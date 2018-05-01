import { createAction } from 'redux-actions';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import F from './../models/file.js';
import D from './../models/directory.js';
import Worker from './../workers/load_file.worker.js'

export const LOAD_FILE = "LOAD_FILE";
export const FILE_LOADING = "FILE_LOADING";
export const FILE_LOADED = "FILE_LOADED";
export const FILE_LOAD_ERROR = "FILE_LOAD_ERROR";
export const FILE_PER_PAGE_CHANGED = "FILE_PER_PAGE_CHANGED";
export const FILE_FAVORITE_CHANGED = "FILE_FAVORITE_CHANGED";

export const fileLoading = createAction(FILE_LOADING);
export const filePerPageChanged = createAction(FILE_PER_PAGE_CHANGED);

export const fileFavoriteChanged = createAction(
  FILE_FAVORITE_CHANGED,
  ({ path, favorite }) => ({
    path,
    favorite,
  })
);


export const fileLoaded = createAction(
  FILE_LOADED,
  (file, directory) => ({
    file,
    directory
  })
);

const fileLoadError = createAction(
  FILE_LOAD_ERROR,
  (error, directory, path) => ({
    error,
    directory,
    path,
  })
)

export function gotoFile(file, directory, param = {}) {
  return (dispatch) => {
    const params = {
      path: directory.path,
      ...param,
    };

    const url = `/files/${file.name}?${queryString.stringify(params)}`;
    dispatch(fileLoading());
    dispatch(push(url));
    loadFile(file, directory)(dispatch);
  };
}

export function loadFile(file, directory) {
  const worker = new Worker();

  return (dispatch) => {
    worker.onmessage = (e) => {
      console.log("WORKER", e);
      const data = e.data;

      if (data.success) {
        const {images} = data;
        const newFile = F.setImages(file, images);
        const newDirectory = D.upsertFile(directory, newFile);
        dispatch(fileLoaded(newFile, newDirectory))
      } else {
        const {error} = data;
        console.log("Error in worker", error);
        const newDirectory = D.removeFile(directory, file);
        dispatch(fileLoadError(error, newDirectory, file.path))
      }
    }

    worker.postMessage(file);
  }
}
