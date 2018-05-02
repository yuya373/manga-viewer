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

function readPdfFile({path}) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        reject({error});
      } else {
        resolve();
      }
    })
  })
}

function loadZipFile(data) {
  console.log("START loading zip file")
  const pStart = performance.now();
  return JSZip.loadAsync(data).then((zip) => {
    const pEnd = performance.now();
    console.log("COMPLETE loading zip file: ", pEnd - pStart,  zip);
    const results = [];

    const p1Start = performance.now();
    zip.forEach((path, entry) => {
      // console.log("ENTRY", entry, entry.dir, !entry.dir);
      if (!entry.dir) {
        const names = entry.name.split("/");
        const name = names[names.length - 1];
        const ext = require('path').extname(name);
        // console.log("EXT", ext, ext.toLowerCase());

        if (allowedExts.includes(ext.toLowerCase())) {
          results.push(
            entry.async("base64").
              then((base64) => (F.createImage({name, ext, base64}))).
              catch((error) => error))
        }
      }
    })
    const p1End = performance.now();
    console.log("iterate each zip contents: ", p1End - p1Start, " count: ", results.length);

    const p2Start = performance.now();
    return Promise.all(results).then((results) => {
      const p2End = performance.now();
      console.log("each zip contents Promise complete: ", p2End - p2Start);
      return results;
    });
  });
}

function sortImages(images) {
  console.log("START sort images: ", images.length);
  return images.sort((a, b) => {
    const ANumStr = a.name.match(/\d+/)[0];
    const BNumStr = b.name.match(/\d+/)[0];
    if ((typeof ANumStr) !== 'undefined' && (typeof BNumStr) !== 'undefined') {
      const ANum = Number.parseInt(ANumStr, 10);
      const BNum = Number.parseInt(BNumStr, 10);
      if (!Number.isNaN(ANum) && !Number.isNaN(BNum)) {
        if (ANum < BNum) return -1;
        if (ANum > BNum) return 1;
        return 0;
      }
    }

    const A = a.name.toLowerCase();
    const B = b.name.toLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}

function readZipFile({path}) {
  console.log("START reading zip file: ", path);
  const pStart = performance.now();
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const pEnd = performance.now();
        console.log("COMPLETE read zip file: ", pEnd - pStart, " MB: ", data.length / 1000000);
        resolve(data);
        // loadZipFile(data).
        //   then((images) => resolve({images: sortImages(images)})).
        //   catch((error) => reject({error}));
      }
    })
  })
}

onmessage = (e) => {
  const file = e.data;
  const ext = file.ext

  switch(ext) {
  case "zip":
    const pAllStart = performance.now();
    readZipFile(file).
      then(loadZipFile).then(sortImages).then((images) => {
        const pAllEnd = performance.now();
        console.log("COMPLETE ZIP WORKER: ", pAllEnd - pAllStart);
        postMessage({
          success: true,
          images,
          error: null,
          message: "",
        });
      }).catch((error) => {
        postMessage({
          success: false,
          images: [],
          error: {
            message: error.message,
            code: error.code,
          },
        })
      });
    return;
  case "pdf":
    readPdfFile(file).then(() => {
      postMessage({
        success: true,
        images: [],
      });
    }).catch(({error}) => {
      postMessage({
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      })
    })
    return;
  }

}
