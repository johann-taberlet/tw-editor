/**
 * Editor configuration constants
 */

export const DEFAULT_DEBOUNCE_MS = 100;

export const DEFAULT_ALLOWED_TAGS = ["p", "br", "span"] as const;

export const DEFAULT_ALLOWED_ATTRIBUTES = {
  span: ["class"],
} as const;

export const EDITOR_CLASSNAMES = {
  container:
    "w-full min-h-[200px] p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y",
  toolbar: "flex items-center space-x-2 p-2 border-b",
  button:
    "px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
} as const;

export const SPECIAL_KEYS = {
  ENTER: "Enter",
  TAB: "Tab",
  BACKSPACE: "Backspace",
  DELETE: "Delete",
} as const;

export const SPECIAL_CHARS = {
  VERTICAL_TAB: "\u000B",
  NEW_LINE: "\n",
} as const;
