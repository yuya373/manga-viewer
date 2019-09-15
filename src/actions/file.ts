import { Action } from 'redux';
import { ThunkAction } from '.';
import { readFirstImage, readAllImages } from '../utils';
import { Types } from './types';
import { ImageEntry } from '../types';
import { getImagesToDisplay } from '../utils/viewer';

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

export interface FetchImagesStartedAction extends Action {
  type: Types.FETCH_IMAGES_STARTED;
  payload: {
    path: string;
  };
}

export interface FetchImagesDoneAction extends Action {
  type: Types.FETCH_IMAGES_DONE;
  payload: {
    path: string;
    images: Array<ImageEntry>;
    imagesToDisplay: Array<string>;
  };
}

export interface FetchImagesFailedAction extends Action {
  type: Types.FETCH_IMAGES_FAILED;
  payload: {
    path: string;
    error: Error;
  };
}

export function fetchImages(path: string): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch({
      type: Types.FETCH_IMAGES_STARTED,
      payload: {
        path,
      },
    });

    try {
      const images = await readAllImages(path);
      const state = getState();
      const { perPage, index } = state.viewer;

      let { imagesToDisplay } = state.viewer;
      if (imagesToDisplay.length !== perPage) {
        imagesToDisplay = getImagesToDisplay({ index, perPage, images }).map(
          e => e.url
        );
      }
      requestAnimationFrame(() => {
        dispatch({
          type: Types.FETCH_IMAGES_DONE,
          payload: {
            path,
            images,
            imagesToDisplay,
          },
        });
      });
    } catch (error) {
      dispatch({
        type: Types.FETCH_IMAGES_FAILED,
        payload: {
          path,
          error,
        },
      });
    }
  };
}

export type FileActions =
  | FetchImagesStartedAction
  | FetchImagesDoneAction
  | FetchImagesFailedAction
  | FetchThumbnailStartedAction
  | FetchThumbnailDoneAction
  | FetchThumbnailFailedAction;
