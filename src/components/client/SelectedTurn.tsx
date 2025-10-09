import { ScreenShare } from "lucide-react";

/** Component props */
interface Props {
    /** Turn string/number */
    turn: string;
}

/**
 * Selected turn card for the client
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function SelectedTurn({ turn }: Props) {
    return (
        <article className="flex items-center gap-6 text-white p-6 justify-between rounded-3xl bg-radial-[at_0%_0%] from-curious-blue-600 to-curious-blue-400 shadow-md">
            <div className="flex flex-col gap-2 w-1/2 h-full">
                <span className="text-xl font-semibold">Atendiendo turno</span>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-white">
                        <ScreenShare className="text-curious-blue-950 size-5" />
                    </div>
                    <span className="text-lg">En caja</span>
                </div>
            </div>
            <span className="text-8xl font-semibold">{turn}</span>
        </article>
    )
}
