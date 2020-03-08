// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import archiver from 'archiver';
import { basename } from 'path';
import { createWriteStream } from 'fs';
import { cpus } from 'os';

const cpuCount = cpus().length;

function splitPerCpuCount(imageUrls: Array<string>): Array<Array<string>> {
  const urls: Array<Array<string>> = [];

  urls.push(
    imageUrls.reduce((a: Array<string>, e, i) => {
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

async function fetchImageBuffer(
  url: string
): Promise<{ buffer: ArrayBuffer; name: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `failed to download image. Url: ${url}, Status: ${response.status}, ${response.statusText}`
    );
  }

  const buffer = await response.arrayBuffer();

  return {
    buffer,
    name: basename(url),
  };
}

async function fetchImageBuffers(
  urls: Array<Array<string>>,
  totalImageCount: number
): Promise<Array<{ buffer: ArrayBuffer; name: string }>> {
  return urls.reduce(
    async (a: Promise<Array<{ buffer: ArrayBuffer; name: string }>>, e, i) =>
      (await a).concat(
        await Promise.all(
          e.map(async (url, j) => {
            const n = i * cpuCount + j;
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
  imageUrls: Array<string>
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
          const buffer = Buffer.from(new Uint8Array(e.buffer));
          zip.append(buffer, { name: e.name });
        });
        zip.finalize();
      })
      .catch(err => {
        console.log('archiveZip', err);
        reject(err);
      });
  });
}
