export interface IpcBridge {
    selectMediaFiles: () => Promise<string[]>;
    sendPaths: (paths: string[]) => void;
    updatePaths: (callback: (paths: string[]) => void) => void;
    removeAllListeners: (channel: string) => void;
    saveMediaPaths: (paths: string[]) => Promise<void>;
    loadMediaPaths: () => Promise<string[]>;
}
