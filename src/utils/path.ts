export function serializePath(path: string): string {
  return encodeURIComponent(path);
}

export function deserializePath(path: string): string {
  return decodeURIComponent(path);
}

export function buildNameFromPath(path: string): string {
  const parts = path.split('/');
  const name = parts[parts.length - 1];
  return name;
}
