import Store, { Schema } from "electron-store";
import type { TurnConfigurationType } from "../../schemas/turnConfiguration.schema";
import type { Turn } from "../../types/turn.type";

/** Turn store schema type */
export type TurnStoreSchema = {
    /** Turn configuration */
    configuration: TurnConfigurationType;
    /** Turn at checkout */
    turnAtCheckout: Turn | null;
    /** Waiting turns */
    waitingTurns: Turn[];
    /** Turns history */
    turnsHistory: Turn[];
}

/** Turn store schema */
const schema: Schema<TurnStoreSchema> = {
    configuration: {
        type: "object",
        properties: {
            prefix: { type: "string", default: "" },
            startNumber: { type: "number", minimum: 0, default: 1 },
            numberOfDigits: { type: "number", minimum: 0, default: 0 }
        },
        default: {
            prefix: "",
            startNumber: 1,
            numberOfDigits: 0
        },
        required: ["prefix", "startNumber", "numberOfDigits"]
    },
    turnAtCheckout: {
        anyOf: [
            {
                type: "object",
                properties: {
                    id: { type: "string", minLength: 1 },
                    prefix: { type: "string" },
                    startNumber: { type: "number", minimum: 0 },
                    numberOfDigits: { type: "number", minimum: 0 },
                    formattedTurn: { type: "string", minLength: 1 }
                }
            },
            { type: "null" }
        ],
        default: null
    },
    waitingTurns: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: { type: "string", minLength: 1 },
                prefix: { type: "string" },
                startNumber: { type: "number", minimum: 0 },
                numberOfDigits: { type: "number", minimum: 0 },
                formattedTurn: { type: "string", minLength: 1 }
            }
        },
        default: []
    },
    turnsHistory: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: { type: "string", minLength: 1 },
                prefix: { type: "string" },
                startNumber: { type: "number", minimum: 0 },
                numberOfDigits: { type: "number", minimum: 0 },
                formattedTurn: { type: "string", minLength: 1 }
            }
        },
        maxItems: 10,
        default: []
    }
}

export type SaveTurnsProps = {
    storeType: "createNewTurn" | "removeTurn" | "returnCheckoutTurn",
    waitingTurns: Turn[],
} | {
    storeType: "attendNextTurn",
    turnAtCheckout: Turn
    waitingTurns: Turn[]
} | {
    storeType: "checkTurnAtCheckout",
    turnsHistory: Turn[]
} | {
    storeType: "returnTurnFromHistory",
    turnAtCheckout: Turn,
    turnsHistory: Turn[]
}

// Store instance
const turnStore = new Store<TurnStoreSchema>({
    name: "turnStore",
    schema
});

/**
 * Save the turn configuration
 * 
 * @param {TurnStoreSchema["configuration"]} configuration - Turn configuration to store
 */
export const saveTurnConfiguration = (configuration: TurnStoreSchema["configuration"]) => {
    turnStore.set("configuration", configuration);
}

/**
 * Get the turn configuration stored
 * 
 * @returns Turn configuration stored object
 */
export const loadTurnConfiguration = (): TurnStoreSchema["configuration"] => {
    return turnStore.get("configuration");
}

/**
 * Save the turn at the checkout, the waiting turns and the turns history
 * 
 * @param {SaveTurnsProps} saveTurnsProps - Save turns props
 */
export const saveTurns = (saveTurnsProps: SaveTurnsProps) => {
    const { storeType } = saveTurnsProps;

    switch (storeType) {
        case "createNewTurn":
        case "removeTurn":
            turnStore.set("waitingTurns", saveTurnsProps.waitingTurns);
            break;
        case "returnCheckoutTurn":
            turnStore.set("turnAtCheckout", null);
            turnStore.set("waitingTurns", saveTurnsProps.waitingTurns);
            break;
        case "attendNextTurn":
            turnStore.set("turnAtCheckout", saveTurnsProps.turnAtCheckout);
            turnStore.set("waitingTurns", saveTurnsProps.waitingTurns);
            break;
        case "checkTurnAtCheckout":
            turnStore.set("turnAtCheckout", null);
            turnStore.set("turnsHistory", saveTurnsProps.turnsHistory);
            break;
        case "returnTurnFromHistory":
            turnStore.set("turnAtCheckout", saveTurnsProps.turnAtCheckout);
            turnStore.set("turnsHistory", saveTurnsProps.turnsHistory);
            break;
        default: {
            const _exhaustive: never = storeType;
            return _exhaustive;
        }
    }
}

/**
 * Get the stored turn at checkout if exists, the waiting turns and the turns history
 * 
 * @returns Stored turn at checkout if exists, or null or undefined otherwise
 */
export const loadTurns = (): Omit<TurnStoreSchema, "configuration"> => {
    return {
        turnAtCheckout: turnStore.get("turnAtCheckout") ?? null,
        waitingTurns: turnStore.get("waitingTurns"),
        turnsHistory: turnStore.get("turnsHistory")
    }
}
