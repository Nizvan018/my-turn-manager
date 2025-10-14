// import SelectedTurn from "./SelectedTurn";
// import WaitingTurn from "./WaitingTurn";
import { History, Settings, Plus } from "lucide-react";
import Modal from "./Modal";
import { useModal } from "../../context/Modal.context";

// Turn examples
const waitingTurns = ["A2", "A3", "A4", "A5", "A6", "A7"];

/**
 * Turn queue section for the control window
 * 
 * @returns JSX.Element
 */
export default function TurnsSection() {
    const { setModalState } = useModal();

    return (
        <section className="flex flex-col gap-6 w-full max-w-1/4 h-full">
            <div className="overflow-y-hidden flex flex-col gap-6 w-full h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
                <div className="flex items-center justify-center w-full h-32 px-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                    <span className="text-curious-blue-950/60 text-center text-lg font-medium">No se está atendiendo ningún turno</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                    <span className="text-nowrap text-curious-blue-950/60 font-light">En espera</span>
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                </div>

                <div className="flex flex-col gap-6">
                    <button className="btn-primary">
                        <span className="text-lg font-medium">Crear un nuevo turno (A8)</span>
                        <Plus className="size-6" />
                    </button>

                    <ul className="flex flex-col gap-4">
                        <span className="w-full text-curious-blue-950/60 text-center">Sin turnos en espera...</span>
                        {/* {waitingTurns.slice(0, 5).map((turn, index) => (
                            <WaitingTurn
                                key={turn}
                                index={index + 1}
                                turn={turn}
                            />
                        ))} */}
                    </ul>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full">
                <button className="btn-secondary w-fit">
                    <span className="font-medium">Historial</span>
                    <History className="size-5" />
                </button>

                <button
                    onClick={() => setModalState("turn-configuration-modal")}
                    className="btn-secondary w-full"
                >
                    <span className="font-medium">Configuración</span>
                    <Settings className="size-5" />
                </button>
            </div>

            <Modal
                id="turn-configuration-modal"
                className="w-sm"
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Configuración de turnos</h2>

                    <span>Aquí iría toda la configuración de los turnos</span>
                </div>
            </Modal>
        </section>
    )
}
