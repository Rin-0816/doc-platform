from __future__ import annotations

import http.client
import json
import tempfile
import threading
import unittest
from pathlib import Path

from app import db
from app.plugins import apply_pending_migrations, compatibility, enabled_frontend_plugins, set_plugin_status, sync_plugins
from app.server import create_server


ROOT = Path(__file__).resolve().parents[1]


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tempdir.name) / "test.sqlite3"
        db.initialize_database(self.db_path)

    def tearDown(self):
        self.tempdir.cleanup()

    def test_revision_restore_creates_new_revision(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            created = db.create_document(
                connection,
                {"title": "Doc", "slug": "doc", "summary": "one", "content_markdown": "first"},
                editor_id,
            )
            document_id = created["document"]["id"]
            updated = db.update_document(
                connection,
                document_id,
                {"title": "Doc", "slug": "doc", "summary": "two", "content_markdown": "second"},
                editor_id,
            )
            restored = db.restore_revision(connection, created["revision_id"], editor_id)
            revisions = db.list_revisions(connection, document_id)

        self.assertEqual(updated["revision_id"], revisions[1]["id"])
        self.assertEqual(restored["document"]["content_markdown"], "first")
        self.assertEqual(len(revisions), 3)

    def test_plugin_compatibility_reads_manifest(self):
        with db.connect(self.db_path) as connection:
            sync_plugins(connection, ROOT / "plugins")
            apply_pending_migrations(connection, "ict_learning", ROOT / "plugins")
            result = compatibility(connection, "ict_learning")

        self.assertEqual(result["result"], "OK")

    def test_text_comment_reanchors_after_document_update(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            created = db.create_document(
                connection,
                {"title": "Doc", "slug": "doc", "content_markdown": "alpha target omega"},
                editor_id,
            )
            document_id = created["document"]["id"]
            comment = db.create_comment(
                connection,
                document_id,
                {
                    "target_type": "text_selection",
                    "target": {
                        "start_offset": 6,
                        "end_offset": 12,
                        "selected_text": "target",
                        "prefix_context": "alpha ",
                        "suffix_context": " omega",
                    },
                    "body": "Keep this anchored",
                    "revision_id": created["revision_id"],
                },
                editor_id,
            )
            db.update_document(
                connection,
                document_id,
                {"title": "Doc", "slug": "doc", "content_markdown": "intro\nalpha target omega"},
                editor_id,
            )
            updated = db.get_comment(connection, comment["id"])

        self.assertEqual(updated["status"], "open")
        self.assertEqual(updated["target"]["start_offset"], 12)
        self.assertEqual(updated["target"]["end_offset"], 18)

    def test_text_comment_becomes_orphaned_when_target_disappears(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            created = db.create_document(
                connection,
                {"title": "Doc", "slug": "doc", "content_markdown": "alpha target omega"},
                editor_id,
            )
            document_id = created["document"]["id"]
            comment = db.create_comment(
                connection,
                document_id,
                {
                    "target_type": "text_selection",
                    "target": {
                        "start_offset": 6,
                        "end_offset": 12,
                        "selected_text": "target",
                        "prefix_context": "alpha ",
                        "suffix_context": " omega",
                    },
                    "body": "Keep this anchored",
                    "revision_id": created["revision_id"],
                },
                editor_id,
            )
            db.update_document(
                connection,
                document_id,
                {"title": "Doc", "slug": "doc", "content_markdown": "alpha changed omega"},
                editor_id,
            )
            updated = db.get_comment(connection, comment["id"])

        self.assertEqual(updated["status"], "orphaned")

    def test_revision_restore_restores_ict_learning_plugin_data(self):
        with db.connect(self.db_path) as connection:
            sync_plugins(connection, ROOT / "plugins")
            set_plugin_status(connection, "ict_learning", True, ROOT / "plugins")
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            created = db.create_document(
                connection,
                {
                    "title": "Course",
                    "slug": "course",
                    "content_markdown": "v1",
                    "plugin_data": {
                        "ict_learning": {
                            "difficulty": "beginner",
                            "estimated_minutes": 15,
                            "required_equipment": ["Laptop"],
                        }
                    },
                },
                editor_id,
            )
            document_id = created["document"]["id"]
            db.update_document(
                connection,
                document_id,
                {
                    "title": "Course",
                    "slug": "course",
                    "content_markdown": "v2",
                    "plugin_data": {
                        "ict_learning": {
                            "difficulty": "advanced",
                            "estimated_minutes": 45,
                            "required_equipment": ["Server"],
                        }
                    },
                },
                editor_id,
            )
            restored = db.restore_revision(connection, created["revision_id"], editor_id)

        self.assertEqual(restored["document"]["content_markdown"], "v1")
        self.assertEqual(restored["document"]["plugin_data"]["ict_learning"]["difficulty"], "beginner")
        self.assertEqual(restored["document"]["plugin_data"]["ict_learning"]["required_equipment"], ["Laptop"])

    def test_glossary_term_includes_documents_that_link_via_wiki_syntax(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute(
                "SELECT id FROM users WHERE username = 'editor'"
            ).fetchone()["id"]
            tag = db.create_tag(connection, {"name": "Diagrams"})
            referencing = db.create_document(
                connection,
                {
                    "title": "Diagram primer",
                    "slug": "diagram-primer",
                    "content_markdown": "Use [[Mermaid]] for sequence diagrams.",
                    "tag_ids": [tag["id"]],
                },
                editor_id,
            )
            db.create_document(
                connection,
                {
                    "title": "Unrelated",
                    "slug": "unrelated",
                    "content_markdown": "Nothing interesting here.",
                },
                editor_id,
            )
            mermaid_term = connection.execute(
                "SELECT id FROM glossary_terms WHERE slug = 'mermaid'"
            ).fetchone()
            term = db.get_glossary_term(connection, mermaid_term["id"])

        self.assertEqual(term["term"], "Mermaid")
        related_ids = [doc["id"] for doc in term["related_documents"]]
        self.assertEqual(related_ids, [referencing["document"]["id"]])
        self.assertEqual([t["name"] for t in term["related_tags"]], ["Diagrams"])

    def test_glossary_term_resolves_slug_form_and_alt_text(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute(
                "SELECT id FROM users WHERE username = 'editor'"
            ).fetchone()["id"]
            slug_ref = db.create_document(
                connection,
                {
                    "title": "Slug ref",
                    "slug": "slug-ref",
                    "content_markdown": "See [[mermaid]] (lowercase slug match).",
                },
                editor_id,
            )
            alt_ref = db.create_document(
                connection,
                {
                    "title": "Alt ref",
                    "slug": "alt-ref",
                    "content_markdown": "Read [[Mermaid|the diagram tool]] later.",
                },
                editor_id,
            )
            mermaid_term = connection.execute(
                "SELECT id FROM glossary_terms WHERE slug = 'mermaid'"
            ).fetchone()
            term = db.get_glossary_term(connection, mermaid_term["id"])

        related_ids = sorted(doc["id"] for doc in term["related_documents"])
        expected = sorted([slug_ref["document"]["id"], alt_ref["document"]["id"]])
        self.assertEqual(related_ids, expected)

    def test_glossary_term_returns_empty_relations_when_unreferenced(self):
        with db.connect(self.db_path) as connection:
            mermaid_term = connection.execute(
                "SELECT id FROM glossary_terms WHERE slug = 'mermaid'"
            ).fetchone()
            term = db.get_glossary_term(connection, mermaid_term["id"])

        self.assertEqual(term["related_documents"], [])
        self.assertEqual(term["related_tags"], [])

    def test_enabled_plugin_without_runtime_is_ignored(self):
        with db.connect(self.db_path) as connection:
            connection.execute(
                """
                INSERT INTO plugins (id, name, version, status, manifest_json)
                VALUES (?, ?, ?, 'enabled', ?)
                """,
                ("metadata_only", "Metadata Only", "0.1.0", json.dumps({"id": "metadata_only"})),
            )
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            created = db.create_document(
                connection,
                {
                    "title": "No Runtime",
                    "slug": "no-runtime",
                    "plugin_data": {"metadata_only": {"flag": True}},
                },
                editor_id,
            )

        self.assertEqual(created["document"]["plugin_data"], {})

    def test_enabled_frontend_plugins_exposes_declared_module(self):
        with db.connect(self.db_path) as connection:
            sync_plugins(connection, ROOT / "plugins")
            set_plugin_status(connection, "ict_learning", True, ROOT / "plugins")

            plugins = enabled_frontend_plugins(connection)

        self.assertEqual(
            plugins,
            [{"id": "ict_learning", "module_url": "/plugins/ict_learning/frontend.js"}],
        )

    def test_create_glossary_term_assigns_unique_slug(self):
        with db.connect(self.db_path) as connection:
            term1 = db.create_glossary_term(connection, {"term": "Python Language"})
            term2 = db.create_glossary_term(connection, {"term": "Python Language"})

        self.assertEqual(term1["slug"], "python-language")
        self.assertTrue(term2["slug"].startswith("python-language"))
        self.assertNotEqual(term1["slug"], term2["slug"])

    def test_update_glossary_term_changes_fields(self):
        with db.connect(self.db_path) as connection:
            created = db.create_glossary_term(connection, {"term": "Old Term", "description_markdown": "old desc"})
            updated = db.update_glossary_term(connection, created["id"], {"term": "New Term", "description_markdown": "new desc"})

        self.assertEqual(updated["term"], "New Term")
        self.assertEqual(updated["description_markdown"], "new desc")

    def test_delete_glossary_term_returns_true_then_false(self):
        with db.connect(self.db_path) as connection:
            created = db.create_glossary_term(connection, {"term": "Temporary Term"})
            first_delete = db.delete_glossary_term(connection, created["id"])
            second_delete = db.delete_glossary_term(connection, created["id"])

        self.assertTrue(first_delete)
        self.assertFalse(second_delete)

    def test_create_glossary_term_with_aliases_persists_them(self):
        with db.connect(self.db_path) as connection:
            created = db.create_glossary_term(
                connection,
                {"term": "Database", "aliases": ["DB", "RDBMS"]},
            )
            fetched = db.get_glossary_term(connection, created["id"])

        self.assertEqual(len(fetched["aliases"]), 2)
        alias_texts = [a["alias"] for a in fetched["aliases"]]
        self.assertIn("DB", alias_texts)
        self.assertIn("RDBMS", alias_texts)
        alias_slugs = [a["alias_slug"] for a in fetched["aliases"]]
        self.assertIn("db", alias_slugs)
        self.assertIn("rdbms", alias_slugs)

    def test_alias_matching_resolves_documents(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute(
                "SELECT id FROM users WHERE username = 'editor'"
            ).fetchone()["id"]
            term = db.create_glossary_term(
                connection,
                {"term": "Database", "aliases": ["DB"]},
            )
            doc = db.create_document(
                connection,
                {
                    "title": "DB Guide",
                    "slug": "db-guide",
                    "content_markdown": "Use [[DB]] for storage.",
                },
                editor_id,
            )
            fetched = db.get_glossary_term(connection, term["id"])

        related_ids = [d["id"] for d in fetched["related_documents"]]
        self.assertIn(doc["document"]["id"], related_ids)

    def test_alias_uniqueness_across_terms_is_enforced(self):
        with db.connect(self.db_path) as connection:
            db.create_glossary_term(
                connection,
                {"term": "Alpha", "aliases": ["Foo"]},
            )
            with self.assertRaises(ValueError):
                db.create_glossary_term(
                    connection,
                    {"term": "Beta", "aliases": ["Foo"]},
                )

    def test_update_glossary_term_replaces_aliases(self):
        with db.connect(self.db_path) as connection:
            created = db.create_glossary_term(
                connection,
                {"term": "Gamma", "aliases": ["A"]},
            )
            db.update_glossary_term(
                connection,
                created["id"],
                {"aliases": ["B", "C"]},
            )
            fetched = db.get_glossary_term(connection, created["id"])

        alias_texts = [a["alias"] for a in fetched["aliases"]]
        self.assertNotIn("A", alias_texts)
        self.assertIn("B", alias_texts)
        self.assertIn("C", alias_texts)
        self.assertEqual(len(fetched["aliases"]), 2)

    def test_term_tag_assignment(self):
        with db.connect(self.db_path) as connection:
            tag = db.create_tag(connection, {"name": "Infrastructure"})
            term = db.create_glossary_term(
                connection,
                {"term": "Server", "tag_ids": [tag["id"]]},
            )
            fetched = db.get_glossary_term(connection, term["id"])

        self.assertEqual(len(fetched["tags"]), 1)
        self.assertEqual(fetched["tags"][0]["name"], "Infrastructure")
        self.assertEqual(fetched["tags"][0]["id"], tag["id"])

    def test_create_glossary_term_writes_initial_revision(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            term = db.create_glossary_term(
                connection,
                {"term": "Revision Test", "description_markdown": "initial desc"},
                user_id=editor_id,
            )
            revisions = db.list_term_revisions(connection, term["id"])

        self.assertEqual(len(revisions), 1)
        self.assertEqual(revisions[0]["version_number"], 1)
        self.assertEqual(revisions[0]["term"], "Revision Test")
        self.assertEqual(revisions[0]["slug"], term["slug"])

    def test_update_glossary_term_writes_new_revision(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            term = db.create_glossary_term(
                connection,
                {"term": "Update Rev", "description_markdown": "v1"},
                user_id=editor_id,
            )
            db.update_glossary_term(
                connection,
                term["id"],
                {"description_markdown": "v2"},
                user_id=editor_id,
            )
            revisions = db.list_term_revisions(connection, term["id"])

        self.assertEqual(len(revisions), 2)
        # list is DESC, so [0] is newest
        self.assertEqual(revisions[0]["version_number"], 2)
        self.assertEqual(revisions[1]["version_number"], 1)

    def test_restore_glossary_term_revision_reverts_and_creates_new_revision(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            term = db.create_glossary_term(
                connection,
                {"term": "Restore Test", "description_markdown": "version one"},
                user_id=editor_id,
            )
            db.update_glossary_term(
                connection,
                term["id"],
                {"description_markdown": "version two"},
                user_id=editor_id,
            )
            revisions_before = db.list_term_revisions(connection, term["id"])
            v1_id = revisions_before[-1]["id"]  # oldest = v1

            restored = db.restore_term_revision(connection, v1_id, user_id=editor_id)
            revisions_after = db.list_term_revisions(connection, term["id"])

        self.assertEqual(restored["description_markdown"], "version one")
        self.assertEqual(len(revisions_after), 3)
        newest = revisions_after[0]
        self.assertEqual(newest["version_number"], 3)
        self.assertEqual(newest["restored_from_revision_id"], v1_id)

    def test_term_revision_diff_lists_changes(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            term = db.create_glossary_term(
                connection,
                {"term": "Diff Test", "description_markdown": "line one"},
                user_id=editor_id,
            )
            db.update_glossary_term(
                connection,
                term["id"],
                {"description_markdown": "line two"},
                user_id=editor_id,
            )
            revisions = db.list_term_revisions(connection, term["id"])
            v2_id = revisions[0]["id"]
            v1_id = revisions[1]["id"]
            diff_lines = db.term_revision_diff(connection, v2_id, v1_id)

        self.assertIsInstance(diff_lines, list)
        self.assertTrue(len(diff_lines) > 0)

    def test_bulk_upsert_glossary_terms_creates_and_updates(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            # Create an existing term
            existing = db.create_glossary_term(
                connection,
                {"term": "Existing Term", "slug": "existing-term", "description_markdown": "old desc"},
                user_id=editor_id,
            )
            payloads = [
                {"term": "Brand New Term", "slug": "brand-new-term", "description_markdown": "new"},
                {"term": "Existing Term", "slug": "existing-term", "description_markdown": "updated desc"},
            ]
            summary = db.bulk_upsert_glossary_terms(connection, payloads, user_id=editor_id)

            # Verify the updated term has the new description
            updated = db.get_glossary_term(connection, existing["id"])

        self.assertEqual(len(summary["created"]), 1)
        self.assertEqual(len(summary["updated"]), 1)
        self.assertEqual(len(summary["errors"]), 0)
        self.assertIn(existing["id"], summary["updated"])
        self.assertEqual(updated["description_markdown"], "updated desc")

    def test_get_set_setting_roundtrip(self):
        with db.connect(self.db_path) as connection:
            # Missing key returns default
            missing = db.get_setting(connection, "nonexistent_key", default="default_val")
            # Set and get back
            db.set_setting(connection, "test_key", "test_value")
            fetched = db.get_setting(connection, "test_key")
            # Overwrite
            db.set_setting(connection, "test_key", "updated_value")
            overwritten = db.get_setting(connection, "test_key")

        self.assertEqual(missing, "default_val")
        self.assertEqual(fetched, "test_value")
        self.assertEqual(overwritten, "updated_value")

    def test_deleted_document_is_excluded(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            created = db.create_document(
                connection,
                {"title": "To Delete", "slug": "to-delete", "content_markdown": "body"},
                editor_id,
            )
            document_id = created["document"]["id"]

            # Before delete: document is visible
            before_get = db.get_document(connection, document_id)
            before_list = db.list_documents(connection)

            db.delete_document(connection, document_id)

            # After delete: document is excluded
            after_get = db.get_document(connection, document_id)
            after_list = db.list_documents(connection)

        self.assertIsNotNone(before_get)
        self.assertTrue(any(d["id"] == document_id for d in before_list["items"]))
        self.assertIsNone(after_get)
        self.assertFalse(any(d["id"] == document_id for d in after_list["items"]))

    def test_list_orphan_attachments_detects_unreferenced(self):
        with db.connect(self.db_path) as connection:
            editor_id = connection.execute("SELECT id FROM users WHERE username = 'editor'").fetchone()["id"]
            # Create a document with attachment referenced in markdown
            created = db.create_document(
                connection,
                {"title": "Doc with Attachment", "slug": "doc-with-att", "content_markdown": ""},
                editor_id,
            )
            document_id = created["document"]["id"]
            # Insert attachment row directly (mirroring upload handler)
            now = db.utc_now()
            cursor = connection.execute(
                """
                INSERT INTO attachments
                  (document_id, file_name, storage_path, mime_type, size_bytes, created_by, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (document_id, "test.png", "data/attachments/test.png", "image/png", 100, editor_id, now),
            )
            connection.commit()
            attachment_id = cursor.lastrowid
            url = f"/api/attachments/{attachment_id}"

            # Reference the attachment in the document's markdown
            connection.execute(
                "UPDATE documents SET content_markdown = ? WHERE id = ?",
                (f"![img]({url})", document_id),
            )
            connection.commit()

            # With reference present: NOT an orphan
            orphans_before = db.list_orphan_attachments(connection)
            self.assertFalse(any(o["id"] == attachment_id for o in orphans_before),
                             "Attachment should not be orphan when referenced in markdown")

            # Remove the reference from markdown
            connection.execute(
                "UPDATE documents SET content_markdown = ? WHERE id = ?",
                ("no attachment here", document_id),
            )
            connection.commit()

            # After removing reference: IS an orphan
            orphans_after = db.list_orphan_attachments(connection)
            self.assertTrue(any(o["id"] == attachment_id for o in orphans_after),
                            "Attachment should be orphan when not referenced in any doc")

    def test_create_and_list_backup(self):
        backups_dir = Path(self.tempdir.name) / "backups"
        entry = db.create_backup(self.db_path, backups_dir)

        self.assertIn("file", entry)
        self.assertTrue(entry["file"].startswith("backup_"))
        self.assertTrue(entry["file"].endswith(".sqlite3"))
        self.assertGreater(entry["size_bytes"], 0)

        # Backup file must exist on disk
        backup_file = backups_dir / entry["file"]
        self.assertTrue(backup_file.exists())

        # list_backups must include it
        items = db.list_backups(backups_dir)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["file"], entry["file"])

    def test_restore_backup_rejects_path_traversal(self):
        backups_dir = Path(self.tempdir.name) / "backups"
        backups_dir.mkdir(parents=True, exist_ok=True)
        traversal_names = ["../foo.sqlite3", "..\\foo.sqlite3", "sub/foo.sqlite3", ""]
        for name in traversal_names:
            with self.assertRaises((ValueError, FileNotFoundError),
                                   msg=f"Expected error for name={name!r}"):
                db.restore_backup(self.db_path, backups_dir, name)


class HttpApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tempdir = tempfile.TemporaryDirectory()
        cls.db_path = Path(cls.tempdir.name) / "api.sqlite3"
        cls.server = create_server(ROOT, cls.db_path, "127.0.0.1", 0)
        cls.port = cls.server.server_address[1]
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.tempdir.cleanup()

    def request(self, method, path, body=None, cookie=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.port)
        headers = {"Accept": "application/json"}
        if body is not None:
            headers["Content-Type"] = "application/json"
        if cookie:
            headers["Cookie"] = cookie
        connection.request(method, path, body=json.dumps(body) if body is not None else None, headers=headers)
        response = connection.getresponse()
        payload = response.read()
        headers_out = dict(response.getheaders())
        connection.close()
        return response.status, json.loads(payload) if payload else None, headers_out

    def request_raw(self, method, path, body=b"", headers=None, cookie=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.port)
        request_headers = dict(headers or {})
        if cookie:
            request_headers["Cookie"] = cookie
        connection.request(method, path, body=body, headers=request_headers)
        response = connection.getresponse()
        payload = response.read()
        headers_out = dict(response.getheaders())
        connection.close()
        return response.status, payload, headers_out

    def login_cookie(self):
        status, payload, headers = self.request("POST", "/api/auth/login", {"username": "editor", "password": "editor"})
        self.assertEqual(status, 200)
        return headers["Set-Cookie"].split(";", 1)[0]

    def test_document_crud_and_search(self):
        cookie = self.login_cookie()
        status, created, _ = self.request(
            "POST",
            "/api/documents",
            {"title": "Networking", "slug": "networking", "summary": "Intro", "content_markdown": "# TCP/IP"},
            cookie,
        )
        self.assertEqual(status, 201)
        document_id = created["document"]["id"]

        status, payload, _ = self.request("GET", f"/api/documents/{document_id}", cookie=cookie)
        self.assertEqual(status, 200)
        self.assertEqual(payload["title"], "Networking")

        status, payload, _ = self.request("GET", "/api/search?q=Networking&type=document", cookie=cookie)
        self.assertEqual(status, 200)
        self.assertEqual(payload["total"], 1)

    def test_taxonomy_api_connects_document_metadata(self):
        cookie = self.login_cookie()
        status, category, _ = self.request("POST", "/api/categories", {"name": "Security Ops"}, cookie)
        self.assertEqual(status, 201)
        status, lesson, _ = self.request("POST", "/api/lessons", {"name": "Incident Review"}, cookie)
        self.assertEqual(status, 201)
        status, tag, _ = self.request("POST", "/api/tags", {"name": "Runbook"}, cookie)
        self.assertEqual(status, 201)

        status, categories, _ = self.request("GET", "/api/categories", cookie=cookie)
        self.assertEqual(status, 200)
        self.assertTrue(any(item["id"] == category["id"] for item in categories["items"]))

        status, created, _ = self.request(
            "POST",
            "/api/documents",
            {
                "title": "Taxonomy doc",
                "slug": "taxonomy-doc",
                "content_markdown": "body",
                "category_id": category["id"],
                "lesson_id": lesson["id"],
                "tag_ids": [tag["id"]],
            },
            cookie,
        )
        self.assertEqual(status, 201)
        document = created["document"]
        self.assertEqual(document["category"]["name"], "Security Ops")
        self.assertEqual(document["lesson"]["name"], "Incident Review")
        self.assertEqual(document["tags"][0]["name"], "Runbook")
        status, _, _ = self.request(
            "POST",
            "/api/documents",
            {
                "title": "A taxonomy doc",
                "slug": "a-taxonomy-doc",
                "content_markdown": "body",
                "category_id": category["id"],
            },
            cookie,
        )
        self.assertEqual(status, 201)

        status, payload, _ = self.request(
            "GET",
            f"/api/search?category_id={category['id']}&sort=title_asc",
            cookie=cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload["total"], 2)
        self.assertEqual(payload["items"][0]["title"], "A taxonomy doc")

        status, payload, _ = self.request("GET", "/api/search?category_id=999999", cookie=cookie)
        self.assertEqual(status, 200)
        self.assertEqual(payload["total"], 0)

        status, payload, _ = self.request("GET", "/api/search?type=glossary&q=Mermaid", cookie=cookie)
        self.assertEqual(status, 200)
        self.assertEqual(payload["total"], 1)

    def test_taxonomy_create_requires_editor(self):
        status, _, headers = self.request("POST", "/api/auth/login", {"username": "viewer", "password": "viewer"})
        self.assertEqual(status, 200)
        viewer_cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, payload, _ = self.request("POST", "/api/tags", {"name": "Viewer Tag"}, viewer_cookie)
        self.assertEqual(status, 403)
        self.assertEqual(payload["error"]["code"], "permission_denied")

    def test_unauthenticated_document_access_is_rejected(self):
        status, payload, _ = self.request("GET", "/api/documents")
        self.assertEqual(status, 401)
        self.assertEqual(payload["error"]["code"], "authentication_required")

    def test_image_attachment_upload_and_fetch(self):
        cookie = self.login_cookie()
        status, created, _ = self.request(
            "POST",
            "/api/documents",
            {"title": "Images", "slug": "images", "content_markdown": ""},
            cookie,
        )
        self.assertEqual(status, 201)
        document_id = created["document"]["id"]
        boundary = "----doc-platform-boundary"
        body = (
            f"--{boundary}\r\n"
            'Content-Disposition: form-data; name="file"; filename="diagram.png"\r\n'
            "Content-Type: image/png\r\n\r\n"
        ).encode() + b"\x89PNG\r\n\x1a\n" + f"\r\n--{boundary}--\r\n".encode()
        status, payload, _ = self.request_raw(
            "POST",
            f"/api/documents/{document_id}/attachments",
            body=body,
            headers={
                "Accept": "application/json",
                "Content-Type": f"multipart/form-data; boundary={boundary}",
                "Content-Length": str(len(body)),
            },
            cookie=cookie,
        )
        self.assertEqual(status, 201)
        attachment = json.loads(payload)
        self.assertEqual(attachment["mime_type"], "image/png")

        status, payload, headers = self.request_raw("GET", attachment["url"], cookie=cookie)
        self.assertEqual(status, 200)
        self.assertEqual(headers["Content-Type"], "image/png")
        self.assertEqual(payload, b"\x89PNG\r\n\x1a\n")

    def test_comment_update_requires_owner_or_admin(self):
        editor_cookie = self.login_cookie()
        status, created, _ = self.request(
            "POST",
            "/api/documents",
            {"title": "Comments", "slug": "comments", "content_markdown": "body"},
            editor_cookie,
        )
        self.assertEqual(status, 201)
        document_id = created["document"]["id"]
        status, comment, _ = self.request(
            "POST",
            f"/api/documents/{document_id}/comments",
            {"target_type": "document", "target": {}, "body": "first"},
            editor_cookie,
        )
        self.assertEqual(status, 201)

        status, _, headers = self.request("POST", "/api/auth/login", {"username": "viewer", "password": "viewer"})
        viewer_cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, payload, _ = self.request(
            "PUT",
            f"/api/comments/{comment['id']}",
            {"body": "viewer edit"},
            viewer_cookie,
        )
        self.assertEqual(status, 403)
        self.assertEqual(payload["error"]["code"], "permission_denied")

    def test_glossary_detail_endpoint_returns_related_documents(self):
        cookie = self.login_cookie()
        status, created, _ = self.request(
            "POST",
            "/api/documents",
            {
                "title": "Wiki link host",
                "slug": "wiki-link-host",
                "content_markdown": "Refer to [[Mermaid]] for diagrams.",
            },
            cookie,
        )
        self.assertEqual(status, 201)
        host_id = created["document"]["id"]

        status, payload, _ = self.request("GET", "/api/glossary", cookie=cookie)
        self.assertEqual(status, 200)
        mermaid = next(item for item in payload["items"] if item["slug"] == "mermaid")

        status, detail, _ = self.request(
            "GET", f"/api/glossary/{mermaid['id']}", cookie=cookie
        )
        self.assertEqual(status, 200)
        self.assertIn("related_documents", detail)
        self.assertTrue(
            any(doc["id"] == host_id for doc in detail["related_documents"]),
            f"expected document {host_id} in related_documents: {detail['related_documents']}",
        )

    def test_invalid_comment_payload_returns_validation_error(self):
        cookie = self.login_cookie()
        status, created, _ = self.request(
            "POST",
            "/api/documents",
            {"title": "Invalid comments", "slug": "invalid-comments", "content_markdown": "body"},
            cookie,
        )
        self.assertEqual(status, 201)
        status, payload, _ = self.request(
            "POST",
            f"/api/documents/{created['document']['id']}/comments",
            {"target_type": "image", "target": {"attachment_id": 999, "x_ratio": 0.5, "y_ratio": 0.5}, "body": "bad"},
            cookie,
        )
        self.assertEqual(status, 400)
        self.assertEqual(payload["error"]["code"], "validation_error")

    def test_glossary_create_requires_editor(self):
        # Viewer attempt should be 403
        status, _, headers = self.request("POST", "/api/auth/login", {"username": "viewer", "password": "viewer"})
        self.assertEqual(status, 200)
        viewer_cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, payload, _ = self.request("POST", "/api/glossary", {"term": "ViewerTerm"}, viewer_cookie)
        self.assertEqual(status, 403)
        self.assertEqual(payload["error"]["code"], "permission_denied")

        # Editor attempt should be 201
        editor_cookie = self.login_cookie()
        status, term, _ = self.request("POST", "/api/glossary", {"term": "EditorTerm"}, editor_cookie)
        self.assertEqual(status, 201)
        self.assertEqual(term["term"], "EditorTerm")

    def test_glossary_delete_returns_204_then_404(self):
        cookie = self.login_cookie()
        status, term, _ = self.request("POST", "/api/glossary", {"term": "DeleteMe"}, cookie)
        self.assertEqual(status, 201)
        term_id = term["id"]

        status, _, _ = self.request("DELETE", f"/api/glossary/{term_id}", cookie=cookie)
        self.assertEqual(status, 204)

        status, payload, _ = self.request("DELETE", f"/api/glossary/{term_id}", cookie=cookie)
        self.assertEqual(status, 404)
        self.assertEqual(payload["error"]["code"], "not_found")

    def test_glossary_post_with_aliases_via_api(self):
        cookie = self.login_cookie()
        # Create a tag first
        status, tag, _ = self.request("POST", "/api/tags", {"name": "Networking"}, cookie)
        self.assertEqual(status, 201)

        # Create a term with aliases and tag_ids
        status, term, _ = self.request(
            "POST",
            "/api/glossary",
            {"term": "Internet Protocol", "aliases": ["IP", "TCP/IP"], "tag_ids": [tag["id"]]},
            cookie,
        )
        self.assertEqual(status, 201)
        self.assertIn("aliases", term)
        alias_texts = [a["alias"] for a in term["aliases"]]
        self.assertIn("IP", alias_texts)
        self.assertIn("TCP/IP", alias_texts)
        self.assertIn("tags", term)
        self.assertEqual(len(term["tags"]), 1)
        self.assertEqual(term["tags"][0]["name"], "Networking")

        # Verify list endpoint also includes aliases
        status, list_payload, _ = self.request("GET", "/api/glossary", cookie=cookie)
        self.assertEqual(status, 200)
        found = next((i for i in list_payload["items"] if i["id"] == term["id"]), None)
        self.assertIsNotNone(found)
        self.assertIn("aliases", found)
        self.assertTrue(len(found["aliases"]) >= 2)

        # Verify collision is rejected
        status, conflict, _ = self.request(
            "POST",
            "/api/glossary",
            {"term": "IP Protocol", "aliases": ["IP"]},
            cookie,
        )
        self.assertEqual(status, 400)
        self.assertEqual(conflict["error"]["code"], "validation_error")

    def test_glossary_revisions_endpoint(self):
        cookie = self.login_cookie()
        # Create term (v1)
        status, term, _ = self.request(
            "POST",
            "/api/glossary",
            {"term": "Rev Endpoint Term", "description_markdown": "v1 content"},
            cookie,
        )
        self.assertEqual(status, 201)
        term_id = term["id"]

        # Update (v2)
        status, _, _ = self.request(
            "PUT",
            f"/api/glossary/{term_id}",
            {"description_markdown": "v2 content"},
            cookie,
        )
        self.assertEqual(status, 200)

        # Update again (v3)
        status, _, _ = self.request(
            "PUT",
            f"/api/glossary/{term_id}",
            {"description_markdown": "v3 content"},
            cookie,
        )
        self.assertEqual(status, 200)

        # List revisions (should be 3, in descending order)
        status, payload, _ = self.request(
            "GET",
            f"/api/glossary/{term_id}/revisions",
            cookie=cookie,
        )
        self.assertEqual(status, 200)
        items = payload["items"]
        self.assertEqual(len(items), 3)
        self.assertEqual(items[0]["version_number"], 3)
        self.assertEqual(items[1]["version_number"], 2)
        self.assertEqual(items[2]["version_number"], 1)

    def test_glossary_bulk_endpoint_requires_admin(self):
        # Viewer: 403
        status, _, viewer_headers = self.request("POST", "/api/auth/login", {"username": "viewer", "password": "viewer"})
        self.assertEqual(status, 200)
        viewer_cookie = viewer_headers["Set-Cookie"].split(";", 1)[0]
        status, payload, _ = self.request("POST", "/api/glossary/bulk", [{"term": "X"}], viewer_cookie)
        self.assertEqual(status, 403)
        self.assertEqual(payload["error"]["code"], "permission_denied")

        # Editor: 403
        editor_cookie = self.login_cookie()
        # login_cookie uses editor credentials
        status, payload, _ = self.request("POST", "/api/glossary/bulk", [{"term": "X"}], editor_cookie)
        self.assertEqual(status, 403)
        self.assertEqual(payload["error"]["code"], "permission_denied")

        # Admin: 200
        status, _, admin_headers = self.request("POST", "/api/auth/login", {"username": "admin", "password": "admin"})
        self.assertEqual(status, 200)
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        status, summary, _ = self.request(
            "POST",
            "/api/glossary/bulk",
            [{"term": "BulkTerm", "description_markdown": "bulk desc"}],
            admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertIn("created", summary)
        self.assertEqual(len(summary["created"]), 1)
        self.assertEqual(len(summary["errors"]), 0)

    def admin_cookie(self):
        status, _, headers = self.request("POST", "/api/auth/login", {"username": "admin", "password": "admin"})
        self.assertEqual(status, 200)
        return headers["Set-Cookie"].split(";", 1)[0]

    def viewer_cookie(self):
        status, _, headers = self.request("POST", "/api/auth/login", {"username": "viewer", "password": "viewer"})
        self.assertEqual(status, 200)
        return headers["Set-Cookie"].split(";", 1)[0]

    def test_backup_endpoints_require_admin(self):
        viewer = self.viewer_cookie()
        editor = self.login_cookie()
        admin = self.admin_cookie()

        # Viewer and editor cannot list backups
        for cookie in (viewer, editor):
            status, payload, _ = self.request("GET", "/api/backups", cookie=cookie)
            self.assertEqual(status, 403, f"Expected 403 for non-admin GET /api/backups")
            self.assertEqual(payload["error"]["code"], "permission_denied")

        # Viewer and editor cannot create backups
        for cookie in (viewer, editor):
            status, payload, _ = self.request("POST", "/api/backups", cookie=cookie)
            self.assertIn(status, (401, 403))

        # Admin can create and list backups
        status, entry, _ = self.request("POST", "/api/backups", cookie=admin)
        self.assertEqual(status, 201, f"Admin should be able to create backup, got {status}")
        self.assertIn("file", entry)
        self.assertTrue(entry["file"].startswith("backup_"))

        status, list_payload, _ = self.request("GET", "/api/backups", cookie=admin)
        self.assertEqual(status, 200)
        self.assertIn("items", list_payload)
        self.assertGreaterEqual(len(list_payload["items"]), 1)
        self.assertTrue(any(i["file"] == entry["file"] for i in list_payload["items"]))

    def test_backup_restore_endpoint(self):
        admin = self.admin_cookie()

        # Create a backup first
        status, entry, _ = self.request("POST", "/api/backups", cookie=admin)
        self.assertEqual(status, 201)
        backup_name = entry["file"]

        # Restore it
        status, result, _ = self.request("POST", "/api/backups/restore", {"name": backup_name}, admin)
        self.assertEqual(status, 200)
        self.assertEqual(result["restored"], backup_name)

        # Path traversal is rejected
        status, payload, _ = self.request("POST", "/api/backups/restore", {"name": "../evil.sqlite3"}, admin)
        self.assertIn(status, (400, 404))

    def test_attachment_orphans_endpoint_requires_admin(self):
        viewer = self.viewer_cookie()
        editor = self.login_cookie()
        admin = self.admin_cookie()

        # Non-admins get 403
        for cookie in (viewer, editor):
            status, payload, _ = self.request("GET", "/api/attachments/orphans", cookie=cookie)
            self.assertEqual(status, 403)
            self.assertEqual(payload["error"]["code"], "permission_denied")

        # Admin can access orphans list
        status, payload, _ = self.request("GET", "/api/attachments/orphans", cookie=admin)
        self.assertEqual(status, 200)
        self.assertIn("items", payload)

        # Admin can purge orphans
        status, payload, _ = self.request("POST", "/api/attachments/orphans/purge", cookie=admin)
        self.assertEqual(status, 200)
        self.assertIn("purged", payload)

    def test_settings_roundtrip_via_api(self):
        admin = self.admin_cookie()
        viewer = self.viewer_cookie()

        # Set a setting via admin
        status, result, _ = self.request("PUT", "/api/settings/test_api_key", {"value": "hello"}, admin)
        self.assertEqual(status, 200)
        self.assertEqual(result["value"], "hello")

        # Read it back via viewer (GET is viewer-accessible)
        status, settings, _ = self.request("GET", "/api/settings", cookie=viewer)
        self.assertEqual(status, 200)
        self.assertEqual(settings.get("test_api_key"), "hello")

        # Overwrite and verify
        status, result, _ = self.request("PUT", "/api/settings/test_api_key", {"value": "world"}, admin)
        self.assertEqual(status, 200)
        status, settings, _ = self.request("GET", "/api/settings", cookie=viewer)
        self.assertEqual(settings.get("test_api_key"), "world")

    def test_settings_put_requires_admin(self):
        # Viewer: 403
        status, _, viewer_headers = self.request("POST", "/api/auth/login", {"username": "viewer", "password": "viewer"})
        self.assertEqual(status, 200)
        viewer_cookie = viewer_headers["Set-Cookie"].split(";", 1)[0]
        status, payload, _ = self.request("PUT", "/api/settings/glossary_autolink", {"value": "on"}, viewer_cookie)
        self.assertEqual(status, 403)

        # Editor: 403
        editor_cookie = self.login_cookie()
        status, payload, _ = self.request("PUT", "/api/settings/glossary_autolink", {"value": "on"}, editor_cookie)
        self.assertEqual(status, 403)

        # Admin: 200
        status, _, admin_headers = self.request("POST", "/api/auth/login", {"username": "admin", "password": "admin"})
        self.assertEqual(status, 200)
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        status, result, _ = self.request("PUT", "/api/settings/glossary_autolink", {"value": "on"}, admin_cookie)
        self.assertEqual(status, 200)
        self.assertEqual(result["value"], "on")

        # Verify GET /api/settings returns the updated value (viewer can read)
        status, settings, _ = self.request("GET", "/api/settings", cookie=viewer_cookie)
        self.assertEqual(status, 200)
        self.assertEqual(settings.get("glossary_autolink"), "on")


if __name__ == "__main__":
    unittest.main()
