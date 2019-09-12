import { combineReducers } from 'redux';
import { Actions } from '../actions';
import directories, { DirectoriesState } from './directories';
import header, { HeaderState } from './header';

export type RootState = {
  directories: DirectoriesState;
  header: HeaderState;
};

export default combineReducers<RootState, Actions>({ directories, header });
