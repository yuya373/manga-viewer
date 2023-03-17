import { join } from 'path';
import { PayloadAction } from '@reduxjs/toolkit';
import { Actions } from '../actions';
import { Types } from '../actions/types';
import {
  DisplayNextPageAction,
  DisplayPrevPageAction,
  ViewerPerPageChangedAction,
} from '../actions/viewer';
import { File } from '../types';
import { FileDialogOpenAction } from '../actions/fileDialog';
import { fetchImagesDone, deleteFileDone } from '../features/files/filesSlice';

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
    | PayloadAction<{ imagesToDisplay: Array<string> }>
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
    case Types.DISPLAY_NEXT_PAGE:
    case Types.DISPLAY_PREV_PAGE:
      return setIndex(setImagesToDisplay(state, action), action);
    case Types.FILE_DIALOG_OPEN:
      return {
        ...initialState,
        ...setFiles(state, action),
        perPage: state.perPage,
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
    default:
      if (fetchImagesDone.match(action)) {
        return setImagesToDisplay(state, action);
      }

      if (deleteFileDone.match(action)) {
        return {
          ...state,
          files: state.files.filter(
            e => join(e.path, e.name) !== action.payload.path
          ),
        };
      }

      return state;
  }
}
