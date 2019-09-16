import { readdir, Dirent, Stats, stat } from 'fs';
import { join } from 'path';

function getStats(path: string, entry: Dirent): Promise<Stats> {
  return new Promise((resolve, reject) => {
    stat(join(path, entry.name), (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stats);
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export function readDir(path: string): Promise<Dirent[]> {
  return new Promise((resolve, reject) => {
    readdir(path, { withFileTypes: true }, (err, entries) => {
      if (err) {
        reject(err);
        return;
      }
      Promise.all(
        entries.map(async entry => {
          const stats = await getStats(path, entry);
          return { entry, stats };
        })
      ).then(es => {
        es.sort((a, b) => {
          return b.stats.mtimeMs - a.stats.mtimeMs;
        });
        resolve(es.map(e => e.entry));
      });
    });
  });
}
