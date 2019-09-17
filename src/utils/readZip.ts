// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as StreamZip from 'node-stream-zip';
import { basename } from 'path';
import { ImageEntry, sortByName } from '../types';

function isImageEntry(entry: any): boolean {
  const baseName = basename(entry.name);

  return (
    !baseName.startsWith('.') &&
    (baseName.endsWith('jpg') ||
      baseName.endsWith('jpeg') ||
      baseName.endsWith('png'))
  );
}

function buildImageEntry(zip: any, entry: any): Promise<ImageEntry> {
  return new Promise((resolve, reject) => {
    const fileType = entry.name.endsWith('png') ? 'png' : 'jpeg';
    zip.stream(entry, (err: Error, stream: any) => {
      if (err) {
        reject(err);
        return;
      }

      stream.on('error', (e: Error) => {
        reject(e);
        stream.destroy();
      });

      const chunks: Array<Buffer> = [];
      let nread = 0;
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
        nread += chunk.length;
      });

      stream.on('end', () => {
        stream.destroy();

        const buf = Buffer.concat(chunks, nread);
        const blob = new Blob([buf], {
          type: `image/${fileType}`,
        });

        resolve({
          name: entry.name,
          url: URL.createObjectURL(blob),
        });
      });
    });
  });
}

export function readAllImages(file: string): Promise<Array<ImageEntry>> {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({
      file,
      storeEntries: false,
    });
    zip.on('error', reject);

    const entries: Array<any> = [];
    zip.on('entry', (entry: any) => {
      if (isImageEntry(entry)) {
        entries.push(entry);
      }
    });

    zip.on('ready', async () => {
      const images = await Promise.all(
        entries.map(async entry => buildImageEntry(zip, entry))
      );
      zip.close();
      resolve(images.sort(sortByName));
    });
  });
}

export async function readFirstImage(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({
      file,
      storeEntries: false,
    });
    zip.on('error', reject);

    const entries: Array<any> = [];
    zip.on('entry', (entry: any) => {
      if (isImageEntry(entry)) {
        entries.push(entry);
      }
    });

    zip.on('ready', async () => {
      entries.sort((a, b) => sortByName(a.name, b.name));
      const entry = entries[0];

      if (entry == null) {
        zip.close();
        resolve('');
        return;
      }

      const image = await buildImageEntry(zip, entry);
      zip.close();
      resolve(image.url);
    });
  });
}
