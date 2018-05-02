import { remote } from 'electron';
import Worker from './../workers/save_state.worker.js';

export const cwd = remote.app.getPath("userData");
console.log(cwd);
const worker = new Worker();

export function persist() {
  return (dispatch, getState) => {
    const t1 = performance.now();
    const state = getState();
    worker.postMessage({ state, cwd });
    worker.onmessage = () => {
      const t2 = performance.now();
      console.log("persist: ", t2 - t1);
    }
  }
}
