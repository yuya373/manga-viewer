/* eslint-disable import/prefer-default-export */
import { Action } from 'redux';
import { Dirent } from 'fs';
import { File, Directory, createFile, createDirectory } from '../types';
import { ThunkAction } from '.';
import { readDir } from '../utils';
import { Types } from './types';

export interface FetchEntriesStartedAction extends Action {
  type: Types.FETCH_ENTRIES_STARTED;
  meta: { path: string };
}

export interface FetchEntriesDoneAction extends Action {
  type: Types.FETCH_ENTRIES_DONE;
  meta: { path: string };
  payload: { entries: Array<File | Directory> };
}

export interface FetchEntriesFailedAction extends Action {
  type: Types.FETCH_ENTRIES_FAILED;
  meta: { path: string };
  error: Error;
}

function filterEntry(entry: Dirent) {
  const { name } = entry;
  if (name.startsWith('.')) return false;
  if (name.endsWith('.zip')) return true;
  if (entry.isDirectory()) return true;
  return false;
}

export function fetchEntries(
  path: string
): ThunkAction<Promise<Array<File | Directory>>> {
  return async dispatch => {
    const meta = { path };

    dispatch({
      type: Types.FETCH_ENTRIES_STARTED,
      meta,
    });

    try {
      const entries = (await readDir(path))
        .filter(filterEntry)
        .map(e => (e.isDirectory() ? createDirectory(e) : createFile(e)));
      dispatch({
        type: Types.FETCH_ENTRIES_DONE,
        meta,
        payload: {
          entries,
        },
      });

      return entries;
    } catch (err) {
      dispatch({
        type: Types.FETCH_ENTRIES_FAILED,
        meta,
        error: err,
      });
      throw err;
    }
  };
}

export type DirectoryActions =
  | FetchEntriesStartedAction
  | FetchEntriesDoneAction
  | FetchEntriesFailedAction;
