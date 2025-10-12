import { ImageOff, SquarePen } from "lucide-react";

/**
 * The banner section of the control page
 * 
 * @returns JSX.Element
 */
export default function BannerSection() {
    return (
        <section className="flex gap-6 w-full grow">
            <div className="flex flex-col justify-center gap-4 items-center w-auto h-full aspect-square rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
                <ImageOff className="size-16" />
                <span>Seleccionar imagen</span>
            </div>

            <article className="relative flex flex-col gap-6 w-full h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-gradient-to-br from-curious-blue-500/15 from-20% to-brilliant-rose-500/15">
                <button className="absolute right-6 flex items-center gap-2 text-sm p-4 rounded-full border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm duration-200 ease-in-out hover:bg-curious-blue-950/10 cursor-pointer">
                    <span>Editar información</span>
                    <SquarePen className="size-5" />
                </button>

                <h1 className="text-3xl font-semibold">Sin título configurado</h1>

                <span>More text...</span>
            </article>
        </section>
    )
}
