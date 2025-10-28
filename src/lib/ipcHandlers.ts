import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";
import type { TurnConfigurationType } from "../schemas/turnConfiguration.schema";
import { saveMediaPaths, loadMediaPaths, saveVolume, loadVolume } from "./storage/mediaStorage";
import { saveTurnConfiguration, loadTurnConfiguration, saveTurns, loadTurns, type SaveTurnsProps } from "./storage/turnStorage";
import { loadLogoPath, saveLogoPath, saveInfo, loadInfo, type InfoStoreSchema } from "./storage/infoStorage";

// MEDIA SELECT

/**
 * Allow to select multiple media files using dialog from electron
 */
ipcMain.handle("utils:selectMediaFiles", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [
            {
                name: "Media",
                extensions: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"]
            }
        ]
    });

    const validPaths = filePaths.filter((path) => existsSync(path));

    return canceled ? [] : validPaths;
});

/**
 * Allow to select one image using dialog from electron
 */
ipcMain.handle("utils:selectLogo", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Images",
                extensions: ["jpg", "jpeg", "png", "webp"]
            }
        ]
    });

    if (canceled || filePaths.length === 0) return null;

    return existsSync(filePaths[0]) ? filePaths[0] : null;
});

// MEDIA STORE:

/**
 * Allow to save the media paths with electron-store
 */
ipcMain.handle("utils:saveMediaPaths", (_event, paths: string[]) => {
    return saveMediaPaths(paths);
});

/**
 * Allow to load the saved media paths with electron-store
 */
ipcMain.handle("utils:loadMediaPaths", () => {
    return loadMediaPaths();
});

/**
 * Allow to save the volume with electron-store
 */
ipcMain.handle("utils:saveVolume", (_event, volume: number) => {
    return saveVolume(volume);
});

/**
 * Allow to load the saved volume with electron-store
 */
ipcMain.handle("utils:loadVolume", () => {
    return loadVolume();
});

// TURN STORE:

/**
 * Allow to save the turn configuration with electron-store
 */
ipcMain.handle("utils:saveTurnConfiguration", (_event, configuration: TurnConfigurationType) => {
    return saveTurnConfiguration(configuration);
});

/**
 * Allow to load the saved turn configuration with electron-store
 */
ipcMain.handle("utils:loadTurnConfiguration", () => {
    return loadTurnConfiguration();
});

/**
 * Allow to save the turn at checkout if exists, the waiting turns and the turns history with electron-store
 */
ipcMain.handle("utils:saveTurns", (_event, saveTurnsProps: SaveTurnsProps) => {
    return saveTurns(saveTurnsProps);
});

/**
 * Allow to load the saved turn at checkout if exists, the waiting turns and the turns history with electron-store
 */
ipcMain.handle("utils:loadTurns", () => {
    return loadTurns();
});

// INFO STORE:

/**
 * Allow to save the logo path with electron-store
 */
ipcMain.handle("utils:saveLogoPath", (_event, logoPath: InfoStoreSchema["logoPath"]) => {
    return saveLogoPath(logoPath);
});

/**
 * Allow to load the saved logo path with electron-store
 */
ipcMain.handle("utils:loadLogoPath", () => {
    return loadLogoPath();
});

/**
 * Allow to save the local info with electron-store
 */
ipcMain.handle("utils:saveInfo", (_event, data: InfoStoreSchema["info"]) => {
    return saveInfo(data);
});

/**
 * Allow to load the saved local info with electron-store
 */
ipcMain.handle("utils:loadInfo", () => {
    return loadInfo();
});
