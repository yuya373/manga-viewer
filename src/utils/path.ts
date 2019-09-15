import { basename } from 'path';

export function serializePath(path: string): string {
  return encodeURIComponent(path);
}

export function deserializePath(path: string): string {
  return decodeURIComponent(path);
}

export function buildNameFromPath(path: string): string {
  return basename(path);
}
