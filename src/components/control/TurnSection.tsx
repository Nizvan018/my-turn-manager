import { useState } from "react";
import { History, Settings, Plus } from "lucide-react";
import { useModal } from "../../context/Modal.context";
import TurnConfigurationModal from "./TurnConfigurationModal";
import TurnHistoryModal from "./TurnHistoryModal";
import { Turn } from "../../types/turn.type";
import WaitingTurnCard from "./WaitingTurnCard";
import TurnAtCheckoutCard from "./TurnAtCheckoutCard";
import { turnFormatter } from "../../lib/turnHelpers";

// Turns history array max length
const HISTORY_LENGTH = 10;

/**
 * Turn queue section for the control window
 * 
 * @returns JSX.Element
 */
export default function TurnsSection() {
    const { setModalState } = useModal();

    const [nextTurn, setNextTurn] = useState<Turn | null>(null);
    const [turnAtCheckout, setTurnAtCheckout] = useState<Turn | null>(null);
    const [waitingTurns, setWaitingTurns] = useState<Turn[]>([]);
    const [turnsHistory, setTurnsHistory] = useState<Turn[]>([]);

    // FOR TURN AT CHECKOUT:

    // Check the turn and send it to the history array
    const checkTurnAtCheckout = () => {
        if (!turnAtCheckout) return;

        setTurnsHistory(
            prev => [turnAtCheckout, ...prev].slice(0, HISTORY_LENGTH)
        );
        setTurnAtCheckout(null);
    }

    // Return the turn at checkout to the waiting turns array
    const returnTurnAtCheckout = () => {
        if (!turnAtCheckout) return;

        setWaitingTurns(prev => [turnAtCheckout, ...prev]);
        setTurnAtCheckout(null);
    }

    // FOR WAITING TURNS:

    // Create a new turn and add it to the waitingTurns array
    const createNewTurn = () => {
        if (!nextTurn) return;

        setWaitingTurns(prev => [...prev, nextTurn]);

        setNextTurn(prev => {
            const formattedTurn = turnFormatter(prev.prefix, prev.turnNumber + 1, prev.numberOfDigits);

            return {
                ...prev,
                id: `${formattedTurn}_${Date.now()}`,
                turnNumber: prev.turnNumber + 1,
                formattedTurn
            }
        });
    }

    // Attend the first turn of the waitingTurns array
    const attendNextTurn = () => {
        const [first, ...rest] = waitingTurns;

        setTurnAtCheckout(first);
        setWaitingTurns(rest);
    }

    // Removes an specific turn of the waitingTurns array
    const removeTurn = (id: string) => {
        const turnIndex = waitingTurns.findIndex(item => item.id === id);

        // If the turn doesn't exist
        if (turnIndex === -1) return;

        // If the turn is the last item
        if (turnIndex === waitingTurns.length - 1) {
            setNextTurn(waitingTurns[turnIndex]); // replace with the eliminated turn
        }

        setWaitingTurns(prev => prev.filter(item => item.id !== id));
    }

    // FOR HISTORY TURNS:

    // Return an specific turn from history array to the checkout
    const returnTurnFromHistory = () => {
        if (turnAtCheckout) return;

        const [first, ...rest] = turnsHistory;

        setTurnAtCheckout(first);
        setTurnsHistory(rest);
    }

    return (
        <section className="flex flex-col gap-6 w-full max-w-1/4 h-full">
            <div className="overflow-y-hidden flex flex-col gap-6 w-full h-full pt-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
                {turnAtCheckout ? (
                    <div className="px-6">
                        <TurnAtCheckoutCard
                            turn={turnAtCheckout}
                            checkTurnAtCheckoutCallback={checkTurnAtCheckout}
                            returnTurnAtCheckoutCallback={returnTurnAtCheckout}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-[calc(100%-48px)] h-32 px-6 mx-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                        <span className="text-curious-blue-950/60 text-center text-lg font-medium">No se está atendiendo ningún turno</span>
                    </div>
                )}

                <div className="flex items-center gap-4 px-6">
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                    <span className="text-nowrap text-curious-blue-950/60 font-light">En espera</span>
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                </div>

                <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
                    <div className="flex flex-col items-center gap-4 px-6">
                        <button
                            onClick={createNewTurn}
                            disabled={nextTurn === null}
                            className="disabled:opacity-50 btn-primary w-full shrink-0"
                        >
                            <span className="text-lg font-medium">Crear un nuevo turno</span>
                            <Plus className="size-6" />
                        </button>
                        <span className="text-curious-blue-950/60">
                            <span className="font-semibold">Turno a generar:</span> {nextTurn?.formattedTurn ?? "Sin turno configurado"}
                        </span>
                    </div>

                    {waitingTurns.length === 0 ? (
                        <span className="w-full text-curious-blue-950/60 text-center">Sin turnos en espera...</span>
                    ) : (
                        <ul className="overflow-y-auto custom-scroll scroll-fade-bottom flex-1 flex flex-col gap-4 min-h-0 pt-3 px-6">
                            {waitingTurns.map((turn, index) => (
                                <WaitingTurnCard
                                    key={turn.id}
                                    turn={turn}
                                    isAttendButtonDisabled={index > 0 || turnAtCheckout !== null}
                                    attendTurnCallback={attendNextTurn}
                                    removeTurnCallback={removeTurn}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 w-full">
                <button
                    onClick={() => setModalState("turns-history-modal")}
                    className="btn-secondary w-fit"
                >
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

            <TurnConfigurationModal setTurnCallback={setNextTurn} />

            <TurnHistoryModal
                turnsHistory={turnsHistory}
                isReturnButtonDisabled={turnAtCheckout !== null}
                returnTurnFromHistoryCallback={returnTurnFromHistory}
            />
        </section>
    )
}
