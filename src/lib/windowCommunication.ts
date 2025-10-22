import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";
import type { MediaState } from "../types/mediaState.type";
import type { TurnState } from "../types/turnState.type";
import type { Turn } from "../types/turn.type";

/**
 * This function create a communication channel between the windows
 * 
 * @param {BrowserWindow} controlWindow
 * @param {BrowserWindow} clientWindow 
 */
export const setWindowCommunication = (controlWindow: BrowserWindow, clientWindow: BrowserWindow) => {
    // MEDIA COMMUNICATION:

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

    // TURN COMMUNICATION:

    ipcMain.on("utils:sendTurnState", (_event, state: TurnState) => {
        if (clientWindow && !clientWindow.isDestroyed()) {
            clientWindow.webContents.send("utils:onTurnStateUpdate", state);
        }
    });

    ipcMain.on("utils:sendTurnAtCheckout", (_event, state: Turn | null) => {
        if (clientWindow && !clientWindow.isDestroyed()) {
            clientWindow.webContents.send("utils:onTurnAtCheckoutUpdate", state);
        }
    });

    ipcMain.on("utils:sendWaitingTurns", (_event, state: Turn[]) => {
        if (clientWindow && !clientWindow.isDestroyed()) {
            clientWindow.webContents.send("utils:onWaitingTurnsUpdate", state);
        }
    });
}
