import { File, Directory } from '../types';
import { Actions } from '../actions';
import { Types } from '../actions/types';
import {
  AddFileToFavoriteAction,
  AddDirectoryToFavoriteAction,
  RemoveFromFavoriteAction,
} from '../actions/favorite';
import { DeleteFileDoneAction } from '../actions/file';

export type FavoritesState = {
  favorites: Array<string>;
  byPath: { [path: string]: File | Directory };
};

const initialState: FavoritesState = {
  favorites: [],
  byPath: {},
};

function addToFavorite(
  state: FavoritesState,
  action: AddFileToFavoriteAction | AddDirectoryToFavoriteAction
): FavoritesState {
  const { path, entry } = action.payload;

  const byPath = { ...state.byPath };
  byPath[path] = entry;

  const favorites = state.favorites.concat([path]);

  return {
    ...state,
    favorites,
    byPath,
  };
}

function removeFromFavorite(
  state: FavoritesState,
  action: RemoveFromFavoriteAction | DeleteFileDoneAction
): FavoritesState {
  const { path } = action.payload;

  const byPath = { ...state.byPath };
  delete byPath[path];

  const favorites = state.favorites.filter(e => e !== path);

  return {
    ...state,
    favorites,
    byPath,
  };
}

export default function(
  state: FavoritesState = initialState,
  action: Actions
): FavoritesState {
  switch (action.type) {
    case Types.ADD_FILE_TO_FAVORITE:
    case Types.ADD_DIRECTORY_TO_FAVORITE:
      return addToFavorite(state, action);
    case Types.REMOVE_FROM_FAVORITE:
      return removeFromFavorite(state, action);
    default:
      return state;
  }
}
