// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import type { IpcBridge } from "./types/ipcBridge";

const bridge: IpcBridge = {
    // Paths
    selectMediaFiles: () => ipcRenderer.invoke("utils:selectMediaFiles"),
    // Path listeners
    sendPaths: (paths: string[]) => ipcRenderer.send("utils:sendPaths", paths),
    updatePaths: (callback) => ipcRenderer.on("utils:updatePaths", (_event, paths) => callback(paths)),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    // Electron store
    saveMediaPaths: (paths) => ipcRenderer.invoke("utils:saveMediaPaths", paths),
    loadMediaPaths: () => ipcRenderer.invoke("utils:loadMediaPaths")
}

contextBridge.exposeInMainWorld("utils", bridge);
