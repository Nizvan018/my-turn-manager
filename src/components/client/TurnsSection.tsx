import { useEffect, useState } from "react";
import SelectedTurn from "./SelectedTurn";
import WaitingTurn from "./WaitingTurn";
import type { Turn } from "../../types/turn.type";

/**
 * Turn queue section for the client
 * 
 * @returns JSX.Element
 */
export default function TurnsSection() {
    const [turnAtCheckout, setTurnAtCheckout] = useState<Turn | null>(null);
    const [waitingTurns, setWaitingTurns] = useState<Turn[]>([]);

    useEffect(() => {
        window.utils.onTurnStateUpdate((newState) => {
            setTurnAtCheckout(newState.turnAtCheckout);
            setWaitingTurns(newState.waitingTurns);
        });

        window.utils.onTurnAtCheckoutUpdate((newTurnAtCheckout) => {
            setTurnAtCheckout(newTurnAtCheckout);
        });

        window.utils.onWaitingTurnsUpdate((newWaitingTurns) => {
            setWaitingTurns(newWaitingTurns);
        });

        return () => {
            window.utils.removeAllListeners("utils:onTurnStateUpdate");
            window.utils.removeAllListeners("utils:onTurnAtCheckoutUpdate");
            window.utils.removeAllListeners("utils:onWaitingTurnsUpdate");
        }
    }, []);

    return (
        <section className="overflow-y-hidden flex flex-col gap-6 w-full max-w-[27%] h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
            {turnAtCheckout ? (
                <SelectedTurn turn={turnAtCheckout.formattedTurn} />
            ) : (
                <div className="flex items-center justify-center w-full h-[150px] rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                    <span className="text-curious-blue-950/60 text-center text-lg font-medium">No se está atendiendo ningún turno</span>
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="w-full h-px bg-curious-blue-950/60"></div>
                <span className="text-nowrap text-curious-blue-950/60 font-light">En espera</span>
                <div className="w-full h-px bg-curious-blue-950/60"></div>
            </div>

            <ul className="flex flex-col gap-4">
                {waitingTurns.slice(0, 5).map((turn, index) => (
                    <WaitingTurn
                        key={turn.id}
                        index={index + 1}
                        turn={turn.formattedTurn}
                    />
                ))}
            </ul>
        </section>
    )
}
