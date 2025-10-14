import Store, { Schema } from "electron-store";

/** Media store schema type */
type MediaStoreSchema = {
    /** Media paths */
    mediaPaths: string[];
    /** Media volume */
    volume: number;
}

/** Media store schema */
const schema: Schema<MediaStoreSchema> = {
    mediaPaths: {
        type: "array",
        items: {
            type: "string"
        }
    },
    volume: {
        type: "number"
    }
}

// Store instance
const mediaStore = new Store<MediaStoreSchema>({
    name: "mediaStore",
    schema
});

/**
 * Save the provided media paths
 * 
 * @param {string[]} paths - Media paths to store
 */
export const saveMediaPaths = (paths: string[]) => {
    mediaStore.set("mediaPaths", paths);
}

/**
 * Get the stored paths 
 * 
 * @returns String array of stored media paths
 */
export const loadMediaPaths = () => {
    return mediaStore.get("mediaPaths", []);
}

/**
 * Save the provided volume
 * 
 * @param {number} volume - Volume to store
 */
export const saveVolume = (volume: number) => {
    mediaStore.set("volume", volume);
}

/**
 * Get the stored volume
 * 
 * @returns Stored volume number
 */
export const loadVolume = () => {
    return mediaStore.get("volume", 50);
}
