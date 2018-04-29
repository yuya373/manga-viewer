// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import homedir from './homedir.js';
import directory from './directory.js';
import file from './file.js';
import drawer from './drawer.js';
import favorite from './favorite.js';

const rootReducer = combineReducers({
  counter,
  router,
  homedir,
  directory,
  file,
  drawer,
  favorite,
});

export default rootReducer;
