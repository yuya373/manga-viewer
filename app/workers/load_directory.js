import fs from 'fs';
import os from 'os';
import D from './../models/directory.js';
import F from './../models/file.js';

const allowedExts = [
  ".zip",
];

onmessage = (e) => {
  const path = e.data;
  let dir = D.create(path);

  try {
    const files = fs.readdirSync(path);
    files.forEach((f) => {
      const _path = `${path === "/" ? "" : dir.path}/${f}`;
      const stat = fs.lstatSync(_path);

      if (!f.startsWith(".")) {
        console.log(require('path').extname(f));
        if (stat.isDirectory()) {
          dir = D.upsertChildDirectory(dir, D.create(_path));
        } else if (allowedExts.includes(require('path').extname(f))) {
          dir = D.upsertFile(dir, F.create(_path));
        }
      }
    })

    postMessage({success: true, directory: dir});
  } catch(e) {
    console.log("ERROR", e.message, e);
    postMessage({success: false, error: e, message: e.message});
  }
}
