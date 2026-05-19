from __future__ import annotations

import sqlite3
from typing import Any


METADATA_TABLE = "{{PLUGIN_ID}}_metadata"


def save_document_data(connection: sqlite3.Connection, document_id: int, payload: dict[str, Any]) -> None:
    if not _metadata_table_exists(connection):
        return
    # TODO: validate payload fields and upsert into {{PLUGIN_ID}}_metadata.
    raise NotImplementedError("Implement save_document_data for {{PLUGIN_ID}}.")


def load_document_data(connection: sqlite3.Connection, document_id: int) -> dict[str, Any] | None:
    if not _metadata_table_exists(connection):
        return None
    row = connection.execute(
        f"SELECT * FROM {METADATA_TABLE} WHERE document_id = ?",
        (document_id,),
    ).fetchone()
    if not row:
        return None
    return dict(row)


def restore_document_data(
    connection: sqlite3.Connection,
    document_id: int,
    payload: dict[str, Any] | None,
) -> None:
    if not _metadata_table_exists(connection):
        return
    if payload is None:
        connection.execute(f"DELETE FROM {METADATA_TABLE} WHERE document_id = ?", (document_id,))
        return
    save_document_data(connection, document_id, payload)


def _metadata_table_exists(connection: sqlite3.Connection) -> bool:
    return bool(
        connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
            (METADATA_TABLE,),
        ).fetchone()
    )
