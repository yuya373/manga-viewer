import { Action } from 'redux';
import { join } from 'path';
import { Types } from './types';
import { ThunkAction, ThunkDispatch } from '.';
import ArchiveImagesWorker, {
  IncomingData,
  OutgoingMessage,
} from '../workers/archiveImages.worker';
import { createFile, File } from '../types';
import { ipcRenderer } from 'electron';

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
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  },
});

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
            error: data.payload.error,
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
      dispatch(scrapeStarted(rawUrl));

      ipcRenderer.on('getPageDetailResult', (ev, result: { id: string, title: string; imageUrls: Array<{ url: string; name: string }>, error?: Error }) => {
        console.log('getPageDetailResult', result);
        const { id, title, imageUrls, error } = result;

        if (error) {
          dispatch(scrapeFailed({ url: rawUrl, error: error as Error }));
          return;
        }

        const normalizedTitle = title.replace(/<|>|:|"|\/|\\|\||\?|\*|\s/gi, '_');
        const location = join(
          process.env.REACT_APP_ARCHIVE_DIR as string,
          `${normalizedTitle}-${id}.zip`
        );
        console.log('title', title, 'imageUrls', imageUrls.length, 'location', location);
        const data: IncomingData = {
          url: rawUrl,
          location,
          imageUrls,
        };

        const worker = getArchiveWorker(dispatch);
        worker.postMessage(data);
      });
      ipcRenderer.send('getPageDetail', rawUrl);
    } catch (error) {
      // TODO: handle error
      console.error(error);
      dispatch(scrapeFailed({ url: rawUrl, error: error as Error }));
    }
  };
}

export type HitomiActions =
  | HitomiUrlChangedAction
  | HitomiScrapeStartedAction
  | HitomiScrapeDoneAction
  | HitomiScrapeFailedAction;
