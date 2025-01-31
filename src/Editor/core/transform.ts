import { TransformOptions } from "../types";
import { preserveWhitespace } from "./utils/whitespace";
import { SPECIAL_CHARS } from "../constants";

/**
 * Transform raw text input into HTML with proper paragraph and break tags
 */
export function transformText(
  input: string,
  options: TransformOptions = {}
): string {
  const { preserveWhitespace: shouldPreserveWhitespace = true } = options;

  if (!input.trim()) return "<br>";

  return input
    .split(SPECIAL_CHARS.NEW_LINE)
    .map((paragraph) => {
      const segments = paragraph
        .split(SPECIAL_CHARS.VERTICAL_TAB)
        .map((segment) => {
          const processed = shouldPreserveWhitespace
            ? preserveWhitespace(segment)
            : segment.trim();

          // Preserve empty segments as line breaks but prevent duplicates
          return processed === "" ? "<br>" : processed;
        });

      // Handle leading/trailing breaks and empty paragraphs
      const content = segments.join("<br>").replace(/(^<br>)|(<br>$)/g, ""); // Trim edge breaks

      if (!content) return "<br>";
      if (segments.length === 1 && segments[0] === "<br>") return "<br>";

      return `<p>${content}</p>`;
    })
    .join("");
}

/**
 * Insert an inline break at the specified position
 */
export function insertInlineBreak(text: string, position: number): string {
  if (position < 0 || position > text.length) return text;
  return (
    text.slice(0, position) + SPECIAL_CHARS.VERTICAL_TAB + text.slice(position)
  );
}
