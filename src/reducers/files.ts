import { ImageEntry } from '../types';
import { Actions } from '../actions';
import { Types } from '../actions/types';
import { FetchImagesDoneAction, DeleteFileDoneAction } from '../actions/file';
import { buildNameFromPath } from '../utils';

type FileState = {
  name: string;
  images: Array<ImageEntry>;
  isLoaded: boolean;
};

export type FilesState = {
  byPath: { [path: string]: FileState };
  isDeleting: { [path: string]: boolean };
};

const initialFileState: FileState = {
  name: '',
  images: [],
  isLoaded: false,
};

const initialState: FilesState = {
  byPath: {},
  isDeleting: {},
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

function updateFile(
  state: FilesState,
  path: string,
  updater: (file: FileState) => FileState
): FilesState {
  const file = state.byPath[path];
  if (file == null) return state;

  return {
    ...state,
    byPath: {
      ...state.byPath,
      [path]: updater(file),
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

export default function(
  state: FilesState = initialState,
  action: Actions
): FilesState {
  switch (action.type) {
    case Types.FETCH_IMAGES_STARTED:
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [action.payload.path]: {
            ...initialFileState,
            name: buildNameFromPath(action.payload.path),
            isLoaded: false,
          },
        },
      };
    case Types.FETCH_IMAGES_DONE:
      return setImages(state, action);
    case Types.FETCH_IMAGES_FAILED:
      return updateFile(state, action.payload.path, s => ({
        ...s,
        isLoaded: true,
      }));
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
