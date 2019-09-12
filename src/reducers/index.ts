import { combineReducers } from 'redux';
import { Actions } from '../actions';
import directories, { DirectoriesState } from './directories';
import header, { HeaderState } from './header';
import thumbnails, { ThumbnailsState } from './thumbnails';

export type RootState = {
  directories: DirectoriesState;
  header: HeaderState;
  thumbnails: ThumbnailsState;
};

export default combineReducers<RootState, Actions>({
  directories,
  header,
  thumbnails,
});
