import fs from 'fs';
import D from './../models/directory.js';
import F from './../models/file.js';

const allowedExts = [
  "zip",
  "pdf",
];

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (error, stats) => {
      if (error) {
        reject(error);
      } else {
        resolve(stats, path);
      }
    })
  });
}

function readdir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    })
  });
}

function mtimeDesc(a, b) {
  if (a.mtime < b.mtime) return 1;
  if (a.mtime > b.mtime) return -1;
  return 0;
}

function separateFilesAndDirectories(filesOrDirectories) {
  const files = [];
  const directories = [];
  filesOrDirectories.forEach((e) => {
    if (e) {
      if (e.isDirectory) {
        directories.push(e);
      } else if (e.isFile && allowedExts.includes(e.ext)) {
        files.push(e);
      }
    }
  })
  return {
    files: files.sort(mtimeDesc),
    directories: directories.sort(mtimeDesc),
  };
}

function parseDir(path) {
  return readdir(path).then((files) => {
    return files.map((f) => {
      const normalizedPath = `${path === "/" ? "" : path}/${f}`;
      return stat(normalizedPath).then((stats) => {
        if (stats.isDirectory()) {
          return D.create(normalizedPath, stats);
        } else if (stats.isFile()) {
          return F.create(normalizedPath, stats);
        }
      })
    });
  });
}

onmessage = (e) => {
  const path = e.data || "/";
  stat(path).then((dirStats) => {
    return parseDir(path).then((promises) => {
        return Promise.all(promises).then((filesOrDirectories) => {
          const separated = separateFilesAndDirectories(
            filesOrDirectories
          );

          postMessage({
            success: true,
            directory: D.create(
              path,
              dirStats,
              separated.files,
              separated.directories
            ),
          });
        });
      });
  }).catch((error) => {
    console.log(error);
    postMessage({
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    });
  })
}
