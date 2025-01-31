import DOMPurify from "dompurify";
import { EditorConfig } from "../types";

const DEFAULT_ALLOWED_TAGS = ["p", "br", "span"];
const DEFAULT_ALLOWED_ATTRIBUTES = {
  span: ["class"],
};

/**
 * Configure DOMPurify with editor settings
 */
export function configureSanitizer(config?: EditorConfig): DOMPurify.Config {
  return {
    ALLOWED_TAGS: config?.allowedTags || DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: config?.allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    WHOLE_DOCUMENT: false,
    SANITIZE_DOM: true,
  };
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string, config?: EditorConfig): string {
  const sanitizeConfig = configureSanitizer(config);
  return DOMPurify.sanitize(html, sanitizeConfig);
}

/**
 * Escape special HTML characters
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
