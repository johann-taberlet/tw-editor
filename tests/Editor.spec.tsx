import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-react";
import Editor from "@/Editor";
import { DEFAULT_DEBOUNCE_MS } from "@/Editor/constants";
import {
  waitForDebounce,
  typeText,
  pressShiftEnter,
  pressEnter,
  clearAndType,
  typeWithShiftEnter,
  setEditorElement,
} from "./test-utils";

describe("Editor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Basic Input", () => {
    it("should handle input events correctly", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      // Type a single character and verify onChange was called
      await typeText("a");
      await waitForDebounce();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith("<p>a</p>");

      // Type another character and verify onChange was called again
      await typeText("b");
      await waitForDebounce();
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith("<p>ab</p>");
    });
  });

  describe("Text Transformation", () => {
    it("should wrap single line text in a paragraph tag", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("Hello World");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<p>Hello World</p>");
    });

    it("should create a br tag for empty lines", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await pressEnter();
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<br>");
    });

    it("should handle multiple paragraphs separated by newlines", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("First paragraph");
      await waitForDebounce();
      await pressEnter();
      await typeText("Second paragraph");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith(
        "<p>First paragraph</p><p>Second paragraph</p>"
      );
    });

    it("should handle mixed content with empty lines", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("First paragraph");
      await waitForDebounce();
      await pressEnter();
      await pressEnter();
      await typeText("Second paragraph");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith(
        "<p>First paragraph</p><br><p>Second paragraph</p>"
      );
    });

    describe("Whitespace Preservation", () => {
      it("should preserve leading spaces using &nbsp;", async () => {
        const onChange = vi.fn();
        const { getByRole } = render(<Editor onChange={onChange} />);
        const editor = getByRole("textbox", { name: "Text Editor" });
        setEditorElement(editor);

        await typeText("   Hello");
        await waitForDebounce();

        expect(onChange).toHaveBeenLastCalledWith(
          "<p>&nbsp;&nbsp;&nbsp;Hello</p>"
        );
      });

      it("should preserve trailing spaces using &nbsp;", async () => {
        const onChange = vi.fn();
        const { getByRole } = render(<Editor onChange={onChange} />);
        const editor = getByRole("textbox", { name: "Text Editor" });
        setEditorElement(editor);

        await typeText("Hello   ");
        await waitForDebounce();

        expect(onChange).toHaveBeenLastCalledWith(
          "<p>Hello&nbsp;&nbsp;&nbsp;</p>"
        );
      });

      it("should preserve both leading and trailing spaces", async () => {
        const onChange = vi.fn();
        const { getByRole } = render(<Editor onChange={onChange} />);
        const editor = getByRole("textbox", { name: "Text Editor" });
        setEditorElement(editor);

        await typeText("  Hello  ");
        await waitForDebounce();

        expect(onChange).toHaveBeenLastCalledWith(
          "<p>&nbsp;&nbsp;Hello&nbsp;&nbsp;</p>"
        );
      });

      it("should preserve spaces in multiple paragraphs", async () => {
        const onChange = vi.fn();
        const { getByRole } = render(<Editor onChange={onChange} />);
        const editor = getByRole("textbox", { name: "Text Editor" });
        setEditorElement(editor);

        await typeText("  First  ");
        await waitForDebounce();
        await pressEnter();
        await typeText("  Second  ");
        await waitForDebounce();

        expect(onChange).toHaveBeenLastCalledWith(
          "<p>&nbsp;&nbsp;First&nbsp;&nbsp;</p><p>&nbsp;&nbsp;Second&nbsp;&nbsp;</p>"
        );
      });

      it("should handle only spaces input", async () => {
        const onChange = vi.fn();
        const { getByRole } = render(<Editor onChange={onChange} />);
        const editor = getByRole("textbox", { name: "Text Editor" });
        setEditorElement(editor);

        await typeText("   ");
        await waitForDebounce();

        expect(onChange).toHaveBeenLastCalledWith("<br>");
      });
    });
  });

  describe("Enter vs Shift+Enter Behavior", () => {
    it("should handle regular Enter with new paragraphs", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("First line");
      await waitForDebounce();
      await pressEnter();
      await typeText("Second line");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith(
        "<p>First line</p><p>Second line</p>"
      );
    });

    it("should handle Shift+Enter at end of paragraph", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("Hello");
      await waitForDebounce();
      await pressShiftEnter();
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<p>Hello<br></p>");
    });

    it("should handle Shift+Enter at start of paragraph", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await pressShiftEnter();
      await typeText("Hello");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<p><br>Hello</p>");
    });

    it("should handle Shift+Enter in empty paragraph", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await pressShiftEnter();
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<br>");

      await pressShiftEnter();
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<br>");
    });

    it("should handle backspace after Shift+Enter correctly", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("A");
      await waitForDebounce();
      await pressShiftEnter();
      await typeText("B");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<p>A<br>B</p>");

      await typeText("{Backspace}");
      await typeText(" B");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<p>A B</p>");
    });

    it("should handle multiple Shift+Enter presses maintaining paragraph structure", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("A");
      // await waitForDebounce();
      await pressShiftEnter();
      await typeText("B");
      // await waitForDebounce();
      await pressShiftEnter();
      await typeText("C");
      // await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<p>A<br>B<br>C</p>");
    });

    it("should maintain paragraph structure when using Shift+Enter across paragraphs", async () => {
      const onChange = vi.fn();
      const { getByRole } = render(<Editor onChange={onChange} />);
      const editor = getByRole("textbox", { name: "Text Editor" });
      setEditorElement(editor);

      await typeText("One");
      await pressEnter();
      await typeText("Two");
      await waitForDebounce();
      expect(onChange).toHaveBeenLastCalledWith("<p>One</p><p>Two</p>");

      await pressShiftEnter();
      await typeText("More");
      await waitForDebounce();

      expect(onChange).toHaveBeenLastCalledWith("<p>One</p><p>Two<br>More</p>");
    });

    // it("should handle mixed Enter and Shift+Enter inputs", async () => {
    //   const onChange = vi.fn();
    //   const { getByRole } = render(<Editor onChange={onChange} />);
    //   const editor = getByRole("textbox", { name: "Text Editor" });
    //   setEditorElement(editor);

    //   await typeText("First");
    //   await waitForDebounce();
    //   expect(onChange).toHaveBeenLastCalledWith("<p>First</p>");

    //   await clearAndType("First");
    //   await waitForDebounce();
    //   await typeWithShiftEnter("First", "line");
    //   await waitForDebounce();

    //   expect(onChange).toHaveBeenLastCalledWith("<p>First<br>line</p>");

    //   await pressEnter();
    //   await typeText("Second");
    //   await waitForDebounce();
    //   expect(onChange).toHaveBeenLastCalledWith(
    //     "<p>First<br>line</p><p>Second</p>"
    //   );

    //   await pressShiftEnter();
    //   await typeText("line");
    //   await waitForDebounce();
    //   expect(onChange).toHaveBeenLastCalledWith(
    //     "<p>First<br>line</p><p>Second<br>line</p>"
    //   );
    // });
  });

  describe("Debounce Behavior", () => {
    //   it("should debounce onChange calls with default delay", async () => {
    //     const onChange = vi.fn();
    //     const { getByRole } = render(<Editor onChange={onChange} />);
    //     const editor = getByRole("textbox", { name: "Text Editor" });
    //     setEditorElement(editor);
    //     await typeText("H");
    //     await typeText("e");
    //     await typeText("l");
    //     await typeText("l");
    //     await typeText("o");
    //     expect(onChange).not.toHaveBeenCalled();
    //     await waitForDebounce();
    //     expect(onChange).toHaveBeenCalledTimes(1);
    //     expect(onChange).toHaveBeenLastCalledWith("<p>Hello</p>");
    //   });
    // it("should respect custom debounce delay", async () => {
    //   const onChange = vi.fn();
    //   const customDelay = 200;
    //   const { getByRole } = render(
    //     <Editor onChange={onChange} config={{ debounceMs: customDelay }} />
    //   );
    //   const editor = getByRole("textbox", { name: "Text Editor" });
    //   setEditorElement(editor);
    //   await typeText("Hello");
    //   await waitForDebounce();
    //   expect(onChange).not.toHaveBeenCalled();
    //   await waitForDebounce();
    //   expect(onChange).toHaveBeenCalledTimes(1);
    //   expect(onChange).toHaveBeenLastCalledWith("<p>Hello</p>");
    // });
    // it("should cancel pending debounced calls on new input", async () => {
    //   const onChange = vi.fn();
    //   const { getByRole } = render(<Editor onChange={onChange} />);
    //   const editor = getByRole("textbox", { name: "Text Editor" });
    //   setEditorElement(editor);
    //   await typeText("Hello");
    //   await vi.advanceTimersByTimeAsync(DEFAULT_DEBOUNCE_MS / 2);
    //   expect(onChange).not.toHaveBeenCalled();
    //   await typeText(" World");
    //   await vi.advanceTimersByTimeAsync(DEFAULT_DEBOUNCE_MS / 2);
    //   expect(onChange).not.toHaveBeenCalled();
    //   await vi.advanceTimersByTimeAsync(DEFAULT_DEBOUNCE_MS);
    //   expect(onChange).toHaveBeenCalledTimes(1);
    //   expect(onChange).toHaveBeenLastCalledWith("<p>Hello World</p>");
    // });
  });
});
