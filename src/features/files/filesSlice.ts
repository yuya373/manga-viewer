import { join } from 'path';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageEntry } from '../../types';
import { buildNameFromPath, unlink } from '../../utils';
import { AppAction, AppDispatch } from '../../actions';
import { getImagesToDisplay } from '../../utils/viewer';
import ReadAllImagesWorker, {
  OutgoingMessage,
} from '../../workers/readAllImages.worker';
import { displayNextFile, displayPrevFile } from '../../actions/viewer';
import { closeFileDialog } from '../../actions/fileDialog';
import { isFavorite, removeFromFavorite } from '../../actions/favorite';

type FileState = {
  name: string;
  images: Array<ImageEntry>;
  isLoaded: boolean;
};

type FilesState = {
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

type FetchImagesStartedPayload = {
  path: string;
};

type FetchImagesDonePayload = {
  path: string;
  images: Array<ImageEntry>;
  imagesToDisplay: Array<string>;
};

type FetchImagesFailedPayload = {
  path: string;
  error: Error;
};

type DeleteFileStartedPayload = {
  path: string;
};

type DeleteFileDonePayload = {
  path: string;
};

type DeleteFileFailedPayload = {
  path: string;
  error: Error;
};

const { actions, reducer } = createSlice({
  name: 'files',
  initialState,
  reducers: {
    fetchImagesStarted: (
      state,
      action: PayloadAction<FetchImagesStartedPayload>
    ) => {
      const { path } = action.payload;
      const file = state.byPath[path];
      if (file == null) {
        state.byPath[path] = {
          ...initialFileState,
          name: buildNameFromPath(path),
        };
      }

      state.isLoading[path] = true;

      return state;
    },
    fetchImagesFailed: (
      state,
      action: PayloadAction<FetchImagesFailedPayload>
    ) => {
      const { path } = action.payload;
      state.isLoading[path] = false;

      return state;
    },
    fetchImagesDone: (
      state: FilesState,
      action: PayloadAction<FetchImagesDonePayload>
    ) => {
      const { path, images } = action.payload;
      const file = state.byPath[path];
      if (file) {
        file.images = images;
      }
      state.isLoading[path] = false;

      return state;
    },
    deleteFileStarted: (
      state: FilesState,
      action: PayloadAction<DeleteFileStartedPayload>
    ) => {
      state.isDeleting[action.payload.path] = true;

      return state;
    },
    deleteFileDone: (
      state: FilesState,
      action: PayloadAction<DeleteFileDonePayload>
    ) => {
      const { path } = action.payload;

      state.isDeleting[path] = false;
      delete state.byPath[path];

      return state;
    },
    deleteFileFailed: (
      state: FilesState,
      action: PayloadAction<DeleteFileFailedPayload>
    ) => {
      state.isDeleting[action.payload.path] = false;

      return state;
    },
  },
});

export const { deleteFileDone, fetchImagesDone } = actions;
export default reducer;

function fetchImagesSuccess({
  path,
  images,
}: {
  path: string;
  images: Array<ImageEntry>;
}): AppAction<void> {
  return (dispatch, getState) => {
    const state = getState();
    const { perPage, index } = state.viewer;
    const { fileDialog } = state;

    let { imagesToDisplay } = state.viewer;
    if (join(fileDialog.path, fileDialog.name) === path) {
      imagesToDisplay = getImagesToDisplay({ index, perPage, images }).map(
        e => e.url
      );
    }
    requestAnimationFrame(() => {
      dispatch(
        actions.fetchImagesDone({
          images,
          imagesToDisplay,
          path,
        })
      );
    });
  };
}

let readAllImagesWorker: any = null;

function getReadAllImagesWorker(dispatch: AppDispatch): any {
  if (readAllImagesWorker == null) {
    readAllImagesWorker = new ReadAllImagesWorker();
    readAllImagesWorker.onmessage = (ev: { data: OutgoingMessage }) => {
      const { data } = ev;
      if (data.success) {
        const { payload } = data;
        dispatch(fetchImagesSuccess(payload));
      } else {
        const { payload } = data;
        dispatch(actions.fetchImagesFailed(payload));
      }
    };
  }

  return readAllImagesWorker;
}

export function fetchImages(path: string): AppAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (getState().files.isLoading[path]) return;

    dispatch(actions.fetchImagesStarted({ path }));

    const file = getState().files.byPath[path];
    if (file == null) return;

    if (file.isLoaded) {
      const { images } = file;
      dispatch(fetchImagesSuccess({ path, images }));
    } else {
      const worker = getReadAllImagesWorker(dispatch);
      worker.postMessage({ path });
    }
  };
}

export function deleteFile(path: string): AppAction<Promise<void>> {
  return async (dispatch, getState) => {
    if (getState().fileDialog.isOpen) {
      if (
        !(await dispatch(displayNextFile())) &&
        !(await dispatch(displayPrevFile()))
      ) {
        dispatch(closeFileDialog());
      }
    }

    if (getState().files.isDeleting[path]) return;

    dispatch(actions.deleteFileStarted({ path }));

    try {
      await unlink(path);
      if (dispatch(isFavorite(path))) {
        dispatch(removeFromFavorite(path));
      }
      dispatch(actions.deleteFileDone({ path }));
    } catch (error) {
      dispatch(actions.deleteFileFailed({ path, error }));
    }
  };
}
