import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from "electron";

/**
 * Create a custom menu for the control window
 * 
 * @returns Custom Electron.Menu
 */
export const createControlMenu = () => {
    const isMac = process.platform === "darwin";

    const template: MenuItemConstructorOptions[] = [
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' as const, label: 'Acerca de' },
                    { type: 'separator' as const },
                    { role: 'hide' as const, label: 'Ocultar' },
                    { role: 'hideOthers' as const, label: 'Ocultar otros' },
                    { role: 'unhide' as const, label: 'Mostrar todo' },
                    { type: 'separator' as const },
                    { role: 'quit' as const, label: 'Salir' }
                ]
            } as MenuItemConstructorOptions]
            : []),
        {
            label: 'Archivo',
            submenu: [
                isMac
                    ? { role: 'close' as const, label: 'Cerrar ventana' }
                    : { role: 'quit' as const, label: 'Salir' }
            ]
        },
        {
            label: 'Vista',
            submenu: [
                ...(!app.isPackaged ? [
                    { role: 'toggleDevTools' } as const,
                    { type: 'separator' } as const
                ] : []),
                { role: 'resetZoom', label: "Reiniciar zoom" },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: "Pantalla completa" }
            ]
        },
        {
            label: 'Ventana',
            submenu: [
                { role: 'minimize' as const, label: 'Minimizar' },
                { role: 'zoom' as const, label: 'Ampliar' },
                ...(isMac ? [
                    { type: 'separator' as const },
                    { role: 'front' as const, label: 'Traer todo al frente' }
                ] : [
                    { role: 'close' as const, label: 'Cerrar' }
                ])
            ]
        },
        {
            label: "Acerca de",
            submenu: [
                {
                    label: "Información de la aplicación",
                    click: () => {
                        const mainWindow = BrowserWindow.getFocusedWindow();

                        if (mainWindow) {
                            mainWindow.webContents.send("utils:onOpenAppInfoModal");
                        }
                    }
                },
                {
                    label: "Repositorio de GitHub",
                    click: async () => {
                        await shell.openExternal("https://github.com/Nizvan018/my-turn-manager")
                    }
                },
                {
                    label: "Licencias de terceros",
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
    const isMac = process.platform === "darwin";

    const template: MenuItemConstructorOptions[] = [
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' as const, label: 'Acerca de' },
                    { type: 'separator' as const },
                    { role: 'hide' as const, label: 'Ocultar' },
                    { role: 'hideOthers' as const, label: 'Ocultar otros' },
                    { role: 'unhide' as const, label: 'Mostrar todo' },
                    { type: 'separator' as const },
                    { role: 'quit' as const, label: 'Salir' }
                ]
            } as MenuItemConstructorOptions]
            : []),
        {
            label: 'Archivo',
            submenu: [
                isMac
                    ? { role: 'close' as const, label: 'Cerrar ventana' }
                    : { role: 'quit' as const, label: 'Salir' }
            ]
        },
        {
            label: 'Vista',
            submenu: [
                ...(!app.isPackaged ? [
                    { role: 'toggleDevTools' } as const,
                    { type: 'separator' } as const
                ] : []),
                { role: 'resetZoom', label: "Reiniciar zoom" },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: "Pantalla completa" }
            ]
        },
        {
            label: 'Ventana',
            submenu: [
                { role: 'minimize' as const, label: 'Minimizar' },
                { role: 'zoom' as const, label: 'Ampliar' },
                ...(isMac ? [
                    { type: 'separator' as const },
                    { role: 'front' as const, label: 'Traer todo al frente' }
                ] : [
                    { role: 'close' as const, label: 'Cerrar' }
                ])
            ]
        },
    ]

    return Menu.buildFromTemplate(template);
}
