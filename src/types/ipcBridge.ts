import type { TurnConfigurationType } from "../schemas/turnConfiguration.schema";
import type { MediaState } from "./mediaState.type";
import type { SaveTurnsProps, TurnStoreSchema } from "../lib/storage/turnStorage";
import type { TurnState } from "./turnState.type";
import type { Turn } from "./turn.type";
import type { InfoStoreSchema } from "../lib/storage/infoStorage";

/**
 * This interface define the IPC bridge
 */
export interface IpcBridge {
    // Media select
    selectMediaFiles: () => Promise<string[]>;
    selectLogo: () => Promise<string | null>;
    // Media store
    saveMediaPaths: (paths: string[]) => Promise<void>;
    loadMediaPaths: () => Promise<string[]>;
    saveVolume: (volume: number) => Promise<void>;
    loadVolume: () => Promise<number>;
    // Turn store
    saveTurnConfiguration: (configuration: TurnConfigurationType) => Promise<void>;
    loadTurnConfiguration: () => Promise<TurnConfigurationType>;
    saveTurns: (saveTurnsProps: SaveTurnsProps) => Promise<void>;
    loadTurns: () => Promise<Omit<TurnStoreSchema, "configuration">>;
    // Info store
    saveLogoPath: (logoPath: InfoStoreSchema["logoPath"]) => Promise<void>;
    loadLogoPath: () => Promise<InfoStoreSchema["logoPath"]>;
    // Window file communication
    sendMediaState: (state: MediaState) => void;
    onMediaStateUpdate: (callback: (state: MediaState) => void) => void;
    notifyMediaEnded: () => void;
    onMediaEnded: (callback: () => void) => void;
    // Window turn communication
    sendTurnState: (state: TurnState) => void;
    onTurnStateUpdate: (callback: (state: TurnState) => void) => void;
    sendTurnAtCheckout: (state: Turn | null) => void;
    onTurnAtCheckoutUpdate: (callback: (state: Turn | null) => void) => void;
    sendWaitingTurns: (state: Turn[]) => void;
    onWaitingTurnsUpdate: (callback: (state: Turn[]) => void) => void;

    removeAllListeners: (channel: string) => void;
}
