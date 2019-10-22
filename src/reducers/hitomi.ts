import { Actions } from '../actions';
import { Types } from '../actions/types';

export type HitomiState = {
  url: string;
};

const initialState: HitomiState = {
  url: '',
};

export default function(
  state: HitomiState = initialState,
  action: Actions
): HitomiState {
  switch (action.type) {
    case Types.HITOMI_URL_CHANGED:
      return {
        ...state,
        url: action.payload.url,
      };
    default:
      return state;
  }
}
