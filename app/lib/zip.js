import JSZip from 'jszip';
import fs from 'fs';

export function read(path) {
  const pStart = performance.now();
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const pEnd = performance.now();
        console.log(
          "read", pEnd - pStart,
          " PATH: ", path,
          " MB: ", data.length / 1000000
        );
        resolve(data);
      }
    })
  }).then((data) => {
    const pStart = performance.now();

    return JSZip.loadAsync(data).then((zip) => {
      const pEnd = performance.now();
      console.log("JSZip.loadAsync: ", pEnd - pStart, zip);
      return zip;
    })
  });
}
