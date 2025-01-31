/**
 * Replace leading and trailing spaces with &nbsp; entities
 */
export function preserveWhitespace(text: string): string {
  return text.replace(/^\s+|\s+$/g, (spaces) => "&nbsp;".repeat(spaces.length));
}

/**
 * Convert all spaces to &nbsp; entities
 */
export function convertAllSpaces(text: string): string {
  return text.replace(/\s/g, "&nbsp;");
}

/**
 * Normalize whitespace by converting multiple spaces to single space
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ");
}
