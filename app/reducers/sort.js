import {
  SORT_TOGGLE_DIRECTION,
} from './../actions/sort.js';

const initialState = {
  key: "mtime",
  desc: true,
};

export default function(state = initialState, { type, payload }) {
  switch(type) {
  case SORT_TOGGLE_DIRECTION:
    return {
      ...state,
      desc: !state.desc,
    };
  default:
    return state;
  }
}
