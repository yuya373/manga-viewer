import { archive } from '../utils/archiveZip';

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

export type IncomingData = {
  url: string;
  location: string;
  imageUrls: Array<{ name: string; url: string }>;
};

export type OutgoingMessage =
  | { success: true; payload: { url: string; location: string } }
  | {
      success: false;
      payload: { url: string; location: string; error: Error };
    };

let p: Promise<void> = Promise.resolve();

ctx.addEventListener('message', async ev => {
  const { data }: { data: IncomingData } = ev;

  p = p.then(() => {
    const { url, location, imageUrls } = data;
    return archive(location, imageUrls)
      .then(() => {
        ctx.postMessage({
          success: true,
          payload: {
            url,
            location,
          },
        });
      })
      .catch(error => {
        const msg: OutgoingMessage = {
          success: false,
          payload: {
            url,
            location,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          },
        };
        ctx.postMessage(msg);
      });
  });
});

export default null as any;
