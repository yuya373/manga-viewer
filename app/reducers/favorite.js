import { handleActions } from 'redux-actions';
import {
  DIRECTORY_FAVORITE_CHANGED,
  DIRECTORY_LOAD_ERROR,
} from './../actions/directory.js';
import {
  FILE_FAVORITE_CHANGED,
  FILE_LOAD_ERROR,
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
    [FILE_LOAD_ERROR]: (state, {payload}) => ({
      ...state,
      files: state.files.filter((e) => e !== payload.file.path),
    }),
    [DIRECTORY_LOAD_ERROR]: (state, {payload}) => ({
      ...state,
      directories: state.directories.filter((e) => e !== payload.path),
    }),
  },
  initialState
);
