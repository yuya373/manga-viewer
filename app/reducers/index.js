// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import directory from './directory.js';
import file from './file.js';
import drawer from './drawer.js';
import favorite from './favorite.js';
import snackbar from './snackbar.js';

const rootReducer = combineReducers({
  router,
  directory,
  file,
  drawer,
  favorite,
  snackbar,
});

export default rootReducer;
