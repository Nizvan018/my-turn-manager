import { app, BrowserWindow, protocol, session } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import "./lib/ipcHandlers";
import fs from "fs";
import mime from "mime";
import { Readable } from 'stream';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });

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

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
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
  createWindow();

  // protocol.registerStreamProtocol("media", (request, callback) => {
  //   const url = request.url.replace("media://", "");
  //   const decodedPath = decodeURIComponent(url);

  //   try {
  //     const stream = fs.createReadStream(decodedPath);

  //     const mimeType = mime.getType(decodedPath) || "application/octet-stream";

  //     callback({
  //       statusCode: 200,
  //       headers: { "Content-Type": mimeType },
  //       data: stream,
  //     });
  //   } catch (err) {
  //     console.error("Error al abrir archivo:", err);
  //     callback({ statusCode: 500 });
  //   }
  // });

  // protocol.registerStreamProtocol("media", (request, callback) => {
  //   const filePath = decodeURIComponent(request.url.replace("media://", ""));
  //   const stat = fs.statSync(filePath);
  //   const totalSize = stat.size;
  //   const mimeType = mime.getType(filePath) || "application/octet-stream";
  //   const range = request.headers.Range || request.headers.range;

  //   if (range) {
  //     const match = range.match(/bytes=(\d*)-(\d*)/);
  //     const start = parseInt(match?.[1] || "0", 10);
  //     const end = match?.[2] ? parseInt(match[2], 10) : totalSize - 1;
  //     const chunkSize = end - start + 1;
  //     const stream = fs.createReadStream(filePath, { start, end });

  //     callback({
  //       statusCode: 206,
  //       headers: {
  //         "Content-Type": mimeType,
  //         "Content-Length": chunkSize.toString(),
  //         "Content-Range": `bytes ${start}-${end}/${totalSize}`,
  //         "Accept-Ranges": "bytes"
  //       },
  //       data: stream
  //     });
  //   } else {
  //     const stream = fs.createReadStream(filePath);
  //     callback({
  //       statusCode: 200,
  //       headers: {
  //         "Content-Type": mimeType,
  //         "Content-Length": totalSize.toString(),
  //         "Accept-Ranges": "bytes"
  //       },
  //       data: stream
  //     });
  //   }
  // });

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
    createWindow();
  }
});

// app.whenReady().then(() => {
//   protocol.handle("media", async (request) => {
//     const filePath = decodeURIComponent(request.url.replace("media://", ""));
//     const fileUrl = pathToFileURL(filePath).toString();

//     return net.fetch(fileUrl);
//   });
// });
