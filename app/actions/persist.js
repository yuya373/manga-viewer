import { remote } from 'electron';
import Worker from './../workers/save_state.worker.js';

export const cwd = remote.app.getPath("userData");
console.log(cwd);
const worker = new Worker();

window.persistTimer = null;

function dispatchWorker(dispatch, getState) {
  console.log("persist:dispatchWorker");
  const t1 = performance.now();
  const state = getState();
  worker.postMessage({ state, cwd });
  worker.onmessage = () => {
    const t2 = performance.now();
    console.log("persist:dispatchWorker: ", t2 - t1);
  }
}

function setPersistTimer(dispatch, getState) {
  if (window.persistTimer) {
    window.clearTimeout(window.persistTimer);
    window.persistTimer = null;
  }

  window.persistTimer = window.setTimeout(
    () => dispatchWorker(dispatchWorker, getState),
    1000
  );
}

export function persist() {
  return (dispatch, getState) => {
    setPersistTimer(dispatch, getState);
  }
}
