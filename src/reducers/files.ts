import { ImageEntry } from '../types';
import { Actions } from '../actions';
import { Types } from '../actions/types';
import {
  FetchImagesDoneAction,
  DeleteFileDoneAction,
  FetchImagesStartedAction,
} from '../actions/file';
import { buildNameFromPath } from '../utils';

type FileState = {
  name: string;
  images: Array<ImageEntry>;
  isLoaded: boolean;
};

export type FilesState = {
  byPath: { [path: string]: FileState };
  isDeleting: { [path: string]: boolean };
  isLoading: { [path: string]: boolean };
};

const initialFileState: FileState = {
  name: '',
  images: [],
  isLoaded: false,
};

const initialState: FilesState = {
  byPath: {},
  isDeleting: {},
  isLoading: {},
};

function setImages(
  state: FilesState,
  action: FetchImagesDoneAction
): FilesState {
  const { images, path } = action.payload;
  const file = state.byPath[path];
  if (file == null) return state;

  return {
    ...state,
    byPath: {
      ...state.byPath,
      [path]: {
        ...file,
        images,
        isLoaded: true,
      },
    },
  };
}

function updateIsDeleting(
  state: FilesState,
  path: string,
  value: boolean
): FilesState {
  const isDeleting = { ...state.isDeleting };

  if (value) {
    isDeleting[path] = true;
  } else {
    delete isDeleting[path];
  }

  return {
    ...state,
    isDeleting,
  };
}

function deleteFile(
  state: FilesState,
  action: DeleteFileDoneAction
): FilesState {
  const byPath = { ...state.byPath };

  delete byPath[action.payload.path];

  return {
    ...state,
    byPath,
  };
}

function updateIsLoading(
  state: FilesState,
  path: string,
  value: boolean
): FilesState {
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

function initFile(
  state: FilesState,
  action: FetchImagesStartedAction
): FilesState {
  const { path } = action.payload;

  if (state.byPath[path] != null) return state;
  const byPath = { ...state.byPath };

  byPath[path] = {
    ...initialFileState,
    name: buildNameFromPath(path),
  };

  return {
    ...state,
    byPath,
  };
}

export default function(
  state: FilesState = initialState,
  action: Actions
): FilesState {
  switch (action.type) {
    case Types.FETCH_IMAGES_STARTED:
      return updateIsLoading(
        initFile(state, action),
        action.payload.path,
        true
      );
    case Types.FETCH_IMAGES_DONE:
      return updateIsLoading(
        setImages(state, action),
        action.payload.path,
        false
      );
    case Types.FETCH_IMAGES_FAILED:
      return updateIsLoading(state, action.payload.path, false);
    case Types.DELETE_FILE_STARTED:
      return updateIsDeleting(state, action.payload.path, true);
    case Types.DELETE_FILE_DONE:
      return updateIsDeleting(
        deleteFile(state, action),
        action.payload.path,
        false
      );
    case Types.DELETE_FILE_FAILED:
      return updateIsDeleting(state, action.payload.path, false);
    default:
      return state;
  }
}
