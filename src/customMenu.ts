import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";

/**
 * Create a custom menu for the control window
 * 
 * @returns Custom Electron.Menu
 */
export const createControlMenu = () => {
    const template: MenuItemConstructorOptions[] = [
        ...(process.platform === "darwin"
            ? [{ role: "appMenu" } as MenuItemConstructorOptions]
            : []),
        { role: "fileMenu" },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                ...(!app.isPackaged ? [{ role: 'toggleDevTools' as const }] : []),
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        { role: "windowMenu" },
        {
            label: "Help",
            submenu: [
                {
                    label: "Third-Party Licenses",
                    click: () => {
                        const mainWindow = BrowserWindow.getFocusedWindow();

                        if (mainWindow) {
                            mainWindow.webContents.send("utils:onOpenLicensesModal");
                        }
                    }
                }
            ]
        }
    ]

    return Menu.buildFromTemplate(template);
}

/**
 * Create a custom menu for the client window
 * 
 * @returns Client Electron.Menu
 */
export const createClientMenu = () => {
    const template: MenuItemConstructorOptions[] = [
        ...(process.platform === "darwin"
            ? [{ role: "appMenu" } as MenuItemConstructorOptions]
            : []),
        { role: "fileMenu" },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                ...(!app.isPackaged ? [{ role: 'toggleDevTools' as const }] : []),
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        { role: "windowMenu" }
    ]

    return Menu.buildFromTemplate(template);
}
