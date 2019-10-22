import { archive } from '../utils/archiveZip';

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

export type IncomingData = {
  url: string;
  location: string;
  imageUrls: Array<string>;
};

export type OutgoingMessage =
  | { success: true; payload: { url: string; location: string } }
  | {
      success: false;
      payload: { url: string; location: string; error: string };
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
        ctx.postMessage({
          success: false,
          payload: {
            url,
            location,
            error: error.message,
          },
        });
      });
  });
});

export default null as any;
