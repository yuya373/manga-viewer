import {
  app,
  BrowserWindow,
  session,
  ipcMain,
  IpcMainInvokeEvent,
} from 'electron';
import { join } from 'path';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import unhandled from 'electron-unhandled';
import { getPageDetail } from './getPageDetail';

unhandled();

const isProduction = app.isPackaged || process.env.NODE_ENV === 'production';

let win: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
    },
  });

  if (isProduction) {
    win.loadFile(join(__dirname, 'index.html'));
  } else {
    win.loadURL('http://localhost:3000');
  }
}

const getPageDetailHandler = async (
  ev: IpcMainInvokeEvent,
  args: string
): Promise<
  | {
      id: string;
      title: string;
      imageUrls: Array<{ url: string; name: string }>;
      url: string;
    }
  | { error: Error }
> => {
  const result = await getPageDetail(args);
  return result;
};

function setup() {
  if (!isProduction) {
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]).catch(
      console.error
    );
  }
  ipcMain.handle('getPageDetail', getPageDetailHandler);
  createWindow();

  if (session.defaultSession) {
    session.defaultSession.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        const headers = {
          ...details.requestHeaders,
        };

        headers.Referer = `${process.env.REACT_APP_ARCHIVE_URL_REFER}/`;
        headers.Origin = process.env.REACT_APP_ARCHIVE_URL_REFER || '';
        headers.UserAgent = process.env.REACT_APP_ARCHIVE_USER_AGENT || '';
        headers.AcceptEncoding = 'gzip, deflate, br, zstd';
        headers.CacheControl = 'no-cache';
        console.log('headers', headers);

        callback({ requestHeaders: headers });
      }
    );
  }
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
