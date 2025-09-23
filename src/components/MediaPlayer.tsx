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
 * Format the name of the path for the video and img html elements
 * 
 * @param {string} path - The file path
 * @returns The formatted file path with media://
 */
const toMediaUrl = (path: string): string => {
    const normalized = path.replace(/\\/g, "/");
    return `media://${encodeURIComponent(normalized)}`;
};

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
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    // Handle the selection of the files
    // const handleSelectFiles = async () => {
    //     const paths = await window.utils.selectMediaFiles();

    //     if (paths.length > 0) {
    //         setMediaPaths(paths);
    //         setCurrentIndex(0);
    //     }
    // }

    // const testMediaResponse = async () => {
    //     const url = toMediaUrl(currentPath);

    //     try {
    //         const response = await fetch(url, {
    //             headers: {
    //                 Range: "bytes=0-1023"
    //             }
    //         });
    //         console.log("Status:", response.status);
    //         console.log("Headers:");
    //         for (const [key, value] of response.headers.entries()) {
    //             console.log(`${key}: ${value}`);
    //         }

    //         const blob = await response.blob();
    //         console.log("Blob size:", blob.size);
    //     } catch (err) {
    //         console.error("Error al hacer fetch:", err);
    //     }
    // };

    // Fetch the file as a blob if the file is a video
    const fetchVideoBlob = async (path: string) => {
        const url = toMediaUrl(path);
        const response = await fetch(url, {
            headers: {
                Range: "bytes=0-" // puedes ajustar el rango
            }
        });

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    useEffect(() => {
        if (mediaType === "video") {
            fetchVideoBlob(currentPath).then(setVideoSrc);
        }
    }, [currentPath]);


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

    useEffect(() => {
        window.utils.updatePaths((paths) => {
            setMediaPaths(paths);
            setCurrentIndex(0);
        });

        return () => {
            window.utils.removeAllListeners("utils:updatePaths");
        }
    }, []);

    return (
        <div className="flex flex-col items-start gap-4 p-4">
            {/* <button
                onClick={handleSelectFiles}
                className="text-white p-2 bg-blue-500"
            >
                Seleccionar archivos
            </button> */}

            {/* <div className="flex flex-col gap-1">
                {mediaPaths.map(item => (
                    <span key={item}>{getMediaType(item)}: {toMediaUrl(item)}</span>
                ))}
            </div> */}

            {mediaPaths.length > 0 && (
                <div className="w-2/3 h-auto aspect-[16/9] border">
                    {mediaType === "video" ? (
                        videoSrc && (
                            <video
                                key={currentPath}
                                src={videoSrc}
                                autoPlay
                                loop={mediaPaths.length === 1}
                                onEnded={() => {
                                    if (mediaPaths.length > 1) {
                                        setCurrentIndex((prev) => (prev + 1) % mediaPaths.length)
                                    }
                                }}
                                className="w-full aspect-[16/9] object-cover"
                            />
                        )
                    ) : (
                        <img
                            src={toMediaUrl(currentPath)}
                            alt="media"
                            className="w-full aspect-[16/9] object-cover"
                        />
                    )}
                </div>
            )}

            {/* <span>{currentPath}</span>
            <span>{currentIndex}</span>

            <button onClick={testMediaResponse}>
                Test media response
            </button> */}
        </div >
    )
}
