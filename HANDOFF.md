# Handoff

## 1. Project State

`doc-platform` is a standard-Python, plugin-oriented internal documentation platform prototype.

Current phase:

- design documents completed and refined
- next milestone implementation underway
- attachment, comment, plugin migration, official `ict_learning` runtime, and frontend plugin module paths are implemented
- automated tests expanded and passing

## 2. What Exists

### Backend

- `manage.py`
- `app/db.py`
- `app/plugin_runtime.py`
- `app/plugins.py`
- `app/server.py`

Implemented:

- SQLite initialization
- seeded users: `admin`, `editor`, `viewer`
- local session login
- document CRUD
- category, lesson, tag list/create APIs
- revision history, diff, restore
- plugin metadata snapshots in revisions and restore
- glossary read APIs
- image attachment upload/file serving
- comment creation/listing/update/status APIs with target validation
- text comment re-anchoring and orphan handling
- SQLite FTS search with document category/lesson/tag filters and glossary search
- plugin discovery, registry sync, compatibility checks, migration execution
- generic plugin runtime delegation for document plugin data load/save/restore
- plugin frontend module discovery and serving
- `ict_learning` metadata persistence through the plugin runtime when enabled
- static/template serving

### Frontend

- `templates/index.html`
- `static/app.js`
- `static/app.css`

Implemented:

- login form
- document list and search
- document detail rendering
- Markdown preview and Mermaid rendering
- editor view
- compact metadata dialog with title, summary, category, lesson, and tag editing
- revision history and diff controls
- image upload insertion in the editor
- visible comment interactions for document/text/image/Mermaid targets
- ICT learning edit/detail panels when the plugin is enabled
- dynamic frontend plugin module loading for enabled plugins
- plugin panel hosts for viewer, creator, and creator preview
- block insertion menu generated from core/plugin block definitions, placed in the editor toolbar
- glossary panel
- plugin admin panel
- role-aware control hiding
- responsive layout for desktop, tablet, mobile

### Official Plugin Scaffold

- `plugins/ict_learning/manifest.json`
- `plugins/ict_learning/extensions.json`
- `plugins/ict_learning/frontend.js`
- `plugins/ict_learning/runtime.py`
- `plugins/ict_learning/migrations/0001_initial.sql`
- `plugins/ict_learning/templates/ict_learning_document.json`
- `plugins/ict_learning/tests/test_scaffold.py`

Implemented:

- manifest contract
- data-driven extension metadata
- plugin-owned SQLite tables
- runtime metadata contract used through the core plugin host
- frontend module contract for edit/detail panels and plugin-owned translations
- plugin-local tests

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

## 4. Verification Already Run

```bash
python3 -m unittest discover -s tests -v
python3 -m unittest discover -s plugins/ict_learning/tests -v
node --check static/app.js
node --check plugins/ict_learning/frontend.js
python3 manage.py --database /tmp/doc-platform-check.sqlite3 check-plugins
```

Observed result:

- backend tests passed
- plugin scaffold tests passed
- JS syntax check passed
- plugin frontend module syntax check passed
- `ict_learning` compatibility check reports pending migrations before init and `OK` after init

## 5. Important Design Documents

Read in this order when resuming:

1. `docs/requirements/requirements-definition.md`
2. `docs/architecture/system-architecture.md`
3. `docs/specs/api-specification.md`
4. `docs/specs/database-design.md`
5. `docs/specs/plugin-specification.md`
6. `docs/specs/comment-specification.md`
7. `docs/testing/master-test-plan.md`
8. `docs/requirements/traceability-matrix.md`

## 6. Known Gaps

Not yet implemented:

- category, lesson, tag update/delete administration beyond the current list/create API and editor quick-add flow
- glossary create/edit APIs
- real auth provider plugin support beyond documented extension point
- real search provider replacement beyond documented extension point
- full cross-browser manual verification beyond Chrome desktop/mobile
- backup automation and operational tooling

## 7. Known Technical Notes

- Python bytecode cache files are currently present under `app/__pycache__/` and `tests/__pycache__/`.
- The current backend server uses in-memory sessions; restarting the process invalidates sessions.
- The current compatibility checker supports simple SemVer range expressions used by the scaffold plugin.
- SQLite FTS5 is available in the environment and is used by the standard search path.

## 8. Recommended Next Work

Priority order:

1. Add glossary create/edit APIs and related document links
2. Add update/delete administration for categories, lessons, and tags if required beyond the current list/create flow
3. Add real auth provider and search provider runtime support
4. Run remaining cross-browser verification beyond the completed Chrome desktop/mobile pass
5. Add backup automation and operational tooling

## 9. Completion Criteria For The Next Milestone

- editor can create a document with Markdown, image, Mermaid, and ICT metadata
- viewer can search, open, and read that document
- comments can be added to text and images and remain visible after reload
- history and restore work after plugin metadata updates
- plugin enablement applies migrations and surfaces plugin fields in UI
- automated tests cover the new workflows

Remaining before full milestone closure:

- category/lesson/tag update/delete administration beyond editor quick-add
- cross-browser verification beyond the completed Chrome desktop/mobile flow

## 10. Recent Implementation Decisions

- auth baseline: built-in local auth first, future extra providers via plugin
- search baseline: SQLite FTS first, future replacement via provider
- disabled plugin behavior: stop features, keep plugin-owned data
- core/plugin boundary: core owns runtime/frontend hosts, plugin owns runtime, frontend module, field names, UI labels, and validation
- text comment anchoring design: hybrid offset + context
- Mermaid comment support: block-level first
- backup policy in docs: daily backups with retained generations
- UI design workflow: research, generated reference image, then implementation
