/**
 * Get the type of the file (image or video)
 * 
 * @param {string} path - The path of the file
 * @returns The type of the file (image or video)
 */
export const getMediaType = (path: string): "video" | "image" => {
    return /\.(mp4|mov|webm)$/i.test(path) ? "video" : "image";
}

/**
 * Format the name of the path for the video and img html elements
 * 
 * @param {string} path - The file path
 * @returns The formatted file path with media://
 */
export const toMediaUrl = (path: string): string => {
    const normalized = path.replace(/\\/g, "/");
    return `media://${encodeURIComponent(normalized)}`;
};

/**
 * Get the number of videos and images in the given paths array
 * 
 * @param {string[]} paths - The file paths
 * @returns The number of videos and images of the path array
 */
export const getCountOfMediaTypes = (paths: string[]) => {
    let videoCount = 0;
    let imageCount = 0;

    paths.forEach(path => {
        if (getMediaType(path) === "video") {
            videoCount++;
        } else {
            imageCount++;
        }
    });

    return { videoCount, imageCount }
}