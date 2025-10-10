import { useEffect, useState } from "react";
import TurnsSection from "../../components/control/TurnSection";

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
        <div className="flex gap-6 p-6 w-full h-screen">
            <TurnsSection />
        </div>
    )
}
