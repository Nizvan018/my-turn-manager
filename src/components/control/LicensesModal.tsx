import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useModal } from '../../context/Modal.context';

/**
 * Modal that displays third-party licenses
 * 
 * @returns JSX.Element
 */
export default function LicensesModal() {
    const { setModalState } = useModal();
    const [licenses, setLicenses] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Load licenses from txt file
    const loadLicenses = async () => {
        try {
            setIsLoading(true);

            const res = await window.utils.getLicenses();

            if (res.ok === false) {
                setError(res.error);
                return;
            }

            setLicenses(res.data);
        } catch (error) {
            setError("No se pudieron cargar las licencias de terceros");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        window.utils.onOpenLicensesModal(() => {
            setModalState("licenses-modal");
            loadLicenses();
        });

        return () => {
            window.utils.removeAllListeners("utils:onOpenLicensesModal");
        }
    }, []);

    return (
        <Modal
            id="licenses-modal"
            className="w-lg"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-xl font-semibold">Licencias de terceros</h2>

                <div className='overflow-auto h-full max-h-[600px] text-wrap text-xs whitespace-pre-wrap font-mono p-4 rounded-2xl border border-curious-blue-950/10 bg-curious-blue-950/5'>
                    {isLoading && "Cargando licencias..."}

                    {error && (
                        <span className="text-rose-500">{error}</span>
                    )}

                    {!isLoading && !error && (
                        <pre>{licenses}</pre>
                    )}
                </div>
            </div>
        </Modal>
    )
}
