import { createAction } from 'redux-actions';

export const SORT_TOGGLE_DIRECTION = "SORT_TOGGLE_DIRECTION";

export const toggleDirection = createAction(SORT_TOGGLE_DIRECTION)
