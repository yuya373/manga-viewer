import { readAllImages } from '../utils';
import { ImageEntry } from '../types';
// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;
// Post data to parent thread
// ctx.postMessage({ foo: 'foo' });
type IncomingData = {
  path: string;
};

export type OutgoingMessage =
  | {
      success: true;
      payload: {
        path: string;
        images: Array<ImageEntry>;
      };
    }
  | {
      success: false;
      payload: {
        path: string;
        error: Error;
      };
    };

ctx.addEventListener('message', async ev => {
  const { data }: { data: IncomingData } = ev;
  const { path } = data;

  try {
    const images = await readAllImages(path);
    ctx.postMessage({
      success: true,
      payload: {
        path,
        images,
      },
    });
  } catch (error) {
    ctx.postMessage({
      success: false,
      payload: {
        path,
        error,
      },
    });
  }
});

export default null as any;
