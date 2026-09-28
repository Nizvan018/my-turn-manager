import Modal from './Modal';
import CustomInput from './CustomInput';
import CustomAreaText from './CustomAreaText';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { infoConfigurationSchema, type InfoConfigurationType } from '../../schemas/infoConfiguration.schema';
import { useEffect, useState } from 'react';
import { LoaderCircle, Instagram, Facebook, Globe } from 'lucide-react';
import { useModal } from '../../context/Modal.context';

/** Component props */
interface Props {
    /** This function sets the local info on the front-end */
    setInfoCallback: React.Dispatch<React.SetStateAction<InfoConfigurationType>>;
}

/**
 * Modal for local info configuration
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function InfoConfigurationModal({ setInfoCallback }: Props) {
    const { setModalState } = useModal();
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const { control, handleSubmit, formState: { errors }, watch, reset } = useForm({
        resolver: zodResolver(infoConfigurationSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            instructionsMessage: "",
            socialNetworks: {
                instagram: "",
                facebook: "",
                web: ""
            }
        }
    });

    // Handle form submition
    const submit = handleSubmit(async (data) => {
        try {
            setIsSavingConfig(true);

            setInfoCallback(data);

            window.utils.sendInfo(data);
            await window.utils.saveInfo(data);

            setModalState(null);
        } catch (error) {
            console.log("Error al guardar la configuración:", error);
        } finally {
            setIsSavingConfig(false);
        }
    });

    // Load the saved local info
    const loadSavedInfo = async () => {
        try {
            const savedInfo = await window.utils.loadInfo();

            if (savedInfo) {
                reset({
                    title: savedInfo.title,
                    subtitle: savedInfo.subtitle,
                    instructionsMessage: savedInfo.instructionsMessage,
                    socialNetworks: savedInfo.socialNetworks
                });
            }
        } catch (error) {
            console.error("Error al cargar la información:", error);
        }
    }

    useEffect(() => {
        loadSavedInfo();
    }, []);

    return (
        <Modal
            id="info-configuration-modal"
            className="w-md"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-xl font-semibold">Configuración de información</h2>

                <form className="overflow-y-scroll scroll-fade custom-scroll flex flex-col gap-4 h-full max-h-[400px] py-2 pr-2">
                    {/* TÍTULO */}
                    <CustomInput
                        control={control}
                        name="title"
                        label="Título"
                        placeholder="Título o saludo"
                        error={errors.title}
                    />

                    <div className="flex items-center gap-4">
                        <div className="w-full h-px bg-curious-blue-950/30"></div>
                        <span className="text-nowrap text-curious-blue-950/60 font-light">Instrucciones/mensaje</span>
                        <div className="w-full h-px bg-curious-blue-950/30"></div>
                    </div>

                    {/* SUBTÍTULO */}
                    <CustomInput
                        control={control}
                        name="subtitle"
                        label="Subtítulo"
                        placeholder="Subtítulo"
                        error={errors.subtitle}
                    />

                    {/* INSTRUCCIONES MENSAJE */}
                    <CustomAreaText
                        control={control}
                        name="instructionsMessage"
                        label="Instrucciones/mensaje"
                        placeholder="Instrucciones o mensaje a mostrar"
                        rows={5}
                        error={errors.instructionsMessage}
                    />

                    <div className="flex items-center gap-4">
                        <div className="w-full h-px bg-curious-blue-950/30"></div>
                        <span className="text-nowrap text-curious-blue-950/60 font-light">Redes sociales</span>
                        <div className="w-full h-px bg-curious-blue-950/30"></div>
                    </div>

                    {/* INSTAGRAM */}
                    <div className="flex gap-3">
                        <div className="h-fit min-w-5 mt-4">
                            <Instagram className={`size-5 ${watch("socialNetworks.instagram").length && "text-brilliant-rose-500"}`} />
                        </div>
                        <CustomInput
                            control={control}
                            name="socialNetworks.instagram"
                            placeholder="Nombre o URL de Instagram"
                            error={errors.socialNetworks?.instagram}
                            className="w-full"
                        />
                    </div>

                    {/* FACEBOOK */}
                    <div className="flex gap-3">
                        <div className="h-fit min-w-5 mt-4">
                            <Facebook className={`size-5 ${watch("socialNetworks.facebook").length && "text-brilliant-rose-500"}`} />
                        </div>
                        <CustomInput
                            control={control}
                            name="socialNetworks.facebook"
                            placeholder="Nombre o URL de Facebook"
                            error={errors.socialNetworks?.facebook}
                            className="w-full"
                        />
                    </div>

                    {/* WEB */}
                    <div className="flex gap-3">
                        <div className="h-fit min-w-5 mt-4">
                            <Globe className={`size-5 ${watch("socialNetworks.web").length && "text-brilliant-rose-500"}`} />
                        </div>
                        <CustomInput
                            control={control}
                            name="socialNetworks.web"
                            placeholder="URL del sitio web"
                            error={errors.socialNetworks?.web}
                            className="w-full"
                        />
                    </div>
                </form>

                <button
                    onClick={submit}
                    disabled={isSavingConfig}
                    className="disabled:opacity-50 btn-primary text-lg"
                >
                    {isSavingConfig ? (
                        <>
                            <span>Guardando</span>
                            <LoaderCircle className="size-5 animate-spin" />
                        </>
                    ) : (
                        "Aceptar"
                    )}
                </button>
            </div>
        </Modal>
    )
}
