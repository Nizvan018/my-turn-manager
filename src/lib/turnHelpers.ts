/**
 * Format the turn based on the configuration
 * 
 * @param {string | number} prefix - The text before the turn number
 * @param {string | number} number - The number of the turn
 * @param {string | number} numberOfDigits - The number of digits of the turn number
 * @returns The formatted turn
 */
export const turnFormatter = (prefix: string, number: string | number, numberOfDigits: string | number) => {
    return `${prefix}${String(Number(number)).padStart(Number(numberOfDigits), "0")}`;
}
