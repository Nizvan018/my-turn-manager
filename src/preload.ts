// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import type { IpcBridge } from "./lib/ipcHandlers";

const bridge: IpcBridge = {
    selectMediaFiles: () => ipcRenderer.invoke("utils:selectMediaFiles")
}

contextBridge.exposeInMainWorld("utils", bridge);
