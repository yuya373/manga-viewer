import {
  SEARCH_QUERY_CHANGED,
} from './../actions/search.js';

const initialState = {
  query: "",
};

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case SEARCH_QUERY_CHANGED:
    return {
      ...state,
      query: payload.query,
    };
  default:
    return state;
  }
}
