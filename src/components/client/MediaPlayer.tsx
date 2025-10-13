import { useEffect, useState } from "react";
import { getMediaType, toMediaUrl } from "../../lib/mediaHelpers";

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
        <section className="overflow-hidden w-full h-auto aspect-[16/9] rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
            {mediaPaths.length > 0 && (
                <div className="w-full h-full">
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
        </section >
    )
}
