import { app, BrowserWindow } from "electron";
import { join } from "path";

const isProduction = process.env.NODE_ENV === 'production';

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (isProduction) {
    win.loadFile(join(__dirname, '..', 'build', 'index.html'))
  } else {
    win.loadURL("http://localhost:3000");
  }
}

app.on("ready", createWindow);
