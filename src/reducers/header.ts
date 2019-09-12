import { Actions } from '../actions';
import { Types } from '../actions/types';

export type HeaderState = {
  title: string;
};

const initialState: HeaderState = {
  title: '',
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
    default:
      return state;
  }
}
