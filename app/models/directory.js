import F from './file.js';


// atime "Access Time" - Time when file data last accessed. Changed by the mknod(2), utimes(2), and read(2) system calls.
// mtime "Modified Time" - Time when file data last modified. Changed by the mknod(2), utimes(2), and write(2) system calls.
// ctime "Change Time" - Time when file status was last changed (inode data modification). Changed by the chmod(2), chown(2), link(2), mknod(2), rename(2), unlink(2), utimes(2), read(2), and write(2) system calls.
// birthtime "Birth Time" - Time of file creation. Set once when the file is created. On filesystems where birthtime is not available, this field may instead hold either the ctime or 1970-01-01T00:00Z (ie, unix epoch timestamp 0). Note that this value may be greater than atime or mtime in this case. On Darwin and other FreeBSD variants, also set if the atime is explicitly set to an earlier value than the current birthtime using the utimes(2) system call.
export function create(path, {size, mtime, ctime, birthtime}, files = [], childDirectories = []) {
  const splitted = path.split("/");
  const name = splitted[splitted.length - 1];

  return {
    isDirectory: true,
    isFile: false,
    name,
    path,
    files,
    childDirectories,

    size,
    mtime,
    ctime,
    birthtime,
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
    childDirectories: directory.childDirectories.filter((e) => {
      if (dir.path) {
        return !isEqual(e, dir)
      } else {
        return e.path !== dir;
      }
    }),
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

export default {
  create,
  upsertFile,
  upsertChildDirectory,
  removeFile,
  removeChildDirectory,
  isEqual,
}
