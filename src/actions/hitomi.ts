import { Action } from 'redux';
import { Types } from './types';

export interface HitomiUrlChangedAction extends Action {
  type: Types.HITOMI_URL_CHANGED;
  payload: {
    url: string;
  };
}

export const urlChanged = (url: string): HitomiUrlChangedAction => ({
  type: Types.HITOMI_URL_CHANGED,
  payload: {
    url,
  },
});

export type HitomiActions = HitomiUrlChangedAction;
