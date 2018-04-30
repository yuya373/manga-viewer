import { createAction } from 'redux-actions';

export const SNACKBAR_HIDE = "SNACKBAR_HIDE";

export const hideSnackbar = createAction(SNACKBAR_HIDE);
