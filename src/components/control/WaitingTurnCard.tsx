import { Trash2, ArrowUp } from "lucide-react";
import { Turn } from "../../types/turn.type";

/** Component props */
interface Props {
    /** Turn displayed */
    turn: Turn;
    /** Indicates if the attend button is disabled */
    isAttendButtonDisabled: boolean;
    /** Callback to attend the turn */
    attendTurnCallback: () => void;
    /** Callback to delete the turn of the array */
    removeTurnCallback: (id: string) => void;
}

/**
 * Waiting turn card for control window
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function WaitingTurnCard({
    turn,
    isAttendButtonDisabled,
    attendTurnCallback,
    removeTurnCallback
}: Props) {
    return (
        <li className="flex items-center gap-6 w-full rounded-3xl bg-white">
            <button
                onClick={() => removeTurnCallback(turn.id)}
                className="flex justify-center items-center w-1/6 h-full text-white rounded-l-3xl bg-rose-400 cursor-pointer transition hover:bg-rose-500"
            >
                <Trash2 className="size-6" />
            </button>

            <div className="flex flex-col grow py-2">
                <span>Turno</span>
                <span className="text-4xl font-medium">{turn.formattedTurn}</span>
            </div>

            <button
                onClick={attendTurnCallback}
                disabled={isAttendButtonDisabled}
                className="disabled:opacity-50 not-disabled:cursor-pointer flex justify-center items-center w-1/6 h-full text-white rounded-r-3xl bg-curious-blue-400 transition hover:bg-curious-blue-500"
            >
                <ArrowUp className="size-6" />
            </button>
        </li>
    )
}
