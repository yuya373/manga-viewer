import { Dirent } from 'fs';
import { basename } from 'path';
import { buildNameFromPath } from './utils';

type Entry = {
  name: string;
};

export type ImageEntry = {
  url: string;
} & Entry;

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

export function createFile(entry: Dirent): File;
export function createFile(entry: string): File;
export function createFile(entry: Dirent | string): File {
  let name;
  if (entry instanceof Dirent) {
    name = entry.name;
  } else {
    name = buildNameFromPath(entry);
  }

  return {
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

export function createDirectory(entry: Dirent): Directory;
export function createDirectory(entry: string): Directory;
export function createDirectory(entry: Dirent | string): Directory {
  let name;
  if (entry instanceof Dirent) {
    name = entry.name;
  } else {
    name = buildNameFromPath(entry);
  }

  return {
    name,
    isFile: false,
    isDirectory: true,
    entries: [],
  };
}

export function isDirectory(entry: File | Directory): entry is Directory {
  return entry.isDirectory;
}
