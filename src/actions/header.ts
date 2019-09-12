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

export type HeaderActions = HeaderTitleChangedAction;
