import { Actions } from '../actions';
import { Types } from '../actions/types';
import { FetchThumbnailDoneAction } from '../actions/file';

type URL = string;

export type ThumbnailsState = {
  byPath: { [path: string]: URL };
  isLoading: { [path: string]: boolean };
};

const initialState: ThumbnailsState = {
  byPath: {},
  isLoading: {},
};

function setIsLoading(
  state: ThumbnailsState,
  path: string,
  value: boolean
): ThumbnailsState {
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

function setThumbnail(
  state: ThumbnailsState,
  action: FetchThumbnailDoneAction
): ThumbnailsState {
  const { path, thumbnail } = action.payload;

  const byPath = { ...state.byPath };
  byPath[path] = thumbnail;

  const isLoading = { ...state.isLoading };
  isLoading[path] = false;

  return {
    ...state,
    byPath,
    isLoading,
  };
}

export default function(
  state: ThumbnailsState = initialState,
  action: Actions
): ThumbnailsState {
  switch (action.type) {
    case Types.FETCH_THUMBNAIL_STARTED:
      return setIsLoading(state, action.payload.path, true);
    case Types.FETCH_THUMBNAIL_DONE:
      return setThumbnail(state, action);
    case Types.FETCH_THUMBNAIL_FAILED:
      return setIsLoading(state, action.payload.path, false);

    default:
      return state;
  }
}
