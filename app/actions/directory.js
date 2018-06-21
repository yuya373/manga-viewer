import { createAction } from 'redux-actions';
import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import Worker from './../workers/load_directory.worker.js'
import { persist } from './persist.js';

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
    const url = `/directories/${encodeURIComponent(path)}?${qs}`;
    if (force || !hasDirectory) {
      dispatch(directoryLoading());
      dispatch(push(url));
      dispatch(loadDirectory(path));
    } else {
      dispatch(push(url));
    }
  }
}

export function loadDirectory(path) {
  const worker = new Worker();

  return (dispatch) => {
    return new Promise((resolve, reject) =>  {
      worker.onmessage = (e) => {
        const data = e.data;

        if (data.success) {
          const {directory} = data;
          dispatch(directoryLoaded(directory))
          dispatch(persist());
          resolve();
        } else {
          const {error} = data;
          console.warn("Error in worker", error);
          dispatch(directoryLoadError(error, path))
          reject(error);
        }
      }

      worker.postMessage(path);
    })
  }
}


export const directoryFavoriteChanged = ({path, favorite}) => {
  const action = createAction(
    DIRECTORY_FAVORITE_CHANGED,
    ({ path, favorite }) => ({
      path,
      favorite
    })
  );

  return (dispatch) => {
    dispatch(action({path, favorite}));
    dispatch(persist());
  }
}
