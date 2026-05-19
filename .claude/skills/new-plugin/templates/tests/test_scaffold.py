import json
import sqlite3
import unittest
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]


class {{PLUGIN_ID}}ScaffoldTests(unittest.TestCase):
    def test_manifest_declares_required_contract(self):
        manifest = self._load_json("manifest.json")

        self.assertEqual(manifest["id"], "{{PLUGIN_ID}}")
        self.assertEqual(manifest["version"], "0.1.0")
        self.assertEqual(manifest["requires_core"], ">=0.1.0 <1.0.0")
        self.assertEqual(manifest["plugin_api"], ">=0.1.0 <1.0.0")

    def test_manifest_migration_paths_exist(self):
        manifest = self._load_json("manifest.json")
        for migration in manifest["migrations"]:
            self.assertTrue((PLUGIN_ROOT / migration["path"]).is_file())

    def test_manifest_frontend_module_exists(self):
        manifest = self._load_json("manifest.json")
        self.assertTrue((PLUGIN_ROOT / manifest["frontend"]).is_file())

    def test_initial_migration_creates_metadata_table(self):
        connection = sqlite3.connect(":memory:")
        try:
            connection.execute("CREATE TABLE documents (id INTEGER PRIMARY KEY)")
            connection.executescript((PLUGIN_ROOT / "migrations/0001_initial.sql").read_text())
            tables = {
                row[0]
                for row in connection.execute(
                    "SELECT name FROM sqlite_master WHERE type = 'table'"
                )
            }
        finally:
            connection.close()
        self.assertIn("{{PLUGIN_ID}}_metadata", tables)

    def _load_json(self, relative_path):
        return json.loads((PLUGIN_ROOT / relative_path).read_text())


if __name__ == "__main__":
    unittest.main()
