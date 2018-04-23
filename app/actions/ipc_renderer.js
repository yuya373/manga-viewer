import { createAction } from 'redux-actions';

export const STATE_LOADED = "STATE_LOADED";
export const STATE_CHANGED = "STATE_CHANGED";

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
