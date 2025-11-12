import { useEffect } from 'react';
import Modal from './Modal';
import { useModal } from '../../context/Modal.context';
import logo from "../../assets/logo.png";

/**
 * Modal that displays the application info
 * 
 * @returns JSX.Element
 */
export default function AppInfoModal() {
    const { setModalState } = useModal();

    useEffect(() => {
        window.utils.onOpenAppInfoModal(() => {
            setModalState("app-info-modal");
        });

        return () => {
            window.utils.removeAllListeners("utils:onOpenAppInfoModal");
        }
    }, []);

    return (
        <Modal
            id="app-info-modal"
            className="w-lg"
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Acerca de la aplicación</h2>

                <picture className='flex justify-center w-full'>
                    <img
                        src={logo}
                        alt="App logo"
                        className="size-80 object-cover"
                    />
                </picture>

                <div className='flex flex-col gap-4 text-center text-wrap'>
                    <span className='font-semibold'>Versión especial para Quiquitos Papelería</span>

                    <p>
                        Esta aplicación está diseñada para gestionar de forma sencilla y gratuita los turnos de atención en tu local, optimizando la organización y mejorando la experiencia de tus clientes.
                    </p>

                    <p>
                        Se trata de un proyecto de código abierto, disponible en su respectivo repositorio oficial de GitHub.
                    </p>
                </div>
            </div>
        </Modal>
    )
}
