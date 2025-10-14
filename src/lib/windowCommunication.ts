import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";
import { MediaState } from "../types/mediaState.type";

/**
 * This function create a communication channel between the windows
 * 
 * @param {BrowserWindow} controlWindow
 * @param {BrowserWindow} clientWindow 
 */
export const setWindowCommunication = (controlWindow: BrowserWindow, clientWindow: BrowserWindow) => {
    ipcMain.on("utils:sendMediaState", (_event, state: MediaState) => {
        if (clientWindow && !clientWindow.isDestroyed()) {
            clientWindow.webContents.send("utils:onMediaStateUpdate", state);
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.on("utils:notifyMediaEnded", (_event) => {
        if (controlWindow && !controlWindow.isDestroyed()) {
            controlWindow.webContents.send("utils:onMediaEnded");
        }
    });
}
