import Dexie from 'dexie';

const db = new Dexie("MangaViewer");

db.version(1).stores({
  thumbnailUrls: "++id, &filePath",
});

db.open().catch((e) => {
  console.error("[ DB ] - ThumbnailUrls Failed to Open: ", e);
})

export default db;
