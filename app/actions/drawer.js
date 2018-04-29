import { createAction } from 'redux-actions';

export const DRAWER_CLOSE = "DRAWER_CLOSE";
export const DRAWER_OPEN = "DRAWER_OPEN";

export const drawerOpen = createAction(DRAWER_OPEN);
export const drawerClose = createAction(DRAWER_CLOSE);
