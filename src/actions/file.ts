import { Action } from 'redux';
import { join } from 'path';
import { ThunkAction } from '.';
import { readFirstImage, readAllImages, unlink } from '../utils';
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

const fetchImagesStarted = (path: string): FetchImagesStartedAction => ({
  type: Types.FETCH_IMAGES_STARTED,
  payload: { path },
});

const fetchImageFailed = (
  path: string,
  error: Error
): FetchImagesFailedAction => ({
  type: Types.FETCH_IMAGES_FAILED,
  payload: {
    path,
    error,
  },
});

export function fetchImages(path: string): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (getState().files.isLoading[path]) return;

    dispatch(fetchImagesStarted(path));

    const file = getState().files.byPath[path];
    if (file == null) return;

    let images: Array<ImageEntry>;
    if (file.isLoaded) {
      images = file.images;
    } else {
      try {
        images = await readAllImages(path);
      } catch (err) {
        dispatch(fetchImageFailed(path, err));
        return;
      }
    }

    const state = getState();
    const { perPage, index } = state.viewer;
    const { fileDialog } = state;

    let { imagesToDisplay } = state.viewer;
    if (join(fileDialog.path, fileDialog.name) === path) {
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
  };
}

export interface DeleteFileStartedAction extends Action {
  type: Types.DELETE_FILE_STARTED;
  payload: {
    path: string;
  };
}

export interface DeleteFileDoneAction extends Action {
  type: Types.DELETE_FILE_DONE;
  payload: {
    path: string;
  };
}

export interface DeleteFileFailedAction extends Action {
  type: Types.DELETE_FILE_FAILED;
  payload: {
    path: string;
    error: Error;
  };
}

export function deleteFile(path: string): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (getState().files.isDeleting[path]) return;

    dispatch({
      type: Types.DELETE_FILE_STARTED,
      payload: {
        path,
      },
    });

    try {
      await unlink(path);
      dispatch({
        type: Types.DELETE_FILE_DONE,
        payload: {
          path,
        },
      });
    } catch (error) {
      dispatch({
        type: Types.DELETE_FILE_FAILED,
        payload: {
          path,
          error,
        },
      });
    }
  };
}

export type FileActions =
  | DeleteFileStartedAction
  | DeleteFileDoneAction
  | DeleteFileFailedAction
  | FetchImagesStartedAction
  | FetchImagesDoneAction
  | FetchImagesFailedAction
  | FetchThumbnailStartedAction
  | FetchThumbnailDoneAction
  | FetchThumbnailFailedAction;
