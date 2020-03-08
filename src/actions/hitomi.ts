import { Action } from 'redux';
import puppeteer, { Browser } from 'puppeteer';
import { basename } from 'path';
import { Types } from './types';
import { ThunkAction, Actions, ThunkDispatch } from '.';
import { findChromium } from '../utils/findChromium';
import ArchiveImagesWorker, {
  IncomingData,
  OutgoingMessage,
} from '../workers/archiveImages.worker';
import { createFile, File } from '../types';

export interface HitomiUrlChangedAction extends Action {
  type: Types.HITOMI_URL_CHANGED;
  payload: {
    url: string;
  };
}

export const urlChanged = (url: string): HitomiUrlChangedAction => ({
  type: Types.HITOMI_URL_CHANGED,
  payload: {
    url,
  },
});

export interface HitomiScrapeStartedAction extends Action {
  type: Types.HITOMI_SCRAPE_STARTED;
  payload: {
    url: string;
  };
}

const scrapeStarted = (url: string): HitomiScrapeStartedAction => ({
  type: Types.HITOMI_SCRAPE_STARTED,
  payload: {
    url,
  },
});

export interface HitomiScrapeDoneAction extends Action {
  type: Types.HITOMI_SCRAPE_DONE;
  payload: {
    url: string;
    file: File;
  };
}

const scrapeDone = ({
  url,
  file,
}: {
  url: string;
  file: File;
}): HitomiScrapeDoneAction => ({
  type: Types.HITOMI_SCRAPE_DONE,
  payload: {
    url,
    file,
  },
});

export interface HitomiScrapeFailedAction extends Action {
  type: Types.HITOMI_SCRAPE_FAILED;
  payload: {
    url: string;
    error: Error;
  };
}

const scrapeFailed = ({
  url,
  error,
}: {
  url: string;
  error: Error;
}): HitomiScrapeFailedAction => ({
  type: Types.HITOMI_SCRAPE_FAILED,
  payload: {
    url,
    error,
  },
});

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser == null) {
    const executablePath = await findChromium();
    browser = await puppeteer.launch({
      executablePath,
    });
    browser.on('disconnected', () => {
      console.error('disconnected');
      browser = null;
    });
  }

  return browser;
}

let archiveWorker: any = null;

function getArchiveWorker(dispatch: ThunkDispatch): any {
  if (archiveWorker == null) {
    archiveWorker = new ArchiveImagesWorker();
    archiveWorker.onmessage = (ev: { data: OutgoingMessage }) => {
      const { data } = ev;
      if (data.success) {
        const { location } = data.payload;
        const file = createFile({ entry: location });
        dispatch(scrapeDone({ url: data.payload.url, file }));
      } else {
        console.error(data.payload.error);
        dispatch(
          scrapeFailed({
            url: data.payload.url,
            error: new Error(data.payload.error),
          })
        );
      }
    };
  }

  return archiveWorker;
}

export function scrape(): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    const { url: rawUrl, isScraping } = getState().hitomi;
    if (isScraping[rawUrl]) return;

    try {
      let url;
      try {
        url = new URL(rawUrl);
      } catch (error) {
        // TODO: handle error
        return;
      }

      dispatch(scrapeStarted(rawUrl));

      const b = await getBrowser();
      const { pathname, origin } = url;
      const fileNames = basename(pathname).split('-');
      const fileName = fileNames[fileNames.length - 1];
      console.log('fileName', fileName);
      const page = await b.newPage();
      page.on('error', error => {
        console.error('error', error);
        dispatch(
          scrapeFailed({
            url: rawUrl,
            error,
          })
        );
      });
      page.on('pageerror', error => {
        console.error('pageerror', error);
        dispatch(
          scrapeFailed({
            url: rawUrl,
            error,
          })
        );
      });
      const readerUrl = `${origin}/reader/${fileName}`;
      await page.goto(readerUrl);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const id: string = await (page.evaluate(`galleryinfo.id`) as Promise<
        string
      >);
      const title: string = await (page.evaluate(
        `document.querySelector("title").text`
      ) as Promise<string>);
      const imageUrls: Array<string> = await (page.evaluate(
        `galleryinfo.files.map(e => url_from_url_from_hash(${id}, e))`
      ) as Promise<Array<string>>);
      await page.close();

      console.log('title', title, 'imageUrls', imageUrls.length);

      const data: IncomingData = {
        url: rawUrl,
        location: `${process.env.REACT_APP_ARCHIVE_DIR}/${title}-${id}.zip`,
        imageUrls,
      };

      const worker = getArchiveWorker(dispatch);
      worker.postMessage(data);
    } catch (error) {
      // TODO: handle error
      console.error(error);
      dispatch(scrapeFailed({ url: rawUrl, error }));
    }
  };
}

export type HitomiActions =
  | HitomiUrlChangedAction
  | HitomiScrapeStartedAction
  | HitomiScrapeDoneAction
  | HitomiScrapeFailedAction;
