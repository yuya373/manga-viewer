import Store from 'electron-store';
import { ThunkAction } from '.';
import { RootState } from '../app';
import { FavoritesState } from '../reducers/favorites';

const store = new Store({
  projectName: 'mv',
  name: 'RootState',
  defaults: {},
} as any);

export function save(): ThunkAction<void> {
  return (_dispatch, getState) => {
    const state = getState();

    store.set({
      favorites: state.favorites,
    });
  };
}

export function load(): Pick<RootState, 'favorites'> {
  return { favorites: store.get('favorites', undefined) as FavoritesState };
}
