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

function buildImageEntry(zip: any, entry: any): ImageEntry {
  const fileType = entry.name.endsWith('png') ? 'png' : 'jpeg';
  const buf = zip.entryDataSync(entry);
  const blob = new Blob([buf], {
    type: `image/${fileType}`,
  });

  return {
    name: entry.name,
    url: URL.createObjectURL(blob),
  };
}

export function readFirstImage(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({
      file,
      storeEntries: false,
    });
    zip.on('error', reject);
    zip.on('entry', (entry: any) => {
      if (isImageEntry(entry)) {
        const { url } = buildImageEntry(zip, entry);
        resolve(url);
        zip.close();
      }
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

    const images: Array<ImageEntry> = [];
    zip.on('entry', (entry: any) => {
      if (isImageEntry) {
        const image = buildImageEntry(zip, entry);
        images.push(image);
      }
    });

    zip.on('ready', () => {
      zip.close();
      resolve(images.sort(sortByName));
    });
  });
}
