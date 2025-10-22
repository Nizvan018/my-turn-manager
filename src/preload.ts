// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import type { IpcBridge } from "./types/ipcBridge";

const bridge: IpcBridge = {
    // Media file operations
    selectMediaFiles: () => ipcRenderer.invoke("utils:selectMediaFiles"),
    saveMediaPaths: (paths) => ipcRenderer.invoke("utils:saveMediaPaths", paths),
    loadMediaPaths: () => ipcRenderer.invoke("utils:loadMediaPaths"),
    saveVolume: (volume) => ipcRenderer.invoke("utils:saveVolume", volume),
    loadVolume: () => ipcRenderer.invoke("utils:loadVolume"),
    // Turn operations
    saveTurnConfiguration: (configuration) => ipcRenderer.invoke("utils:saveTurnConfiguration", configuration),
    loadTurnConfiguration: () => ipcRenderer.invoke("utils:loadTurnConfiguration"),
    saveTurns: (saveTurnsProps) => ipcRenderer.invoke("utils:saveTurns", saveTurnsProps),
    loadTurns: () => ipcRenderer.invoke("utils:loadTurns"),
    // Window file communication
    sendMediaState: (state) => ipcRenderer.send("utils:sendMediaState", state),
    onMediaStateUpdate: (callback) => ipcRenderer.on("utils:onMediaStateUpdate", (_event, state) => callback(state)),
    notifyMediaEnded: () => ipcRenderer.send("utils:notifyMediaEnded"),
    onMediaEnded: (callback) => ipcRenderer.on("utils:onMediaEnded", callback),
    // Window turn communication
    sendTurnState: (state) => ipcRenderer.send("utils:sendTurnState", state),
    onTurnStateUpdate: (callback) => ipcRenderer.on("utils:onTurnStateUpdate", (_event, state) => callback(state)),
    sendTurnAtCheckout: (state) => ipcRenderer.send("utils:sendTurnAtCheckout", state),
    onTurnAtCheckoutUpdate: (callback) => ipcRenderer.on("utils:onTurnAtCheckoutUpdate", (_event, state) => callback(state)),
    sendWaitingTurns: (state) => ipcRenderer.send("utils:sendWaitingTurns", state),
    onWaitingTurnsUpdate: (callback) => ipcRenderer.on("utils:onWaitingTurnsUpdate", (_event, state) => callback(state)),

    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
}

contextBridge.exposeInMainWorld("utils", bridge);
