# Frontend Conventions

## Architecture

This project uses **classic browser scripts with no build step**.

- Scripts are loaded via `<script src="...">` tags at the bottom of `templates/index.html`.
- There are no ES modules, no `import`/`export`, no bundler, no npm.
- All functions and variables live in the **global scope**.

### Why ordering matters

`function` declarations are hoisted and become global, so cross-file function calls work regardless of script load order. However, top-level `const`/`let` declarations are **not** hoisted (temporal dead zone), and top-level executable statements run in load order. The safe partition is:

1. **`globals.js`** — loaded first. Contains all top-level `const`/`let` data declarations.
2. **Feature files** — loaded in the middle in any order among themselves. Contain only `function` declarations. No top-level executable statements, no top-level `const`/`let`.
3. **`boot.js`** — loaded last. Contains the only bootstrap executable statements and calls `boot()`.

### Script load order in `index.html`

```
CDN libraries (marked, mermaid, lucide)
globals.js
i18n.js
api.js
render.js
rail.js
viewer.js
glossary.js
editor.js
comments.js
topbar.js
routing.js
events.js
boot.js
```

## File Responsibilities

| File | Contents |
|------|----------|
| `globals.js` | All top-level `const`/`let` declarations: `translations`, `state`, `elements`, `CORE_INSERT_BLOCKS`, etc. No function declarations. |
| `i18n.js` | `t()`, `applyTranslations()`, `createDateFormatter()`, `setLanguage()`, language/date helpers, `rerenderLocalizedContent()` |
| `api.js` | `request()`, `readableError()`, `setStatus()`, `escapeHtml()`, normalize helpers, utility functions (`debounce`, `clampRatio`, etc.) |
| `render.js` | `renderMarkdown()`, `sanitizeHtml()`, `applyWikiLinks()`, `buildWikiLink()`, `resolveGlossaryTerm()`, `applyGlossaryAutolinks()` |
| `rail.js` | Document list/tree (`renderDocumentList()`), filters, taxonomy controls, `loadTaxonomy()`, `loadDocuments()` |
| `viewer.js` | `renderDocumentDetail()`, `renderTermDetail()`, TOC, related terms, glossary index, `selectDocument()`, `selectTerm()` |
| `glossary.js` | Glossary list, term editor (open/submit/close), CRUD, slug preview, used-in, delete, revisions/diff/restore, bulk import |
| `editor.js` | `hydrateEditor()`, ribbon (`setRibbonTab()`, `renderInsertBlocks()`), `applyFormatAction()`, preview, `saveDocument()`, guard dialogs, attachments |
| `comments.js` | Comments drawer, comment CRUD, target capture, `setCommentsOpen()`, `renderCommentComposer()` |
| `topbar.js` | Avatar menu, login/logout, theme (`getInitialTheme()`, `setTheme()`, `toggleTheme()`), settings/autolink, plugins admin, shortcuts, `renderSession()`, `syncFrontendPlugins()` |
| `routing.js` | `parseHashRoute()`, `applyHashRoute()`, `updateHashRoute()`, `onHashChange()`, `setAppMode()`, `setCreatorView()`, `setMobileView()`, `setAuxPanel()` |
| `events.js` | `handleClick()`, `handleGlobalKeydown()`, `bindEvents()`, outside-click closers |
| `boot.js` | `dateFormatter = createDateFormatter()`, mermaid init, `applyTranslations()`, `boot()` — the only executable top-level statements |

## Adding New Features

### Adding a function to an existing file

Put the function in the file whose theme best matches (see table above). Prefer correctness over perfect categorization.

### When to create a new file

Create a new feature file when a logical group of functions grows beyond ~600 lines. Add the new `<script>` tag to `templates/index.html` **between** `globals.js` and `boot.js`. The new file must contain only `function` declarations — no top-level executable statements, no top-level `const`/`let`.

### Adding global state

Add new `const`/`let` declarations to `globals.js` only. Never declare top-level variables in feature files.

## Naming Conventions

- **Functions**: `camelCase`.
- **Prefixes by type**:
  - `render*` — updates the DOM from current `state`.
  - `load*` — fetches from the API and updates `state` then re-renders.
  - `set*` — updates a specific piece of `state` and/or DOM attribute.
  - `handle*` — event handlers.
  - `open*` / `close*` — dialog/panel open/close operations.
  - `normalize*` — converts a raw API payload to a normalized shape.
- **`data-action` dispatch**: `handleClick()` in `events.js` dispatches all button clicks via `button.dataset.action`. Add new actions to the `switch` statement there.
- **Constants**: `UPPER_SNAKE_CASE` for module-level constants.

## i18n

- Add translation keys to **both** `en` and `ja` objects in `globals.js` (`translations`).
- Retrieve strings with `t("key")` or `t("key", { placeholder: value })`.
- For plugin-specific strings, they are merged via `frontendPluginTranslations` at runtime.

## Plugins

- Migration files under `plugins/*/migrations/*.sql` are **write-once** — do not modify existing migration files.
- Frontend plugin modules are loaded dynamically via `syncFrontendPlugins()` in `topbar.js`.

## Backend

- Do not touch `static/app.css` or backend Python files when working on frontend JavaScript.
- The server is a Python stdlib HTTP server with no hot-reload; restart is required after backend changes.
