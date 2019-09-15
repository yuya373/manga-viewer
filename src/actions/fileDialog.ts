import { Action } from 'redux';
import { Types } from './types';
import { ThunkAction } from '.';

export interface FileDialogOpenAction extends Action {
  type: Types.FILE_DIALOG_OPEN;
  payload: {
    name: string;
    path: string;
  };
}

export const fileDialogOpen = ({
  path,
  name,
}: {
  path: string;
  name: string;
}): FileDialogOpenAction => ({
  type: Types.FILE_DIALOG_OPEN,
  payload: {
    name,
    path,
  },
});

export interface FileDialogCloseAction extends Action {
  type: Types.FILE_DIALOG_CLOSE;
}

export const fileDialogClose = (): FileDialogCloseAction => ({
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

export type FileDialogActions =
  | FileDialogOpenAction
  | FileDialogCloseAction
  | FileDialogHideAppBarAction
  | FileDialogDisplayAppBarAction;
