# doc-platform — Claude working notes

Plugin-oriented internal documentation platform. Python 3 **stdlib** HTTP server + SQLite backend; **vanilla JS frontend with NO build step**. No npm, no bundler, no framework.

## Run & verify
- Init DB: `python manage.py init-db`
- Serve: `python manage.py serve --host 127.0.0.1 --port 8000` (seeded logins: admin/admin, editor/editor, viewer/viewer)
- Verify (own this yourself — or run `/verify-all`):
  - `python -m unittest discover -s tests`
  - `python -m unittest discover -s plugins/ict_learning/tests`
  - `node --check` on every changed JS file
  - `python manage.py --database data/_verify.sqlite3 check-plugins` (throwaway DB; delete after)

## Hard rules (detail in `docs/specs/frontend-conventions.md`)
- **No build step**: frontend is plain `<script>` tags in load order `globals.js` → feature files → `boot.js`. Feature files contain ONLY `function` declarations — no top-level `const`/`let`, no top-level executable statements. All shared state lives in `globals.js`.
- **No auto-save**: the editor uses explicit manual save plus an unsaved-changes guard (in-app navigation + `beforeunload`). Never add debounced/interval auto-save.
- **i18n parity**: every user-facing string goes in BOTH the `en` and `ja` maps in `static/js/globals.js`. (A PostToolUse hook checks this.)
- **XSS-safe DOM**: never inject untrusted document/comment/term/attachment text via `innerHTML`; use `textContent`/`createTextNode` (mirror `static/js/highlight.js`).
- **File-size budgets**: respect the budgets in `frontend-conventions.md`. `static/app.css` (~3200) and `app/db.py` (~1950) are over budget — split as a dedicated refactor, don't pile on.
- **Migrations are write-once**: never edit an applied `plugins/*/migrations/*.sql`; add the next-numbered file (a PreToolUse hook enforces this).
- **Backend boundary**: SQL/data shaping lives in `app/db.py`; HTTP/request parsing in `app/server.py` (`handle_*` method per resource).

## Workflow
Implementation may be delegated to sub-agents; the main agent owns running the verification suite above and reviewing the actual diffs before reporting work done. After frontend changes, the `frontend-conventions-reviewer` agent can audit against the rules above.
