import { combineReducers } from 'redux';
import { Actions } from '../actions';
import directories, { DirectoriesState } from './directories';
import header, { HeaderState } from './header';
import thumbnails, { ThumbnailsState } from './thumbnails';
import fileDialog, { FileDialogState } from './fileDialog';
import viewer, { ViewerState } from './viewer';
import files, { FilesState } from './files';
import favorites, { FavoritesState } from './favorites';
import hitomi, { HitomiState } from './hitomi';

export type RootState = {
  directories: DirectoriesState;
  header: HeaderState;
  thumbnails: ThumbnailsState;
  files: FilesState;
  fileDialog: FileDialogState;
  viewer: ViewerState;
  favorites: FavoritesState;
  hitomi: HitomiState;
};

export default combineReducers<RootState, Actions>({
  directories,
  header,
  thumbnails,
  files,
  fileDialog,
  viewer,
  favorites,
  hitomi,
});
