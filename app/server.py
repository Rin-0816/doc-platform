from __future__ import annotations

import json
import mimetypes
import secrets
from email.parser import BytesParser
from email.policy import default
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from . import db
from .plugins import compatibility, enabled_frontend_plugins, get_plugin, list_plugins, set_plugin_status, sync_plugins


class AppContext:
    def __init__(self, root: Path, db_path: Path):
        self.root = root
        self.db_path = db_path
        self.sessions: dict[str, int] = {}


def build_handler(context: AppContext):
    class Handler(BaseHTTPRequestHandler):
        server_version = "DocPlatform/0.1"

        def do_GET(self):
            self.route("GET")

        def do_POST(self):
            self.route("POST")

        def do_PUT(self):
            self.route("PUT")

        def do_DELETE(self):
            self.route("DELETE")

        def route(self, method: str):
            parsed = urlparse(self.path)
            path = parsed.path
            parts = [part for part in path.split("/") if part]
            if path == "/":
                return self.serve_file(context.root / "templates" / "index.html", "text/html")
            if path.startswith("/static/"):
                return self.serve_static(path.removeprefix("/static/"))
            if path.startswith("/plugins/"):
                return self.serve_plugin_asset(parts[1:])
            if not path.startswith("/api/"):
                return self.send_error(HTTPStatus.NOT_FOUND)

            try:
                with db.connect(context.db_path) as connection:
                    sync_plugins(connection, context.root / "plugins")
                    user = self.current_user(connection)
                    if parts[:2] == ["api", "auth"]:
                        return self.handle_auth(method, parts[2:], connection, user)
                    if parts[:2] == ["api", "documents"]:
                        return self.handle_documents(method, parts[2:], parsed.query, connection, user)
                    if parts[:2] == ["api", "attachments"]:
                        return self.handle_attachments(method, parts[2:], connection, user)
                    if parts[:2] == ["api", "comments"]:
                        return self.handle_comments(method, parts[2:], connection, user)
                    if parts[:2] == ["api", "revisions"]:
                        return self.handle_revisions(method, parts[2:], parsed.query, connection, user)
                    if parts[:2] == ["api", "categories"]:
                        return self.handle_taxonomy("categories", method, parts[2:], connection, user)
                    if parts[:2] == ["api", "lessons"]:
                        return self.handle_taxonomy("lessons", method, parts[2:], connection, user)
                    if parts[:2] == ["api", "tags"]:
                        return self.handle_taxonomy("tags", method, parts[2:], connection, user)
                    if parts[:2] == ["api", "glossary"]:
                        return self.handle_glossary(method, parts[2:], parsed.query, connection, user)
                    if parts[:2] == ["api", "search"]:
                        return self.handle_search(method, parsed.query, connection, user)
                    if parts[:2] == ["api", "plugins"]:
                        return self.handle_plugins(method, parts[2:], connection, user)
            except Exception as exc:  # pragma: no cover - defensive boundary
                return self.json_error("internal_error", str(exc), HTTPStatus.INTERNAL_SERVER_ERROR)
            return self.json_error("not_found", "Endpoint not found.", HTTPStatus.NOT_FOUND)

        def current_user(self, connection):
            cookie = SimpleCookie(self.headers.get("Cookie"))
            session_id = cookie.get("session_id")
            if not session_id:
                return None
            user_id = context.sessions.get(session_id.value)
            if not user_id:
                return None
            row = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            if not row:
                return None
            result = dict(row)
            result["roles"] = db.user_roles(connection, row["id"])
            result["enabled_plugins"] = db.enabled_plugin_ids(connection)
            result["frontend_plugins"] = enabled_frontend_plugins(connection)
            return result

        def handle_auth(self, method, parts, connection, user):
            if method == "POST" and parts == ["login"]:
                payload = self.read_json()
                row = db.authenticate(connection, payload.get("username", ""), payload.get("password", ""))
                if not row:
                    return self.json_error("authentication_required", "Invalid credentials.", HTTPStatus.UNAUTHORIZED)
                session_id = secrets.token_urlsafe(24)
                context.sessions[session_id] = row["id"]
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "application/json")
                self.send_header("Set-Cookie", f"session_id={session_id}; Path=/; HttpOnly; SameSite=Lax")
                self.end_headers()
                self.wfile.write(json.dumps(self.user_payload(connection, row["id"])).encode())
                return
            if method == "POST" and parts == ["logout"]:
                if not user:
                    return self.json_error("authentication_required", "Sign in is required.", HTTPStatus.UNAUTHORIZED)
                cookie = SimpleCookie(self.headers.get("Cookie"))
                session_id = cookie.get("session_id")
                if session_id:
                    context.sessions.pop(session_id.value, None)
                self.send_response(HTTPStatus.NO_CONTENT)
                self.end_headers()
                return
            if method == "GET" and parts == ["session"]:
                if not user:
                    return self.json_error("authentication_required", "Sign in is required.", HTTPStatus.UNAUTHORIZED)
                return self.json_response(user)
            if method == "GET" and parts == ["providers"]:
                return self.json_response({"items": [{"id": "local", "name": "Local authentication"}], "total": 1})
            return self.json_error("not_found", "Auth endpoint not found.", HTTPStatus.NOT_FOUND)

        def handle_documents(self, method, parts, query, connection, user):
            if not self.require_role(user, "viewer"):
                return
            params = parse_qs(query)
            if not parts and method == "GET":
                page, page_size = self.page_args(params)
                payload = db.list_documents(
                    connection,
                    limit=page_size,
                    offset=(page - 1) * page_size,
                    sort=params.get("sort", ["updated_desc"])[0],
                )
                payload.update({"page": page, "page_size": page_size})
                return self.json_response(payload)
            if not parts and method == "POST":
                if not self.require_role(user, "editor"):
                    return
                payload = self.read_json()
                if not payload.get("title") or not payload.get("slug"):
                    return self.json_error("validation_error", "title and slug are required.", HTTPStatus.BAD_REQUEST)
                try:
                    return self.json_response(db.create_document(connection, payload, user["id"]), HTTPStatus.CREATED)
                except ValueError as exc:
                    return self.json_error("validation_error", str(exc), HTTPStatus.BAD_REQUEST)
                except Exception as exc:
                    return self.json_error("conflict", str(exc), HTTPStatus.CONFLICT)
            if len(parts) == 1:
                document_id = self.int_id(parts[0])
                if document_id is None:
                    return
                if method == "GET":
                    document = db.get_document(connection, document_id)
                    return self.json_response(document) if document else self.json_error("not_found", "Document not found.", HTTPStatus.NOT_FOUND)
                if method == "PUT":
                    if not self.require_role(user, "editor"):
                        return
                    payload = self.read_json()
                    try:
                        result = db.update_document(connection, document_id, payload, user["id"])
                    except ValueError as exc:
                        return self.json_error("validation_error", str(exc), HTTPStatus.BAD_REQUEST)
                    return self.json_response(result) if result else self.json_error("not_found", "Document not found.", HTTPStatus.NOT_FOUND)
                if method == "DELETE":
                    if not self.require_role(user, "editor"):
                        return
                    return self.empty_response() if db.delete_document(connection, document_id) else self.json_error("not_found", "Document not found.", HTTPStatus.NOT_FOUND)
            if len(parts) == 2 and parts[1] == "comments":
                document_id = self.int_id(parts[0])
                if document_id is None:
                    return
                if method == "GET":
                    if not db.get_document(connection, document_id):
                        return self.json_error("not_found", "Document not found.", HTTPStatus.NOT_FOUND)
                    comments = db.list_comments(connection, document_id, params.get("status", [None])[0], params.get("target_type", [None])[0])
                    return self.json_response({"items": comments, "total": len(comments), "page": 1, "page_size": len(comments)})
                if method == "POST":
                    if not user:
                        return self.json_error("authentication_required", "Sign in is required.", HTTPStatus.UNAUTHORIZED)
                    if not db.get_document(connection, document_id):
                        return self.json_error("not_found", "Document not found.", HTTPStatus.NOT_FOUND)
                    payload = self.read_json()
                    validation_error = self.validate_comment_payload(connection, document_id, payload)
                    if validation_error:
                        return self.json_error("validation_error", validation_error, HTTPStatus.BAD_REQUEST)
                    return self.json_response(db.create_comment(connection, document_id, payload, user["id"]), HTTPStatus.CREATED)
            if len(parts) == 2 and parts[1] == "attachments":
                document_id = self.int_id(parts[0])
                if document_id is None:
                    return
                if method != "POST":
                    return self.json_error("not_found", "Attachment endpoint not found.", HTTPStatus.NOT_FOUND)
                if not self.require_role(user, "editor"):
                    return
                if not db.get_document(connection, document_id):
                    return self.json_error("not_found", "Document not found.", HTTPStatus.NOT_FOUND)
                try:
                    upload = self.read_multipart_file()
                except ValueError as exc:
                    return self.json_error("validation_error", str(exc), HTTPStatus.BAD_REQUEST)
                if not upload["body"]:
                    return self.json_error("validation_error", "file must not be empty.", HTTPStatus.BAD_REQUEST)
                mime_type = upload["content_type"] or mimetypes.guess_type(upload["file_name"])[0] or "application/octet-stream"
                if not mime_type.startswith("image/"):
                    return self.json_error("validation_error", "Only image attachments are supported.", HTTPStatus.BAD_REQUEST)
                suffix = Path(upload["file_name"]).suffix.lower()
                storage_dir = context.root / "data" / "attachments"
                storage_dir.mkdir(parents=True, exist_ok=True)
                storage_name = f"{secrets.token_urlsafe(18)}{suffix}"
                storage_path = storage_dir / storage_name
                storage_path.write_bytes(upload["body"])
                attachment = db.create_attachment(
                    connection,
                    document_id=document_id,
                    file_name=upload["file_name"],
                    storage_path=str(storage_path.relative_to(context.root)),
                    mime_type=mime_type,
                    size_bytes=len(upload["body"]),
                    user_id=user["id"],
                )
                attachment["url"] = f"/api/attachments/{attachment['id']}"
                return self.json_response(attachment, HTTPStatus.CREATED)
            if len(parts) == 2 and parts[1] == "revisions":
                document_id = self.int_id(parts[0])
                if document_id is None:
                    return
                revisions = db.list_revisions(connection, document_id)
                return self.json_response({"items": revisions, "total": len(revisions), "page": 1, "page_size": len(revisions)})
            return self.json_error("not_found", "Document endpoint not found.", HTTPStatus.NOT_FOUND)

        def handle_attachments(self, method, parts, connection, user):
            if not self.require_role(user, "viewer"):
                return
            if len(parts) != 1:
                return self.json_error("not_found", "Attachment endpoint not found.", HTTPStatus.NOT_FOUND)
            attachment_id = self.int_id(parts[0])
            if attachment_id is None:
                return
            attachment = db.get_attachment(connection, attachment_id)
            if not attachment:
                return self.json_error("not_found", "Attachment not found.", HTTPStatus.NOT_FOUND)
            if method == "GET":
                path = context.root / attachment["storage_path"]
                if not path.exists():
                    return self.json_error("not_found", "Attachment file not found.", HTTPStatus.NOT_FOUND)
                return self.serve_file(path, attachment["mime_type"])
            if method == "DELETE":
                if not self.require_role(user, "editor"):
                    return
                return self.empty_response() if db.delete_attachment(connection, attachment_id) else self.json_error(
                    "not_found",
                    "Attachment not found.",
                    HTTPStatus.NOT_FOUND,
                )
            return self.json_error("not_found", "Attachment endpoint not found.", HTTPStatus.NOT_FOUND)

        def handle_comments(self, method, parts, connection, user):
            if not self.require_role(user, "viewer"):
                return
            if len(parts) == 1 and method == "GET":
                comment_id = self.int_id(parts[0])
                if comment_id is None:
                    return
                comment = db.get_comment(connection, comment_id)
                return self.json_response(comment) if comment else self.json_error("not_found", "Comment not found.", HTTPStatus.NOT_FOUND)
            if len(parts) == 1 and method == "PUT":
                comment_id = self.int_id(parts[0])
                if comment_id is None:
                    return
                comment = db.get_comment(connection, comment_id)
                if not comment:
                    return self.json_error("not_found", "Comment not found.", HTTPStatus.NOT_FOUND)
                if user["id"] != comment["created_by"] and "admin" not in user["roles"]:
                    return self.json_error("permission_denied", "You do not have permission to perform this action.", HTTPStatus.FORBIDDEN)
                payload = self.read_json()
                body = payload.get("body")
                if not isinstance(body, str) or not body.strip():
                    return self.json_error("validation_error", "body is required.", HTTPStatus.BAD_REQUEST)
                return self.json_response(db.update_comment(connection, comment_id, body.strip()))
            if len(parts) == 2 and parts[1] in {"resolve", "reopen"} and method == "POST":
                if not self.require_role(user, "editor"):
                    return
                comment_id = self.int_id(parts[0])
                if comment_id is None:
                    return
                comment = db.set_comment_status(connection, comment_id, "resolved" if parts[1] == "resolve" else "open")
                return self.json_response(comment) if comment else self.json_error("not_found", "Comment not found.", HTTPStatus.NOT_FOUND)
            return self.json_error("not_found", "Comment endpoint not found.", HTTPStatus.NOT_FOUND)

        def handle_revisions(self, method, parts, query, connection, user):
            if not self.require_role(user, "viewer"):
                return
            if len(parts) == 1 and method == "GET":
                revision_id = self.int_id(parts[0])
                if revision_id is None:
                    return
                revision = db.get_revision(connection, revision_id)
                return self.json_response(revision) if revision else self.json_error("not_found", "Revision not found.", HTTPStatus.NOT_FOUND)
            if len(parts) == 2 and parts[1] == "diff" and method == "GET":
                revision_id = self.int_id(parts[0])
                against_id = self.int_id(parse_qs(query).get("against", [""])[0])
                if revision_id is None or against_id is None:
                    return
                diff = db.revision_diff(connection, revision_id, against_id)
                return self.json_response(diff) if diff else self.json_error("not_found", "Revision not found.", HTTPStatus.NOT_FOUND)
            if len(parts) == 2 and parts[1] == "restore" and method == "POST":
                if not self.require_role(user, "editor"):
                    return
                revision_id = self.int_id(parts[0])
                if revision_id is None:
                    return
                result = db.restore_revision(connection, revision_id, user["id"])
                return self.json_response(result) if result else self.json_error("not_found", "Revision not found.", HTTPStatus.NOT_FOUND)
            return self.json_error("not_found", "Revision endpoint not found.", HTTPStatus.NOT_FOUND)

        def handle_glossary(self, method, parts, query, connection, user):
            if not self.require_role(user, "viewer"):
                return
            params = parse_qs(query)
            page, page_size = self.page_args(params)
            if not parts and method == "GET":
                payload = db.list_glossary(connection, limit=page_size, offset=(page - 1) * page_size)
                payload.update({"page": page, "page_size": page_size})
                return self.json_response(payload)
            if len(parts) == 1 and method == "GET":
                term_id = self.int_id(parts[0])
                if term_id is None:
                    return
                term = db.get_glossary_term(connection, term_id)
                return self.json_response(term) if term else self.json_error("not_found", "Glossary term not found.", HTTPStatus.NOT_FOUND)
            return self.json_error("not_found", "Glossary endpoint not found.", HTTPStatus.NOT_FOUND)

        def handle_taxonomy(self, kind, method, parts, connection, user):
            if not self.require_role(user, "viewer"):
                return
            if parts:
                return self.json_error("not_found", f"{kind.title()} endpoint not found.", HTTPStatus.NOT_FOUND)
            listers = {
                "categories": db.list_categories,
                "lessons": db.list_lessons,
                "tags": db.list_tags,
            }
            creators = {
                "categories": db.create_category,
                "lessons": db.create_lesson,
                "tags": db.create_tag,
            }
            if method == "GET":
                items = listers[kind](connection)
                return self.json_response({"items": items, "total": len(items), "page": 1, "page_size": len(items)})
            if method == "POST":
                if not self.require_role(user, "editor"):
                    return
                try:
                    return self.json_response(creators[kind](connection, self.read_json()), HTTPStatus.CREATED)
                except ValueError as exc:
                    return self.json_error("validation_error", str(exc), HTTPStatus.BAD_REQUEST)
                except Exception as exc:
                    return self.json_error("conflict", str(exc), HTTPStatus.CONFLICT)
            return self.json_error("not_found", f"{kind.title()} endpoint not found.", HTTPStatus.NOT_FOUND)

        def handle_search(self, method, query, connection, user):
            if method != "GET":
                return self.json_error("not_found", "Search endpoint not found.", HTTPStatus.NOT_FOUND)
            if not self.require_role(user, "viewer"):
                return
            params = parse_qs(query)
            page, page_size = self.page_args(params)
            search_type = params.get("type", ["document"])[0] or "document"
            if search_type == "glossary":
                payload = db.search_glossary(connection, params.get("q", [""])[0], page_size, (page - 1) * page_size)
            elif search_type == "document":
                category_id = self.query_int(params, "category_id")
                lesson_id = self.query_int(params, "lesson_id")
                if category_id is False or lesson_id is False:
                    return
                payload = db.list_documents(
                    connection,
                    params.get("q", [""])[0],
                    page_size,
                    (page - 1) * page_size,
                    category_id=category_id,
                    lesson_id=lesson_id,
                    tag=params.get("tag", [None])[0],
                    sort=params.get("sort", ["updated_desc"])[0],
                )
            else:
                return self.json_error("validation_error", "type must be document or glossary.", HTTPStatus.BAD_REQUEST)
            payload.update({"page": page, "page_size": page_size})
            return self.json_response(payload)

        def handle_plugins(self, method, parts, connection, user):
            if not self.require_role(user, "admin"):
                return
            if not parts and method == "GET":
                items = list_plugins(connection)
                return self.json_response({"items": items, "total": len(items), "page": 1, "page_size": len(items)})
            plugin_id = parts[0] if parts else None
            if not plugin_id or not get_plugin(connection, plugin_id):
                return self.json_error("not_found", "Plugin not found.", HTTPStatus.NOT_FOUND)
            if len(parts) == 1 and method == "GET":
                return self.json_response(get_plugin(connection, plugin_id))
            if len(parts) == 2 and parts[1] == "compatibility" and method == "GET":
                return self.json_response(compatibility(connection, plugin_id))
            if len(parts) == 2 and parts[1] in {"enable", "disable"} and method == "POST":
                check = compatibility(connection, plugin_id)
                if parts[1] == "enable" and check and check["result"] == "ERROR":
                    return self.json_error("compatibility_error", "Plugin is not compatible.", HTTPStatus.CONFLICT, check)
                return self.json_response(set_plugin_status(connection, plugin_id, parts[1] == "enable"))
            return self.json_error("not_found", "Plugin endpoint not found.", HTTPStatus.NOT_FOUND)

        def user_payload(self, connection, user_id):
            row = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            result = dict(row)
            result.pop("password_hash", None)
            result["roles"] = db.user_roles(connection, user_id)
            result["enabled_plugins"] = db.enabled_plugin_ids(connection)
            result["frontend_plugins"] = enabled_frontend_plugins(connection)
            return result

        def require_role(self, user, role):
            hierarchy = {"viewer": 1, "editor": 2, "admin": 3}
            if not user:
                self.json_error("authentication_required", "Sign in is required.", HTTPStatus.UNAUTHORIZED)
                return False
            max_role = max((hierarchy.get(candidate, 0) for candidate in user["roles"]), default=0)
            if max_role < hierarchy[role]:
                self.json_error("permission_denied", "You do not have permission to perform this action.", HTTPStatus.FORBIDDEN)
                return False
            return True

        def page_args(self, params):
            page = max(int(params.get("page", ["1"])[0]), 1)
            page_size = min(max(int(params.get("page_size", ["20"])[0]), 1), 100)
            return page, page_size

        def validate_comment_payload(self, connection, document_id, payload):
            target_type = payload.get("target_type")
            if target_type not in {"document", "section", "text_selection", "image", "mermaid_block"}:
                return "target_type is invalid."
            if not isinstance(payload.get("body"), str) or not payload["body"].strip():
                return "body is required."
            target = payload.get("target", {})
            if not isinstance(target, dict):
                return "target must be an object."
            revision_id = payload.get("revision_id")
            if revision_id is not None:
                revision = db.get_revision(connection, revision_id)
                if not revision or revision["document_id"] != document_id:
                    return "revision_id must belong to the document."
            if target_type == "text_selection":
                required = ("start_offset", "end_offset", "selected_text", "prefix_context", "suffix_context")
                if not all(key in target for key in required):
                    return "text_selection target is incomplete."
                if not isinstance(target["start_offset"], int) or not isinstance(target["end_offset"], int):
                    return "text_selection offsets must be integers."
                if target["start_offset"] < 0 or target["end_offset"] < target["start_offset"]:
                    return "text_selection offsets are invalid."
                if not all(isinstance(target[key], str) for key in ("selected_text", "prefix_context", "suffix_context")):
                    return "text_selection context must be strings."
            if target_type == "image":
                attachment_id = target.get("attachment_id")
                attachment = db.get_attachment(connection, attachment_id) if isinstance(attachment_id, int) else None
                if not attachment or attachment["document_id"] != document_id:
                    return "image target must reference a document attachment."
                if not all(isinstance(target.get(key), (int, float)) and 0 <= target[key] <= 1 for key in ("x_ratio", "y_ratio")):
                    return "image target coordinates must be ratios between 0 and 1."
            if target_type == "mermaid_block" and not isinstance(target.get("block_id"), str):
                return "mermaid_block target requires block_id."
            return None

        def int_id(self, value):
            try:
                return int(value)
            except (TypeError, ValueError):
                self.json_error("validation_error", "ID must be an integer.", HTTPStatus.BAD_REQUEST)
                return None

        def query_int(self, params, name):
            value = params.get(name, [None])[0]
            if value in (None, ""):
                return None
            try:
                return int(value)
            except (TypeError, ValueError):
                self.json_error("validation_error", f"{name} must be an integer.", HTTPStatus.BAD_REQUEST)
                return False

        def read_json(self):
            length = int(self.headers.get("Content-Length", "0"))
            return json.loads(self.rfile.read(length) or b"{}")

        def read_body_bytes(self):
            length = int(self.headers.get("Content-Length", "0"))
            return self.rfile.read(length)

        def read_multipart_file(self):
            content_type = self.headers.get("Content-Type", "")
            if not content_type.startswith("multipart/form-data"):
                raise ValueError("multipart/form-data is required.")
            body = self.read_body_bytes()
            message = BytesParser(policy=default).parsebytes(
                f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode() + body
            )
            for part in message.iter_parts():
                if part.get_content_disposition() != "form-data":
                    continue
                file_name = part.get_filename()
                if file_name:
                    payload = part.get_payload(decode=True) or b""
                    return {"file_name": Path(file_name).name, "content_type": part.get_content_type(), "body": payload}
            raise ValueError("file is required.")

        def json_response(self, payload, status=HTTPStatus.OK):
            body = json.dumps(payload).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def json_error(self, code, message, status, details=None):
            return self.json_response({"error": {"code": code, "message": message, "details": details or {}}}, status)

        def empty_response(self):
            self.send_response(HTTPStatus.NO_CONTENT)
            self.end_headers()

        def serve_static(self, relative_path):
            target = (context.root / "static" / relative_path).resolve()
            if not str(target).startswith(str((context.root / "static").resolve())) or not target.is_file():
                return self.send_error(HTTPStatus.NOT_FOUND)
            return self.serve_file(target, mimetypes.guess_type(str(target))[0] or "application/octet-stream")

        def serve_plugin_asset(self, parts):
            if len(parts) < 2:
                return self.send_error(HTTPStatus.NOT_FOUND)
            plugin_id = parts[0]
            requested_asset = "/".join(parts[1:])
            plugin_root = (context.root / "plugins" / plugin_id).resolve()
            manifest_path = plugin_root / "manifest.json"
            if not manifest_path.is_file():
                return self.send_error(HTTPStatus.NOT_FOUND)
            manifest = json.loads(manifest_path.read_text())
            declared_frontend = str(manifest.get("frontend") or "").removeprefix("./")
            if not declared_frontend or requested_asset != declared_frontend:
                return self.send_error(HTTPStatus.NOT_FOUND)
            target = (plugin_root / declared_frontend).resolve()
            try:
                target.relative_to(plugin_root)
            except ValueError:
                return self.send_error(HTTPStatus.NOT_FOUND)
            if not target.is_file():
                return self.send_error(HTTPStatus.NOT_FOUND)
            return self.serve_file(target, "text/javascript")

        def serve_file(self, path, content_type):
            if not path.exists():
                return self.send_error(HTTPStatus.NOT_FOUND)
            body = path.read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, format, *args):  # pragma: no cover - keep local server quiet in tests
            return

    return Handler


def create_server(root: Path, db_path: Path, host: str = "127.0.0.1", port: int = 8000) -> ThreadingHTTPServer:
    db.initialize_database(db_path)
    return ThreadingHTTPServer((host, port), build_handler(AppContext(root, db_path)))
