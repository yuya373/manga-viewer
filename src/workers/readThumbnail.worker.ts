import { readFirstImage } from '../utils';
// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

type IncomingData = {
  path: string;
  canvas: OffscreenCanvas;
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

const maxImageSize = 174 * 1.4 * 3;

const resize = (image: Blob, canvas: OffscreenCanvas): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvasCtx = canvas.getContext('2d', {
      alpha: false,
    });
    if (canvasCtx == null) {
      reject(new Error('failed to get context for resize'));
    }

    const f = async () => {
      const t0 = performance.now();
      const img = await createImageBitmap(image);
      const t1 = performance.now();
      console.log('createImageBitmap', t1 - t0);

      let dstHeight;
      let dstWidth;
      if (img.height > maxImageSize) {
        dstHeight = maxImageSize;
        dstWidth = img.width * (maxImageSize / img.height);
      } else {
        dstWidth = maxImageSize;
        dstHeight = img.height * (maxImageSize / img.width);
      }

      console.log(
        'maxImageSize',
        maxImageSize,
        'img.width',
        img.width,
        'img.height',
        img.height,
        'dstWidth',
        dstWidth,
        'dstHeight',
        dstHeight
      );

      // eslint-disable-next-line no-param-reassign
      canvas.width = dstWidth;
      // eslint-disable-next-line no-param-reassign
      canvas.height = dstHeight;
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      canvasCtx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        dstWidth,
        dstHeight
      );
      const t2 = performance.now();
      console.log('drawImage', t2 - t1);
      const blob = await canvas.convertToBlob();
      const t3 = performance.now();
      console.log('convertToBlob', t3 - t2);
      resolve(blob);
    };

    f();
  });
};

ctx.addEventListener('message', async ev => {
  const { data }: { data: IncomingData } = ev;
  const { path, canvas } = data;

  try {
    const image = await readFirstImage(path);
    let thumbnail = '';
    if (image) {
      const thumbnailBlob = await resize(image, canvas);
      thumbnail = URL.createObjectURL(thumbnailBlob);
    }

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
