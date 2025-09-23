import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";

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
