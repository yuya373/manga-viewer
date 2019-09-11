import { readdir, Dirent } from 'fs';

// eslint-disable-next-line import/prefer-default-export
export function readDir(path: string): Promise<Dirent[]> {
  return new Promise((resolve, reject) => {
    readdir(path, { withFileTypes: true }, (err, entries) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(entries);
    });
  });
}
