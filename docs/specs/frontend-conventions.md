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

## File Size Budgets

To keep files reviewable and prevent unbounded growth, each file type has a **soft budget**. Crossing it is not an error — it is a signal to split *before* adding more.

| File type | Soft budget | Action when exceeded |
|-----------|-------------|----------------------|
| JS feature file (`static/js/*.js`) | ~600 lines | Extract a cohesive group of functions into a new feature file (see "When to create a new file"). |
| `globals.js` (data only) | ~1000 lines | Split the `translations` map into a dedicated `i18n-strings.js` loaded before `globals.js`. |
| `static/app.css` | ~2000 lines | Split into multiple stylesheets by concern (see "CSS Organization"). |
| Python module (`app/*.py`) | ~1000 lines | Split by domain into a package or sibling modules (see "Backend"). |
| `templates/index.html` | ~900 lines | Extract large dialog/panel markup into separate partials if a templating mechanism is introduced; until then, keep sections clearly comment-delimited. |

**Currently over budget (split candidates, in priority order):** `static/app.css` (~3200), `app/db.py` (~1950), `static/js/editor.js` (~985), `static/js/globals.js` (~920). Prefer splitting one of these *before* adding substantial new code to it.

The budget is about a single file's responsibility growing too broad — not a hard line count. A 1200-line file with one tight responsibility is healthier than two 600-line files with tangled dependencies. Split along seams that already exist, never to hit a number.

## CSS Organization

`static/app.css` is a single stylesheet (no build step). Keep it navigable:

- Organize top-to-bottom as: **design tokens** (`:root`, `[data-theme="dark"]`) → **base/reset** → **layout** (shell, topbar, rails) → **components** (buttons, dialogs, drawers) → **feature blocks** (editor, viewer, glossary, comments, diff) → **animations/utilities**.
- Mark each major section with a banner comment (`/* ===== Editor ===== */`) so sections are greppable.
- Define colors only as CSS variables in the token blocks; never hard-code a hex value inside a feature rule. New theme-dependent colors get a `--token` in **both** `:root` and `[data-theme="dark"]`.

**When `app.css` exceeds ~2000 lines**, split it into multiple stylesheets loaded with separate `<link>` tags in `index.html` (NOT `@import`, which serializes requests). A clean split is `tokens.css` (variables + base), `layout.css` (shell/topbar/rails), `components.css` (buttons/dialogs/drawers), and `features.css` (editor/viewer/glossary/comments/diff). Load order is tokens → layout → components → features so later files can rely on earlier variables.

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

### Backend module organization

- `app/db.py` is the data-access layer; `app/server.py` is the HTTP router (`handle_*` methods per resource). Keep HTTP/request parsing in `server.py` and SQL/data shaping in `db.py` — do not write SQL in the server or parse requests in the db layer.
- Group related `db.py` functions by domain (documents, revisions, comments, attachments, glossary/terms, taxonomy, settings, plugins) and keep each domain's functions contiguous, in the order: read → create → update → delete → helpers.
- **When `db.py` exceeds ~1000 lines** (it currently does, ~1950), promote it to a `db/` package and split by the domains above (`db/documents.py`, `db/glossary.py`, `db/attachments.py`, …) re-exported from `db/__init__.py`, OR split into sibling modules (`db_documents.py`, …). Keep the public function names stable so callers in `server.py` and tests don't change. Do this as a dedicated refactor with the test suite green before and after — not bundled into a feature change.
- New endpoints: add a `handle_<resource>` method dispatched from the top-level router rather than growing one giant handler.

### Migrations

- Schema lives in `db.py` via `CREATE TABLE IF NOT EXISTS`; re-running `init-db` is the upgrade path.
- Plugin migration files under `plugins/*/migrations/*.sql` are **write-once** (enforced by `.claude/hooks/block_applied_migration_edit.py`).
