import { createAction } from 'redux-actions';
import { ipcRenderer } from 'electron';

export const LOAD_DIRECTORY = "LOAD_DIRECTORY";
export const DIRECTORY_LOADING = "DIRECTORY_LOADING";
export const DIRECTORY_LOADED = "DIRECTORY_LOADED";
export const DIRECTORY_LOAD_ERROR = "DIRECTORY_LOAD_ERROR";

export const directoryLoading = createAction(DIRECTORY_LOADING);
export const directoryLoaded = createAction(
  DIRECTORY_LOADED,
  (directory) => ({
    directory,
  })
);

const directoryLoadError = createAction(
  DIRECTORY_LOAD_ERROR,
  (error, message) => ({
    error,
    message,
  })
)

export function loadDirectory(path) {
  const Worker = require("worker-loader?inline!workers/load_directory.js");
  const worker = new Worker();

  return (dispatch, getState) => {
    const {directory} = getState()
    if (directory.loading) return;

    dispatch(directoryLoading());

    worker.onmessage = (e) => {
      const data = e.data;

      if (data.success) {
        const {directory} = data;
        dispatch(directoryLoaded(directory))
      } else {
        const {error, message} = data;
        console.warn("Error in worker", error);
        dispatch(directoryLoadError(error, message))
      }
    }

    worker.postMessage(path);
  }
}
