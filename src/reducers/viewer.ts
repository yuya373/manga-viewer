import { join } from 'path';
import { Actions } from '../actions';
import { Types } from '../actions/types';
import {
  DisplayNextPageAction,
  DisplayPrevPageAction,
  ViewerPerPageChangedAction,
} from '../actions/viewer';
import { FetchImagesDoneAction } from '../actions/file';
import { File } from '../types';
import { FileDialogOpenAction } from '../actions/fileDialog';

export type ViewerState = {
  index: number;
  imagesToDisplay: Array<string>;
  perPage: 1 | 2;
  files: Array<File>;
};

const initialState: ViewerState = {
  index: 0,
  imagesToDisplay: [],
  perPage: 2,
  files: [],
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

function setFiles(
  state: ViewerState,
  action: FileDialogOpenAction
): ViewerState {
  const { files } = action.payload;

  return {
    ...state,
    files,
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
    case Types.FILE_DIALOG_OPEN:
      return {
        ...initialState,
        perPage: state.perPage,
        ...setFiles(state, action),
      };
    case Types.FILE_DIALOG_CLOSE:
      return {
        ...initialState,
        perPage: state.perPage,
      };
    case Types.VIEWER_PER_PAGE_CHANGED:
      return {
        ...state,
        ...setImagesToDisplay(state, action),
        perPage: action.payload.perPage,
      };
    case Types.FILE_DIALOG_FILE_CHANGED:
      return {
        ...state,
        index: 0,
      };
    case Types.DELETE_FILE_DONE:
      return {
        ...state,
        files: state.files.filter(
          e => join(e.path, e.name) !== action.payload.path
        ),
      };
    default:
      return state;
  }
}
