// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import archiver from 'archiver';
import { createWriteStream } from 'fs';
// import { cpus } from 'os';

// const cpuCount = cpus().length;
const cpuCount = 2;

function splitPerCpuCount(
  imageUrls: Array<{ name: string; url: string }>
): Array<Array<{ name: string; url: string }>> {
  const urls: Array<Array<{ name: string; url: string }>> = [];

  urls.push(
    imageUrls.reduce((a: Array<{ name: string; url: string }>, e, i) => {
      if ((i + 1) % cpuCount === 0) {
        a.push(e);
        urls.push(a);
        return [];
      }

      a.push(e);
      return a;
    }, [])
  );

  return urls;
}

async function fetchImageBuffer({
  name,
  url,
}: {
  name: string;
  url: string;
}): Promise<{ buffer?: ArrayBuffer; name: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchImageBuffer({ name, url });
      }
      if (response.status === 404) {
        console.error(`URL: ${url} returned 404. RESPONSE: ${response}`);
        return {
          name,
        };
      }
      if (response.status === 403) {
        console.error(`URL: ${url} returned 403. RESPONSE: ${response}`);
        return {
          name,
        };
      }
      throw new Error(
        `failed to download image. Url: ${url}, Status: ${response.status}, ${response.statusText}`
      );
    }

    const buffer = await response.arrayBuffer();

    return {
      buffer,
      name,
    };
  } catch (error) {
    console.error('fetchImageBuffer Failed', error);

    return { name };
  }
}

async function fetchImageBuffers(
  urls: Array<Array<{ name: string; url: string }>>,
  totalImageCount: number
): Promise<Array<{ buffer?: ArrayBuffer; name: string }>> {
  return urls.reduce(
    async (a: Promise<Array<{ buffer?: ArrayBuffer; name: string }>>, e, i) =>
      (await a).concat(
        await Promise.all(
          e.map(async (url, j) => {
            const n = i * cpuCount + (j + 1);
            console.log(`Fetch Image Started [${n}/${totalImageCount}] ${url}`);
            const { buffer, name } = await fetchImageBuffer(url);
            console.log(`Fetch Image Done [${n}/${totalImageCount}] ${url}`);

            return {
              buffer,
              name: `${n}-${name}`,
            };
          })
        )
      ),
    Promise.resolve([])
  );
}

export function archive(
  location: string,
  imageUrls: Array<{ name: string; url: string }>
): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Archive Started', location);
    const output = createWriteStream(location);
    const zip = archiver('zip');

    const onEnd = () => {
      console.log('Archive Finished', location);
      resolve();
    };
    output.on('end', onEnd);
    output.on('close', onEnd);

    zip.on('error', reject);
    zip.pipe(output);

    const totalImageCount = imageUrls.length;
    const urls = splitPerCpuCount(imageUrls);
    fetchImageBuffers(urls, totalImageCount)
      .then(imageBuffers => {
        imageBuffers.forEach(e => {
          if (e.buffer) {
            const buffer = Buffer.from(new Uint8Array(e.buffer));
            zip.append(buffer, { name: e.name });
          }
        });
        zip.finalize();
      })
      .catch(err => {
        console.log('archiveZip', err);
        reject(err);
      });
  });
}
