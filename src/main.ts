import { app, BrowserWindow, dialog, Menu, protocol, session } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import "./lib/ipcHandlers";
import fs from "fs";
import mime from "mime";
import { Readable } from 'stream';
import { setWindowCommunication } from './lib/windowCommunication';
import { createControlMenu, createClientMenu } from "./customMenu";

interface CreateAppWindowProps {
  route: string,
  title: string,
  position: { x: number, y: number }
}

const CONTROL_DATA = {
  route: "control",
  title: "My Turn Manager - Panel del control",
  position: { x: 16, y: 16 }
}
const CLIENT_DATA = {
  route: "client",
  title: "My Turn Manager - Cliente",
  position: { x: 64, y: 64 }
}

// Window global references
let controlWindow: BrowserWindow | null = null;
let clientWindow: BrowserWindow | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createAppWindow = ({
  route,
  title,
  position
}: CreateAppWindowProps) => {
  // Create the browser window.
  const appWindow = new BrowserWindow({
    title,
    show: false,
    minWidth: 1080,
    minHeight: 720,
    width: 1080,
    height: 720,
    x: position.x,
    y: position.y,
    closable: route === "control",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  // Only for Windows and Linux (not macOS)
  if (process.platform !== "darwin") {
    if (route === "control") {
      const controlMenu = createControlMenu();
      appWindow.setMenu(controlMenu);
    } else {
      const clientMenu = createClientMenu();
      appWindow.setMenu(clientMenu);
    }
  }

  appWindow.once("ready-to-show", () => {
    appWindow.show();
  });

  // Handle window close
  appWindow.on("close", (event) => {
    if (route === "client") {
      event.preventDefault();
    } else {
      const choice = dialog.showMessageBoxSync(appWindow, {
        type: "question",
        buttons: ["Cancelar", "Cerrar"],
        title: "Confirmar cierre",
        message: "¿Estás seguro de que deseas cerrar la aplicación?",
        defaultId: 1,
        cancelId: 0
      });

      if (choice === 1) {
        if (clientWindow && !clientWindow.isDestroyed()) {
          clientWindow.destroy();
        }
      } else {
        event.preventDefault();
      }
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    appWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/#/${route}`);
  } else {
    appWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      { hash: `/${route}` }
    );
  }

  // console.log(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/#/${route}`);

  return appWindow;
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: {
      secure: true,
      stream: true,
      supportFetchAPI: true,
      bypassCSP: true
    }
  }
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // CSP for production
  if (!MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' media: file: data:; media-src 'self' blob: media: file: data:"
          ]
        }
      });
    });
  }

  controlWindow = createAppWindow(CONTROL_DATA);
  clientWindow = createAppWindow(CLIENT_DATA);

  // macOS menu handling
  if (process.platform === "darwin") {
    Menu.setApplicationMenu(createControlMenu());

    // Change the menu based on the focused window:

    controlWindow.on("focus", () => {
      Menu.setApplicationMenu(createControlMenu());
    });

    clientWindow.on("focus", () => {
      Menu.setApplicationMenu(createClientMenu());
    });
  }

  setWindowCommunication(controlWindow, clientWindow);

  protocol.handle("media", async (request) => {
    const filePath = decodeURIComponent(request.url.replace("media://", ""));
    const stat = fs.statSync(filePath);
    const totalSize = stat.size;
    const mimeType = mime.getType(filePath) || "application/octet-stream";

    const headers = Object.fromEntries(request.headers.entries());
    const rangeHeader = headers.Range || headers.range;

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
      const start = parseInt(match?.[1] || "0", 10);
      const end = match?.[2] ? parseInt(match[2], 10) : totalSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });
      const webStream = Readable.toWeb(stream);

      return new Response(webStream as BodyInit, {
        status: 206,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": chunkSize.toString(),
          "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          "Accept-Ranges": "bytes"
        }
      });
    }

    const stream = fs.createReadStream(filePath);
    const webStream = Readable.toWeb(stream);

    return new Response(webStream as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": totalSize.toString(),
        "Accept-Ranges": "bytes"
      }
    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    controlWindow = createAppWindow(CONTROL_DATA);
    clientWindow = createAppWindow(CLIENT_DATA);
  }
});
