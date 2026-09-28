import { ImageOff, SquarePen, MousePointerClick, Instagram, Facebook, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { toMediaUrl } from "../../lib/mediaHelpers";
import InfoConfigurationModal from "./InfoConfigurationModal";
import { useModal } from "../../context/Modal.context";
import type { InfoConfigurationType } from "../../schemas/infoConfiguration.schema";

/**
 * The banner section of the control page
 * 
 * @returns JSX.Element
 */
export default function BannerSection() {
    const { setModalState } = useModal();
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
        const savedInfo = await window.utils.loadInfo();

        if (savedLogoPath) {
            setLogoPath(savedLogoPath);
            window.utils.sendLogoPath(savedLogoPath);
        }

        if (savedInfo) {
            setInfo(savedInfo);
            window.utils.sendInfo(savedInfo);
        }
    }

    useEffect(() => {
        loadSavedInfo();
    }, []);

    return (
        <section className="flex gap-6 w-full min-h-0 grow">
            {/* LOGO BUTTON */}
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

            {/* LOCAL INFO ARTICLE */}
            <article className="relative flex flex-col gap-3 w-full h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-gradient-to-br from-curious-blue-500/15 from-20% to-brilliant-rose-500/15">
                <button
                    onClick={() => setModalState("info-configuration-modal")}
                    className="absolute right-6 flex items-center gap-2 text-sm p-4 rounded-full border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm duration-200 ease-in-out hover:bg-curious-blue-950/10 cursor-pointer"
                >
                    <span>Editar información</span>
                    <SquarePen className="size-5" />
                </button>

                <h1 className="text-3xl font-semibold">{info.title || "Sin título configurado"}</h1>

                <div className="flex gap-4 w-full h-full">
                    {/* INSTRUCTIONS MESSAGE */}
                    <div className="flex flex-col gap-2 w-full h-full">
                        <h2 className="font-semibold">{info.subtitle || "Subtítulo sin configurar"}</h2>
                        <p className="whitespace-pre-line text-curious-blue-950/60">{info.instructionsMessage || "Instrucciones/mensaje sin configurar"}</p>
                    </div>

                    <div className="w-px h-full bg-curious-blue-950/30"></div>

                    {/* SOCIAL NETWORKS */}
                    <div className="flex flex-col gap-2 w-full h-full">
                        <h2 className="font-semibold">Redes sociales</h2>
                        <ul className="flex flex-col gap-2">
                            <li className="flex items-center gap-2">
                                <Instagram size={20} />
                                <span className="text-curious-blue-950/60">{info.socialNetworks.instagram || "Sin Instagram configurado"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Facebook size={20} />
                                <span className="text-curious-blue-950/60">{info.socialNetworks.facebook || "Sin Facebook configurado"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Globe size={20} />
                                <span className="text-curious-blue-950/60">{info.socialNetworks.web || "Sin Web configurado"}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>

            <InfoConfigurationModal
                setInfoCallback={setInfo}
            />
        </section>
    )
}
