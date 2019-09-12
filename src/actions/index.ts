import { ThunkAction as OrgThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { DirectoryActions } from './directory';
import { HeaderActions } from './header';

export type Actions = DirectoryActions | HeaderActions;
export type ThunkAction<R> = OrgThunkAction<R, RootState, undefined, Actions>;
