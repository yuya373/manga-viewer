import { ImageEntry } from '../types';

export function getImagesToDisplay({
  index,
  perPage,
  images,
}: {
  index: number;
  perPage: number;
  images: Array<ImageEntry>;
}): Array<ImageEntry> {
  return index === 0
    ? images.slice(0, 1)
    : images.slice(index, index + perPage).reverse();
}
