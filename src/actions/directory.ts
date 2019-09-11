/* eslint-disable import/prefer-default-export */
import { Action } from 'redux';
import { File, Directory, createFile, createDirectory } from '../types';
import { ThunkAction } from '.';
import { readDir } from '../utils';
import { Types } from './types';

type FetchEntriesActionBase = Action & {
  type: Types.FETCH_ENTRIES;
  meta: { path: string };
};

export type FetchEntriesAction =
  | FetchEntriesActionBase & {
      payload:
        | { isLoading: true }
        | { isLoading: false; entries: Array<File | Directory> };
      error: false;
    }
  | FetchEntriesActionBase & { payload: Error; error: true };

export function fetchEntries(
  path: string
): ThunkAction<Promise<Array<File | Directory>>> {
  return async dispatch => {
    const meta = { path };

    dispatch({
      type: Types.FETCH_ENTRIES,
      meta,
      error: false,
      payload: {
        isLoading: true,
      },
    });

    try {
      const entries = (await readDir(path)).map(e =>
        e.isDirectory() ? createDirectory(e) : createFile(e)
      );
      dispatch({
        type: Types.FETCH_ENTRIES,
        meta,
        error: false,
        payload: {
          isLoading: false,
          entries,
        },
      });

      return entries;
    } catch (err) {
      dispatch({
        type: Types.FETCH_ENTRIES,
        meta,
        error: true,
        payload: err,
      });
      throw err;
    }
  };
}

export type DirectoryActions = FetchEntriesAction;
