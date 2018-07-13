import * as zip from './../lib/zip.js';
import * as image from './../lib/image.js';
import { allowedExts } from './../components/File/ImageFile.js';
import { storeThumbnailUrl } from './../db/ThumbnailUrls.js';

const ext = (name) => {
  if (name) {
    return require("path").extname(name).
      substring(1).toLowerCase();
  }
  return null;
}

function getFirstImage(zip) {
  const cover = Object.keys(zip.files).
        map((e) => ({ name: e, ext: ext(e) })).
        filter(({ name, ext }) => allowedExts.includes(ext)).
        sort((a, b) => image.sort(a.name, b.name))[0];

  if (cover) {
    return zip.files[cover.name].async("base64").
      then((base64) => ({base64, ext: ext(cover.name)}))
  } else {
    return Promise.resolve({ base64: null, ext: null });
  }
}

function getImageUrl({ base64, ext }) {
  const url = image.base64Url(base64, ext);
  return url;
}

onmessage = ({data}) => {
  const {
    directory,
    files,
  } = data;
  const promises = [];

  files.forEach((file) => {
    if (file.ext === "zip") {
      const path = file.path;
      const promise = zip.read(path).
            then(getFirstImage).
            then(getImageUrl).
            then((url) => ({ url, path })).
            then(storeThumbnailUrl).
            then(() => postMessage({
              success: true,
              type: "STEP",
              path,
            })).catch((err) => {
              console.error(err);
              postMessage({
                success: false,
                message: err.message,
                stack: err.stack,
              });
            });

      promises.push(promise);
    }
  });

  Promise.all(promises).then(() => postMessage({
    success: true,
    type: "COMPLETED",
  })).catch((err) => {
    console.error(err);
    postMessage({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  });
}
