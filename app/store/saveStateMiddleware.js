import Store from 'electron-store'

const persistentStore = new Store();
const middleware = (store) => (next) => (action) => {
  next(action);
  const state = store.getState();
  persistentStore.set("state", {
    ...state,
    directory: {
      ...state.directory,
      loading: false,
    },
    file: {
      ...state.file,
      loading: false,
    },
  });
}

export default middleware;
