import { Action } from 'redux';
import { Types } from './types';
import { Directory, File, createFile, createDirectory } from '../types';
import { ThunkAction } from '.';
import { save } from './store';

export function isFavorite(path: string): ThunkAction<boolean> {
  return (_dispatch, getState) => {
    return Boolean(getState().favorites.byPath[path]);
  };
}

export interface AddFileToFavoriteAction extends Action {
  type: Types.ADD_FILE_TO_FAVORITE;
  payload: {
    path: string;
    entry: File;
  };
}

function addFileToFavorite(path: string): ThunkAction<void> {
  return dispatch => {
    dispatch({
      type: Types.ADD_FILE_TO_FAVORITE,
      payload: {
        path,
        entry: createFile({ entry: path }),
      },
    });
    dispatch(save());
  };
}

export interface AddDirectoryToFavoriteAction extends Action {
  type: Types.ADD_DIRECTORY_TO_FAVORITE;
  payload: {
    path: string;
    entry: Directory;
  };
}

function addDirectoryToFavorite(path: string): ThunkAction<void> {
  return dispatch => {
    dispatch({
      type: Types.ADD_DIRECTORY_TO_FAVORITE,
      payload: {
        path,
        entry: createDirectory({ entry: path }),
      },
    });
    dispatch(save());
  };
}

export interface RemoveFromFavoriteAction extends Action {
  type: Types.REMOVE_FROM_FAVORITE;
  payload: {
    path: string;
  };
}

export function removeFromFavorite(path: string): ThunkAction<void> {
  return dispatch => {
    dispatch({
      type: Types.REMOVE_FROM_FAVORITE,
      payload: {
        path,
      },
    });
    dispatch(save());
  };
}

export function toggleFavorite(path: string, isFile = true): ThunkAction<void> {
  return (dispatch, getState) => {
    const addAction = isFile ? addFileToFavorite : addDirectoryToFavorite;
    const action = dispatch(isFavorite(path)) ? removeFromFavorite : addAction;

    requestAnimationFrame(() => {
      dispatch(action(path));
    });
  };
}

export function toggleDirectoryFavorite(path: string): ThunkAction<void> {
  return dispatch => {
    dispatch(toggleFavorite(path, false));
  };
}

export type FavoriteActions =
  | AddFileToFavoriteAction
  | AddDirectoryToFavoriteAction
  | RemoveFromFavoriteAction;
