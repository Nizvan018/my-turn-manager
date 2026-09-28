import { Undo } from "lucide-react";
import Modal from "./Modal";
import { Turn } from "../../types/turn.type";

/** Component props */
interface Props {
    /** Turn history array */
    turnsHistory: Turn[];
    /** Indicate if the return button is disabled */
    isReturnButtonDisabled: boolean;
    /** Return the turn to the checktou */
    returnTurnFromHistoryCallback: () => Promise<void>;
}

/**
 * This modal shows the turn history
 * (last 10 checked turns)
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function TurnHistoryModal({
    turnsHistory,
    isReturnButtonDisabled,
    returnTurnFromHistoryCallback
}: Props) {
    return (
        <Modal
            id="turns-history-modal"
            className="w-lg"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-xl font-semibold">Historial de turnos</h2>

                <p>A continuación se muestran los 10 turnos más recientes, ordenados del más reciente al más antiguo.</p>

                {turnsHistory.length === 0 ? (
                    <span className="w-full text-curious-blue-950/60 text-center">Sin turnos en el historial...</span>
                ) : (
                    <ul className="overflow-y-auto custom-scroll scroll-fade flex flex-col gap-4 h-full max-h-96 py-3 pr-2">
                        {turnsHistory.map((turn, index) => (
                            <li key={turn.id} className="flex items-center gap-6 w-full rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                                <div className="flex flex-col grow pl-4">
                                    <span>Turno</span>
                                    <span className="text-4xl font-medium">{turn.formattedTurn}</span>
                                </div>

                                <button
                                    onClick={returnTurnFromHistoryCallback}
                                    disabled={index > 0 || isReturnButtonDisabled}
                                    className="disabled:opacity-50 not-disabled:cursor-pointer flex justify-center items-center w-1/6 h-20 text-white rounded-r-3xl bg-curious-blue-400 transition hover:bg-curious-blue-500"
                                >
                                    <Undo className="size-6" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <span className="text-curious-blue-950/60 text-center">No puede regresar un turno si algún turno se está atendiendo</span>
            </div>
        </Modal>
    )
}
