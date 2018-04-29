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
    favorite: false,
  };
}

export function upsertChildDirectory(directory, dir) {
  let found = false;
  const newDirectories = directory.childDirectories.map((e) => {
    if (isEqual(e, dir)) {
      found = true;
      return dir;
    }
    return e;
  });

  return {
    ...directory,
    childDirectories: found ? newDirectories : newDirectories.concat([dir]),
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
  let found = false;
  const newFiles = directory.files.map((e) => {
    if (F.isEqual(e, file)) {
      found = true;
      return file;
    }
    return e;
  });


  return {
    ...directory,
    files: found ? newFiles : newFiles.concat([file]),
  };
}

export function removeFile(directory, file) {
  return {
    ...directory,
    files: directory.files.filter((e) => !F.isEqual(e, file)),
  };
}

export function favorite(directory, favorite = true) {
  return {
    ...directory,
    favorite,
  };
}


export default {
  create,
  upsertFile,
  upsertChildDirectory,
  isEqual,
  favorite,
}
