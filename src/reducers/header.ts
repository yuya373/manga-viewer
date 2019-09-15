import { Actions } from '../actions';
import { Types } from '../actions/types';

export type HeaderState = {
  title: string;
  isBackButtonHidden: boolean;
};

const initialState: HeaderState = {
  title: '',
  isBackButtonHidden: false,
};

export default function(
  state: HeaderState = initialState,
  action: Actions
): HeaderState {
  switch (action.type) {
    case Types.HEADER_TITLE_CHANGED:
      return {
        ...state,
        title: action.payload.title,
      };
    case Types.HEADER_HIDE_BACK_BUTTON:
      return {
        ...state,
        isBackButtonHidden: true,
      };
    case Types.HEADER_DISPLAY_BACK_BUTTON:
      return {
        ...state,
        isBackButtonHidden: false,
      };
    default:
      return state;
  }
}
