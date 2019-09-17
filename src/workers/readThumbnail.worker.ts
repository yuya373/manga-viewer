import { readFirstImage } from '../utils';
// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

type IncomingData = {
  path: string;
};

export type OutgoingMessage =
  | {
      success: true;
      payload: {
        path: string;
        thumbnail: string;
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
    const thumbnail = await readFirstImage(path);
    ctx.postMessage({
      success: true,
      payload: {
        path,
        thumbnail,
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
