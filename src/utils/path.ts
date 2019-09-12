export function serializePath(path: string): string {
  return encodeURIComponent(path);
}

export function deserializePath(path: string): string {
  return decodeURIComponent(path);
}
