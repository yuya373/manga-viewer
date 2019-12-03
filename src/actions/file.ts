import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from '.';
import { Types } from './types';
import ReadThumbnailWorker, {
  OutgoingMessage as ThumnailOutgoinMessage,
} from '../workers/readThumbnail.worker';

export interface FetchThumbnailStartedAction extends Action {
  type: Types.FETCH_THUMBNAIL_STARTED;
  payload: {
    path: string;
  };
}

export interface FetchThumbnailDoneAction extends Action {
  type: Types.FETCH_THUMBNAIL_DONE;
  payload: {
    path: string;
    thumbnail: string;
  };
}

export interface FetchThumbnailFailedAction extends Action {
  type: Types.FETCH_THUMBNAIL_FAILED;
  payload: {
    path: string;
    error: Error;
  };
}

function fetchThumbnailDone({
  path,
  thumbnail,
}: {
  path: string;
  thumbnail: string;
}): FetchThumbnailDoneAction {
  return {
    type: Types.FETCH_THUMBNAIL_DONE,
    payload: {
      path,
      thumbnail,
    },
  };
}

function fetchThumbnailFailed({
  path,
  error,
}: {
  path: string;
  error: Error;
}): FetchThumbnailFailedAction {
  return {
    type: Types.FETCH_THUMBNAIL_FAILED,
    payload: {
      path,
      error,
    },
  };
}

let readThumbnailWorker: any = null;

function getReadThumbnailWorker(dispatch: ThunkDispatch): any {
  if (readThumbnailWorker == null) {
    readThumbnailWorker = new ReadThumbnailWorker();
    readThumbnailWorker.onmessage = (ev: { data: ThumnailOutgoinMessage }) => {
      if (ev.data.success) {
        const { payload } = ev.data;
        requestAnimationFrame(() => {
          dispatch(fetchThumbnailDone(payload));
        });
      } else {
        const { payload } = ev.data;
        dispatch(fetchThumbnailFailed(payload));
      }
    };
  }

  return readThumbnailWorker;
}

export function fetchThumbnail(path: string): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (getState().thumbnails.isLoading[path]) {
      return;
    }
    if (getState().thumbnails.byPath[path]) {
      return;
    }

    dispatch({
      type: Types.FETCH_THUMBNAIL_STARTED,
      payload: {
        path,
      },
    });

    const worker = getReadThumbnailWorker(dispatch);
    const canvas = document.createElement('canvas');
    const offscreenCanvas = canvas.transferControlToOffscreen();
    worker.postMessage({ path, canvas: offscreenCanvas }, [offscreenCanvas]);
  };
}

export type FileActions =
  | FetchThumbnailStartedAction
  | FetchThumbnailDoneAction
  | FetchThumbnailFailedAction;
