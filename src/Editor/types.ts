/**
 * Core Editor Types
 */

export interface EditorProps {
  /** Callback triggered when editor content changes */
  onChange?: (html: string) => void;
  /** Initial HTML content */
  initialHtml?: string;
  /** Editor configuration options */
  config?: EditorConfig;
}

export interface EditorConfig {
  /** Whether to use debounce for onChange events (default: false) */
  useDebounce?: boolean;
  /** Debounce delay in milliseconds for onChange events */
  debounceMs?: number;
  /** Allowed HTML tags */
  allowedTags?: string[];
  /** Allowed HTML attributes */
  allowedAttributes?: Record<string, string[]>;
}

export interface EditorState {
  /** Current raw text content */
  text: string;
  /** Current HTML output */
  html: string;
  /** Current selection state */
  selection: SelectionState;
}

export interface SelectionState {
  start: number;
  end: number;
}

export interface TransformOptions {
  preserveWhitespace?: boolean;
  handleInlineBreaks?: boolean;
}
