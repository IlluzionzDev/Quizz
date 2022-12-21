/**
 * Util functions for design purposes
 */

export const trimString = (value: string, maxChars: number, elipsis: boolean = false): string => {
    return value.substring(0, Math.min(maxChars, value.length)) + (elipsis && value.length <= maxChars - 3 ? '...' : '');
}