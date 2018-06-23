import { handleActions } from 'redux-actions';
import {
  FILE_LOADING,
  FILE_LOADED,
  FILE_LOAD_ERROR,
  FILE_PER_PAGE_CHANGED,
  FILE_SAVE_THUMBNAIL_URL,
} from './../actions/file.js';

const initialState = {
  loading: false,
  perPage: 2,
  thumbnailUrls: {},
};

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case FILE_LOADING:
    return ({
      ...state,
      loading: true,
    });
  case FILE_LOADED:
    return ({
      ...state,
      loading: false,
    });
  case FILE_PER_PAGE_CHANGED:
    return ({
      ...state,
      perPage: payload,
    });
  case FILE_LOAD_ERROR :
    return ({
      ...state,
      loading: false,
    });
  case FILE_SAVE_THUMBNAIL_URL:
    return ({
      ...state,
      thumbnailUrls: {
        ...state.thumbnailUrls,
        [payload.file.path]: [payload.thumbnailUrl],
      },
    });
  default:
    return state;
  }
}
