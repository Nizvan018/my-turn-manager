import Store, { type Schema } from "electron-store";

/** Info store schema type */
export type InfoStoreSchema = {
    /** Info path */
    logoPath: string | null;
}

/** Info store schema */
const schema: Schema<InfoStoreSchema> = {
    logoPath: {
        anyOf: [
            { type: "string" },
            { type: "null" }
        ],
        default: null
    }
}

// Store instance
const infoStore = new Store<InfoStoreSchema>({
    name: "infoStore",
    schema
});

/**
 * Save the logo path
 * 
 * @param {InfoStoreSchema["logoPath"]} logoPath - Logo path to store
 */
export const saveLogoPath = (logoPath: InfoStoreSchema["logoPath"]) => {
    infoStore.set("logoPath", logoPath);
}

/**
 * Get the logo path stored
 * 
 * @returns Logo path stored 
 */
export const loadLogoPath = (): InfoStoreSchema["logoPath"] => {
    return infoStore.get("logoPath") ?? null;
}
