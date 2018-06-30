import { handleActions } from 'redux-actions';
import {
  FILE_LOAD_ERROR,
  FILE_DELETE_FAILED,
  FILE_DELETE_SUCCESS,
} from './../actions/file.js';
import {
  DIRECTORY_LOAD_ERROR,
} from './../actions/directory.js';
import {
  SNACKBAR_HIDE,
} from './../actions/snackbar.js';

const initialState = {
  isOpen: false,
  message: "",
};

const displayMessage = (state, {message}) => ({
  ...state,
  isOpen: true,
  message,
});

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case FILE_DELETE_SUCCESS:
    return displayMessage(state, payload);
  case FILE_DELETE_FAILED:
  case FILE_LOAD_ERROR:
  case DIRECTORY_LOAD_ERROR:
    return displayMessage(state, payload.error);
  case SNACKBAR_HIDE:
    return ({
      ...state,
      isOpen: false,
    });
  default:
    return state;
  }
}
