import { ImageEntry } from '../types';
import { Actions } from '../actions';
import { Types } from '../actions/types';
import { FetchImagesDoneAction } from '../actions/file';
import { buildNameFromPath } from '../utils';

type FileState = {
  name: string;
  images: Array<ImageEntry>;
  isLoaded: boolean;
};

export type FilesState = {
  byPath: { [path: string]: FileState };
};

const initialFileState: FileState = {
  name: '',
  images: [],
  isLoaded: false,
};

const initialState: FilesState = {
  byPath: {},
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
    default:
      return state;
  }
}
