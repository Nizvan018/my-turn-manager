import type { TurnConfigurationType } from "../schemas/turnConfiguration.schema";
import type { MediaState } from "./mediaState.type";
import type { SaveTurnsProps, TurnStoreSchema } from "../lib/storage/turnStorage";

/**
 * This interface define the IPC bridge
 */
export interface IpcBridge {
    // Media file operations
    selectMediaFiles: () => Promise<string[]>;
    saveMediaPaths: (paths: string[]) => Promise<void>;
    loadMediaPaths: () => Promise<string[]>;
    saveVolume: (volume: number) => Promise<void>;
    loadVolume: () => Promise<Omit<TurnStoreSchema, "configuration">>;
    // Turn opreations
    saveTurnConfiguration: (configuration: TurnConfigurationType) => Promise<void>;
    loadTurnConfiguration: () => Promise<TurnConfigurationType>;
    saveTurns: (saveTurnsProps: SaveTurnsProps) => Promise<void>;
    loadTurns: () => Promise<Omit<TurnStoreSchema, "configuration">>;
    // Window file communication
    sendMediaState: (state: MediaState) => void;
    onMediaStateUpdate: (callback: (state: MediaState) => void) => void;
    notifyMediaEnded: () => void;
    onMediaEnded: (callback: () => void) => void;
    removeAllListeners: (channel: string) => void;
}
