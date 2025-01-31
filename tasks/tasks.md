# tasks/tasks.md - Development Tasks for Tailwind-Editor

## TE-001: Basic Text Transformation

Status: In Progress  
Priority: High  
Dependencies: None

### Requirements

- Split text by "\n" to create paragraphs <p> or <br> for empty lines
- Preserve whitespace: leading/trailing spaces to &nbsp;
- Handle SHIFT+ENTER as inline <br> in the same paragraph
- Escape special characters (<, >, &)
- Use DOMPurify for sanitization

### Acceptance Criteria

1. Single line "Hello" -> <p>Hello</p>
2. Empty line -> <br>
3. Leading/trailing spaces -> &nbsp; replaced
4. SHIFT+ENTER -> <p>Line<br>Line</p>
5. Characters like < > & -> escaped

### Technical Notes

- Test with Vitest unit specs
- Integrate sanitization in transform function
- Debounced onChange (100ms)

---

## TE-002: Editor Component Tests

Status: Not Started  
Priority: Medium  
Dependencies: TE-001

### Requirements

- Editor updates output on each keystroke (debounced)
- SHIFT+ENTER, ENTER behaviors tested with user events
- Renders sanitized HTML in a preview area (optional)

### Acceptance Criteria

1. Typing text triggers onChange
2. SHIFT+ENTER adds line break in same paragraph
3. ENTER adds new paragraph or <br> for empty line
4. Sanitized HTML output is displayed

### Technical Notes

- Use React Testing Library for integration tests
- Mock DOMPurify as needed
- Snapshots for final HTML output

---

## TE-003: End-To-End Tests

Status: Not Started  
Priority: Medium  
Dependencies: TE-001, TE-002

### Requirements

- Validate user can type multiline text
- Validate large text performance
- Validate copy/paste scenarios
- Validate mobile view

### Acceptance Criteria

1. No lag or crashes for large texts (100+ lines)
2. Copy/paste preserves paragraphs
3. Mobile-friendly rendering (Playwright mobile emulation)
4. Cursor does not jump unpredictably

### Technical Notes

- Use Playwright for e2e
- Test on multiple viewports
- Check final HTML output and console logs for errors
