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
        <li className="relative flex flex-col p-5 rounded-3xl border border-curious-blue-950/10 bg-white shadow-sm">
            <span className="text-lg font-semibold">Turno en espera</span>
            <span className="text-6xl font-medium pb-1">{turn}</span>
            <div className="absolute bottom-3 right-3 flex items-center justify-end gap-2">
                <span className="text-sm">{index * 3} min. aprox.</span>
                <div className="p-[6px] rounded-full bg-curious-blue-950/5">
                    <ScreenShare className="size-[14px]" />
                </div>
            </div>
        </li>
    )
}
