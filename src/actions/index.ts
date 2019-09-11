import { ThunkAction as OrgThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { DirectoryActions } from './directory';

export type Actions = DirectoryActions;
export type ThunkAction<R> = OrgThunkAction<R, RootState, undefined, Actions>;
