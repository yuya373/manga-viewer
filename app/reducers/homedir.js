import { handleActions } from 'redux-actions';
import D from './../models/directory.js';
import {
  STATE_LOADED,
  STATE_CHANGED,
} from './../actions/ipc_renderer.js';

export default handleActions(
  {
    [STATE_CHANGED]: (state, {payload}) =>
      payload.homedir ? ({
        ...state,
        ...payload.homedir,
      }) : state,
    [STATE_LOADED]: (state, {payload}) =>
      payload.homedir ? ({
        ...payload.homedir,
      }) : state,
  },
  D.create(""),
)
