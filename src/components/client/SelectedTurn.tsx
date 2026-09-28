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
        <article className="relative flex flex-col text-white p-5 justify-between rounded-3xl bg-radial-[at_0%_0%] from-curious-blue-600 to-curious-blue-400 shadow-md">
            <span className="text-lg font-semibold">Atendiendo turno</span>
            <span className="text-7xl font-semibold pb-2">{turn}</span>
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span>En caja</span>
                <div className="p-2 rounded-full bg-white">
                    <ScreenShare className="text-curious-blue-950 size-4" />
                </div>
            </div>
        </article>
    )
}
