/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
import fs from 'fs';
import os from 'os';
import D from './models/directory.js';
import F from './models/file.js';
import { RELOAD_DIRECTORY } from './actions/homedir.js';
import { LOAD_DIRECTORY } from './actions/directory.js';
import {
  STATE_CHANGED,
  STATE_LOADED,
  PARSE_DIR_ERROR,
  parseDirError,
} from './actions/ipc_renderer.js';
import Store from 'electron-store';

const store = new Store();
if (process.env.NODE_ENV === 'development') {
  store.clear();
}

const allowedExts = [
  ".zip",
];

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  // mainWindow.webContents.on('did-finish-load', () => {
  //   if (!mainWindow) {
  //     throw new Error('"mainWindow" is not defined');
  //   }
  //   mainWindow.show();
  //   // mainWindow.focus();
  // });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  const homedir = parseDir(os.homedir());
  store.set("state", { homedir, directories: [] });

  mainWindow.webContents.send(STATE_LOADED, store.get("state"));

  store.onDidChange("state", (newValue, oldValue) => {
    mainWindow.webContents.send(STATE_CHANGED, newValue);
    // console.log(STATE_CHANGED, newValue);
  })
});

function parseDir(path, parent = null) {
  let dir = D.create(path, parent);
  try {
    const files = fs.readdirSync(path);
    files.forEach((f) => {
      const _path = `${path === "/" ? "" : dir.path}/${f}`;
      const stat = fs.lstatSync(_path);

      if (!f.startsWith(".")) {
        console.log(require('path').extname(f));
        if (stat.isDirectory()) {
          dir = D.upsertChildDirectory(dir, D.create(_path));
        } else if (allowedExts.includes(require('path').extname(f))) {
          dir = D.upsertFile(dir, F.create(_path));
        }
      }
    })

    return dir;
  } catch(e) {
    const action = parseDirError({error: e, message: e.message});

    console.log("ERROR", e.message, e);
    mainWindow.webContents.send(action.type, action);
  }
}

ipcMain.on(RELOAD_DIRECTORY, (event, path, parent) => {
  console.log("EVENT", event);
  const state = store.get("state", {});
  const dir = parseDir(path, parent);

  if (dir) {
    if (os.homedir() === dir.path) {
      store.set("state", { homedir: dir });
    } else {
      store.set(
        "state",
        {
          ...state,
          directories: state.directories.
            filter((e) => !D.isEqual(e, dir)).concat([dir]),
        }
      );
    }
  }
});

ipcMain.on(LOAD_DIRECTORY, (event, path) => {
  console.log("PATH", path);
  const state = store.get("state", {});
  const dir = parseDir(path);

  console.log("DIR", dir);

  if (dir) {
    store.set(
      "state",
      {
        ...state,
        directories: state.directories.
          filter((e) => !D.isEqual(e, dir)).concat([dir]),
      }
    );
  }
});
