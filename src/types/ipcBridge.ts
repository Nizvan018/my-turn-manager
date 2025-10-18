import type { TurnConfigurationType } from "../schemas/turnConfiguration.schema";
import type { MediaState } from "./mediaState.type";

/**
 * This interface define the IPC bridge
 */
export interface IpcBridge {
    // Media file operations
    selectMediaFiles: () => Promise<string[]>;
    saveMediaPaths: (paths: string[]) => Promise<void>;
    loadMediaPaths: () => Promise<string[]>;
    saveVolume: (volume: number) => Promise<void>;
    loadVolume: () => Promise<number>;
    // Turn opreations
    saveTurnConfiguration: (configuration: TurnConfigurationType) => Promise<void>;
    loadTurnConfiguration: () => Promise<TurnConfigurationType>;
    // Window file communication
    sendMediaState: (state: MediaState) => void;
    onMediaStateUpdate: (callback: (state: MediaState) => void) => void;
    notifyMediaEnded: () => void;
    onMediaEnded: (callback: () => void) => void;
    removeAllListeners: (channel: string) => void;
}
