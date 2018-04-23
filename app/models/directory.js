import F from './file.js';

export function create(path, parent = null, files = [], childDirectories = []) {
  const splitted = path.split("/");
  const name = splitted[splitted.length - 1];

  return {
    name,
    path,
    parent,
    files,
    childDirectories,
  };
}

export function upsertChildDirectory(directory, dir) {
  const removed = removeChildDirectory(directory, dir);

  return {
    ...removed,
    childDirectories: removed.childDirectories.concat([dir]),
  };
}

export function removeChildDirectory(directory, dir) {
  return {
    ...directory,
    childDirectories: directory.childDirectories.filter((e) => !isEqual(e, dir)),
  }
}

export function isEqual(a, b) {
  return a.path === b.path;
}

export function upsertFile(directory, file) {
  const removed = removeFile(directory, file);

  return {
    ...removed,
    files: removed.files.concat([file]),
  };
}

export function removeFile(directory, file) {
  return {
    ...directory,
    files: directory.files.filter((e) => !F.isEqual(e, file)),
  };
}


export default {
  create,
  upsertFile,
  upsertChildDirectory,
}
