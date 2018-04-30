import { handleActions } from 'redux-actions';
import {
  DIRECTORY_LOADING,
  DIRECTORY_LOADED,
  DIRECTORY_LOAD_ERROR,
} from './../actions/directory.js';
import {
  FILE_LOADED,
  FILE_LOAD_ERROR,
} from './../actions/file.js';
import D from './../models/directory.js';

const defaultState = {
  loading: false,
  directories: [],
};

const modifyParentDirectory = (directories, childPath, modify) => {
  const paths = childPath.split("/");
  const parentPath = paths.slice(0, paths.length - 1).join("/");

  return directories.map((e) => {
    if (e.path === parentPath) return modify(e);
    return e;
  });
}

export default handleActions(
  {
    [DIRECTORY_LOAD_ERROR]: (state, {payload}) => ({
      ...state,
      loading: false,
      directories: modifyParentDirectory(
        state.directories.filter((e) => e.path !== payload.path),
        payload.path,
        (parentDir) => D.removeChildDirectory(parentDir, payload.path),
      ),
    }),
    [DIRECTORY_LOADING]: (state) => ({
      ...state,
      loading: true,
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
    [FILE_LOAD_ERROR]: (state, {payload}) => ({
      ...state,
      directories: state.directories.
        filter((e) => !D.isEqual(e, payload.directory)).
        concat([payload.directory]),
    }),
  },
  defaultState,
);
