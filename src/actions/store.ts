import Store from 'electron-store';
import { ThunkAction } from '.';
import { RootState } from '../app';

const store = new Store({
  name: 'RootState',
  defaults: {},
});

export function save(): ThunkAction<void> {
  return (_dispatch, getState) => {
    const state = getState();

    store.set({
      favorites: state.favorites,
    });
  };
}

export function load(): Pick<RootState, 'favorites'> {
  return { favorites: store.get('favorites', undefined) };
}
