import { Dirent } from 'fs';

type Entry = {
  name: string;
};

export type ImageEntry = {
  url: string;
} & Entry;

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
