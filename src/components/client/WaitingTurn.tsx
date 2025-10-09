import { ScreenShare } from "lucide-react";

/** Component props */
interface Props {
    /** Index of the turn (starting with 1) */
    index: number;
    /** Turn string/number */
    turn: string;
}

/**
 * Waiting turn card for the client
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function WaitingTurn({ index, turn }: Props) {
    return (
        <li className="flex items-center gap-6 p-6 justify-between rounded-3xl border border-curious-blue-950/10 bg-white shadow-sm">
            <div className="flex flex-col gap-2 h-full">
                <span className="text-lg font-semibold">Turno en espera</span>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-curious-blue-950/5">
                        <ScreenShare className="size-4" />
                    </div>
                    <span>{index * 3} minutos aprox.</span>
                </div>
            </div>
            <span className="text-6xl font-medium">{turn}</span>
        </li>
    )
}
