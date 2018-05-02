import fs from 'fs';
import os from 'os';
import JSZip from 'jszip';
import D from './../models/directory.js';
import F from './../models/file.js';

function readPdfFile({path}) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (error, stats) => {
      if (error) {
        reject({error});
      } else {
        console.log("STATS", stats);
        resolve();
      }
    })
  })
}

function readZipFile({path}) {
  const pStart = performance.now();
  return new Promise((resolve, reject) => {
    fs.lstat(path, (error, stats) => {
      if (error) {
        reject(error);
      } else {
        const pEnd = performance.now();
        console.log("readZipFile: ", pEnd - pStart, " STATS: ", stats);
        resolve(stats);
      }
    })
  })
}

onmessage = (e) => {
  const file = e.data;
  const ext = file.ext

  switch(ext) {
  case "zip":
    readZipFile(file).then(() => {
        postMessage({
          success: true,
          error: null,
        });
    }).catch((error) => {
        postMessage({
          success: false,
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
