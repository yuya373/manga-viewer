import { Actions } from '../actions';
import { Types } from '../actions/types';
import {
  DisplayNextPageAction,
  DisplayPrevPageAction,
  ViewerPerPageChangedAction,
} from '../actions/viewer';
import { FetchImagesDoneAction } from '../actions/file';

export type ViewerState = {
  index: number;
  imagesToDisplay: Array<string>;
  perPage: 1 | 2;
};

const initialState: ViewerState = {
  index: 0,
  imagesToDisplay: [],
  perPage: 2,
};

function setImagesToDisplay(
  state: ViewerState,
  action:
    | FetchImagesDoneAction
    | DisplayNextPageAction
    | DisplayPrevPageAction
    | ViewerPerPageChangedAction
): ViewerState {
  const { imagesToDisplay } = action.payload;

  return {
    ...state,
    imagesToDisplay,
  };
}

function setIndex(
  state: ViewerState,
  action: DisplayNextPageAction | DisplayPrevPageAction
): ViewerState {
  const { index } = action.payload;

  return {
    ...state,
    index,
  };
}

export default function(
  state: ViewerState = initialState,
  action: Actions
): ViewerState {
  switch (action.type) {
    case Types.FETCH_IMAGES_DONE:
      return setImagesToDisplay(state, action);
    case Types.DISPLAY_NEXT_PAGE:
    case Types.DISPLAY_PREV_PAGE:
      return setIndex(setImagesToDisplay(state, action), action);
    case Types.FILE_DIALOG_CLOSE:
      return initialState;
    case Types.VIEWER_PER_PAGE_CHANGED:
      return {
        ...state,
        ...setImagesToDisplay(state, action),
        perPage: action.payload.perPage,
      };
    default:
      return state;
  }
}
