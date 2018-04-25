import { handleActions } from 'redux-actions';
import {
  DIRECTORY_LOADING,
  DIRECTORY_LOADED,
  DIRECTORY_LOAD_ERROR,
} from './../actions/directory.js';
import {
  FILE_LOADED,
} from './../actions/file.js';
import D from './../models/directory.js';

const defaultState = {
  loading: false,
  directories: [],
  error: {
    message: "",
  }
};

export default handleActions(
  {
    [DIRECTORY_LOAD_ERROR]: (state, {payload}) => ({
      ...state,
      loading: false,
      error: {
        ...state.error,
        message: payload.message,
      }
    }),
    [DIRECTORY_LOADING]: (state) => ({
      ...state,
      loading: true,
      error: {
        message: "",
      },
    }),
    [DIRECTORY_LOADED]: (state, {payload}) => ({
      ...state,
      loading: false,
      directories: state.directories.
        filter((e) => !D.isEqual(e, payload.directory)).
        concat([payload.directory]),
    }),
    [FILE_LOADED]: (state, {payload}) => ({
      ...state,
      directories: state.directories.
        filter((e) => !D.isEqual(e, payload.directory)).
        concat([payload.directory])
    })
  },
  defaultState,
);
