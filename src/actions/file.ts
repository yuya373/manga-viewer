import { Action } from 'redux';
import { ThunkAction } from '.';
import { readFirstImage } from '../utils';
import { Types } from './types';

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

export function fetchThumbnail(path: string): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (getState().thumbnails.isLoading[path]) {
      return;
    }

    dispatch({
      type: Types.FETCH_THUMBNAIL_STARTED,
      payload: {
        path,
      },
    });

    try {
      const thumbnail = await readFirstImage(path);
      requestAnimationFrame(() => {
        dispatch({
          type: Types.FETCH_THUMBNAIL_DONE,
          payload: {
            path,
            thumbnail,
          },
        });
      });
    } catch (err) {
      dispatch({
        type: Types.FETCH_THUMBNAIL_FAILED,
        payload: {
          path,
          error: err,
        },
      });
    }
  };
}

export type FileActions =
  | FetchThumbnailStartedAction
  | FetchThumbnailDoneAction
  | FetchThumbnailFailedAction;
