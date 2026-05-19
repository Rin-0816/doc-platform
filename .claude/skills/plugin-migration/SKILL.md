---
name: plugin-migration
description: Add a new SQL migration to an existing plugin under plugins/<id>/migrations/ with the correct version number, and register it in the plugin manifest. Use when the user asks to change a plugin's schema or add a migration.
disable-model-invocation: true
---

# plugin-migration

Add a new migration to an existing plugin while keeping the manifest in sync
and respecting the project's "migrations are write-once" rule.

## Required inputs

Ask the user for, or infer from the request:

- `plugin_id` — directory under `plugins/` (e.g. `ict_learning`).
- `summary` — short snake_case description for the filename (e.g. `add_quiz_tags`).
- `sql` — the schema change. If the user did not provide one, ask them.

## Steps

1. Verify `plugins/<plugin_id>/manifest.json` exists. Fail loudly if not.
2. Read `plugins/<plugin_id>/manifest.json` and list `manifest["migrations"]`.
3. Compute the next version number:
   - Take the max of existing `version` strings as integers.
   - Increment by 1, zero-pad to 4 digits (`0002`, `0003`, ...).
4. Compose the new filename: `plugins/<plugin_id>/migrations/<NNNN>_<summary>.sql`.
5. **Do not edit any existing migration file.** The `block_applied_migration_edit.py`
   hook will refuse Edit/MultiEdit and refuse Write to existing paths. If the
   user wants to change an applied migration, push back and propose a new one.
6. Write the new SQL file. Start with `PRAGMA foreign_keys = ON;` if FKs are
   referenced. Prefer `CREATE TABLE IF NOT EXISTS` / `ALTER TABLE ... ADD COLUMN`
   so the migration is idempotent.
7. Append a new entry to `manifest["migrations"]`:
   ```json
   { "version": "<NNNN>", "path": "./migrations/<NNNN>_<summary>.sql" }
   ```
   Keep the array sorted by version.
8. Run `python manage.py check-plugins`. The plugin's compatibility result must
   stay `OK`. If it does not, stop and surface the error.
9. Run `python -m unittest tests.test_plugin_migrations` and the plugin's own
   `tests/test_scaffold.py` (if present). All must pass.
10. Summarize: the new file path, the manifest diff, and the check-plugins
    result.

## Schema change guidance

- Plugin tables MUST be prefixed with `<plugin_id>_`. Never touch core tables
  (`documents`, `users`, `revisions`, `comments`, `attachments`, etc.).
- SQLite `ALTER TABLE` has limits — it cannot drop columns or change types.
  For destructive changes use the rename-copy-drop pattern in a single
  migration script:
  ```sql
  ALTER TABLE old_table RENAME TO old_table__legacy;
  CREATE TABLE old_table (...);
  INSERT INTO old_table (...) SELECT ... FROM old_table__legacy;
  DROP TABLE old_table__legacy;
  ```
- For FTS5 tables, remember to rebuild the index after data-shape changes:
  `INSERT INTO <fts_table>(<fts_table>) VALUES('rebuild');`

## When NOT to use this skill

- The plugin does not exist yet — use the `new-plugin` skill instead.
- The user wants to revert a migration — explain that migrations are forward-only
  and propose a compensating migration.
