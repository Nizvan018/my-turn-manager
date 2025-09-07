import type { IpcBridge } from "../lib/ipcHandlers";

declare global {
    interface Window {
        utils: IpcBridge
    }
}
