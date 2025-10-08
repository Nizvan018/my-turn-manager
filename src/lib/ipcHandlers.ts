import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";
import { saveMediaPaths, loadMediaPaths } from "./storage";

/**
 * Allow to select multiple media files using dialog from electron
 */
ipcMain.handle("utils:selectMediaFiles", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [
            {
                name: "Media",
                extensions: ["jpg", "png", "mp4", "mov", "webm"]
            }
        ]
    });

    const validPaths = filePaths.filter((path) => existsSync(path));

    return canceled ? [] : validPaths;
});

/**
 * Allow to save the media paths with electron-storage
 */
ipcMain.handle("utils:saveMediaPaths", (_event, paths: string[]) => {
    return saveMediaPaths(paths);
});

/**
 * Allow to load the saved media paths with electron-storage
 */
ipcMain.handle("utils:loadMediaPaths", () => {
    return loadMediaPaths();
});
