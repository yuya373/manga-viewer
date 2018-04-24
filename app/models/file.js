export function create(path) {
  const splitted = path.split("/");
  const name = splitted[splitted.length - 1];
  return {
    path,
    name,
  };
}

export function isEqual(a, b) {
  return a.path === b.path;
}

export default {
  create,
  isEqual,
}
