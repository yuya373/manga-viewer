import { handleActions } from 'redux-actions';
import {
  DRAWER_OPEN,
  DRAWER_CLOSE,
} from './../actions/drawer.js';

export default handleActions(
  {
    [DRAWER_OPEN]: (state) => ({
      ...state,
      isOpen: true,
    }),
    [DRAWER_CLOSE]: (state) => ({
      ...state,
      isOpen: false,
    }),
  },
  {
    isOpen: false,
  }
);
