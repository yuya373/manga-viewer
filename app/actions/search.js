import { createAction } from 'redux-actions';

export const SEARCH_QUERY_CHANGED = "SEARCH_QUERY_CHANGED";

export const searchQueryChanged = createAction(
  SEARCH_QUERY_CHANGED,
  ({query}) => ({
    query
  })
);
