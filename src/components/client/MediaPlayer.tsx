import { useEffect, useRef, useState } from "react";
import { getMediaType, toMediaUrl } from "../../lib/mediaHelpers";
import { MediaState } from "../../types/mediaState.type";

/**
 * This component is the media player for the selected files (videos and images)
 * 
 * @returns JSX.Element
 */
export default function MediaPlayer() {
    const [mediaState, setMediaState] = useState<MediaState>({
        paths: [],
        currentIndex: 0,
        isPlaying: false,
        volume: 100
    });
    const { paths, currentIndex, isPlaying, volume } = mediaState;
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageTimerRef = useRef<NodeJS.Timeout | null>(null);
    const currentPath = paths[currentIndex];
    const mediaType = currentPath ? getMediaType(currentPath) : null;

    // Fetch the file as a blob if the file is a video
    const fetchVideoBlob = async (path: string) => {
        const url = toMediaUrl(path);
        const response = await fetch(url, {
            headers: {
                Range: "bytes=0-"
            }
        });

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    // Notify controller that the media has ended
    const handleMediaEnded = () => {
        window.utils.notifyMediaEnded();
    }

    // USE EFFECTS:

    // Update video source when currentPath changes
    useEffect(() => {
        if (currentPath && mediaType === "video") {
            fetchVideoBlob(currentPath).then(setVideoSrc);
        } else {
            setVideoSrc(null);
        }
    }, [currentPath, mediaType]);

    // Control video playback based on isPlaying state
    useEffect(() => {
        if (videoRef.current && mediaType === "video" && videoSrc) {
            videoRef.current.volume = volume / 100;

            if (isPlaying) {
                videoRef.current.play().catch(error => console.error("Error playing video", error));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, mediaType, videoSrc]);

    // Control video volume
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume / 100;
        }
    }, [volume]);

    // Handle image timer (10 seconds per image)
    useEffect(() => {
        // Clear any existing timer
        if (imageTimerRef.current) {
            clearTimeout(imageTimerRef.current);
            imageTimerRef.current = null;
        }

        // Set timer for images if playing
        if (currentPath && mediaType === "image" && isPlaying) {
            imageTimerRef.current = setTimeout(() => {
                handleMediaEnded();
            }, 10000);
        }

        return () => {
            if (imageTimerRef.current) {
                clearTimeout(imageTimerRef.current);
            }
        }
    }, [currentPath, mediaType, isPlaying]);

    // Listen for media state updates from controller
    useEffect(() => {
        window.utils.onMediaStateUpdate((newState) => {
            setMediaState(newState);
        });

        return () => {
            window.utils.removeAllListeners("utils:onMediaStateUpdate");
        }
    }, []);

    // Cleanup video blob URLs on unmount
    useEffect(() => {
        return () => {
            if (videoSrc) {
                URL.revokeObjectURL(videoSrc);
            }
        }
    }, [videoSrc]);

    return (
        <section className="overflow-hidden w-full h-auto aspect-[16/9] rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
            {paths.length > 0 && currentPath && (
                <div className="w-full h-full">
                    {mediaType === "video" ? (
                        videoSrc && (
                            <video
                                key={currentPath}
                                ref={videoRef}
                                src={videoSrc}
                                onEnded={handleMediaEnded}
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
