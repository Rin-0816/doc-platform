---
name: new-plugin
description: Scaffold a new doc-platform plugin (manifest, extensions, runtime, frontend, initial migration, tests) following the ict_learning reference layout. Use when the user asks to create a new plugin or add an official extension under plugins/.
disable-model-invocation: true
---

# new-plugin

Create a new plugin under `plugins/<plugin_id>/` that conforms to the project's
plugin contract (see `docs/plugin-guide/plugin-development-guide.md`).

## Required inputs

Ask the user for, or infer from the request, these values before writing files:

- `plugin_id` — snake_case identifier (e.g. `quiz_bank`). Used as directory name and manifest `id`.
- `name` — human-readable display name (e.g. `Quiz Bank`).
- `description` — one-sentence summary for the manifest.
- `capabilities` — subset of `document_metadata`, `templates`, `view_panels`, `edit_panels`, `validators`, `search_extensions`, `content_types`, `auth_provider`, `search_provider`. Default to `["document_metadata", "view_panels", "edit_panels"]` if unspecified.

The `requires_core` and `plugin_api` fields are pinned to the current contract
(`>=0.1.0 <1.0.0`). Update both if the project bumps `CORE_VERSION` /
`PLUGIN_API_VERSION` in `app/plugins.py`.

## Steps

1. Confirm `plugins/<plugin_id>/` does not exist. If it does, stop and ask.
2. Render each file in `templates/` into `plugins/<plugin_id>/`, replacing the
   placeholders below. Keep file layout identical to `plugins/ict_learning/`:
   - `manifest.json`
   - `extensions.json`
   - `runtime.py`
   - `frontend.js`
   - `migrations/0001_initial.sql`
   - `tests/__init__.py` (empty)
   - `tests/test_scaffold.py`
3. Placeholders to substitute in every template:
   - `{{PLUGIN_ID}}` — the `plugin_id` value
   - `{{PLUGIN_NAME}}` — the `name` value
   - `{{PLUGIN_DESCRIPTION}}` — the `description` value
   - `{{CAPABILITIES_JSON}}` — JSON array of capability strings
4. After writing files, run:
   - `python manage.py check-plugins` — must report `OK` for the new plugin.
   - `python -m unittest plugins.<plugin_id>.tests.test_scaffold` — must pass.
5. Show the user the new directory tree and the check-plugins output.

## Contract rules to enforce (from the plugin guide)

- Do not modify core tables. All plugin data lives in tables prefixed with `<plugin_id>_`.
- The initial migration must declare `PRAGMA foreign_keys = ON;` and use
  `CREATE TABLE IF NOT EXISTS` so re-runs are safe.
- `runtime.py` exposes `save_document_data`, `load_document_data`,
  `restore_document_data` only when the plugin opts into `document_metadata`.
  Omit them otherwise.
- `frontend.js` must export `translations` (EN + JA) and register panels via
  the host's `panel host` API — do not touch core DOM directly.
- Migration files in `migrations/` are write-once. To change schema later, add
  `0002_*.sql`, `0003_*.sql`, etc., and append entries to `manifest.json`
  `migrations[]`.

## When NOT to use this skill

- The user wants to modify an existing plugin — edit files directly.
- The user wants a plugin migration only — use the `plugin-migration` skill.
