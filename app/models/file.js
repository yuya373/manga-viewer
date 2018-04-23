export function create(path) {
  return {
    path,
  };
}

export function isEqual(a, b) {
  return a.path === b.path;
}

export default {
  create,
  isEqual,
}
