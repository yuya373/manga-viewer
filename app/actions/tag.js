import { createAction } from 'redux-actions';
import { persist } from './persist.js';

export const ADD_TAG = "ADD_TAG";
export const DELETE_TAG = "DELETE_TAG";

export function deleteTag({filePath, tag}) {
  const action = createAction(
    DELETE_TAG,
    (filePath, tag) => ({
      filePath,
      tag,
    })
  )

  return (dispatch) => {
    dispatch(action(filePath, tag));
    dispatch(persist());
  }
}

export function addTag({filePath, tag}) {
  const action = createAction(
    ADD_TAG,
    (filePath, tag) => ({
      filePath,
      tag,
    })
  );

  return (dispatch) => {
    dispatch(action(filePath, tag));
    dispatch(persist());
  }
}
