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
import F from './../models/file.js';

const initialState = {
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

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case DIRECTORY_LOAD_ERROR:
    return ({
      ...state,
      loading: false,
      directories: modifyParentDirectory(
        state.directories.filter((e) => e.path !== payload.path),
        payload.path,
        (parentDir) => D.removeChildDirectory(
          parentDir, payload.path
        ),
      ),
    });
  case DIRECTORY_LOADING:
    return ({
      ...state,
      loading: true,
    });
  case DIRECTORY_LOADED:
    return ({
      ...state,
      loading: false,
      directories: state.directories.
        filter((e) => !D.isEqual(e, payload.directory)).
        concat([payload.directory]),
    });
  case FILE_LOAD_ERROR:
    return ({
      ...state,
      directories: state.directories.
        filter((e) => !D.isEqual(e, payload.directory)).
        concat([D.removeFile(payload.directory, payload.file)]),
    });
  default:
    return state;
  }
}
