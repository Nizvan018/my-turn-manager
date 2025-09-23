import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";

export const setWindowComunication = (clientWindow: BrowserWindow) => {
    ipcMain.on("utils:sendPaths", (_event, paths: string[]) => {
        clientWindow.webContents.send("utils:updatePaths", paths);
    });
}
