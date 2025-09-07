import { useEffect, useState } from "react";

/**
 * Get the type of the file (image or video)
 * 
 * @param {string} path - The path of the file
 * @returns The type of the file (image or video)
 */
const getMediaType = (path: string): "video" | "image" => {
    return /\.(mp4|mov|webm)$/i.test(path) ? "video" : "image";
}

/**
 * This component is the media player for the selected files (videos and images)
 * 
 * @returns JSX.Element
 */
export default function MediaPlayer() {
    const [mediaPaths, setMediaPaths] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentPath = mediaPaths[currentIndex];
    const mediaType = currentPath ? getMediaType(currentPath) : null;

    // Handle the selection of the files
    const handleSelectFiles = async () => {
        const paths = await window.utils.selectMediaFiles();

        if (paths.length > 0) {
            setMediaPaths(paths);
            setCurrentIndex(0);
        }
    }

    // Format the name of the path for the video and img html elements
    const toMediaUrl = (path: string): string => {
        const normalized = path.replace(/\\/g, "/");
        return `media://${encodeURIComponent(normalized)}`;
    };

    useEffect(() => {
        if (mediaPaths.length === 0) return;

        const path = mediaPaths[currentIndex];
        let timer: NodeJS.Timeout;

        // If the file is an image, set a time out of ten seconds
        if (getMediaType(path) === "image") {
            timer = setTimeout(() => setCurrentIndex(prev => {
                return (prev + 1) % mediaPaths.length
            }), 10000);
        }

        return () => clearTimeout(timer);
    }, [currentIndex, mediaPaths]);

    return (
        <div className="flex flex-col items-start gap-4 p-4">
            <button
                onClick={handleSelectFiles}
                className="text-white p-2 bg-blue-500"
            >
                Seleccionar archivos
            </button>

            <div className="flex flex-col gap-1">
                {mediaPaths.map(item => (
                    <span key={item}>{getMediaType(item)}: {toMediaUrl(item)}</span>
                ))}
            </div>

            {mediaPaths.length > 0 && (
                <div className="w-96 h-64 border">
                    {mediaType === "video" ? (
                        <video
                            src={toMediaUrl(currentPath)}
                            autoPlay
                            controls
                            onEnded={() => setCurrentIndex((prev) => (prev + 1) % mediaPaths.length)}
                        >
                            <source src={toMediaUrl(currentPath)} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={toMediaUrl(currentPath)}
                            alt="media"
                            className="w-full"
                        />
                    )}
                </div>
            )}

            <video controls>
                <source src="media://C%3A%2FUsers%2Fnizva%2FDesktop%2Ftest%20files%2Ftest.mp4" type="video/mp4" />
            </video>
        </div >
    )
}
