import { userEvent, type Locator } from "@vitest/browser/context";
import { DEFAULT_DEBOUNCE_MS } from "@/Editor/constants";
import { vi } from "vitest";

let editorElement: Locator | null = null;

export const setEditorElement = (element: Locator) => {
  editorElement = element;
};

export const waitForDebounce = async () => {
  // First wait for any pending microtasks (React state updates)
  await vi.advanceTimersByTimeAsync(0);
  // Then wait for the debounce timer
  await vi.advanceTimersByTimeAsync(DEFAULT_DEBOUNCE_MS);
  // Finally wait for any pending microtasks again
  await vi.advanceTimersByTimeAsync(0);
};

export const typeText = async (text: string) => {
  if (!editorElement) {
    throw new Error("Editor element not set. Call setEditorElement first.");
  }

  // First ensure the element is focused
  await editorElement.click();
  await vi.advanceTimersByTimeAsync(0);

  const user = userEvent.setup();

  // Handle special characters
  if (text === "{Backspace}") {
    await user.keyboard("{Backspace}");
    await vi.advanceTimersByTimeAsync(0);
    return;
  }

  // Type the text as a single input to maintain proper cursor position
  await user.type(editorElement, text);
  await vi.advanceTimersByTimeAsync(0);
};

export const pressShiftEnter = async () => {
  if (!editorElement) {
    throw new Error("Editor element not set. Call setEditorElement first.");
  }

  await editorElement.click();
  await vi.advanceTimersByTimeAsync(0);

  const user = userEvent.setup();

  // Use type instead of keyboard to ensure proper event handling
  await user.type(editorElement, "{Shift>}{Enter}{/Shift}");
  await vi.advanceTimersByTimeAsync(0);
};

export const pressEnter = async () => {
  if (!editorElement) {
    throw new Error("Editor element not set. Call setEditorElement first.");
  }

  await editorElement.click();
  await vi.advanceTimersByTimeAsync(0);

  const user = userEvent.setup();

  // Use type instead of keyboard to ensure proper event handling
  await user.type(editorElement, "{Enter}");
  await vi.advanceTimersByTimeAsync(0);
};

export const clearAndType = async (text: string) => {
  if (!editorElement) {
    throw new Error("Editor element not set. Call setEditorElement first.");
  }

  await editorElement.click();
  await vi.advanceTimersByTimeAsync(0);

  const user = userEvent.setup();

  // Clear by selecting all and typing
  await user.type(editorElement, "{Meta>}a{/Meta}");
  await vi.advanceTimersByTimeAsync(0);
  await user.type(editorElement, "{Backspace}");
  await vi.advanceTimersByTimeAsync(0);

  if (text) {
    await user.type(editorElement, text);
    await vi.advanceTimersByTimeAsync(0);
  }
};

export const typeWithShiftEnter = async (text1: string, text2: string) => {
  if (!editorElement) {
    throw new Error("Editor element not set. Call setEditorElement first.");
  }

  await clearAndType(text1);
  await waitForDebounce();

  // Ensure we're at the end of the text before pressing Shift+Enter
  await editorElement.click();
  await vi.advanceTimersByTimeAsync(0);

  const user = userEvent.setup();
  await user.type(editorElement, "{End}");
  await vi.advanceTimersByTimeAsync(0);

  await pressShiftEnter();
  await vi.advanceTimersByTimeAsync(0);

  if (text2) {
    await user.type(editorElement, text2);
    await vi.advanceTimersByTimeAsync(0);
  }
};
