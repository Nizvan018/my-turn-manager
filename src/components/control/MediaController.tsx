import { useState, useEffect, useRef } from "react";
import { FileVideoCamera, SkipBack, Play, Pause, SkipForward, Volume2, VolumeOff } from "lucide-react";
import { getCountOfMediaTypes, getMediaType, getFileName } from "../../lib/mediaHelpers";
import { MediaState } from "../../types/mediaState.type";
import MediaThumbnail from "./MediaThumbnail";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
    const saveVolumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { imageCount, videoCount } = getCountOfMediaTypes(paths);
    const currentPath = paths[currentIndex] || null;
    const currentMediaType = currentPath ? getMediaType(currentPath) : null;
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

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
    const getInitialState = async () => {
        const savedPaths = await window.utils.loadMediaPaths();
        const savedVolume = await window.utils.loadVolume();

        if (savedPaths.length > 0) {
            const newState = {
                paths: savedPaths,
                currentIndex: 0,
                isPlaying: false,
                volume: savedVolume
            }

            window.utils.sendMediaState(newState);
            setMediaState(newState);
        } else {
            setMediaState(prev => {
                const newState = {
                    ...prev,
                    volume: savedVolume
                }

                window.utils.sendMediaState(newState);

                return newState;
            });
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

    // Handle go to specific video
    const goToIndex = (index: number) => {
        if (paths.length === 0) return;

        setMediaState(prev => {
            const newState = {
                ...prev,
                currentIndex: index,
                isPlaying: true
            }

            window.utils.sendMediaState(newState);

            return newState;
        });
    }

    // Remove an specific video of the list
    const removeFile = async (index: number) => {
        let pathsToSave: string[] = [];

        setMediaState(prev => {
            const newPaths = prev.paths.filter((_, i) => i !== index);
            pathsToSave = newPaths;

            const newIndex = index === prev.currentIndex
                ? Math.min(index, newPaths.length - 1)
                : index < prev.currentIndex
                    ? prev.currentIndex - 1
                    : prev.currentIndex;

            const newState = {
                ...prev,
                paths: newPaths,
                currentIndex: newPaths.length > 0 ? newIndex : 0,
                isPlaying: newPaths.length > 0 ? prev.isPlaying : false
            }

            window.utils.sendMediaState(newState);

            return newState;
        });

        await window.utils.saveMediaPaths(pathsToSave);
    }

    // Handle drag and drop event to reorganize the paths
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            let pathsToSave: string[] = [];

            setMediaState(prev => {
                const oldIndex = prev.paths.indexOf(active.id as string);
                const newIndex = prev.paths.indexOf(over.id as string);
                const newPaths = arrayMove(prev.paths, oldIndex, newIndex)
                pathsToSave = newPaths;

                let newCurrentIndex = prev.currentIndex;

                if (oldIndex === prev.currentIndex) {
                    newCurrentIndex = newIndex;
                } else if (oldIndex < prev.currentIndex && newIndex >= prev.currentIndex) {
                    newCurrentIndex = prev.currentIndex - 1;
                } else if (oldIndex > prev.currentIndex && newIndex <= prev.currentIndex) {
                    newCurrentIndex = prev.currentIndex + 1;
                }

                const newState = {
                    ...prev,
                    paths: newPaths,
                    currentIndex: newCurrentIndex
                }

                window.utils.sendMediaState(newState);

                return newState;
            });

            await window.utils.saveMediaPaths(pathsToSave);
        }
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

        if (saveVolumeTimeoutRef.current) {
            clearTimeout(saveVolumeTimeoutRef.current);
        }

        saveVolumeTimeoutRef.current = setTimeout(() => {
            window.utils.saveVolume(newVolume);
            console.log("Volumen guardado")
        }, 1000);
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

    // Load the initial state (paths and volume)
    useEffect(() => {
        getInitialState();

        return () => {
            if (saveVolumeTimeoutRef.current) {
                clearTimeout(saveVolumeTimeoutRef.current);
            }
        }
    }, []);

    return (
        <section className="overflow-y-auto flex gap-4 w-full h-auto aspect-[16/9] px-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
            {/* CONTROL CARD */}
            <div className="flex flex-col gap-8 min-w-[420px] max-w-[420px] h-[calc(100%-48px)] min-h-fit my-6 p-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
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

            {/* VIDEO LIST */}
            <div className="overflow-y-auto custom-scroll scroll-fade flex flex-col gap-4 w-full h-full max-h-[calc(100%-8px)] my-1 py-5 pr-2">
                {paths.length === 0 && (
                    <div className="flex items-center justify-center w-full h-32 px-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                        <span className="text-curious-blue-950/60 text-center">No hay ningún video/imagen seleccionado/a</span>
                    </div>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={paths}
                        strategy={verticalListSortingStrategy}
                    >
                        {paths.map((path, index) => (
                            <MediaThumbnail
                                key={path}
                                path={path}
                                index={index}
                                isPlaying={index === currentIndex}
                                goToIndexCallback={goToIndex}
                                removeFileCallback={removeFile}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </section>
    )
}
