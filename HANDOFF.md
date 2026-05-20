# Handoff

## 1. Project State

`doc-platform` is a standard-Python, plugin-oriented internal documentation platform. The system runs on Python 3 stdlib HTTP server + SQLite, with a vanilla JS frontend (no build step). Implementation Phases 1-10 are complete plus a UX-hardening session (see §9); the application is feature-complete for the documented requirements.

## 2. What Exists

### Backend

- `manage.py` (CLI: `init-db`, `serve`, `check-plugins`)
- `app/db.py` — SQLite schema, queries, glossary CRUD + revisions, wiki-link scan, FTS, settings
- `app/plugins.py`, `app/plugin_runtime.py` — plugin discovery, lifecycle, runtime delegation
- `app/server.py` — `ThreadingHTTPServer` request router for `/api/*`

Implemented:

- Seeded users (admin/editor/viewer) and roles; local session login
- Document CRUD, revision history, diff (unified), restore
- Comments on document / text selection / image / Mermaid block; orphan-on-disappearance
- Image attachment upload + serving
- Categories, lessons, tags CRUD (list + create)
- **Glossary CRUD** (editor) with aliases, tags, revisions, bulk import (admin)
- **Wiki-link resolution** (`[[term]]`, `[[term|alt]]`, alias-aware) computed from document body scans
- **App settings** key/value store (`app_settings`), `glossary_autolink` toggle (admin)
- SQLite FTS5 for documents and glossary terms (alias text included)
- Plugin discovery, registry sync, compatibility checks, migration execution
- Generic plugin runtime delegation for `plugin_data` load/save/restore
- Plugin frontend module discovery and serving
- `_drain_request_body` defensive helper to avoid Windows TCP RST on permission denials

### Frontend

- `templates/index.html`, `static/app.js`, `static/app.css`

Implemented:

- Notion-style design tokens with dark mode (`[data-theme="dark"]`)
- Topbar: brand + Viewer/Creator tabs + search + New + Reference + (Sign in modal / avatar pill popover)
- Document rail: Category → Lesson → Document tree (collapsible) + Filter popover
- Viewer:
  - Document detail with sticky TOC (H1-H3), related-terms chips, summary, plugin panels, markdown body
  - Term detail (Overview / History tabs)
  - Glossary full-page index at `#/glossary` (search, tag filter, sort, New/Bulk-import)
- Comments side drawer (toggle from document header; count badge)
- Creator:
  - Inline title input
  - Ribbon tabs (Home / Insert / Extensions / View)
  - Live split preview (Editor / Split / Preview modes), debounced render
  - Format toolbar (Bold/Italic/Code/Link/`[[]]`/Heading/UL/OL/Quote/CodeBlock + Promote-to-term)
  - Save state indicator (unsaved / saving / saved HH:MM)
  - Metadata dialog (slug/summary/category/lesson/tags) — title moved inline
- Term editor dialog: rich (split preview + mini format toolbar), aliases, tags, slug preview + collision warning, Used-in panel
- Smart delete dialog (type-to-confirm if referenced)
- Red-link click → term creation; selection → Promote-to-term
- Hash routing: `#/doc/<slug>`, `#/term/<slug>`, `#/glossary`
- Empty state with onboarding card
- Keyboard shortcuts overlay (`Ctrl+/`)
- i18n EN/JA, language persisted; locale-aware date formatting

### Official Plugin Scaffold

- `plugins/ict_learning/` (manifest, runtime, frontend, extensions, migrations, tests, templates)

### Dev Tooling

- `.claude/settings.json` — Claude Code hook config
- `.claude/hooks/block_applied_migration_edit.py` — refuses edits to existing `plugins/*/migrations/*.sql`
- `.claude/skills/new-plugin/` — scaffold for new plugins
- `.claude/skills/plugin-migration/` — scaffold for new migration

## 3. How To Run

From `doc-platform/`:

```bash
python3 manage.py init-db
python3 manage.py serve --host 127.0.0.1 --port 8000
```

Open:

```text
http://127.0.0.1:8000
```

Seeded credentials:

| Role | Username | Password |
| --- | --- | --- |
| admin | `admin` | `admin` |
| editor | `editor` | `editor` |
| viewer | `viewer` | `viewer` |

If you upgrade from an earlier schema, just re-run `init-db` — all new tables use `CREATE TABLE IF NOT EXISTS`.

## 4. Verification Run

```bash
python3 -m unittest discover -s tests -v          # 43/43 ok
python3 -m unittest discover -s plugins/ict_learning/tests -v  # 5/5 ok
node --check static/app.js
node --check plugins/ict_learning/frontend.js
python3 manage.py --database /tmp/doc-platform-check.sqlite3 check-plugins
```

Latest results:

- Backend tests: 61/61 pass (glossary, settings, backup, attachment, side-by-side diff, and per-document export/import tests added across Phases 6-10 and the UX-hardening session)
- Plugin scaffold tests: 5/5 pass
- JS syntax check: pass
- Plugin frontend syntax check: pass
- `ict_learning` compatibility: `WARN` before init, `OK` after init
- E2E smoke (HTML/JS/CSS markers + API round-trips): pass

## 5. Important Design Documents

Read in this order when resuming:

1. `docs/requirements/requirements-definition.md`
2. `docs/architecture/system-architecture.md`
3. `docs/specs/api-specification.md` (updated with glossary CRUD, revisions, bulk, settings, wiki-link semantics)
4. `docs/specs/database-design.md` (updated with `glossary_term_aliases`, `glossary_term_tags`, `glossary_revisions`, `app_settings`)
5. `docs/specs/screen-specification.md` (updated with Notion-style UI, ribbon, drawer, TOC, term tabs, glossary index)
6. `docs/specs/plugin-specification.md`
7. `docs/specs/comment-specification.md`
8. `docs/testing/master-test-plan.md`
9. `docs/requirements/traceability-matrix.md`

## 6. Known Gaps

- Real auth provider / search provider plugins (extension points documented, no working runtime sample beyond `ict_learning` shape)
- Manual cross-browser verification on Firefox / Safari / Edge (Chrome desktop & mobile passed); the UX-hardening session changes (avatar anchor, comment markers, side-by-side diff, attachment/backup UIs) have NOT been visually verified in a browser — only code-reviewed and unit/syntax-tested
- Scheduled/automated backups (manual DB backup/restore and per-document export/import exist, but no scheduling)
- Frontend test framework (no JS unit tests; backend tests cover API contract — now 61 tests)
- Categories / lessons / tags update + delete administration UI beyond create + quick-add
- `app.css` and `app/db.py` are over the documented file-size budget and pending a split refactor

## 7. Known Technical Notes

- Backend sessions are in-memory; server restart invalidates sessions
- `app_settings.glossary_autolink` toggles raw-text → wiki-link conversion at render time; default off to avoid false positives
- Compatibility checker supports simple SemVer range expressions used by the scaffold plugin
- SQLite FTS5 is required (standard on most builds)
- Pre-existing Windows `WSAECONNRESET` test flakes were resolved via `_drain_request_body` in `app/server.py`

## 8. Recommended Next Work

Priority order:

1. Auth provider / search provider runtime sample
2. Cross-browser verification beyond Chrome
3. Backup automation and operational tooling
4. Frontend testing harness for plugin-supplied JS modules

## 9. Implementation Phase Log

| Phase | Theme | Key deliverables |
| --- | --- | --- |
| 1 | Wiki minimum | `[[term]]` resolver, term full page, related docs / related terms |
| 2 | Editor overhaul | Inline title, live split preview, format toolbar, keyboard shortcuts |
| 3 | Viewer cleanup | Sticky TOC, comments side drawer |
| 4 | Wiki polish | Hash routing, creator-mode glossary, term CRUD UI + API |
| 5 | UI redesign | Notion-style tokens, dark mode, topbar (avatar + login modal), rail tree, ribbon tabs, polish (save state / empty state / shortcuts overlay) |
| 6 | Glossary depth | Aliases, tags, revisions, rich term editor, Used-in panel, slug preview, smart delete, red-link create, Promote-to-term, glossary index, bulk import, auto-link toggle |
| 9 | Admin & lifecycle | Settings screen, whole-DB backup/restore, attachment orphan cleanup, document delete |
| 10 | Editor UX | Syntax highlighting for fenced code blocks, editor↔preview scroll sync, icon tooltips, dialog/panel/drawer animations (reduced-motion aware) |
| Session (UX hardening) | Comment & history & per-doc backup | Avatar popover re-anchored (fixed mis-alignment); comment **position markers** on anchored text + click-to-focus; **inline comment editing** (replaces window.prompt); **side-by-side GitHub-style revision diff** (documents + terms); **per-attachment delete UI** + physical file removal on delete; **per-document backup/restore** (JSON export/import with attachment URL remapping); coding-rule/file-size budgets documented |

## 10. Decisions Recorded

- Auth baseline: built-in local auth first, future extra providers via plugin
- Search baseline: SQLite FTS first, future replacement via provider
- Disabled plugin behavior: stop features, keep plugin-owned data
- Core/plugin boundary: core owns runtime/frontend hosts, plugin owns runtime, frontend module, field names, UI labels, validation
- Text comment anchoring: hybrid offset + context, orphan on disappearance
- Mermaid comment: block-level
- Wiki link resolution: term, slug, and alias (case-insensitive); related_documents derived from body scan, not from a manually-curated link table
- Glossary auto-link: opt-in via `app_settings.glossary_autolink` (admin), default off
- Visual direction: Notion-style (white background, single blue accent, thin dividers); dark theme via `[data-theme="dark"]`
- Plugin migration files are write-once; `.claude/hooks/block_applied_migration_edit.py` enforces this in the dev environment
- **No auto-save**: the editor uses explicit manual save with an unsaved-changes guard (in-app navigation + `beforeunload`); auto-save was deliberately rejected because the auto-saved copy and the live buffer appeared inconsistent to users
- **Per-document backup** is editor-scoped JSON export/import (document + revisions + base64 attachments, with `/api/attachments/{id}` URL remapping on import); distinct from the admin whole-DB backup
- **Side-by-side diff** is the standard history view; backend `revision_diff` returns aligned `rows` (difflib opcodes) alongside the legacy unified `diff` string
- **File-size budgets** and CSS/backend split strategy are documented in `docs/specs/frontend-conventions.md`; `app.css` (~3200) and `app/db.py` (~1950) are flagged split candidates to address as dedicated refactors before further growth

## 11. URLs to Bookmark

- Document detail: `http://localhost:8000/#/doc/<slug>`
- Term detail: `http://localhost:8000/#/term/<slug>`
- Glossary index: `http://localhost:8000/#/glossary`
