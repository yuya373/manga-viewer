/* eslint-disable import/prefer-default-export */
import { Action } from 'redux';
import { Types } from './types';

export interface HeaderTitleChangedAction extends Action {
  type: Types.HEADER_TITLE_CHANGED;
  payload: {
    title: string;
  };
}

export const headerTitleChanged = (title: string): HeaderTitleChangedAction => {
  return {
    type: Types.HEADER_TITLE_CHANGED,
    payload: {
      title,
    },
  };
};

export interface HeaderHideBackButtonAction extends Action {
  type: Types.HEADER_HIDE_BACK_BUTTON;
}

export const headerHideBackButton = (): HeaderHideBackButtonAction => ({
  type: Types.HEADER_HIDE_BACK_BUTTON,
});

export interface HeaderDisplayBackButtonAction extends Action {
  type: Types.HEADER_DISPLAY_BACK_BUTTON;
}

export const headerDisplayBackButton = (): HeaderDisplayBackButtonAction => ({
  type: Types.HEADER_DISPLAY_BACK_BUTTON,
});

export type HeaderActions =
  | HeaderTitleChangedAction
  | HeaderHideBackButtonAction
  | HeaderDisplayBackButtonAction;
