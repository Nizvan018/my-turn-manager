import Store, { Schema } from "electron-store";

/** Media store schema type */
type MediaStoreSchema = {
    /** Media paths */
    mediaPaths: string[];
}

/** Media store schema */
const schema: Schema<MediaStoreSchema> = {
    mediaPaths: {
        type: "array",
        items: {
            type: "string"
        }
    }
}

// Store instance
const store = new Store<MediaStoreSchema>({ schema });

/**
 * Save the provided media paths
 * 
 * @param {string[]} paths - Media paths to store
 */
export const saveMediaPaths = (paths: string[]) => {
    store.set("mediaPaths", paths);
}

/**
 * Get the stored paths 
 * 
 * @returns String array of stored media paths
 */
export const loadMediaPaths = () => {
    return store.get("mediaPaths", []);
}
