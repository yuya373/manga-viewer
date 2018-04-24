import { handleActions } from 'redux-actions';
import {
  STATE_LOADED,
  STATE_CHANGED,
  PARSE_DIR_ERROR,
} from './../actions/ipc_renderer.js';
import {
  DIRECTORY_LOADING,
} from './directory.js';

export default handleActions(
  {
    [STATE_LOADED]: (state, {payload}) => ({
      ...state,
      directories: payload.directories,
    }),
    [STATE_CHANGED]: (state, {payload}) => ({
      ...state,
      directories: payload.directories,
    }),
    [PARSE_DIR_ERROR]: (state, {payload}) => ({
      ...state,
      error: {
        ...state.error,
        message: payload.message,
      }
    }),
    [DIRECTORY_LOADING]: (state) => ({
      ...state,
      error: {
        message: "",
      },
    }),
  },
  {
    directories: [],
    error: {
      message: "",
    }
  }
);
