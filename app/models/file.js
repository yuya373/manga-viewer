export function create(path, {size, mtime, ctime, birthtime}) {
  const splitted = path.split("/");
  const name = splitted[splitted.length - 1];
  const ext = require('path').extname(name).substring(1);

  return {
    isFile: true,
    isDirectory: false,
    path,
    name,
    images: [],
    ext,

    size,
    mtime,
    ctime,
    birthtime,
  };
}

export function isEqual(a, b) {
  return a.path === b.path;
}

export function createImage({name, ext, base64}) {
  return {
    name,
    ext,
    base64
  }
}

export function setImages(file, images) {
  return {
    ...file,
    images,
  };
}

export default {
  create,
  isEqual,
  setImages,
  createImage,
}
