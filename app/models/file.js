export function create(path) {
  const splitted = path.split("/");
  const name = splitted[splitted.length - 1];
  return {
    path,
    name,
    images: [],
  };
}

export function isEqual(a, b) {
  return a.path === b.path;
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
}
