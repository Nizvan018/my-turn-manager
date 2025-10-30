import { useModal } from "../../context/Modal.context";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

/** Component props */
interface Props {
    /** The ID of the modal */
    id: string;
    /** The content of the modal */
    children: React.ReactNode;
    /** Additional functionality when the modal is closed */
    onCloseModal?: () => void;
    /** Indicates whether the modal is close or not */
    isCloseButtonDisabled?: boolean;
    /** Additional class names for styling */
    className?: React.ComponentProps<"div">["className"];
}

/**
 * Main modal that renders all modals on control window
 * 
 * @param {Props} props - Component props 
 * @returns JSX.Element
 */
export default function Modal({ id, children, onCloseModal, isCloseButtonDisabled, className }: Props) {
    const { modalState, setModalState } = useModal();
    const modalRoot = document.getElementById("modal");

    // Handle close modal
    const closeModal = () => {
        if (isCloseButtonDisabled) return;

        setModalState(null);

        if (typeof onCloseModal === "function") {
            onCloseModal();
        }
    }

    // Manage the propagation of the click on the modal
    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    // If modalRoot doesn't exist
    if (!modalRoot) return null;

    return createPortal(
        <AnimatePresence>
            {modalState === id && (
                <motion.div
                    onClick={closeModal}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="z-[1000] fixed top-0 left-0 flex items-center justify-center w-full h-screen px-4 bg-curious-blue-950/20"
                >
                    <motion.div
                        onClick={handleContentClick}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                        className={`${className} relative rounded-[48px] p-8 bg-white shadow-lg`}
                    >
                        <button
                            onClick={closeModal}
                            disabled={isCloseButtonDisabled}
                            className="absolute disabled:opacity-50 top-8 right-8 text-rose-500 cursor-pointer transition hover:text-rose-600"
                        >
                            <X size={24} />
                        </button>

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        modalRoot
    );
}
