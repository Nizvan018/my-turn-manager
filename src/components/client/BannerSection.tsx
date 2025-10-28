import { Facebook, Globe, ImageOff, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { toMediaUrl } from "../../lib/mediaHelpers";
import { InfoConfigurationType } from "../../schemas/infoConfiguration.schema";

/**
 * The banner section of the client window
 * 
 * @returns JSX.Element
 */
export default function BannerSection() {
    const [logoPath, setLogoPath] = useState<string | null>(null);
    const [info, setInfo] = useState<InfoConfigurationType>({
        title: "",
        subtitle: "",
        instructionsMessage: "",
        socialNetworks: {
            facebook: "",
            instagram: "",
            web: ""
        }
    });
    const hasInstructions = Boolean(info.subtitle || info.instructionsMessage);
    const hasSocialNetworks = Boolean(
        info.socialNetworks.instagram ||
        info.socialNetworks.facebook ||
        info.socialNetworks.web
    );

    useEffect(() => {
        window.utils.onLogoPathUpdated(newState => {
            setLogoPath(newState);
        });

        window.utils.onInfoUpdated(newState => {
            setInfo(newState)
        });

        return () => {
            window.utils.removeAllListeners("utils:onLogoPathUpdated");
            window.utils.removeAllListeners("utils:onInfoUpdated");
        }
    }, []);

    return (
        <section className="flex gap-6 w-full min-h-0 grow">
            {/* LOGO */}
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

            {/* LOCAL INFO */}
            <article className="flex flex-col gap-4 w-full h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-gradient-to-br from-curious-blue-500/15 from-20% to-brilliant-rose-500/15">
                <h1 className="text-3xl font-semibold">{info.title}</h1>

                <div className="flex gap-4 w-full h-full">
                    {/* INSTRUCTIONS MESSAGE */}
                    {hasInstructions && (
                        <div className="flex flex-col gap-4 w-full h-full">
                            <h2 className="font-semibold">{info.subtitle}</h2>
                            <p className="whitespace-pre-line text-curious-blue-950/60">{info.instructionsMessage}</p>
                        </div>
                    )}

                    {hasInstructions && hasSocialNetworks && (
                        <div className="w-px h-full bg-curious-blue-950/30"></div>
                    )}

                    {/* SOCIAL NETWORKS */}
                    {hasSocialNetworks && (
                        <div className="flex flex-col gap-4 w-full h-full">
                            <h2 className="font-semibold">Redes sociales</h2>
                            <ul className="flex flex-col gap-2">
                                {info.socialNetworks.instagram && (
                                    <li className="flex items-center gap-2">
                                        <Instagram size={20} />
                                        <span className="text-curious-blue-950/60">{info.socialNetworks.instagram}</span>
                                    </li>
                                )}
                                {info.socialNetworks.facebook && (
                                    <li className="flex items-center gap-2">
                                        <Facebook size={20} />
                                        <span className="text-curious-blue-950/60">{info.socialNetworks.facebook}</span>
                                    </li>
                                )}
                                {info.socialNetworks.web && (
                                    <li className="flex items-center gap-2">
                                        <Globe size={20} />
                                        <span className="text-curious-blue-950/60">{info.socialNetworks.web}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </article>
        </section>
    )
}
