# docs/technical.md - Technical Specifications and Patterns

## Overview

We are building a React-based rich text editor using Tailwind CSS, focusing on correct HTML output with semantic paragraph tags, handling empty lines, whitespace preservation, and special characters. The editor will:

- Provide a multiline text input area for users
- Convert input into sanitized, properly structured HTML
- Emit changes via an onChange callback

## Key Libraries & Tools

- React (TypeScript)
- Tailwind CSS for styling
- DOMPurify for sanitization
- Vite for build tooling
- Vitest + vitest-browser-react exclusively for testing

## Requirements Recap

1. Transform input text into correct HTML:
   - Paragraphs for normal lines
   - <br> for empty lines
   - <p> with preserved leading/trailing spaces as &nbsp;
2. Special characters such as <, >, & should be escaped.
3. Sanitization:
   - Only allow <p>, <br>, <span> (with class attribute)
   - Strip all other tags
4. Maintain minimal SHIFT+ENTER logic (insert <br> in the same paragraph).
5. Provide debounced onChange events (100ms).
6. TDD approach:
   - Write unit tests for transformation logic
   - Write integration tests for Editor component
   - Write e2e tests for user interactions

## Coding Standards

- Strict TypeScript with noImplicitAny
- Keep all React components with functional style + Hooks
- Use "Editor" as the main component
- Use descriptive naming for transform helper functions (e.g., `transformInputToHTML`)

## Testing Strategy

1. **Unit Tests (Vitest + React Testing Library)**
   - Each transformation function must have focused tests
   - Edge-case coverage for whitespace handling, empty lines, special characters
2. **Component Tests**
   - Editor component states, user typing, SHIFT+ENTER, ENTER
   - Cursor position preservation if possible
3. **End-to-End Tests (Playwright)**
   - Full user flows for typing, multi-line text, copy/paste
   - Large documents to ensure performance
   - Behavior on mobile form factors

## Security Considerations

- Implement DOMPurify for each text transformation output
- Strip disallowed attributes
- Thoroughly test for injection attempts

## Performance

- Use debouncing (100ms) in onChange
- Keep transformations efficient for 100+ lines of text

## Deployment

- Publish as an npm package "tailwind-editor"
- Provide minimal configuration:
  ```jsx
  import Editor from 'tailwind-editor';
  ...
  <Editor html={html} onChange={setHtml} />
  ```
- Ensure minimal overhead and tree-shaking capabilities

## File Structure

```
src/
├── Editor/
│   ├── index.tsx                 # Main Editor component
│   ├── types.ts                  # TypeScript interfaces and types
│   ├── constants.ts              # Constants and configuration
│   ├── components/
│   │   └── Toolbar/             # Future toolbar implementation
│   │       ├── index.tsx
│   │       └── types.ts
│   └── core/                     # EditorCore module
│       ├── index.ts             # Core exports
│       ├── transform.ts         # Text transformation logic
│       ├── sanitize.ts         # DOMPurify integration
│       ├── cursor.ts           # Cursor position management
│       └── utils/
│           ├── whitespace.ts    # Whitespace handling
│           └── html.ts          # HTML manipulation utilities
├── hooks/
│   └── useDebounce.ts           # Debounced onChange hook
├── utils/
│   └── dom.ts                   # DOM-related utilities
└── types/
    └── editor.ts                # Shared type definitions

tests/
├── unit/
│   ├── Editor/
│   │   ├── core/
│   │   │   ├── transform.spec.ts
│   │   │   ├── sanitize.spec.ts
│   │   │   └── cursor.spec.ts
│   │   └── components/
│   │       └── Toolbar.spec.ts
├── integration/
│   └── Editor.spec.tsx
└── e2e/
    └── editor.spec.ts
```

## Module Responsibilities

1. **Editor Component (`src/Editor/index.tsx`)**

   - Main React component
   - State management
   - Event handling
   - Component composition

2. **EditorCore (`src/Editor/core/`)**

   - Text transformation logic
   - HTML sanitization
   - Cursor position management
   - Pure functions for core operations

3. **Toolbar (`src/Editor/components/Toolbar/`)**

   - Future implementation
   - Format controls
   - Style modifications

4. **Utilities**
   - Reusable helper functions
   - DOM manipulation
   - Type definitions
   - Custom hooks

## Implementation Strategy

1. **Phase 1: Core Refactoring**

   - Split current logic into separate modules
   - Implement proper sanitization
   - Add comprehensive unit tests

2. **Phase 2: Performance Optimization**

   - Implement proper debouncing
   - Optimize large document handling
   - Add performance tests

3. **Phase 3: Toolbar Integration**
   - Implement toolbar component
   - Add formatting capabilities
   - Extend test coverage
