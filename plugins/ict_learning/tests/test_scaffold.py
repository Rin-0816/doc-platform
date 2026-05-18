import json
import sqlite3
import unittest
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]


class IctLearningScaffoldTests(unittest.TestCase):
    def test_manifest_declares_required_contract(self):
        manifest = self._load_json("manifest.json")

        self.assertEqual(manifest["id"], "ict_learning")
        self.assertEqual(manifest["version"], "0.1.0")
        self.assertEqual(manifest["requires_core"], ">=0.1.0 <1.0.0")
        self.assertEqual(manifest["plugin_api"], ">=0.1.0 <1.0.0")
        self.assertEqual(
            set(manifest["capabilities"]),
            {
                "document_metadata",
                "templates",
                "view_panels",
                "edit_panels",
                "validators",
                "search_extensions",
            },
        )

    def test_manifest_migration_paths_exist(self):
        manifest = self._load_json("manifest.json")

        for migration in manifest["migrations"]:
            migration_path = PLUGIN_ROOT / migration["path"]
            self.assertTrue(migration_path.is_file(), migration_path)

    def test_manifest_frontend_module_exists(self):
        manifest = self._load_json("manifest.json")

        frontend_path = PLUGIN_ROOT / manifest["frontend"]
        self.assertTrue(frontend_path.is_file(), frontend_path)

    def test_extension_definitions_are_data_driven(self):
        extensions = self._load_json("extensions.json")

        self.assertEqual(extensions["document_metadata"]["table"], "ict_learning_metadata")
        self.assertEqual(
            {content_type["id"] for content_type in extensions["content_types"]},
            {"exercise", "quiz", "troubleshooting"},
        )
        self.assertEqual(
            {search_extension["id"] for search_extension in extensions["search_extensions"]},
            {"difficulty", "required_equipment", "supported_version"},
        )

    def test_initial_migration_uses_plugin_owned_tables(self):
        expected_tables = {
            "ict_learning_metadata",
            "ict_learning_required_equipment",
            "ict_learning_required_software",
            "ict_learning_supported_platforms",
            "ict_learning_exercises",
            "ict_learning_quizzes",
            "ict_learning_troubleshooting",
        }

        connection = sqlite3.connect(":memory:")
        try:
            connection.execute("CREATE TABLE documents (id INTEGER PRIMARY KEY)")
            migration_sql = (PLUGIN_ROOT / "migrations/0001_initial.sql").read_text()
            connection.executescript(migration_sql)
            table_names = {
                row[0]
                for row in connection.execute(
                    "SELECT name FROM sqlite_master WHERE type = 'table'"
                )
            }
        finally:
            connection.close()

        self.assertTrue(expected_tables.issubset(table_names))

    def _load_json(self, relative_path):
        return json.loads((PLUGIN_ROOT / relative_path).read_text())


if __name__ == "__main__":
    unittest.main()
