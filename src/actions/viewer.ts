import { Action } from 'redux';
import { join } from 'path';
import { Types } from './types';
import { ThunkAction } from '.';
import { getImagesToDisplay } from '../utils/viewer';

export interface DisplayNextPageAction extends Action {
  type: Types.DISPLAY_NEXT_PAGE;
  payload: {
    index: number;
    imagesToDisplay: Array<string>;
  };
}

export const displayNextPage = (): ThunkAction<void> => {
  return (dispatch, getState) => {
    const { path, name } = getState().fileDialog;
    const file = getState().files.byPath[join(path, name)];
    if (file == null) return;

    const { images } = file;
    const { index: currentIndex, perPage } = getState().viewer;

    const index = Math.min(
      currentIndex === 0 ? currentIndex + 1 : currentIndex + perPage,
      images.length - 1
    );

    const imagesToDisplay = getImagesToDisplay({ index, perPage, images }).map(
      e => e.url
    );

    requestAnimationFrame(() => {
      dispatch({
        type: Types.DISPLAY_NEXT_PAGE,
        payload: {
          index,
          imagesToDisplay,
        },
      });
    });
  };
};

export interface DisplayPrevPageAction extends Action {
  type: Types.DISPLAY_PREV_PAGE;
  payload: {
    index: number;
    imagesToDisplay: Array<string>;
  };
}

export const displayPrevPage = (): ThunkAction<void> => {
  return (dispatch, getState) => {
    const { path, name } = getState().fileDialog;
    const file = getState().files.byPath[join(path, name)];
    if (file == null) return;

    const { images } = file;
    const { index: currentIndex, perPage } = getState().viewer;

    const index = Math.max(0, currentIndex - perPage);
    const imagesToDisplay = getImagesToDisplay({ index, perPage, images }).map(
      e => e.url
    );

    requestAnimationFrame(() => {
      dispatch({
        type: Types.DISPLAY_PREV_PAGE,
        payload: {
          index,
          imagesToDisplay,
        },
      });
    });
  };
};

export interface ViewerPerPageChangedAction extends Action {
  type: Types.VIEWER_PER_PAGE_CHANGED;
  payload: {
    perPage: 1 | 2;
    imagesToDisplay: Array<string>;
  };
}

export function perPageChanged(): ThunkAction<void> {
  return (dispatch, getState) => {
    const { path, name } = getState().fileDialog;
    const file = getState().files.byPath[join(path, name)];
    if (file == null) return;

    const { images } = file;
    const { index, perPage: currentPerPage } = getState().viewer;
    const perPage = currentPerPage === 1 ? 2 : 1;
    const imagesToDisplay = getImagesToDisplay({ index, perPage, images }).map(
      e => e.url
    );

    dispatch({
      type: Types.VIEWER_PER_PAGE_CHANGED,
      payload: {
        perPage,
        imagesToDisplay,
      },
    });
  };
}

export type ViewerActions =
  | DisplayNextPageAction
  | DisplayPrevPageAction
  | ViewerPerPageChangedAction;
