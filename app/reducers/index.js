// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import homedir from './homedir.js';

const rootReducer = combineReducers({
  counter,
  router,
  homedir,
});

export default rootReducer;
