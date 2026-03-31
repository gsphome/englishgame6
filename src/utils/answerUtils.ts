/**
 * Normalize answer for comparison: lowercase, collapse whitespace, trim,
 * strip sentence-ending punctuation (.!?) anywhere for leniency.
 */
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.!?]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
