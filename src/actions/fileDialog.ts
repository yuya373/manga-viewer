import { Action } from 'redux';
import { Types } from './types';
import { ThunkAction } from '.';
import { File, isFile } from '../types';
import { deleteFile } from './file';
import { displayNextFile, displayPrevFile } from './viewer';

export interface FileDialogOpenAction extends Action {
  type: Types.FILE_DIALOG_OPEN;
  payload: {
    name: string;
    path: string;
    files: Array<File>;
  };
}

const fileDialogOpen = ({
  path,
  name,
  files,
}: {
  path: string;
  name: string;
  files: Array<File>;
}): FileDialogOpenAction => ({
  type: Types.FILE_DIALOG_OPEN,
  payload: {
    name,
    path,
    files,
  },
});

export function openFileDialog({
  path,
  name,
  fromFavorite,
}: {
  path: string;
  name: string;
  fromFavorite?: boolean;
}): ThunkAction<void> {
  return (dispatch, getState) => {
    let files: Array<File>;
    if (fromFavorite) {
      files = Object.values(getState().favorites.byPath).filter(isFile);
    } else {
      const directory = getState().directories.byPath[path];
      if (directory == null) return;
      files = directory.entries.filter(isFile);
    }

    dispatch(
      fileDialogOpen({
        path,
        name,
        files,
      })
    );
  };
}

export interface FileDialogCloseAction extends Action {
  type: Types.FILE_DIALOG_CLOSE;
}

export const closeFileDialog = (): FileDialogCloseAction => ({
  type: Types.FILE_DIALOG_CLOSE,
});

export interface FileDialogHideAppBarAction extends Action {
  type: Types.FILE_DIALOG_HIDE_APP_BAR;
}

export const fileDialogHideAppBar = (): ThunkAction<void> => {
  return (dispatch, getState) => {
    if (getState().fileDialog.isAppBarHidden) return;

    requestAnimationFrame(() => {
      dispatch({
        type: Types.FILE_DIALOG_HIDE_APP_BAR,
      });
    });
  };
};

export interface FileDialogDisplayAppBarAction extends Action {
  type: Types.FILE_DIALOG_DISPLAY_APP_BAR;
}

export const fileDialogDisplayAppBar = (): ThunkAction<void> => {
  return (dispatch, getState) => {
    if (!getState().fileDialog.isAppBarHidden) return;

    requestAnimationFrame(() => {
      dispatch({
        type: Types.FILE_DIALOG_DISPLAY_APP_BAR,
      });
    });
  };
};

export interface FileDialogFileChangedAction extends Action {
  type: Types.FILE_DIALOG_FILE_CHANGED;
  payload: {
    path: string;
    name: string;
  };
}

export function deleteFileFromDialog(path: string): ThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (
      !(await dispatch(displayNextFile())) &&
      !(await dispatch(displayPrevFile()))
    ) {
      dispatch(closeFileDialog());
    }
    await dispatch(deleteFile(path));
  };
}

export type FileDialogActions =
  | FileDialogFileChangedAction
  | FileDialogOpenAction
  | FileDialogCloseAction
  | FileDialogHideAppBarAction
  | FileDialogDisplayAppBarAction;
