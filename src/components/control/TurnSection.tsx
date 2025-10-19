import { useEffect, useState } from "react";
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

    // Save turns helper (wrap saveTurns in a try catch)
    const saveTurnsHelper = async (data: Parameters<typeof window.utils.saveTurns>[0]) => {
        try {
            await window.utils.saveTurns(data);
        } catch (error) {
            console.error("Error al guardar los turnos:", error);
        }
    }

    // FOR TURN AT CHECKOUT:

    // Check the turn and send it to the history array
    const checkTurnAtCheckout = async () => {
        if (!turnAtCheckout) return;

        const newTurnsHistory = [
            turnAtCheckout, ...turnsHistory
        ].slice(0, HISTORY_LENGTH);

        setTurnsHistory(newTurnsHistory);
        setTurnAtCheckout(null);

        await saveTurnsHelper({
            storeType: "checkTurnAtCheckout",
            turnsHistory: newTurnsHistory
        });
    }

    // Return the turn at checkout to the waiting turns array
    const returnCheckoutTurn = async () => {
        if (!turnAtCheckout) return;

        const newWaitingTurns = [turnAtCheckout, ...waitingTurns];

        setWaitingTurns(newWaitingTurns);
        setTurnAtCheckout(null);

        await saveTurnsHelper({
            storeType: "returnCheckoutTurn",
            waitingTurns: newWaitingTurns
        });
    }

    // FOR WAITING TURNS:

    // Create a new turn and add it to the waitingTurns array
    const createNewTurn = async () => {
        if (!nextTurn) return;

        const newWaitingTurns = [...waitingTurns, nextTurn];

        setWaitingTurns(newWaitingTurns);
        setNextTurn(prev => {
            const formattedTurn = turnFormatter(prev.prefix, prev.turnNumber + 1, prev.numberOfDigits);

            return {
                ...prev,
                id: `${formattedTurn}_${Date.now()}`,
                turnNumber: prev.turnNumber + 1,
                formattedTurn
            }
        });

        await saveTurnsHelper({
            storeType: "createNewTurn",
            waitingTurns: newWaitingTurns
        });
    }

    // Attend the first turn of the waitingTurns array
    const attendNextTurn = async () => {
        if (waitingTurns.length === 0) return;

        const [first, ...rest] = waitingTurns;

        setTurnAtCheckout(first);
        setWaitingTurns(rest);

        await saveTurnsHelper({
            storeType: "attendNextTurn",
            turnAtCheckout: first,
            waitingTurns: rest
        });
    }

    // Removes an specific turn of the waitingTurns array
    const removeTurn = async (id: string) => {
        const turnIndex = waitingTurns.findIndex(item => item.id === id);

        // If the turn doesn't exist
        if (turnIndex === -1) return;

        // If the turn is the last item
        if (turnIndex === waitingTurns.length - 1) {
            setNextTurn(waitingTurns[turnIndex]); // replace with the eliminated turn
        }

        const newWaitingTurns = waitingTurns.filter(item => item.id !== id);
        setWaitingTurns(newWaitingTurns);

        await saveTurnsHelper({
            storeType: "removeTurn",
            waitingTurns: newWaitingTurns
        });
    }

    // FOR HISTORY TURNS:

    // Return an specific turn from history array to the checkout
    const returnTurnFromHistory = async () => {
        if (turnAtCheckout) return;
        if (turnsHistory.length === 0) return;

        const [first, ...rest] = turnsHistory;

        setTurnAtCheckout(first);
        setTurnsHistory(rest);

        await saveTurnsHelper({
            storeType: "returnTurnFromHistory",
            turnAtCheckout: first,
            turnsHistory: rest
        });
    }

    // Load the turns from electron store
    const loadSavedTurns = async () => {
        try {
            const { turnAtCheckout, waitingTurns, turnsHistory } = await window.utils.loadTurns(); // get the saved turns
            const savedConfig = await window.utils.loadTurnConfiguration(); // get the saved turn configuration

            const lastTurn = waitingTurns.at(-1) ?? // if there are waiting turns
                turnAtCheckout ?? // if there is a turn at the checkout
                turnsHistory.at(0) ?? // if there is a turns history
                null;

            if (lastTurn) { // if last turn exists, generate the next turn
                const { prefix, turnNumber, numberOfDigits } = lastTurn;
                const formattedTurn = turnFormatter(prefix, turnNumber + 1, numberOfDigits);

                setNextTurn({
                    id: `${formattedTurn}_${Date.now()}`,
                    prefix,
                    turnNumber: turnNumber + 1,
                    numberOfDigits,
                    formattedTurn
                });
            } else { // use the saved turn configuration to generate the next turn
                const { prefix, startNumber, numberOfDigits } = savedConfig;
                const formattedTurn = turnFormatter(prefix, startNumber, numberOfDigits);

                setNextTurn({
                    id: `${formattedTurn}_${Date.now()}`,
                    prefix,
                    turnNumber: startNumber,
                    numberOfDigits,
                    formattedTurn
                });
            }

            // Set the saved turns
            setTurnAtCheckout(turnAtCheckout);
            setWaitingTurns(waitingTurns);
            setTurnsHistory(turnsHistory);
        } catch (error) {
            console.error("Error al cargar los turnos", error);
        }
    }

    useEffect(() => {
        loadSavedTurns();
    }, []);

    return (
        <section className="flex flex-col gap-6 w-full max-w-1/4 h-full">
            <div className="overflow-y-hidden flex flex-col gap-6 w-full h-full pt-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
                {turnAtCheckout ? (
                    <div className="px-6">
                        <TurnAtCheckoutCard
                            turn={turnAtCheckout}
                            checkTurnAtCheckoutCallback={checkTurnAtCheckout}
                            returnCheckoutTurnCallback={returnCheckoutTurn}
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
