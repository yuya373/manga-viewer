import { ThunkAction as OrgThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { DirectoryActions } from './directory';
import { HeaderActions } from './header';
import { FileActions } from './file';

export type Actions = DirectoryActions | HeaderActions | FileActions;
export type ThunkAction<R> = OrgThunkAction<R, RootState, undefined, Actions>;
