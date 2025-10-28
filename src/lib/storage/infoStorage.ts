import Store, { type Schema } from "electron-store";
import type { InfoConfigurationType } from "../../schemas/infoConfiguration.schema";

/** Info store schema type */
export type InfoStoreSchema = {
    /** Info path */
    logoPath: string | null;
    info: InfoConfigurationType;
}

/** Info store schema */
const schema: Schema<InfoStoreSchema> = {
    logoPath: {
        anyOf: [
            { type: "string" },
            { type: "null" }
        ],
        default: null
    },
    info: {
        type: "object",
        properties: {
            title: { type: "string", default: "" },
            subtitle: { type: "string", default: "" },
            instructionsMessage: { type: "string", default: "" },
            socialNetworks: {
                type: "object",
                properties: {
                    instagram: { type: "string", default: "" },
                    facebook: { type: "string", default: "" },
                    web: { type: "string", default: "" }
                },
                default: {
                    instagram: "",
                    facebook: "",
                    web: ""
                }
            }
        },
        default: {
            title: "",
            subtitle: "",
            instructionsMessage: "",
            socialNetworks: {
                instagram: "",
                facebook: "",
                web: ""
            }
        }
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

/**
 * Save the local info
 * 
 * @param {InfoStoreSchema["info"]} data - Info data tu store
 */
export const saveInfo = (data: InfoStoreSchema["info"]) => {
    infoStore.set("info", data);
}

/**
 * Get the loca info stored
 * 
 * @returns Local info stored
 */
export const loadInfo = (): InfoStoreSchema["info"] => {
    return infoStore.get("info");
}
