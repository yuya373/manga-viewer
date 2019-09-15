import { Action } from 'redux';
import { Types } from './types';
import { Directory, File, createFile, createDirectory } from '../types';
import { ThunkAction } from '.';

export interface AddFileToFavoriteAction extends Action {
  type: Types.ADD_FILE_TO_FAVORITE;
  payload: {
    path: string;
    entry: File;
  };
}

export const addFileToFavorite = (path: string): AddFileToFavoriteAction => ({
  type: Types.ADD_FILE_TO_FAVORITE,
  payload: {
    path,
    entry: createFile(path),
  },
});

export interface AddDirectoryToFavoriteAction extends Action {
  type: Types.ADD_DIRECTORY_TO_FAVORITE;
  payload: {
    path: string;
    entry: Directory;
  };
}

export const addDirectoryToFavorite = (
  path: string
): AddDirectoryToFavoriteAction => ({
  type: Types.ADD_DIRECTORY_TO_FAVORITE,
  payload: {
    path,
    entry: createDirectory(path),
  },
});

export interface RemoveFromFavoriteAction extends Action {
  type: Types.REMOVE_FROM_FAVORITE;
  payload: {
    path: string;
  };
}

export const removeFromFavorite = (path: string): RemoveFromFavoriteAction => ({
  type: Types.REMOVE_FROM_FAVORITE,
  payload: {
    path,
  },
});

export function toggleFavorite(path: string, isFile = true): ThunkAction<void> {
  return (dispatch, getState) => {
    const isFavorite = Boolean(getState().favorites.byPath[path]);

    const addAction = isFile ? addFileToFavorite : addDirectoryToFavorite;
    const action = isFavorite ? removeFromFavorite : addAction;

    requestAnimationFrame(() => {
      dispatch(action(path));
    });
  };
}

export type FavoriteActions =
  | AddFileToFavoriteAction
  | AddDirectoryToFavoriteAction
  | RemoveFromFavoriteAction;
