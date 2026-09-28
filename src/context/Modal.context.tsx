import { createContext, useContext } from "react";

/** The props of the context */
interface ModalContextType {
    /** Modal state (whether is open or not) */
    modalState: string | null;
    /** Set the state of the modal */
    setModalState: React.Dispatch<React.SetStateAction<string | null>>;
}

// Modal context definition
export const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * This hook provides the modal state and setState function
 * 
 * @returns context- modalState, setModalState()
 */
export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) throw new Error("useModal must be used within a ModalProvider");

    return context;
}
