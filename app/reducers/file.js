import { handleActions } from 'redux-actions';
import {
  FILE_LOADING,
  FILE_LOADED,
  FILE_LOAD_ERROR,
  FILE_PER_PAGE_CHANGED,
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
    }),
    [FILE_PER_PAGE_CHANGED]: (state, {payload}) => ({
      ...state,
      perPage: payload,
    }),
    [FILE_LOAD_ERROR] : (state, {payload}) => ({
      ...state,
      loading: false,
    })
  },
  {
    loading: false,
    perPage: 2,
  }
)
