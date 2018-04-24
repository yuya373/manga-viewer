import { createAction } from 'redux-actions';
import { ipcRenderer } from 'electron';

export const LOAD_DIRECTORY = "LOAD_DIRECTORY";
export const DIRECTORY_LOADING = "DIRECTORY_LOADING";
export const DIRECTORY_LOADED = "DIRECTORY_LOADED";

export const directoryLoading = createAction(DIRECTORY_LOADING);
export const directoryLoaded = createAction(DIRECTORY_LOADED);

export function loadDirectory(path) {
  return (dispatch) => {
    ipcRenderer.send(LOAD_DIRECTORY, path);
  }
}
