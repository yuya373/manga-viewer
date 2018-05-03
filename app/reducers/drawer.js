import { handleActions } from 'redux-actions';
import {
  DRAWER_OPEN,
  DRAWER_CLOSE,
} from './../actions/drawer.js';

const initialState = {
  isOpen: false,
};

export default function(state = initialState, {type}) {
  switch(type) {
  case DRAWER_OPEN:
    return ({
      ...state,
      isOpen: true,
    });
  case DRAWER_CLOSE:
    return ({
      ...state,
      isOpen: false,
    });
  default:
    return state;
  }
}
