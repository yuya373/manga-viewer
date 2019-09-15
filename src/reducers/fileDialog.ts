import { Actions } from '../actions';
import { Types } from '../actions/types';

export type FileDialogState = {
  isOpen: boolean;
  isAppBarHidden: boolean;
  name: string;
  path: string;
};

const initialState: FileDialogState = {
  isOpen: false,
  isAppBarHidden: false,
  name: '',
  path: '',
};

export default function(
  state: FileDialogState = initialState,
  action: Actions
): FileDialogState {
  switch (action.type) {
    case Types.FILE_DIALOG_OPEN:
      return {
        ...state,
        isOpen: true,
        name: action.payload.name,
        path: action.payload.path,
      };
    case Types.FILE_DIALOG_CLOSE:
      return initialState;
    case Types.FILE_DIALOG_DISPLAY_APP_BAR:
      return {
        ...state,
        isAppBarHidden: false,
      };
    case Types.FILE_DIALOG_HIDE_APP_BAR:
      return {
        ...state,
        isAppBarHidden: true,
      };
    default:
      return state;
  }
}
