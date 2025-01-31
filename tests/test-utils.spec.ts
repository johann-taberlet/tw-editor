import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  typeText,
  pressShiftEnter,
  pressEnter,
  waitForDebounce,
} from "./test-utils";

describe("Test Utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should simulate typing text", async () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    await typeText("Hello");

    expect(input.value).toBe("Hello");
  });

  it("should simulate pressing Enter", async () => {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();

    await typeText("First line");
    await pressEnter();
    await typeText("Second line");

    expect(textarea.value).toBe("First line\nSecond line");
  });

  it("should simulate pressing Shift+Enter", async () => {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();

    await typeText("First line");
    await pressShiftEnter();
    await typeText("Second line");

    expect(textarea.value).toBe("First line\nSecond line");
  });

  it("should handle waitForDebounce", async () => {
    const callback = vi.fn();
    setTimeout(callback, 300);
    await vi.advanceTimersByTimeAsync(300);

    await waitForDebounce();
    expect(callback).toHaveBeenCalled();
  });
});
