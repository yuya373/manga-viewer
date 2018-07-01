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
  SNACKBAR_NOTIFY_MESSAGE,
} from './../actions/snackbar.js';

const initialState = {
  isOpen: false,
  message: "",
  autoHide: false,
};

const displayMessage = (state, { message, autoHide = false }) => ({
  ...state,
  isOpen: true,
  message,
  autoHide,
});

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case SNACKBAR_NOTIFY_MESSAGE:
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
