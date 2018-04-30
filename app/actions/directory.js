import { createAction } from 'redux-actions';
import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import Worker from './../workers/load_directory.worker.js'

export const LOAD_DIRECTORY = "LOAD_DIRECTORY";
export const DIRECTORY_LOADING = "DIRECTORY_LOADING";
export const DIRECTORY_LOADED = "DIRECTORY_LOADED";
export const DIRECTORY_LOAD_ERROR = "DIRECTORY_LOAD_ERROR";
export const DIRECTORY_FAVORITE_CHANGED = "DIRECTORY_FAVORITE_CHANGED";

export const directoryLoading = createAction(DIRECTORY_LOADING);
export const directoryLoaded = createAction(
  DIRECTORY_LOADED,
  (directory) => ({
    directory,
  })
);

export const directoryFavoriteChanged = createAction(
  DIRECTORY_FAVORITE_CHANGED,
  ({ path, favorite }) => ({
    path,
    favorite
  })
);

const directoryLoadError = createAction(
  DIRECTORY_LOAD_ERROR,
  (error, path) => ({
    error,
    path
  })
)

export function gotoDirectory(path, params = {}, force = false) {
  return (dispatch, getState) => {
    const hasDirectory = Boolean(
      getState().directory.directories.find((e) => e.path === path)
    );
    const qs = queryString.stringify(params);
    const url = `/directories${path}?${qs}`;
    if (force || !hasDirectory) {
      dispatch(directoryLoading());
      dispatch(push(url));
      loadDirectory(path)(dispatch);
    } else {
      dispatch(push(url));
    }
  }
}

export function loadDirectory(path) {
  const worker = new Worker();

  return (dispatch) => {
    worker.onmessage = (e) => {
      const data = e.data;

      if (data.success) {
        const {directory} = data;
        dispatch(directoryLoaded(directory))
      } else {
        const {error} = data;
        console.warn("Error in worker", error);
        dispatch(directoryLoadError(error, path))
      }
    }

    worker.postMessage(path);
  }
}
