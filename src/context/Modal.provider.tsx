import { useState } from "react";
import { ModalContext } from "./Modal.context";

/** The props of the provider */
interface ModalProviderProps {
    /** Children react node */
    children: React.ReactNode;
}

/**
 * This context provider provides the children with the modal
 * 
 * @param {ModalProviderProps} props - Provider props
 * @returns JSX.Element
 */
export default function ModalProvider({ children }: ModalProviderProps) {
    const [modalState, setModalState] = useState<string | null>(null);

    return (
        <ModalContext.Provider value={{ modalState, setModalState }}>
            {children}
        </ModalContext.Provider>
    )
}
