import { combineReducers } from 'redux';
import { Actions } from '../actions';
import directories, { DirectoriesState } from './directories';

export type RootState = {
  directories: DirectoriesState;
};

export default combineReducers<RootState, Actions>({ directories });
