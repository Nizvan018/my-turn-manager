import { FileVideoCamera, SkipBack, Play, SkipForward, Volume1 } from "lucide-react";

/**
 * The media controller component for the control window
 * 
 * @returns JSX.Element
 */
export default function MediaController() {
    return (
        <section className="overflow-hidden flex flex-col items-center gap-4 w-full h-auto aspect-[16/9] p-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
            <h2 className="text-curious-blue-950/60 font-light">Configuración del reproductor</h2>

            {/* CONTROL CARD */}
            <div className="flex flex-col gap-8 w-[420px] h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5">
                {/* HEADER */}
                <header className="flex flex-col items-center gap-4">
                    <button className="btn-primary w-full">
                        <span className="text-lg font-medium">Seleccionar videos/imágenes</span>
                        <FileVideoCamera className="size-6" />
                    </button>

                    <h3>Archivos seleccionados</h3>

                    <div className="flex justify-center items-center gap-6 w-full">
                        <div className="flex flex-col items-center gap-1 w-20">
                            <span className="text-curious-blue-950/60 text-sm">Total</span>
                            <span className="font-medium">0</span>
                        </div>
                        <div className="w-px h-full bg-curious-blue-950/30"></div>
                        <div className="flex flex-col items-center gap-1 w-20">
                            <span className="text-curious-blue-950/60 text-sm">Videos</span>
                            <span className="font-medium">0</span>
                        </div>
                        <div className="w-px h-full bg-curious-blue-950/30"></div>
                        <div className="flex flex-col items-center gap-1 w-20">
                            <span className="text-curious-blue-950/60 text-sm">Imágenes</span>
                            <span className="font-medium">0</span>
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
                        <span className="text-curious-blue-950/60 text-sm">Video/imagen actual</span>
                        <span className="text-rose-500">Sin archivo en reproducción</span>
                    </div>

                    <div className="flex flex-col gap-4 p-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                        <div className="flex justify-center items-center gap-6 w-full">
                            <button className="group flex flex-col items-center gap-1 w-20 cursor-pointer">
                                <SkipBack className="size-6 text-curious-blue-950 transition group-hover:scale-110" />
                                <span className="text-curious-blue-950/60 text-xs transition group-hover:text-curious-blue-950">Anterior</span>
                            </button>
                            <button className="group flex flex-col items-center gap-1 w-20 cursor-pointer">
                                <Play className="size-6 text-curious-blue-950 transition group-hover:scale-110" />
                                <span className="text-curious-blue-950/60 text-xs transition group-hover:text-curious-blue-950">Reproducir</span>
                            </button>
                            <button className="group flex flex-col items-center gap-1 w-20 cursor-pointer">
                                <SkipForward className="size-6 text-curious-blue-950 transition group-hover:scale-110" />
                                <span className="text-curious-blue-950/60 text-xs transition group-hover:text-curious-blue-950">Siguiente</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-curious-blue-950/60 text-sm">Volumen</span>
                            <div className="relative w-full h-1 rounded-full bg-curious-blue-950/30">
                                <div className="absolute -top-0.5 left-[calc(50%-4px)] size-2 rounded-full bg-curious-blue-900"></div>
                                <div className="h-1 rounded-full bg-curious-blue-950 w-1/2"></div>
                            </div>
                            <button className="w-6 cursor-pointer text-curious-blue-950/60 transition hover:text-curious-blue-950">
                                <Volume1 className="size-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
