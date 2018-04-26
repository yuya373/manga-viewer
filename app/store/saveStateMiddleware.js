import Store from 'electron-store'

const persistentStore = new Store();
const middleware = (store) => (next) => (action) => {
  next(action);
  const state = store.getState();
  persistentStore.set("state", state);
}

export default middleware;
