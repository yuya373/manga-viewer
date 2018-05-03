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

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case DIRECTORY_FAVORITE_CHANGED:
    return ({
      ...state,
      directories: state.directories.filter((e) => e !== payload.path).
        concat(payload.favorite ? [payload.path] : []),
    });
  case FILE_FAVORITE_CHANGED:
    return ({
      ...state,
      files: state.files.filter((e) => e !== payload.path).
        concat(payload.favorite ? [payload.path] : []),
    });
  case FILE_LOAD_ERROR:
    return ({
      ...state,
      files: state.files.filter((e) => e !== payload.file.path),
    });
  case DIRECTORY_LOAD_ERROR:
    return ({
      ...state,
      directories: state.directories.filter((e) => e !== payload.path),
    });
  default:
    return state;
  }
}
