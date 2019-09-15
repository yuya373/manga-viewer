import { Dirent } from 'fs';

type Entry = {
  name: string;
};

export type ImageEntry = {
  url: string;
} & Entry;

export function sortByName(a: ImageEntry, b: ImageEntry): -1 | 0 | 1 {
  const ANumStrings = a.name.match(/\d+/);
  const BNumStrings = b.name.match(/\d+/);

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
  images: Array<ImageEntry>;
  isFile: true;
  isDirectory: false;
};

export function createFile(entry: Dirent): File {
  return {
    name: entry.name,
    isFile: true,
    isDirectory: false,
    images: [],
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
    // entry is file path
    const parts = entry.split('/');
    name = parts[parts.length - 1];
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
