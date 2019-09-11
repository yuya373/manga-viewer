import { Directory, createDirectory } from '../types';
import { Types } from '../actions/types';
import { FetchEntriesAction, DirectoryActions } from '../actions/directory';

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
  action: FetchEntriesAction
): DirectoriesState {
  const { path } = action.meta;
  const isLoading = { ...state.isLoading };

  if (action.error) {
    delete isLoading[path];

    return {
      ...state,
      isLoading,
    };
  }

  const byPath = { ...state.byPath };

  if (action.payload.isLoading) {
    isLoading[path] = true;
  } else {
    delete isLoading[path];
    const directory: Directory = byPath[path] || createDirectory(path);
    directory.entries = action.payload.entries;
    byPath[path] = directory;
  }

  return {
    ...state,
    isLoading,
    byPath,
  };
}

export default function(
  state: DirectoriesState = initialState,
  action: DirectoryActions
): DirectoriesState {
  switch (action.type) {
    case Types.FETCH_ENTRIES:
      return setDirectory(state, action);
    default:
      return state;
  }
}
