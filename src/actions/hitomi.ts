import { Action } from 'redux';
import puppeteer, { Browser } from 'puppeteer';
import { basename } from 'path';
import { Types } from './types';
import { ThunkAction } from '.';
import { findChromium } from '../utils/findChromium';

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
  };
}

const scrapeDone = (url: string): HitomiScrapeDoneAction => ({
  type: Types.HITOMI_SCRAPE_DONE,
  payload: {
    url,
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
  }

  return browser;
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
      const fileName = basename(pathname);
      const page = await b.newPage();
      const readerUrl = `${origin}/reader/${fileName}`;
      await page.goto(readerUrl);
      const id: string = await page.evaluate(`get_galleryid()`);
      const title: string = await page.evaluate(
        `document.querySelector("title").text`
      );
      const imageSrcs: Array<string> = await page.evaluate(
        `galleryinfo.map(e => url_from_url_from_hash(${id}, e))`
      );
      await page.close();

      const imageUrls = imageSrcs.map(e => `https:${e}`);
      console.log('title', title, 'imageUrls', imageUrls);
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
