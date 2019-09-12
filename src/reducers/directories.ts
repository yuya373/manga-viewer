import { Actions } from '../actions';
import { Directory, createDirectory } from '../types';
import { Types } from '../actions/types';
import { FetchEntriesDoneAction } from '../actions/directory';

export type DirectoriesState = {
  byPath: { [path: string]: Directory };
  isLoading: { [path: string]: boolean };
};

const initialState: DirectoriesState = {
  byPath: {},
  isLoading: {},
};

function setDirectory(
  state: DirectoriesState,
  action: FetchEntriesDoneAction
): DirectoriesState {
  const { path } = action.meta;
  const isLoading = { ...state.isLoading };
  delete isLoading[path];

  const byPath = { ...state.byPath };
  const directory: Directory = byPath[path] || createDirectory(path);
  directory.entries = action.payload.entries;
  byPath[path] = directory;

  return {
    ...state,
    isLoading,
    byPath,
  };
}

function setIsLoading(
  state: DirectoriesState,
  path: string,
  value: boolean
): DirectoriesState {
  const isLoading = { ...state.isLoading };
  if (value) {
    isLoading[path] = true;
  } else {
    delete isLoading[path];
  }

  return {
    ...state,
    isLoading,
  };
}

export default function(
  state: DirectoriesState = initialState,
  action: Actions
): DirectoriesState {
  switch (action.type) {
    case Types.FETCH_ENTRIES_STARTED:
      return setIsLoading(state, action.meta.path, true);
    case Types.FETCH_ENTRIES_DONE:
      return setDirectory(state, action);
    case Types.FETCH_ENTRIES_FAILED:
      return setIsLoading(state, action.meta.path, false);
    default:
      return state;
  }
}
