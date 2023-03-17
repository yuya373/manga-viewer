// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

export type IncomingData = {
  canvas?: OffscreenCanvas;
  image: string;
  width: number;
  height: number;
};

export type OutgoingMessage =
  | {
      success: true;
      scale: number;
    }
  | {
      success: false;
      error: Error;
    };

let canvas: OffscreenCanvas | null | undefined = null;

ctx.addEventListener('message', async ev => {
  const { data }: { data: IncomingData } = ev;
  const { image, width, height } = data;

  if (data.canvas == null && canvas) {
    const canvasCtx = canvas.getContext('2d', {
      alpha: false,
    });
    if (canvasCtx) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      canvasCtx.fillStyle = 'white';
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  if (data.canvas) {
    canvas = data.canvas;
  }
  if (canvas == null) {
    throw new Error('failed to get canvas');
  }

  try {
    const t0 = performance.now();
    const response = await fetch(image);
    const t1 = performance.now();
    console.log('fetch blob', t1 - t0);
    const blob = await response.blob();
    const t2 = performance.now();
    console.log('convert response to blob', t2 - t1);
    const img = await createImageBitmap(blob);
    const t3 = performance.now();
    console.log('create image bitmap', t3 - t2);

    canvas.height = img.height;
    canvas.width = img.width;

    const t4 = performance.now();
    const canvasCtx = canvas.getContext('2d', {
      alpha: false,
    });
    if (canvasCtx) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      canvasCtx.drawImage(
        img, // source
        0,
        0 // source point (x, y)
      );
    }
    const t5 = performance.now();
    console.log('drawImage', t5 - t4);

    const scaleX = width / img.width;
    const scaleY = height / img.height;
    const scaleToFit = Math.min(scaleX, scaleY);

    const message: OutgoingMessage = {
      success: true,
      scale: scaleToFit,
    };
    ctx.postMessage(message);
    img.close();
  } catch (error) {
    const message: OutgoingMessage = {
      success: false,
      error: error as Error,
    };
    ctx.postMessage(message);
  }
});

export default null as any;
