import { handleActions } from 'redux-actions';
import {
  FILE_LOAD_ERROR,
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

export default handleActions(
  {
    [FILE_LOAD_ERROR]: (state, {payload}) =>
      displayMessage(state, payload.error),
    [DIRECTORY_LOAD_ERROR]: (state, {payload}) =>
      displayMessage(state, payload.error),
    [SNACKBAR_HIDE]: (state) =>  ({
      ...state,
      isOpen: false,
    }),
  },
  initialState
);
