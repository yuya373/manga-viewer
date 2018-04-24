import Store from 'electron-store';

const store = new Store();

// if (process.env.NODE_ENV === 'development') {
// store.clear();
// }

store.onDidChange("homedir", (newValue, oldValue) => {
  console.log("homedir changed", newValue, oldValue);
})

export default store;
