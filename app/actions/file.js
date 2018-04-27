import { createAction } from 'redux-actions';
import F from './../models/file.js';
import D from './../models/directory.js';
import Worker from './../workers/load_file.worker.js'

export const LOAD_FILE = "LOAD_FILE";
export const FILE_LOADING = "FILE_LOADING";
export const FILE_LOADED = "FILE_LOADED";
export const FILE_LOAD_ERROR = "FILE_LOAD_ERROR";

export const fileLoading = createAction(FILE_LOADING);


export const fileLoaded = createAction(
  FILE_LOADED,
  (file, directory) => ({
    file,
    directory
  })
);

const fileLoadError = createAction(
  FILE_LOAD_ERROR,
  (error, message) => ({
    error,
    message,
  })
)

export function loadFile(file, directory) {
  const worker = new Worker();

  return (dispatch, getState) => {
    const state = getState()
    if (state.file.loading) return;

    dispatch(fileLoading());

    worker.onmessage = (e) => {
      console.log("WORKER", e);
      const data = e.data;

      if (data.success) {
        const {images} = data;
        const newFile = F.setImages(file, images);
        const newDirectory = D.upsertFile(directory, newFile);
        dispatch(fileLoaded(newFile, newDirectory))
      } else {
        const {error, message} = data;
        console.warn("Error in worker", error);
        dispatch(fileLoadError(error, message))
      }
    }

    worker.postMessage(file);
  }
}
