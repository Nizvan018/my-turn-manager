import { app } from "electron";
import { readFileSync } from "fs";
import path from "path";

/**
 * Get the third-party licenses of the txt file
 * 
 * @returns The third-party licenses string
 */
export const getLicenses = async () => {
    try {
        let licensePath: string;

        if (app.isPackaged) {
            licensePath = path.join(process.resourcesPath, "LICENSES_THIRD_PARTY.txt");
        } else {
            licensePath = path.join(__dirname, "..", "..", "LICENSES_THIRD_PARTY.txt");
        }

        const licenses = readFileSync(licensePath, "utf-8");

        return { ok: true, data: licenses }
    } catch (error) {
        console.error("Error al leer las licencias", error);

        return {
            ok: false,
            error: "No se pudieron cargar las licencias de terceros"
        }
    }
}