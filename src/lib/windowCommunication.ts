import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";

/**
 * This function create a communication channel on the client window
 * 
 * @param {BrowserWindow} clientWindow 
 */
export const setWindowCommunication = (clientWindow: BrowserWindow) => {
    ipcMain.on("utils:sendPaths", (_event, paths: string[]) => {
        clientWindow.webContents.send("utils:updatePaths", paths);
    });
}
