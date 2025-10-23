import { ImageOff, SquarePen, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";
import { toMediaUrl } from "../../lib/mediaHelpers";

/**
 * The banner section of the control page
 * 
 * @returns JSX.Element
 */
export default function BannerSection() {
    const [logoPath, setLogoPath] = useState<string | null>(null);

    // Handle the logo selection
    const handleSelectLogo = async () => {
        const newPath = await window.utils.selectLogo();

        if (newPath) {
            setLogoPath(newPath);

            window.utils.sendLogoPath(newPath);
            await window.utils.saveLogoPath(newPath);
        }
    }

    // Load saved info
    const loadSavedInfo = async () => {
        const savedLogoPath = await window.utils.loadLogoPath();

        if (savedLogoPath) {
            setLogoPath(savedLogoPath);
            window.utils.sendLogoPath(savedLogoPath);
        }
    }

    useEffect(() => {
        loadSavedInfo();
    }, []);

    return (
        <section className="flex gap-6 w-full min-h-0 grow">
            <button
                onClick={handleSelectLogo}
                className="flex flex-col justify-center gap-4 items-center w-auto h-full aspect-square rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm cursor-pointer transition hover:bg-curious-blue-950/10"
            >
                {logoPath ? (
                    <div className="group relative overflow-hidden rounded-[48px]">
                        <img
                            src={toMediaUrl(logoPath)}
                            alt="logo"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 m-auto flex flex-col items-center justify-center gap-4 text-white bg-curious-blue-950/30 backdrop-blur-md opacity-0 transition group-hover:opacity-100">
                            <MousePointerClick className="size-16" />
                            <span>Cambiar imagen</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <ImageOff className="size-16" />
                        <span>Seleccionar imagen</span>
                    </>
                )}
            </button>

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
