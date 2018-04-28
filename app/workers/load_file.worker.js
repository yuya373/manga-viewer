import fs from 'fs';
import os from 'os';
import JSZip from 'jszip';
import D from './../models/directory.js';
import F from './../models/file.js';

const allowedExts = [
  ".jpg",
  ".jpeg",
  ".png",
]

function readZipFile({path}) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject({
          message: err.message,
          error: err,
        });
      }

      JSZip.loadAsync(data).then((zip) => {
        const results = [];

        zip.forEach((path, entry) => {
          // console.log("ENTRY", entry, entry.dir, !entry.dir);
          if (!entry.dir) {
            const name = entry.name;
            const ext = require('path').extname(name);
            // console.log("EXT", ext, ext.toLowerCase());

            if (allowedExts.includes(ext.toLowerCase())) {
              results.push(
                entry.async("base64").
                  then((base64) => (F.createImage({name, ext, base64}))).
                  catch((error) => ({message: error.message, error}))
              )
            }
          }
        })

        Promise.all(results).
          then((images) => resolve({images: images.sort((a, b) => {
            const A = a.name.toLowerCase();
            const B = b.name.toLowerCase();
            if (A < B) return -1;
            if (A > B) return 1;
              return 0;
          })})).catch((error) => reject(error));
      }).catch((error) => {
        reject({
          message: error.message,
          error,
        })
      })
    })
  })
}

onmessage = (e) => {
  const file = e.data;
  const ext = file.ext

  switch(ext) {
  case "zip":
    readZipFile(file).then(({images}) => {
      postMessage({
        success: true,
        images,
        error: null,
        message: "",
      });
    }).catch(({error, message}) => {
      postMessage({
        success: false,
        images: [],
        message,
        error,
      })
    });
    return;
  case "pdf":
    postMessage({
      success: true,
      images: [],
    });
    return;
  }

}
