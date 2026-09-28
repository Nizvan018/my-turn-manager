import type { IpcBridge } from "../types/ipcBridge";

declare global {
    interface Window {
        utils: IpcBridge
    }
}
