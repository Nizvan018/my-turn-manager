import Store, { Schema } from "electron-store";
import { TurnConfigurationType } from "../../schemas/turnConfiguration.schema";

/** Turn store schema type */
type TurnStoreSchema = {
    /** Turn configuration */
    configuration: TurnConfigurationType;
}

/** Turn store schema */
const schema: Schema<TurnStoreSchema> = {
    configuration: {
        type: "object",
        properties: {
            prefix: {
                type: "string"
            },
            startNumber: {
                type: "number",
                minimum: 0
            },
            numberOfDigits: {
                type: "number",
                minimum: 0
            }
        }
    }
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
    return turnStore.get("configuration", {
        prefix: "",
        startNumber: 0,
        numberOfDigits: 0
    });
}
