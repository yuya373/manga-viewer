import {
  ThunkAction as OrgThunkAction,
  ThunkDispatch as OrgThunkDispatch,
} from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../app';
import { DirectoryActions } from './directory';
import { HeaderActions } from './header';
import { FileActions } from './file';
import { FileDialogActions } from './fileDialog';
import { ViewerActions } from './viewer';
import { FavoriteActions } from './favorite';
import { HitomiActions } from './hitomi';

export type Actions =
  | HitomiActions
  | FavoriteActions
  | ViewerActions
  | DirectoryActions
  | HeaderActions
  | FileActions
  | FileDialogActions;

export type ThunkAction<R> = OrgThunkAction<
  R,
  RootState,
  undefined,
  Action<string>
>;
export type AppAction<R> = ThunkAction<R>;
export type ThunkDispatch = OrgThunkDispatch<
  RootState,
  undefined,
  Action<string>
>;
export type AppDispatch = ThunkDispatch;
