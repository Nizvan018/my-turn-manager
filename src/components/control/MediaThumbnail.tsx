import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Play, Trash, GripVertical } from "lucide-react";
import { getFileName, getMediaType, toMediaUrl } from "../../lib/mediaHelpers";

/** Component props */
interface Props {
    path: string;
    index: number;
    isPlaying: boolean;
    goToIndexCallback: (index: number) => void;
    removeFileCallback: (index: number) => void;
}

/**
 * Media thumbnail for control window
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function MediaThumbnail({ path, index, isPlaying, goToIndexCallback, removeFileCallback }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: path });
    const style = { transform: CSS.Transform.toString(transform), transition }
    const mediaType = getMediaType(path);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <div className={`${isPlaying ? "from-curious-blue-500/10" : "from-curious-blue-950/5"} flex py-3 p-1 pr-3 rounded-3xl border border-curious-blue-950/10 bg-radial-[at_0%_50%] from-60% to-curious-blue-950/5 transition-colors`}>
                {/* HANDLE FOR DRAGGING */}
                <div
                    {...listeners}
                    className="flex items-center min-h-full rounded-md cursor-grab active:cursor-grabbing transition hover:bg-curious-blue-950/5"
                >
                    <GripVertical className="size-5 text-curious-blue-950/60" />
                </div>

                {/* THUMBNAIL */}
                <div className="relative min-w-40 max-w-44 h-30 ml-1 mr-4 rounded-xl overflow-hidden bg-curious-blue-950/5">
                    {mediaType === "image" ? (
                        <img
                            src={toMediaUrl(path)}
                            alt={getFileName(path)}
                            className="w-full hfull object-cover"
                        />
                    ) : (
                        <>
                            <video
                                src={toMediaUrl(path)}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-curious-blue-950/20">
                                <Play className="size-6 text-white" />
                            </div>
                        </>
                    )}
                </div>

                {/* INFORMATION */}
                <div className="flex flex-col gap-1">
                    <span className="text-curious-blue-950/60 text-sm">{mediaType === "video" ? "Video" : "Imagen"}</span>
                    <p className="font-medium line-clamp-2">{getFileName(path)}</p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToIndexCallback(index)}
                            disabled={isPlaying}
                            className="flex items-center gap-1 w-fit text-xs py-2 px-3 rounded-full border border-curious-blue-950/10 bg-curious-blue-950/5 duration-200 not-disabled:hover:bg-curious-blue-950/10 not-disabled:cursor-pointer"
                        >
                            {isPlaying ? (
                                <>
                                    <span className="text-curious-blue-600">En reproducción</span>
                                </>
                            ) : (
                                <>
                                    <span>Reproducir</span>
                                    <Play className="size-4" />
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => removeFileCallback(index)}
                            className="flex items-center gap-1 w-fit text-rose-400 text-xs py-2 px-3 border border-transparent duration-200 hover:text-rose-500 cursor-pointer"
                        >
                            <span>Quitar</span>
                            <Trash className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
