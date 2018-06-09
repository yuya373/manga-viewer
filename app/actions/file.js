import { createAction } from 'redux-actions';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import F from './../models/file.js';
import D from './../models/directory.js';
import Worker from './../workers/load_file.worker.js'
import { persist } from './persist.js';
import { loadDirectory } from './directory.js';

export const LOAD_FILE = "LOAD_FILE";
export const FILE_LOADING = "FILE_LOADING";
export const FILE_LOADED = "FILE_LOADED";
export const FILE_LOAD_ERROR = "FILE_LOAD_ERROR";
export const FILE_PER_PAGE_CHANGED = "FILE_PER_PAGE_CHANGED";
export const FILE_FAVORITE_CHANGED = "FILE_FAVORITE_CHANGED";
export const FILE_SAVE_THUMBNAIL_URL = "FILE_SAVE_THUMBNAIL_URL";

export const fileLoading = createAction(FILE_LOADING);
export const filePerPageChanged = createAction(FILE_PER_PAGE_CHANGED);

export const fileLoaded = createAction(FILE_LOADED);

export const fileLoadError = createAction(
  FILE_LOAD_ERROR,
  (error, directory, file) => ({
    error: {
      message: error.message,
      code: error.code,
    },
    directory,
    file,
  })
)

function hasFileAndDirectory(state, file, directory) {
  const d = state.directory.directories.
        find((e) => D.isEqual(e, directory));
  if (!d) return false;
  if (!d.files.find((e) => F.isEqual(e, file))) return false;

  return true;
}

export function gotoFile(file, directory, param = {}) {
  return (dispatch, getState) => {
    const params = {
      path: directory.path,
      ...param,
    };

    const url = `/files/${file.name}?${queryString.stringify(params)}`;

    dispatch(fileLoading());

    if (!hasFileAndDirectory(getState(), file, directory)) {
      console.warn("NO FILE AND DIRECTORY");
      dispatch(loadDirectory(directory.path)).then(() => {
        console.warn("DIRECTORY LOADED THEN PUSH URL: ", url);
        dispatch(push(url));
        dispatch(loadFile(file, directory));
      });
    } else {
      dispatch(push(url));
      dispatch(loadFile(file, directory));
    }

  };
}

export function loadFile(file, directory) {
  const worker = new Worker();

  return (dispatch) => {
    worker.onmessage = (e) => {
      console.log("WORKER", e);
      const data = e.data;

      if (data.success) {
        dispatch(fileLoaded())
      } else {
        const {error} = data;
        console.log("Error in worker", error);
        dispatch(fileLoadError(error, directory, file))
      }
    }

    worker.postMessage(file);
  }
}

export function fileFavoriteChanged({path, favorite}) {
  const action = createAction(
    FILE_FAVORITE_CHANGED,
    ({ path, favorite }) => ({
      path,
      favorite,
    })
  );

  return (dispatch) => {
    dispatch(action({path, favorite}));
    dispatch(persist());
  }
}

export function saveThumbnailUrl({ file, directory, thumbnailUrl }) {
  const action = createAction(FILE_SAVE_THUMBNAIL_URL);

  return (dispatch) => {
    dispatch(action({ file, directory, thumbnailUrl }));
  }
}
