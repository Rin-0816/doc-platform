from __future__ import annotations

import json
import sqlite3
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from types import SimpleNamespace

import manage
from app import db
from app.plugins import compatibility, pending_migrations, set_plugin_status, sync_plugins


ROOT = Path(__file__).resolve().parents[1]


class PluginMigrationTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tempdir.name) / "test.sqlite3"
        db.initialize_database(self.db_path)

    def tearDown(self):
        self.tempdir.cleanup()

    def test_compatibility_reports_pending_migrations(self):
        with db.connect(self.db_path) as connection:
            sync_plugins(connection, ROOT / "plugins")
            result = compatibility(connection, "ict_learning", ROOT / "plugins")
            pending = pending_migrations(connection, "ict_learning", ROOT / "plugins")

        migration_check = next(check for check in result["checks"] if check["name"] == "migrations")
        self.assertEqual(result["result"], "WARN")
        self.assertEqual(migration_check["result"], "WARN")
        self.assertEqual([migration["version"] for migration in pending], ["0001"])

    def test_enable_applies_pending_migrations_before_status_changes(self):
        with db.connect(self.db_path) as connection:
            sync_plugins(connection, ROOT / "plugins")
            plugin = set_plugin_status(connection, "ict_learning", True, ROOT / "plugins")
            migration = connection.execute(
                "SELECT version, source FROM schema_migrations WHERE version = ? AND source = ?",
                ("0001", "ict_learning"),
            ).fetchone()
            table = connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
                ("ict_learning_metadata",),
            ).fetchone()
            result = compatibility(connection, "ict_learning", ROOT / "plugins")

        self.assertEqual(plugin["status"], "enabled")
        self.assertEqual(dict(migration), {"version": "0001", "source": "ict_learning"})
        self.assertIsNotNone(table)
        self.assertEqual(result["result"], "OK")

    def test_failed_migration_does_not_enable_plugin_or_record_history(self):
        plugins_root = Path(self.tempdir.name) / "plugins"
        plugin_root = plugins_root / "broken_plugin"
        migration_root = plugin_root / "migrations"
        migration_root.mkdir(parents=True)
        (plugin_root / "manifest.json").write_text(
            json.dumps(
                {
                    "id": "broken_plugin",
                    "name": "Broken Plugin",
                    "version": "0.1.0",
                    "requires_core": ">=0.1.0 <1.0.0",
                    "plugin_api": ">=0.1.0 <1.0.0",
                    "capabilities": [],
                    "migrations": [{"version": "0001", "path": "./migrations/0001_broken.sql"}],
                }
            )
        )
        (migration_root / "0001_broken.sql").write_text(
            "CREATE TABLE broken_plugin_rows (id INTEGER PRIMARY KEY);\nTHIS IS NOT SQL;\n"
        )

        with db.connect(self.db_path) as connection:
            sync_plugins(connection, plugins_root)
            with self.assertRaises(sqlite3.OperationalError):
                set_plugin_status(connection, "broken_plugin", True, plugins_root)
            plugin = connection.execute("SELECT status FROM plugins WHERE id = ?", ("broken_plugin",)).fetchone()
            migration = connection.execute(
                "SELECT version FROM schema_migrations WHERE source = ?", ("broken_plugin",)
            ).fetchone()
            table = connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
                ("broken_plugin_rows",),
            ).fetchone()

        self.assertEqual(plugin["status"], "disabled")
        self.assertIsNone(migration)
        self.assertIsNone(table)


class PluginMigrationCliTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tempdir.name) / "cli.sqlite3"

    def tearDown(self):
        self.tempdir.cleanup()

    def test_check_plugins_reports_pending_migrations_before_init(self):
        output = StringIO()
        with redirect_stdout(output):
            exit_code = manage.command_check_plugins(SimpleNamespace(database=self.db_path))

        results = json.loads(output.getvalue())
        self.assertEqual(exit_code, 1)
        self.assertEqual(results[0]["result"], "WARN")

    def test_init_db_applies_migrations_for_followup_checks(self):
        with redirect_stdout(StringIO()):
            manage.command_init_db(SimpleNamespace(database=self.db_path))
            exit_code = manage.command_check_plugins(SimpleNamespace(database=self.db_path))

        with db.connect(self.db_path) as connection:
            migration = connection.execute(
                "SELECT version, source FROM schema_migrations WHERE version = ? AND source = ?",
                ("0001", "ict_learning"),
            ).fetchone()

        self.assertEqual(exit_code, 0)
        self.assertEqual(dict(migration), {"version": "0001", "source": "ict_learning"})


if __name__ == "__main__":
    unittest.main()
