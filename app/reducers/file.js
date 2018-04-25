import { handleActions } from 'redux-actions';
import {
  FILE_LOADING,
  FILE_LOADED,
  FILE_LOAD_ERROR,
} from './../actions/file.js';

export default handleActions(
  {
    [FILE_LOADING]: (state) => ({
      ...state,
      loading: true,
    }),
    [FILE_LOADED]: (state) => ({
      ...state,
      loading: false,
      error: {
        ...state.error,
        message: "",
      },
    })
  },
  {
    loading: false,
    error: {
      message: "",
    },
  }
)
