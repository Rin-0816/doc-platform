from __future__ import annotations

import difflib
import hashlib
import json
import re
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

from .plugin_runtime import (
    load_document_plugin_data,
    restore_document_plugin_data,
    save_document_plugin_data,
)

DEFAULT_USERS = (
    ("admin", "Administrator", "admin", "admin"),
    ("editor", "Editor", "editor", "editor"),
    ("viewer", "Viewer", "viewer", "viewer"),
)


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def password_hash(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def normalize_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


@contextmanager
def connect(db_path: str | Path) -> Iterator[sqlite3.Connection]:
    connection = sqlite3.connect(str(db_path))
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        yield connection
    finally:
        connection.close()


def initialize_database(db_path: str | Path) -> None:
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    with connect(db_path) as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY,
              username TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              display_name TEXT NOT NULL,
              is_active INTEGER NOT NULL DEFAULT 1,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS roles (
              id INTEGER PRIMARY KEY,
              code TEXT NOT NULL UNIQUE,
              name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS user_roles (
              user_id INTEGER NOT NULL,
              role_id INTEGER NOT NULL,
              PRIMARY KEY (user_id, role_id),
              FOREIGN KEY (user_id) REFERENCES users(id),
              FOREIGN KEY (role_id) REFERENCES roles(id)
            );

            CREATE TABLE IF NOT EXISTS categories (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              slug TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS lessons (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              slug TEXT NOT NULL UNIQUE,
              position INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS tags (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              slug TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS documents (
              id INTEGER PRIMARY KEY,
              title TEXT NOT NULL,
              slug TEXT NOT NULL UNIQUE,
              summary TEXT NOT NULL DEFAULT '',
              content_markdown TEXT NOT NULL DEFAULT '',
              category_id INTEGER,
              lesson_id INTEGER,
              created_by INTEGER NOT NULL,
              updated_by INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              deleted_at TEXT,
              FOREIGN KEY (category_id) REFERENCES categories(id),
              FOREIGN KEY (lesson_id) REFERENCES lessons(id),
              FOREIGN KEY (created_by) REFERENCES users(id),
              FOREIGN KEY (updated_by) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS document_sections (
              id INTEGER PRIMARY KEY,
              document_id INTEGER NOT NULL,
              anchor TEXT NOT NULL,
              heading TEXT NOT NULL,
              position INTEGER NOT NULL,
              FOREIGN KEY (document_id) REFERENCES documents(id)
            );

            CREATE TABLE IF NOT EXISTS document_tags (
              document_id INTEGER NOT NULL,
              tag_id INTEGER NOT NULL,
              PRIMARY KEY (document_id, tag_id),
              FOREIGN KEY (document_id) REFERENCES documents(id),
              FOREIGN KEY (tag_id) REFERENCES tags(id)
            );

            CREATE TABLE IF NOT EXISTS attachments (
              id INTEGER PRIMARY KEY,
              document_id INTEGER NOT NULL,
              file_name TEXT NOT NULL,
              storage_path TEXT NOT NULL,
              mime_type TEXT NOT NULL,
              size_bytes INTEGER NOT NULL,
              width INTEGER,
              height INTEGER,
              created_by INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              deleted_at TEXT,
              FOREIGN KEY (document_id) REFERENCES documents(id),
              FOREIGN KEY (created_by) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS glossary_terms (
              id INTEGER PRIMARY KEY,
              term TEXT NOT NULL,
              slug TEXT NOT NULL UNIQUE,
              description_markdown TEXT NOT NULL DEFAULT '',
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS glossary_term_documents (
              term_id INTEGER NOT NULL,
              document_id INTEGER NOT NULL,
              PRIMARY KEY (term_id, document_id),
              FOREIGN KEY (term_id) REFERENCES glossary_terms(id),
              FOREIGN KEY (document_id) REFERENCES documents(id)
            );

            CREATE TABLE IF NOT EXISTS revisions (
              id INTEGER PRIMARY KEY,
              document_id INTEGER NOT NULL,
              version_number INTEGER NOT NULL,
              content_markdown TEXT NOT NULL,
              summary TEXT NOT NULL DEFAULT '',
              plugin_data_json TEXT NOT NULL DEFAULT '{}',
              created_by INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              restored_from_revision_id INTEGER,
              UNIQUE (document_id, version_number),
              FOREIGN KEY (document_id) REFERENCES documents(id),
              FOREIGN KEY (created_by) REFERENCES users(id),
              FOREIGN KEY (restored_from_revision_id) REFERENCES revisions(id)
            );

            CREATE TABLE IF NOT EXISTS comments (
              id INTEGER PRIMARY KEY,
              document_id INTEGER NOT NULL,
              target_type TEXT NOT NULL,
              target_payload_json TEXT NOT NULL,
              body TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'open',
              revision_id INTEGER,
              created_by INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              FOREIGN KEY (document_id) REFERENCES documents(id),
              FOREIGN KEY (revision_id) REFERENCES revisions(id),
              FOREIGN KEY (created_by) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS plugins (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              version TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'disabled',
              enabled_at TEXT,
              disabled_at TEXT,
              last_checked_at TEXT,
              manifest_json TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS schema_migrations (
              version TEXT NOT NULL,
              applied_at TEXT NOT NULL,
              source TEXT NOT NULL,
              PRIMARY KEY (version, source)
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts
              USING fts5(title, summary, content_markdown);

            CREATE VIRTUAL TABLE IF NOT EXISTS glossary_terms_fts
              USING fts5(term, description_markdown);

            CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at);
            CREATE INDEX IF NOT EXISTS idx_comments_document_status ON comments(document_id, status);
            CREATE INDEX IF NOT EXISTS idx_revisions_document_version ON revisions(document_id, version_number);
            CREATE INDEX IF NOT EXISTS idx_attachments_document ON attachments(document_id);
            CREATE INDEX IF NOT EXISTS idx_plugins_status ON plugins(status);
            """
        )
        ensure_column(connection, "revisions", "plugin_data_json", "TEXT NOT NULL DEFAULT '{}'")
        seed_core_data(connection)


def seed_core_data(connection: sqlite3.Connection) -> None:
    now = utc_now()
    connection.executemany(
        "INSERT OR IGNORE INTO roles (code, name) VALUES (?, ?)",
        (("viewer", "Viewer"), ("editor", "Editor"), ("admin", "Administrator")),
    )
    for username, display_name, password, role in DEFAULT_USERS:
        connection.execute(
            """
            INSERT OR IGNORE INTO users
              (username, password_hash, display_name, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (username, password_hash(password), display_name, now, now),
        )
        user_id = connection.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()["id"]
        role_id = connection.execute("SELECT id FROM roles WHERE code = ?", (role,)).fetchone()["id"]
        connection.execute(
            "INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)",
            (user_id, role_id),
        )
    connection.execute(
        "INSERT OR IGNORE INTO categories (id, name, slug) VALUES (1, '未分類', 'general')"
    )
    connection.execute(
        "INSERT OR IGNORE INTO lessons (id, name, slug, position) VALUES (1, 'はじめに', 'getting-started', 1)"
    )
    connection.execute(
        """
        INSERT OR IGNORE INTO glossary_terms (id, term, slug, description_markdown, created_at, updated_at)
        VALUES (1, 'Mermaid', 'mermaid', 'Text-based diagram syntax rendered in the browser.', ?, ?)
        """,
        (now, now),
    )
    connection.commit()


def authenticate(connection: sqlite3.Connection, username: str, password: str) -> sqlite3.Row | None:
    return connection.execute(
        """
        SELECT u.*
        FROM users u
        WHERE u.username = ? AND u.password_hash = ? AND u.is_active = 1
        """,
        (username, password_hash(password)),
    ).fetchone()


def user_roles(connection: sqlite3.Connection, user_id: int) -> list[str]:
    return [
        row["code"]
        for row in connection.execute(
            """
            SELECT r.code
            FROM roles r
            JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = ?
            ORDER BY r.id
            """,
            (user_id,),
        )
    ]


def list_documents(
    connection: sqlite3.Connection,
    query: str = "",
    limit: int = 20,
    offset: int = 0,
    category_id: int | None = None,
    lesson_id: int | None = None,
    tag: str | None = None,
    sort: str = "updated_desc",
) -> dict[str, Any]:
    clauses = ["d.deleted_at IS NULL"]
    values: list[Any] = []
    source = "documents d"
    joins: list[str] = []
    if query:
        source = "documents_fts f JOIN documents d ON d.id = f.rowid"
        clauses.append("documents_fts MATCH ?")
        values.append(query)
    if category_id:
        clauses.append("d.category_id = ?")
        values.append(category_id)
    if lesson_id:
        clauses.append("d.lesson_id = ?")
        values.append(lesson_id)
    if tag:
        joins.extend(
            [
                "JOIN document_tags dt ON dt.document_id = d.id",
                "JOIN tags t ON t.id = dt.tag_id",
            ]
        )
        clauses.append("(t.slug = ? OR t.name = ?)")
        values.extend((tag, tag))

    where = " AND ".join(clauses)
    join_sql = " ".join(joins)
    order_sql = {
        "title_asc": "d.title COLLATE NOCASE ASC, d.updated_at DESC",
        "updated_desc": "d.updated_at DESC",
    }.get(sort, "d.updated_at DESC")
    rows = connection.execute(
        f"""
        SELECT DISTINCT d.*
        FROM {source}
        {join_sql}
        WHERE {where}
        ORDER BY {order_sql}
        LIMIT ? OFFSET ?
        """,
        (*values, limit, offset),
    ).fetchall()
    total = connection.execute(
        f"""
        SELECT COUNT(DISTINCT d.id) AS count
        FROM {source}
        {join_sql}
        WHERE {where}
        """,
        values,
    ).fetchone()["count"]
    return {"items": [serialize_document(connection, row) for row in rows], "total": total}


def list_categories(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    return [dict(row) for row in connection.execute("SELECT * FROM categories ORDER BY name")]


def list_lessons(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    return [dict(row) for row in connection.execute("SELECT * FROM lessons ORDER BY position, name")]


def list_tags(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    return [dict(row) for row in connection.execute("SELECT * FROM tags ORDER BY name")]


def create_category(connection: sqlite3.Connection, payload: dict[str, Any]) -> dict[str, Any]:
    name = required_taxonomy_name(payload)
    slug = taxonomy_slug(connection, "categories", payload, name)
    cursor = connection.execute("INSERT INTO categories (name, slug) VALUES (?, ?)", (name, slug))
    connection.commit()
    return dict(connection.execute("SELECT * FROM categories WHERE id = ?", (cursor.lastrowid,)).fetchone())


def create_lesson(connection: sqlite3.Connection, payload: dict[str, Any]) -> dict[str, Any]:
    name = required_taxonomy_name(payload)
    slug = taxonomy_slug(connection, "lessons", payload, name)
    position = payload.get("position")
    if position is None:
        position = connection.execute("SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM lessons").fetchone()[
            "next_position"
        ]
    try:
        position = int(position)
    except (TypeError, ValueError) as exc:
        raise ValueError("position must be an integer.") from exc
    cursor = connection.execute(
        "INSERT INTO lessons (name, slug, position) VALUES (?, ?, ?)",
        (name, slug, position),
    )
    connection.commit()
    return dict(connection.execute("SELECT * FROM lessons WHERE id = ?", (cursor.lastrowid,)).fetchone())


def create_tag(connection: sqlite3.Connection, payload: dict[str, Any]) -> dict[str, Any]:
    name = required_taxonomy_name(payload)
    slug = taxonomy_slug(connection, "tags", payload, name)
    cursor = connection.execute("INSERT INTO tags (name, slug) VALUES (?, ?)", (name, slug))
    connection.commit()
    return dict(connection.execute("SELECT * FROM tags WHERE id = ?", (cursor.lastrowid,)).fetchone())


def required_taxonomy_name(payload: dict[str, Any]) -> str:
    name = str(payload.get("name") or "").strip()
    if not name:
        raise ValueError("name is required.")
    return name


def taxonomy_slug(connection: sqlite3.Connection, table: str, payload: dict[str, Any], name: str) -> str:
    base = normalize_slug(str(payload.get("slug") or name)) or "item"
    slug = base
    suffix = 2
    while connection.execute(f"SELECT 1 FROM {table} WHERE slug = ?", (slug,)).fetchone():
        slug = f"{base}-{suffix}"
        suffix += 1
    return slug


def create_document(connection: sqlite3.Connection, payload: dict[str, Any], user_id: int) -> dict[str, Any]:
    now = utc_now()
    cursor = connection.execute(
        """
        INSERT INTO documents
          (title, slug, summary, content_markdown, category_id, lesson_id, created_by, updated_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload["title"],
            payload["slug"],
            payload.get("summary", ""),
            payload.get("content_markdown", ""),
            payload.get("category_id"),
            payload.get("lesson_id"),
            user_id,
            user_id,
            now,
            now,
        ),
    )
    document_id = cursor.lastrowid
    update_document_tags(connection, document_id, payload.get("tag_ids", []))
    save_plugin_data(connection, document_id, payload.get("plugin_data", {}))
    revision_id = create_revision(
        connection,
        document_id,
        payload.get("content_markdown", ""),
        payload.get("summary", ""),
        user_id,
        plugin_data=load_plugin_data(connection, document_id),
    )
    refresh_document_fts(connection, document_id)
    connection.commit()
    return {"document": get_document(connection, document_id), "revision_id": revision_id}


def update_document(connection: sqlite3.Connection, document_id: int, payload: dict[str, Any], user_id: int) -> dict[str, Any] | None:
    row = connection.execute(
        "SELECT * FROM documents WHERE id = ? AND deleted_at IS NULL",
        (document_id,),
    ).fetchone()
    if not row:
        return None
    now = utc_now()
    connection.execute(
        """
        UPDATE documents
        SET title = ?, slug = ?, summary = ?, content_markdown = ?, category_id = ?, lesson_id = ?, updated_by = ?, updated_at = ?
        WHERE id = ?
        """,
        (
            payload["title"],
            payload["slug"],
            payload.get("summary", ""),
            payload.get("content_markdown", ""),
            payload.get("category_id"),
            payload.get("lesson_id"),
            user_id,
            now,
            document_id,
        ),
    )
    update_document_tags(connection, document_id, payload.get("tag_ids", []))
    save_plugin_data(connection, document_id, payload.get("plugin_data", {}))
    revision_id = create_revision(
        connection,
        document_id,
        payload.get("content_markdown", ""),
        payload.get("summary", ""),
        user_id,
        plugin_data=load_plugin_data(connection, document_id),
    )
    reanchor_text_comments(connection, document_id, payload.get("content_markdown", ""))
    refresh_document_fts(connection, document_id)
    connection.commit()
    return {"document": get_document(connection, document_id), "revision_id": revision_id}


def delete_document(connection: sqlite3.Connection, document_id: int) -> bool:
    cursor = connection.execute(
        "UPDATE documents SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
        (utc_now(), document_id),
    )
    connection.commit()
    return cursor.rowcount > 0


def get_document(connection: sqlite3.Connection, document_id: int) -> dict[str, Any] | None:
    row = connection.execute(
        "SELECT * FROM documents WHERE id = ? AND deleted_at IS NULL",
        (document_id,),
    ).fetchone()
    return serialize_document(connection, row) if row else None


def serialize_document(connection: sqlite3.Connection, row: sqlite3.Row) -> dict[str, Any]:
    tags = [
        dict(tag)
        for tag in connection.execute(
            """
            SELECT t.*
            FROM tags t
            JOIN document_tags dt ON dt.tag_id = t.id
            WHERE dt.document_id = ?
            ORDER BY t.name
            """,
            (row["id"],),
        )
    ]
    category = connection.execute("SELECT * FROM categories WHERE id = ?", (row["category_id"],)).fetchone()
    lesson = connection.execute("SELECT * FROM lessons WHERE id = ?", (row["lesson_id"],)).fetchone()
    result = dict(row)
    result["tags"] = tags
    result["tag_ids"] = [tag["id"] for tag in tags]
    result["category"] = dict(category) if category else None
    result["lesson"] = dict(lesson) if lesson else None
    result["plugin_data"] = load_plugin_data(connection, row["id"])
    return result


def update_document_tags(connection: sqlite3.Connection, document_id: int, tag_ids: list[int]) -> None:
    connection.execute("DELETE FROM document_tags WHERE document_id = ?", (document_id,))
    for tag_id in tag_ids:
        connection.execute(
            "INSERT OR IGNORE INTO document_tags (document_id, tag_id) VALUES (?, ?)",
            (document_id, tag_id),
        )


def create_revision(
    connection: sqlite3.Connection,
    document_id: int,
    content_markdown: str,
    summary: str,
    user_id: int,
    plugin_data: dict[str, Any] | None = None,
    restored_from_revision_id: int | None = None,
) -> int:
    version_number = connection.execute(
        "SELECT COALESCE(MAX(version_number), 0) + 1 AS next_version FROM revisions WHERE document_id = ?",
        (document_id,),
    ).fetchone()["next_version"]
    cursor = connection.execute(
        """
        INSERT INTO revisions
          (document_id, version_number, content_markdown, summary, plugin_data_json, created_by, created_at, restored_from_revision_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            document_id,
            version_number,
            content_markdown,
            summary,
            json.dumps(plugin_data or {}, sort_keys=True),
            user_id,
            utc_now(),
            restored_from_revision_id,
        ),
    )
    return cursor.lastrowid


def list_revisions(connection: sqlite3.Connection, document_id: int) -> list[dict[str, Any]]:
    return [
        serialize_revision(row)
        for row in connection.execute(
            """
            SELECT *
            FROM revisions
            WHERE document_id = ?
            ORDER BY version_number DESC
            """,
            (document_id,),
        )
    ]


def get_revision(connection: sqlite3.Connection, revision_id: int) -> dict[str, Any] | None:
    row = connection.execute("SELECT * FROM revisions WHERE id = ?", (revision_id,)).fetchone()
    return serialize_revision(row) if row else None


def revision_diff(connection: sqlite3.Connection, revision_id: int, against_id: int) -> dict[str, Any] | None:
    target = get_revision(connection, revision_id)
    against = get_revision(connection, against_id)
    if not target or not against:
        return None
    diff = "\n".join(
        difflib.unified_diff(
            against["content_markdown"].splitlines(),
            target["content_markdown"].splitlines(),
            fromfile=f"v{against['version_number']}",
            tofile=f"v{target['version_number']}",
            lineterm="",
        )
    )
    return {"target": target, "against": against, "diff": diff}


def restore_revision(connection: sqlite3.Connection, revision_id: int, user_id: int) -> dict[str, Any] | None:
    revision = get_revision(connection, revision_id)
    if not revision:
        return None
    document = connection.execute("SELECT * FROM documents WHERE id = ?", (revision["document_id"],)).fetchone()
    if not document:
        return None
    now = utc_now()
    connection.execute(
        """
        UPDATE documents
        SET content_markdown = ?, summary = ?, updated_by = ?, updated_at = ?
        WHERE id = ?
        """,
        (revision["content_markdown"], revision["summary"], user_id, now, revision["document_id"]),
    )
    new_revision_id = create_revision(
        connection,
        revision["document_id"],
        revision["content_markdown"],
        revision["summary"],
        user_id,
        plugin_data=revision["plugin_data"],
        restored_from_revision_id=revision_id,
    )
    restore_plugin_data(connection, revision["document_id"], revision["plugin_data"])
    reanchor_text_comments(connection, revision["document_id"], revision["content_markdown"])
    refresh_document_fts(connection, revision["document_id"])
    connection.commit()
    return {"document": get_document(connection, revision["document_id"]), "revision_id": new_revision_id}


def list_glossary(connection: sqlite3.Connection, limit: int = 100, offset: int = 0) -> dict[str, Any]:
    rows = connection.execute(
        "SELECT * FROM glossary_terms ORDER BY term LIMIT ? OFFSET ?",
        (limit, offset),
    ).fetchall()
    total = connection.execute("SELECT COUNT(*) AS count FROM glossary_terms").fetchone()["count"]
    return {"items": [dict(row) for row in rows], "total": total}


def search_glossary(connection: sqlite3.Connection, query: str = "", limit: int = 100, offset: int = 0) -> dict[str, Any]:
    if not query:
        return list_glossary(connection, limit=limit, offset=offset)
    pattern = f"%{query.lower()}%"
    rows = connection.execute(
        """
        SELECT *
        FROM glossary_terms
        WHERE lower(term || ' ' || description_markdown) LIKE ?
        ORDER BY term
        LIMIT ? OFFSET ?
        """,
        (pattern, limit, offset),
    ).fetchall()
    total = connection.execute(
        """
        SELECT COUNT(*) AS count
        FROM glossary_terms
        WHERE lower(term || ' ' || description_markdown) LIKE ?
        """,
        (pattern,),
    ).fetchone()["count"]
    return {"items": [dict(row) for row in rows], "total": total}


def get_glossary_term(connection: sqlite3.Connection, term_id: int) -> dict[str, Any] | None:
    row = connection.execute("SELECT * FROM glossary_terms WHERE id = ?", (term_id,)).fetchone()
    return dict(row) if row else None


def create_comment(connection: sqlite3.Connection, document_id: int, payload: dict[str, Any], user_id: int) -> dict[str, Any]:
    now = utc_now()
    cursor = connection.execute(
        """
        INSERT INTO comments
          (document_id, target_type, target_payload_json, body, status, revision_id, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?)
        """,
        (
            document_id,
            payload["target_type"],
            json.dumps(payload.get("target", {}), sort_keys=True),
            payload["body"],
            payload.get("revision_id"),
            user_id,
            now,
            now,
        ),
    )
    connection.commit()
    return get_comment(connection, cursor.lastrowid)  # type: ignore[arg-type]


def list_comments(
    connection: sqlite3.Connection,
    document_id: int,
    status: str | None = None,
    target_type: str | None = None,
) -> list[dict[str, Any]]:
    clauses = ["document_id = ?"]
    values: list[Any] = [document_id]
    if status:
        clauses.append("status = ?")
        values.append(status)
    if target_type:
        clauses.append("target_type = ?")
        values.append(target_type)
    rows = connection.execute(
        f"SELECT * FROM comments WHERE {' AND '.join(clauses)} ORDER BY created_at DESC",
        values,
    ).fetchall()
    return [serialize_comment(row) for row in rows]


def get_comment(connection: sqlite3.Connection, comment_id: int) -> dict[str, Any] | None:
    row = connection.execute("SELECT * FROM comments WHERE id = ?", (comment_id,)).fetchone()
    return serialize_comment(row) if row else None


def set_comment_status(connection: sqlite3.Connection, comment_id: int, status: str) -> dict[str, Any] | None:
    cursor = connection.execute(
        "UPDATE comments SET status = ?, updated_at = ? WHERE id = ?",
        (status, utc_now(), comment_id),
    )
    if cursor.rowcount == 0:
        return None
    connection.commit()
    return get_comment(connection, comment_id)


def update_comment(connection: sqlite3.Connection, comment_id: int, body: str) -> dict[str, Any] | None:
    cursor = connection.execute(
        "UPDATE comments SET body = ?, updated_at = ? WHERE id = ?",
        (body, utc_now(), comment_id),
    )
    if cursor.rowcount == 0:
        return None
    connection.commit()
    return get_comment(connection, comment_id)


def serialize_comment(row: sqlite3.Row) -> dict[str, Any]:
    result = dict(row)
    result["target"] = json.loads(result.pop("target_payload_json"))
    return result


def refresh_document_fts(connection: sqlite3.Connection, document_id: int) -> None:
    row = connection.execute(
        "SELECT title, summary, content_markdown FROM documents WHERE id = ?",
        (document_id,),
    ).fetchone()
    connection.execute("DELETE FROM documents_fts WHERE rowid = ?", (document_id,))
    if row:
        connection.execute(
            "INSERT INTO documents_fts (rowid, title, summary, content_markdown) VALUES (?, ?, ?, ?)",
            (document_id, row["title"], row["summary"], row["content_markdown"]),
        )


def create_attachment(
    connection: sqlite3.Connection,
    document_id: int,
    file_name: str,
    storage_path: str,
    mime_type: str,
    size_bytes: int,
    user_id: int,
    width: int | None = None,
    height: int | None = None,
) -> dict[str, Any]:
    cursor = connection.execute(
        """
        INSERT INTO attachments
          (document_id, file_name, storage_path, mime_type, size_bytes, width, height, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (document_id, file_name, storage_path, mime_type, size_bytes, width, height, user_id, utc_now()),
    )
    connection.commit()
    return get_attachment(connection, cursor.lastrowid)  # type: ignore[arg-type]


def get_attachment(connection: sqlite3.Connection, attachment_id: int, include_deleted: bool = False) -> dict[str, Any] | None:
    clause = "" if include_deleted else " AND deleted_at IS NULL"
    row = connection.execute(
        f"SELECT * FROM attachments WHERE id = ?{clause}",
        (attachment_id,),
    ).fetchone()
    return dict(row) if row else None


def delete_attachment(connection: sqlite3.Connection, attachment_id: int) -> bool:
    cursor = connection.execute(
        "UPDATE attachments SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
        (utc_now(), attachment_id),
    )
    if cursor.rowcount == 0:
        return False
    rows = connection.execute(
        "SELECT * FROM comments WHERE target_type = 'image' AND status != 'orphaned'"
    ).fetchall()
    for row in rows:
        target = json.loads(row["target_payload_json"])
        if target.get("attachment_id") == attachment_id:
            connection.execute(
                "UPDATE comments SET status = 'orphaned', updated_at = ? WHERE id = ?",
                (utc_now(), row["id"]),
            )
    connection.commit()
    return True


def save_plugin_data(connection: sqlite3.Connection, document_id: int, plugin_data: dict[str, Any] | None) -> None:
    save_document_plugin_data(connection, document_id, plugin_data)


def restore_plugin_data(connection: sqlite3.Connection, document_id: int, plugin_data: dict[str, Any]) -> None:
    restore_document_plugin_data(connection, document_id, plugin_data)


def load_plugin_data(connection: sqlite3.Connection, document_id: int) -> dict[str, Any]:
    return load_document_plugin_data(connection, document_id)


def enabled_plugin_ids(connection: sqlite3.Connection) -> list[str]:
    return [
        row["id"]
        for row in connection.execute(
            "SELECT id FROM plugins WHERE status = 'enabled' ORDER BY id"
        )
    ]


def ensure_column(connection: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    columns = {row["name"] for row in connection.execute(f"PRAGMA table_info({table})")}
    if column not in columns:
        connection.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def serialize_revision(row: sqlite3.Row) -> dict[str, Any]:
    result = dict(row)
    result["plugin_data"] = json.loads(result.pop("plugin_data_json", "{}"))
    return result


def reanchor_text_comments(connection: sqlite3.Connection, document_id: int, content_markdown: str) -> None:
    rows = connection.execute(
        """
        SELECT *
        FROM comments
        WHERE document_id = ? AND target_type = 'text_selection' AND status != 'orphaned'
        """,
        (document_id,),
    ).fetchall()
    for row in rows:
        target = json.loads(row["target_payload_json"])
        selected_text = target.get("selected_text", "")
        if not selected_text:
            mark_comment_orphaned(connection, row["id"])
            continue

        start = target.get("start_offset")
        end = target.get("end_offset")
        if (
            isinstance(start, int)
            and isinstance(end, int)
            and 0 <= start <= end <= len(content_markdown)
            and content_markdown[start:end] == selected_text
        ):
            continue

        new_start = find_reanchored_offset(
            content_markdown,
            selected_text,
            target.get("prefix_context", ""),
            target.get("suffix_context", ""),
        )
        if new_start is None:
            mark_comment_orphaned(connection, row["id"])
            continue
        target["start_offset"] = new_start
        target["end_offset"] = new_start + len(selected_text)
        connection.execute(
            "UPDATE comments SET target_payload_json = ?, updated_at = ? WHERE id = ?",
            (json.dumps(target, sort_keys=True), utc_now(), row["id"]),
        )


def find_reanchored_offset(content: str, selected_text: str, prefix: str, suffix: str) -> int | None:
    start = 0
    while True:
        index = content.find(selected_text, start)
        if index < 0:
            return None
        before = content[max(0, index - len(prefix)) : index]
        after = content[index + len(selected_text) : index + len(selected_text) + len(suffix)]
        if (not prefix or before.endswith(prefix)) and (not suffix or after.startswith(suffix)):
            return index
        start = index + 1


def mark_comment_orphaned(connection: sqlite3.Connection, comment_id: int) -> None:
    connection.execute(
        "UPDATE comments SET status = 'orphaned', updated_at = ? WHERE id = ?",
        (utc_now(), comment_id),
    )
