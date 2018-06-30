import { createAction } from 'redux-actions';

export const SNACKBAR_HIDE = "SNACKBAR_HIDE";

export const hideSnackbar = createAction(SNACKBAR_HIDE);

export const SNACKBAR_NOTIFY_MESSAGE = "SNACKBAR_NOTIFY_MESSAGE";
export const notifyMessage = createAction(
  SNACKBAR_NOTIFY_MESSAGE,
  (message) => ({ message })
);

