import {
  FC,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { EditorProps, EditorState, SelectionState } from "./types";
import { transformText } from "./core/transform";
import { sanitizeHtml } from "./core/sanitize";
import { useDebounce } from "../hooks/useDebounce";
import {
  DEFAULT_DEBOUNCE_MS,
  EDITOR_CLASSNAMES,
  SPECIAL_KEYS,
  SPECIAL_CHARS,
} from "./constants";

const Editor: FC<EditorProps> = ({ onChange, initialHtml = "", config }) => {
  const [state, setState] = useState<EditorState>({
    text: "",
    html: "",
    selection: { start: 0, end: 0 },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitializedRef = useRef(false);
  const isProgrammaticChange = useRef(false);

  // Initialize from HTML if provided
  useEffect(() => {
    if (initialHtml && !state.text && !isInitializedRef.current) {
      isInitializedRef.current = true;
      // TODO: Implement HTML to text conversion
      setState((prev) => ({ ...prev, html: initialHtml }));
    }
  }, [initialHtml, state.text]);

  const debouncedOnChange = useDebounce(
    onChange || (() => {}),
    config?.debounceMs || DEFAULT_DEBOUNCE_MS
  );

  const updateContent = (newText: string, newSelection?: SelectionState) => {
    console.log("updateContent - Input:", { newText, newSelection });
    const html = sanitizeHtml(transformText(newText), config);
    console.log("updateContent - Generated HTML:", html);
    setState((prev) => ({
      text: newText,
      html,
      selection: newSelection || prev.selection,
    }));
    if (config?.useDebounce) {
      debouncedOnChange(html);
    } else {
      onChange?.(html);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (isProgrammaticChange.current) {
      isProgrammaticChange.current = false;
      return;
    }
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Directly use the textarea's value without replacement
    updateContent(newValue, { start: cursorPos, end: cursorPos });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === SPECIAL_KEYS.ENTER) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const text = state.text;

      // Calculate new text and cursor position
      const insertChar = e.shiftKey
        ? SPECIAL_CHARS.VERTICAL_TAB
        : SPECIAL_CHARS.NEW_LINE;

      const newText =
        text.slice(0, cursorPos) + insertChar + text.slice(cursorPos);

      // Update state with new text and adjusted cursor
      updateContent(newText, {
        start: cursorPos + 1,
        end: cursorPos + 1,
      });

      // Force sync update with proper character mapping
      isProgrammaticChange.current = true;
      textarea.value = newText
        .replace(SPECIAL_CHARS.VERTICAL_TAB, "\n")
        .replace(SPECIAL_CHARS.NEW_LINE, "\n");
      textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      role="textbox"
      aria-label="Text Editor"
      value={state.text.replace(
        new RegExp(SPECIAL_CHARS.VERTICAL_TAB, "g"),
        SPECIAL_CHARS.NEW_LINE
      )} // Show \n for display
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={EDITOR_CLASSNAMES.container}
    />
  );
};

export default Editor;
