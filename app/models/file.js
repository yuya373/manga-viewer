export function create(path) {
  const splitted = path.split("/");
  const name = splitted[splitted.length - 1];
  const ext = require('path').extname(name).substring(1);

  return {
    path,
    name,
    images: [],
    ext,
    favorite: false,
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

export function favorite(file, favorite = true) {
  return {
    ...file,
    favorite,
  };
}

export default {
  create,
  isEqual,
  setImages,
  createImage,
  favorite,
}
