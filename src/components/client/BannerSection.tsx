import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toMediaUrl } from "../../lib/mediaHelpers";

const exampleData = {
    title: "¡Bienvenido a Papelería Quiquitos!"
}

/**
 * The banner section of the client window
 * 
 * @returns JSX.Element
 */
export default function BannerSection() {
    const [logoPath, setLogoPath] = useState<string | null>(null);

    useEffect(() => {
        window.utils.onLogoPathUpdated(newState => {
            setLogoPath(newState);
        });

        return () => {
            window.utils.removeAllListeners("utils:onLogoPathUpdated");
        }
    }, []);

    return (
        <section className="flex gap-6 w-full min-h-0 grow">
            <div className="flex justify-center items-center w-auto h-full aspect-square rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
                {logoPath ? (
                    <img
                        src={toMediaUrl(logoPath)}
                        alt="logo"
                        className="object-cover rounded-[48px]"
                    />
                ) : (
                    <ImageOff className="size-24 text-slate-400" />
                )}
            </div>

            <article className="flex flex-col gap-6 w-full h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-gradient-to-br from-curious-blue-500/15 from-20% to-brilliant-rose-500/15">
                <h1 className="text-3xl font-semibold">{exampleData.title}</h1>

                <span>More text...</span>
            </article>
        </section>
    )
}
