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


if __name__ == "__main__":
    unittest.main()
