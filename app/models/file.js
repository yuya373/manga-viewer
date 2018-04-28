export function create(path) {
  const splitted = path.split("/");
  const name = splitted[splitted.length - 1];
  const ext = require('path').extname(name).substring(1);

  return {
    path,
    name,
    images: [],
    ext,
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
