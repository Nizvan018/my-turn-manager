import SelectedTurn from "./SelectedTurn";
import WaitingTurn from "./WaitingTurn";

// Turn examples
const waitingTurns = ["A2", "A3", "A4", "A5", "A6", "A7"];

/**
 * Turn queue section for the client
 * 
 * @returns JSX.Element
 */
export default function TurnsSection() {
    return (
        <section className="overflow-y-hidden flex flex-col gap-6 w-full max-w-[400px] h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
            <SelectedTurn turn="A1" />

            <div className="flex items-center gap-4">
                <div className="w-full h-px bg-curious-blue-950/60"></div>
                <span className="text-nowrap text-curious-blue-950/60 font-light">En espera</span>
                <div className="w-full h-px bg-curious-blue-950/60"></div>
            </div>

            <ul className="flex flex-col gap-4">
                {waitingTurns.slice(0, 5).map((turn, index) => (
                    <WaitingTurn
                        key={turn}
                        index={index + 1}
                        turn={turn}
                    />
                ))}
            </ul>
        </section>
    )
}
