import { ArrowDown, Check } from "lucide-react";
import type { Turn } from "../../types/turn.type";

/** Component props */
interface Props {
    /** Turn at the checkout */
    turn: Turn;
    /** Callback to check the turn (send it to the history) */
    checkTurnAtCheckoutCallback: () => void;
    /** Callback to return the turn to the waiting turns array */
    returnTurnAtCheckoutCallback: () => void;
}

/**
 * Card of the turn at the checkout, for the control window
 * 
 * @param {Props} props - Component props 
 * @returns JSX.Element
 */
export default function TurnAtCheckoutCard({ turn, checkTurnAtCheckoutCallback, returnTurnAtCheckoutCallback }: Props) {
    return (
        <div className="flex items-center gap-6 w-full h-32 text-white rounded-3xl bg-radial-[at_0%_0%] from-curious-blue-600 to-curious-blue-400 shadow-md">
            <button
                onClick={returnTurnAtCheckoutCallback}
                className="flex justify-center items-center w-1/6 h-full rounded-l-3xl text-rose-400 bg-rose-400/25 cursor-pointer transition hover:bg-rose-500/25"
            >
                <ArrowDown className="size-8" />
            </button>

            <div className="flex flex-col gap-1 grow">
                <span className="text-xl">Atendiendo</span>
                <span className="text-5xl font-semibold">{turn.formattedTurn}</span>
            </div>

            <button
                onClick={checkTurnAtCheckoutCallback}
                className="flex justify-center items-center w-1/6 h-full rounded-r-3xl bg-curious-blue-300/25 cursor-pointer transition hover:bg-curious-blue-200/25"
            >
                <Check className="size-8" />
            </button>
        </div>
    )
}
