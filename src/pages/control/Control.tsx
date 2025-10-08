import { useEffect, useState } from "react";

/**
 * Control page of the control window
 * For the checkout screen
 * 
 * @returns JSX.Element
 */
export default function Control() {
    const [paths, setPaths] = useState<string[]>([]);

    // Handle the media file selection
    const handleSelectFiles = async () => {
        const paths = await window.utils.selectMediaFiles();

        if (paths.length > 0) {
            window.utils.sendPaths(paths);
        }

        setPaths(paths);
        await window.utils.saveMediaPaths(paths);
    }

    // Load the saved media paths
    const getSavedMediaPaths = async () => {
        const paths = await window.utils.loadMediaPaths();
        setPaths(paths);

        window.utils.sendPaths(paths);
    }

    useEffect(() => {
        getSavedMediaPaths();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1>Esta es la página de control</h1>

            <div className="flex flex-col gap-1">
                {paths.map(path => (
                    <span>{path}</span>
                ))}
            </div>

            <button
                onClick={handleSelectFiles}
                className="text-white p-2 bg-blue-500"
            >
                Seleccionar archivos
            </button>
        </div>
    )
}
