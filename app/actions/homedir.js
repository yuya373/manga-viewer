import { createAction } from 'redux-actions';
import { ipcRenderer } from 'electron';

export const RELOAD_DIRECTORY = "RELOAD_DIRECTORY";
export const RELOADING_DIRECTORY = "RELOADING_DIRECTORY";

const reloadingDirectory = createAction(
  RELOADING_DIRECTORY,
  (path) => ({
    path,
  })
);

export function reloadDirectory(path, parent) {
  return (dispatch) => {
    ipcRenderer.send(RELOAD_DIRECTORY, path, parent);
    dispatch(reloadingDirectory(path));
  };

}
