import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import unhandled from 'electron-unhandled';

unhandled();

const isProduction = app.isPackaged || process.env.NODE_ENV === 'production';

let win: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  if (isProduction) {
    win.loadFile(join(__dirname, 'index.html'));
  } else {
    win.loadURL('http://localhost:3000');
  }
}

function setup() {
  if (!isProduction) {
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]).catch(
      console.error
    );
  }
  createWindow();
}

app.on('ready', setup);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
