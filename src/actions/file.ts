import { Action } from 'redux';
import { join } from 'path';
import { ThunkAction, ThunkDispatch } from '.';
import { unlink } from '../utils';
import { Types } from './types';
import { ImageEntry } from '../types';
import { getImagesToDisplay } from '../utils/viewer';
import { isFavorite, removeFromFavorite } from './favorite';
import ReadAllImagesWorker, {
  OutgoingMessage,
} from '../workers/readAllImages.worker';
import ReadThumbnailWorker, {
  OutgoingMessage as ThumnailOutgoinMessage,
} from '../workers/readThumbnail.worker';
import { displayNextFile, displayPrevFile } from './viewer';
import { closeFileDialog } from './fileDialog';

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

const fetchImageFailed = ({
  path,
  error,
}: {
  path: string;
  error: Error;
}): FetchImagesFailedAction => ({
  type: Types.FETCH_IMAGES_FAILED,
  payload: {
    path,
    error,
  },
});

function fetchImagesSuccess({
  path,
  images,
}: {
  path: string;
  images: Array<ImageEntry>;
}): ThunkAction<void> {
  return (dispatch, getState) => {
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

let readAllImagesWorker: any = null;

function getReadAllImagesWorker(dispatch: ThunkDispatch): any {
  if (readAllImagesWorker == null) {
    readAllImagesWorker = new ReadAllImagesWorker();
    readAllImagesWorker.onmessage = (ev: { data: OutgoingMessage }) => {
      const { data } = ev;
      if (data.success) {
        const { payload } = data;
        dispatch(fetchImagesSuccess(payload));
      } else {
        const { payload } = data;
        dispatch(fetchImageFailed(payload));
      }
    };
  }

  return readAllImagesWorker;
}

export function fetchImages(path: string): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (getState().files.isLoading[path]) return;

    dispatch(fetchImagesStarted(path));

    const file = getState().files.byPath[path];
    if (file == null) return;

    if (file.isLoaded) {
      const { images } = file;
      dispatch(fetchImagesSuccess({ path, images }));
    } else {
      const worker = getReadAllImagesWorker(dispatch);
      worker.postMessage({ path });
    }
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
    if (getState().fileDialog.isOpen) {
      if (
        !(await dispatch(displayNextFile())) &&
        !(await dispatch(displayPrevFile()))
      ) {
        dispatch(closeFileDialog());
      }
    }

    if (getState().files.isDeleting[path]) return;

    dispatch({
      type: Types.DELETE_FILE_STARTED,
      payload: {
        path,
      },
    });

    try {
      await unlink(path);
      if (dispatch(isFavorite(path))) {
        dispatch(removeFromFavorite(path));
      }
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
