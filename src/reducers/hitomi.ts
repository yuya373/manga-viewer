import { join } from 'path';
import { PayloadAction } from '@reduxjs/toolkit';
import { Actions } from '../actions';
import { Types } from '../actions/types';
import {
  HitomiScrapeStartedAction,
  HitomiScrapeDoneAction,
  HitomiScrapeFailedAction,
} from '../actions/hitomi';
import { File } from '../types';
import { deleteFileDone } from '../features/files/filesSlice';

export type HitomiState = {
  url: string;
  isScraping: { [url: string]: boolean };
  urls: Array<string>;
  fileByUrl: { [url: string]: File };
  errorByUrl: { [url: string]: Error };
};

const initialState: HitomiState = {
  url: '',
  isScraping: {},
  urls: [],
  fileByUrl: {},
  errorByUrl: {},
};

function setIsScraping(
  state: HitomiState = initialState,
  url: string,
  value: boolean
): HitomiState {
  const isScraping = { ...state.isScraping };

  if (value) {
    isScraping[url] = true;
  } else {
    delete isScraping[url];
  }

  return {
    ...state,
    isScraping,
  };
}

function addUrl(
  state: HitomiState,
  action: HitomiScrapeStartedAction
): HitomiState {
  const { url } = action.payload;
  const urls = [url].concat(state.urls.filter(e => e !== url));

  return {
    ...state,
    urls,
  };
}

function setFile(
  state: HitomiState,
  action: HitomiScrapeDoneAction
): HitomiState {
  const fileByUrl = { ...state.fileByUrl };

  fileByUrl[action.payload.url] = action.payload.file;

  return {
    ...state,
    fileByUrl,
  };
}

function deleteFile(state: HitomiState, url: string): HitomiState {
  const fileByUrl = { ...state.fileByUrl };

  delete fileByUrl[url];

  return {
    ...state,
    fileByUrl,
  };
}

function resetUrl(state: HitomiState): HitomiState {
  return {
    ...state,
    url: '',
  };
}

function updateErrorByUrl(
  state: HitomiState,
  url: string,
  error?: Error
): HitomiState {
  const errorByUrl = { ...state.errorByUrl };

  if (error) {
    errorByUrl[url] = error;
  } else {
    delete errorByUrl[url];
  }

  return {
    ...state,
    errorByUrl,
  };
}

function scrapeStarted(
  state: HitomiState,
  action: HitomiScrapeStartedAction
): HitomiState {
  const { url } = action.payload;
  let s = state;

  s = resetUrl(s);
  s = addUrl(s, action);
  s = setIsScraping(s, url, true);
  s = deleteFile(s, url);
  s = updateErrorByUrl(s, url);

  return s;
}

function scrapeDone(
  state: HitomiState,
  action: HitomiScrapeDoneAction
): HitomiState {
  const { url } = action.payload;
  let s = state;

  s = setIsScraping(s, url, false);
  s = setFile(s, action);

  return s;
}

function scrapeFailed(
  state: HitomiState,
  action: HitomiScrapeFailedAction
): HitomiState {
  const { url, error } = action.payload;
  let s = state;

  s = setIsScraping(s, url, false);
  s = updateErrorByUrl(s, url, error);

  return s;
}

type DeleteFileByPathPayload = {
  path: string;
};

function deleteFileByPath(
  state: HitomiState,
  action: PayloadAction<DeleteFileByPathPayload>
): HitomiState {
  const { path } = action.payload;
  const url = Object.keys(state.fileByUrl).find(e => {
    const file = state.fileByUrl[e];
    return path === join(file.path, file.name);
  });

  if (url == null) return state;

  const urls = state.urls.filter(e => e !== url);

  return deleteFile({ ...state, urls }, url);
}

export default function(
  state: HitomiState = initialState,
  action: Actions
): HitomiState {
  switch (action.type) {
    case Types.HITOMI_URL_CHANGED:
      return {
        ...state,
        url: action.payload.url,
      };
    case Types.HITOMI_SCRAPE_STARTED:
      return scrapeStarted(state, action);
    case Types.HITOMI_SCRAPE_DONE:
      return scrapeDone(state, action);
    case Types.HITOMI_SCRAPE_FAILED:
      return scrapeFailed(state, action);
    default:
      return deleteFileDone.match(action)
        ? deleteFileByPath(state, action)
        : state;
  }
}
