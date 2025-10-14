import { useState, useEffect } from "react";
import { FileVideoCamera, SkipBack, Play, Pause, SkipForward, Volume2, VolumeOff } from "lucide-react";
import { getCountOfMediaTypes, getMediaType, getFileName } from "../../lib/mediaHelpers";
import { MediaState } from "../../types/mediaState.type";

/**
 * The media controller component for the control window
 * 
 * @returns JSX.Element
 */
export default function MediaController() {
    const [mediaState, setMediaState] = useState<MediaState>({
        paths: [],
        currentIndex: 0,
        isPlaying: false,
        volume: 100
    });
    const { paths, currentIndex, isPlaying, volume } = mediaState;
    const [volumeBeforeMute, setVolumeBeforeMute] = useState<number>(50);
    const { imageCount, videoCount } = getCountOfMediaTypes(paths);
    const currentPath = paths[currentIndex] || null;
    const currentMediaType = currentPath ? getMediaType(currentPath) : null;

    // Handle the media file selection
    const handleSelectFiles = async () => {
        const newPaths = await window.utils.selectMediaFiles();

        if (newPaths.length > 0) {
            const newState = {
                paths: newPaths,
                currentIndex: 0,
                isPlaying: true,
                volume
            }

            window.utils.sendMediaState(newState);
            setMediaState(newState);
            await window.utils.saveMediaPaths(newPaths);
        }
    }

    // Load the saved media paths
    const getSavedMediaPaths = async () => {
        const savedPaths = await window.utils.loadMediaPaths();

        if (savedPaths.length > 0) {
            const newState = {
                paths: savedPaths,
                currentIndex: 0,
                isPlaying: false,
                volume
            }

            window.utils.sendMediaState(newState);
            setMediaState(newState);
        }
    }

    // Handle go to previous path
    const goPrevious = () => {
        if (paths.length === 0) return;

        setMediaState(prev => {
            const newIndex = prev.currentIndex === 0 ?
                prev.paths.length - 1 :
                prev.currentIndex - 1;

            const newState = {
                ...prev,
                currentIndex: newIndex,
                isPlaying: true
            }

            window.utils.sendMediaState(newState);

            return newState;
        });
    }

    // Handle play and pause
    const playPause = () => {
        if (paths.length === 0) return;

        setMediaState(prev => {
            const newState = {
                ...prev,
                isPlaying: !prev.isPlaying
            }

            window.utils.sendMediaState(newState);

            return newState;
        });
    }

    // Handle go to next path
    const goNext = () => {
        if (paths.length === 0) return;

        setMediaState(prev => {
            const newIndex = (currentIndex + 1) % paths.length;

            const newState = {
                ...prev,
                currentIndex: newIndex,
                isPlaying: true
            }

            window.utils.sendMediaState(newState);

            return newState;
        });
    }

    // Handle volume change for videos
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);

        setMediaState(prev => {
            const newState = {
                ...prev,
                volume: newVolume
            }

            window.utils.sendMediaState(newState);

            return newState;
        });
    }

    // Handle mute and unmute for videos
    const muteUnmute = () => {
        setMediaState(prev => {
            let newVolume = 0;

            if (prev.volume === 0) {
                newVolume = volumeBeforeMute;
            } else {
                setVolumeBeforeMute(prev.volume);
            }

            const newState = {
                ...prev,
                volume: newVolume
            }

            window.utils.sendMediaState(newState);

            return newState;
        });
    }

    // USE EFFECTS:

    // Listen for media ended notification from the player
    useEffect(() => {
        window.utils.onMediaEnded(() => {
            setMediaState(prev => {
                if (prev.paths.length > 1) {
                    const newIndex = (prev.currentIndex + 1) % prev.paths.length;

                    const newState = {
                        ...prev,
                        currentIndex: newIndex,
                        isPlaying: true
                    }

                    window.utils.sendMediaState(newState);

                    return newState;
                }
            });
        });

        return () => {
            window.utils.removeAllListeners("utils:onMediaEnded");
        }
    }, []);

    // Load saved paths
    useEffect(() => {
        getSavedMediaPaths();
    }, []);

    return (
        <section className="overflow-y-auto flex flex-col items-center gap-4 w-full h-auto aspect-[16/9] p-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
            <h2 className="text-curious-blue-950/60 font-light">Configuración del reproductor</h2>

            {/* CONTROL CARD */}
            <div className="flex flex-col gap-8 w-[420px] h-full min-h-fit p-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5">
                {/* HEADER */}
                <header className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleSelectFiles}
                        className="btn-primary w-full"
                    >
                        <span className="text-lg font-medium">Seleccionar videos/imágenes</span>
                        <FileVideoCamera className="size-6" />
                    </button>

                    <h3>Archivos seleccionados</h3>

                    <div className="flex justify-center items-center gap-6 w-full">
                        <div className="flex flex-col items-center gap-1 w-20">
                            <span className="text-curious-blue-950/60 text-sm">Total</span>
                            <span className="font-medium">{paths.length}</span>
                        </div>
                        <div className="w-px h-full bg-curious-blue-950/30"></div>
                        <div className="flex flex-col items-center gap-1 w-20">
                            <span className="text-curious-blue-950/60 text-sm">Videos</span>
                            <span className="font-medium">{videoCount}</span>
                        </div>
                        <div className="w-px h-full bg-curious-blue-950/30"></div>
                        <div className="flex flex-col items-center gap-1 w-20">
                            <span className="text-curious-blue-950/60 text-sm">Imágenes</span>
                            <span className="font-medium">{imageCount}</span>
                        </div>
                    </div>
                </header>

                {/* DIVIDER */}
                <div className="flex items-center gap-4">
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                    <span className="text-nowrap text-curious-blue-950/60 font-light">Controles</span>
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1 p-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                        <span className="text-curious-blue-950/60 text-sm">
                            {
                                currentMediaType ?
                                    currentMediaType === "video" ? "Video en reproducción" : "Imagen en reproducción" :
                                    "Video/imagen en reproducción"
                            }
                        </span>
                        <span className={`${!currentPath && "text-rose-500"} line-clamp-2`}>
                            {currentPath ? getFileName(currentPath) : "Sin archivo en reproducción"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-4 p-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                        <div className="flex justify-center items-center gap-6 w-full">
                            <button
                                onClick={goPrevious}
                                disabled={paths.length === 0}
                                className="disabled:opacity-50 not-disabled:cursor-pointer group flex flex-col items-center gap-1 w-20"
                            >
                                <SkipBack className="size-6 text-curious-blue-950 transition group-hover:scale-110" />
                                <span className="text-curious-blue-950/60 text-xs transition group-hover:text-curious-blue-950">Anterior</span>
                            </button>
                            <button
                                onClick={playPause}
                                disabled={paths.length === 0}
                                className="disabled:opacity-50 not-disabled:cursor-pointer group flex flex-col items-center gap-1 w-20"
                            >
                                {isPlaying ? (
                                    <Pause className="size-6 text-curious-blue-500 transition group-hover:scale-110" />
                                ) : (
                                    <Play className="size-6 text-curious-blue-950 transition group-hover:scale-110" />
                                )}
                                <span className="text-curious-blue-950/60 text-xs transition group-hover:text-curious-blue-950">Reproducir</span>
                            </button>
                            <button
                                onClick={goNext}
                                disabled={paths.length === 0}
                                className="disabled:opacity-50 not-disabled:cursor-pointer group flex flex-col items-center gap-1 w-20"
                            >
                                <SkipForward className="size-6 text-curious-blue-950 transition group-hover:scale-110" />
                                <span className="text-curious-blue-950/60 text-xs transition group-hover:text-curious-blue-950">Siguiente</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-curious-blue-950/60 text-sm">Vol.</span>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="custom-slider"
                            />
                            <button
                                onClick={muteUnmute}
                                className="w-6 cursor-pointer text-curious-blue-950/60 transition hover:text-curious-blue-950"
                            >
                                {mediaState.volume > 0 ? (
                                    <Volume2 className="size-6" />
                                ) : (
                                    <VolumeOff className="size-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
