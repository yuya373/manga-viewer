import { createAction } from 'redux-actions';

export const STATE_LOADED = "STATE_LOADED";
export const STATE_CHANGED = "STATE_CHANGED";
export const PARSE_DIR_ERROR = "PARSE_DIR_ERROR";

export const parseDirError = createAction(
  PARSE_DIR_ERROR,
  ({message, error}) => ({
    error,
    message,
  })
);
export const stateLoaded = createAction(
  STATE_LOADED,
  (state) => ({
    ...state,
  })
);

export const stateChanged = createAction(
  STATE_CHANGED,
  (state) => ({
    ...state,
  })
);
