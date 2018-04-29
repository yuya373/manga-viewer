import { handleActions } from 'redux-actions';
import {
  DIRECTORY_FAVORITE_CHANGED,
} from './../actions/directory.js';
import {
  FILE_FAVORITE_CHANGED,
} from './../actions/file.js';

const initialState = {
  files: [],
  directories: [],
};

export default handleActions(
  {
    [DIRECTORY_FAVORITE_CHANGED]: (state, {payload}) => ({
      ...state,
      directories: state.directories.filter((e) => e !== payload.path).
        concat(payload.favorite ? [payload.path] : []),
    }),
    [FILE_FAVORITE_CHANGED]: (state, {payload}) => ({
      ...state,
      files: state.files.filter((e) => e !== payload.path).
        concat(payload.favorite ? [payload.path] : []),
    }),
  },
  initialState
);