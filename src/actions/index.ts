import { ThunkAction as OrgThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { DirectoryActions } from './directory';
import { HeaderActions } from './header';
import { FileActions } from './file';
import { FileDialogActions } from './fileDialog';
import { ViewerActions } from './viewer';

export type Actions =
  | ViewerActions
  | DirectoryActions
  | HeaderActions
  | FileActions
  | FileDialogActions;
export type ThunkAction<R> = OrgThunkAction<R, RootState, undefined, Actions>;
