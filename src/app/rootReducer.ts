import { combineReducers } from '@reduxjs/toolkit';
import directories from '../reducers/directories';
import header from '../reducers/header';
import thumbnails from '../reducers/thumbnails';
import fileDialog from '../reducers/fileDialog';
import viewer from '../reducers/viewer';
import files from '../features/files/filesSlice';
import favorites from '../reducers/favorites';
import hitomi from '../reducers/hitomi';

const rootReducer = combineReducers({
  directories,
  header,
  thumbnails,
  files,
  fileDialog,
  viewer,
  favorites,
  hitomi,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
