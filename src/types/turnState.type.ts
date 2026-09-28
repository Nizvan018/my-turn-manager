import { Turn } from "./turn.type";

export interface TurnState {
    turnAtCheckout: Turn | null;
    waitingTurns: Turn[];
}
