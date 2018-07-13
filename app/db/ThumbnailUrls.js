import db from './index.js';

export function getThumbnailUrl(filePath) {
  return new Promise((resolve, reject) => {
    db.thumbnailUrls.get({ filePath }).then((existing) => {
      if (existing) {
        resolve(existing.thumbnailUrl);
      } else resolve();
    }).catch((err) => reject(err));
  });
}

export function storeThumbnailUrl({url, path}) {
  console.log("[storeThumbnailUrl] PATH: ", path);
  return new Promise((resolve, reject) => {
    if (!url || !path) {
      resolve();
      return;
    }

    db.transaction("rw", db.thumbnailUrls, () => {
      db.thumbnailUrls.get({ filePath: path }).then((existing) => {
        const attributes = {
          thumbnailUrl: url,
          filePath: path,
        };

        if (existing) {
          db.thumbnailUrls.update(existing.id, attributes);
        } else {
          db.thumbnailUrls.put(attributes);
        }
      });
    }).then(() => resolve()).catch((err) => reject(err));
  });
}

export function storeThumbnailUrls(urls) {
  return new Promise((resolve, reject) => {
    db.transaction("rw", db.thumbnailUrls, () => {
      db.thumbnailUrls.bulkPut(urls.map(({url, path}) => ({
        thumbnailUrl: url,
        filePath: path,
      })));
    }).then(() => resolve()).
      catch((err) => reject(err));
  });
}

export function notExists(filePaths) {
  return new Promise((resolve, reject) => {
    db.thumbnailUrls.
      where("filePath").
      equals(filePaths).
      keys((existFilePaths) => {
        const notExists = filePaths.filter((fp) => {
          return !existFilePaths.includes(fp);
        });
        resolve(notExists);
      }).catch((err) => reject(err));
  });
}
