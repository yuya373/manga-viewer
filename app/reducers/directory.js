import { handleActions } from 'redux-actions';
import {
  DIRECTORY_LOADING,
  DIRECTORY_LOADED,
  DIRECTORY_LOAD_ERROR,
  DIRECTORY_FAVORITE_CHANGED,
} from './../actions/directory.js';
import {
  FILE_LOADED,
  FILE_FAVORITE_CHANGED,
} from './../actions/file.js';
import D from './../models/directory.js';
import F from './../models/file.js';

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
    }),
    [DIRECTORY_FAVORITE_CHANGED]: (state, {payload}) => ({
      ...state,
      directories: state.directories.map((e) => {
        if (D.isEqual(e, payload.parent)) {
          const target = e.childDirectories.
                find((f) => D.isEqual(f, payload.directory));
          if (target) {
            return D.upsertChildDirectory(e, D.favorite(target, payload.favorite));
          }
        }
        return e;
      }),
    }),
    [FILE_FAVORITE_CHANGED]: (state, {payload}) => ({
      ...state,
      directories: state.directories.map((e) => {
        if (D.isEqual(e, payload.parentDir)) {
          const target = e.files.find((f) => F.isEqual(f, payload.file));
          if (target) {
            return D.upsertFile(e, F.favorite(target, payload.favorite));
          }
        }
        return e;
      })
    })
  },
  defaultState,
);
