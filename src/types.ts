import { Dirent } from 'fs';
import { basename, dirname } from 'path';
import { buildNameFromPath } from './utils';

type Entry = {
  path: string;
  name: string;
};

export type ImageEntry = {
  name: string;
  url: string;
};

export function sortByName(a: ImageEntry, b: ImageEntry): -1 | 0 | 1 {
  const ANumStrings = basename(a.name).match(/\d+/);
  const BNumStrings = basename(b.name).match(/\d+/);

  if (ANumStrings !== null && BNumStrings !== null) {
    const ANumStr = ANumStrings[0];
    const BNumStr = BNumStrings[0];

    if (typeof ANumStr !== 'undefined' && typeof BNumStr !== 'undefined') {
      const ANum = Number.parseInt(ANumStr, 10);
      const BNum = Number.parseInt(BNumStr, 10);

      if (!Number.isNaN(ANum) && !Number.isNaN(BNum)) {
        if (ANum < BNum) return -1;
        if (ANum > BNum) return 1;
        return 0;
      }
    }
  }

  const aLowerName = a.name.toLowerCase();
  const bLowerName = a.name.toLowerCase();
  if (aLowerName < bLowerName) return -1;
  if (aLowerName > bLowerName) return 1;
  return 0;
}

export type File = Entry & {
  isFile: true;
  isDirectory: false;
};

export function createFile(param: { entry: Dirent; path: string }): File;
export function createFile(param: { entry: string }): File;
export function createFile(
  param: { entry: string } | { entry: Dirent; path: string }
): File {
  let name;
  if (param.entry instanceof Dirent) {
    name = param.entry.name;
  } else {
    name = buildNameFromPath(param.entry);
  }

  let path;
  if ('path' in param) {
    path = param.path;
  } else {
    path = dirname(param.entry);
  }

  return {
    path,
    name,
    isFile: true,
    isDirectory: false,
  };
}

export function isFile(entry: File | Directory): entry is File {
  return entry.isFile;
}

export type Directory = Entry & {
  isFile: false;
  isDirectory: true;
  entries: Array<File | Directory>;
};

export function createDirectory(param: {
  entry: Dirent;
  path: string;
}): Directory;
export function createDirectory(param: { entry: string }): Directory;
export function createDirectory(
  param:
    | {
        entry: Dirent;
        path: string;
      }
    | { entry: string }
): Directory {
  let name;
  if (param.entry instanceof Dirent) {
    name = param.entry.name;
  } else {
    name = buildNameFromPath(param.entry);
  }

  let path;
  if ('path' in param) {
    path = param.path;
  } else {
    path = dirname(param.entry);
  }

  return {
    name,
    path,
    isFile: false,
    isDirectory: true,
    entries: [],
  };
}

export function isDirectory(entry: File | Directory): entry is Directory {
  return entry.isDirectory;
}
