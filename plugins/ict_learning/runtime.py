from __future__ import annotations

import sqlite3
from datetime import date
from typing import Any


def save_document_data(connection: sqlite3.Connection, document_id: int, payload: dict[str, Any]) -> None:
    if not _metadata_table_exists(connection):
        return

    difficulty = payload.get("difficulty") or None
    if difficulty not in {None, "beginner", "intermediate", "advanced"}:
        raise ValueError("difficulty must be beginner, intermediate, or advanced.")

    estimated_minutes = payload.get("estimated_minutes")
    if estimated_minutes in {"", None}:
        estimated_minutes = None
    elif not isinstance(estimated_minutes, int) or estimated_minutes <= 0:
        raise ValueError("estimated_minutes must be a positive integer.")

    last_verified_on = payload.get("last_verified_on") or None
    if last_verified_on:
        try:
            date.fromisoformat(last_verified_on)
        except ValueError as exc:
            raise ValueError("last_verified_on must use ISO date format.") from exc

    required_equipment = _normalize_string_list(payload.get("required_equipment", []), "required_equipment")
    required_software = _normalize_string_list(payload.get("required_software", []), "required_software")
    supported_platforms = _normalize_platforms(payload.get("supported_platforms", []))

    connection.execute(
        """
        INSERT INTO ict_learning_metadata
          (document_id, learning_objectives_markdown, prerequisites_markdown, difficulty, estimated_minutes, last_verified_on)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(document_id) DO UPDATE SET
          learning_objectives_markdown = excluded.learning_objectives_markdown,
          prerequisites_markdown = excluded.prerequisites_markdown,
          difficulty = excluded.difficulty,
          estimated_minutes = excluded.estimated_minutes,
          last_verified_on = excluded.last_verified_on
        """,
        (
            document_id,
            payload.get("learning_objectives", ""),
            payload.get("prerequisites", ""),
            difficulty,
            estimated_minutes,
            last_verified_on,
        ),
    )
    connection.execute("DELETE FROM ict_learning_required_equipment WHERE document_id = ?", (document_id,))
    connection.executemany(
        """
        INSERT INTO ict_learning_required_equipment (document_id, equipment, position)
        VALUES (?, ?, ?)
        """,
        ((document_id, item, index) for index, item in enumerate(required_equipment)),
    )
    connection.execute("DELETE FROM ict_learning_required_software WHERE document_id = ?", (document_id,))
    connection.executemany(
        """
        INSERT INTO ict_learning_required_software (document_id, software, position)
        VALUES (?, ?, ?)
        """,
        ((document_id, item, index) for index, item in enumerate(required_software)),
    )
    connection.execute("DELETE FROM ict_learning_supported_platforms WHERE document_id = ?", (document_id,))
    connection.executemany(
        """
        INSERT INTO ict_learning_supported_platforms (document_id, os, version)
        VALUES (?, ?, ?)
        """,
        ((document_id, item["os"], item["version"]) for item in supported_platforms),
    )


def load_document_data(connection: sqlite3.Connection, document_id: int) -> dict[str, Any] | None:
    if not _metadata_table_exists(connection):
        return None
    row = connection.execute(
        "SELECT * FROM ict_learning_metadata WHERE document_id = ?",
        (document_id,),
    ).fetchone()
    if not row:
        return None
    return {
        "learning_objectives": row["learning_objectives_markdown"],
        "prerequisites": row["prerequisites_markdown"],
        "difficulty": row["difficulty"],
        "estimated_minutes": row["estimated_minutes"],
        "required_equipment": [
            item["equipment"]
            for item in connection.execute(
                """
                SELECT equipment
                FROM ict_learning_required_equipment
                WHERE document_id = ?
                ORDER BY position, equipment
                """,
                (document_id,),
            )
        ],
        "required_software": [
            item["software"]
            for item in connection.execute(
                """
                SELECT software
                FROM ict_learning_required_software
                WHERE document_id = ?
                ORDER BY position, software
                """,
                (document_id,),
            )
        ],
        "supported_platforms": [
            {"os": item["os"], "version": item["version"]}
            for item in connection.execute(
                """
                SELECT os, version
                FROM ict_learning_supported_platforms
                WHERE document_id = ?
                ORDER BY os, version
                """,
                (document_id,),
            )
        ],
        "last_verified_on": row["last_verified_on"],
    }


def restore_document_data(
    connection: sqlite3.Connection,
    document_id: int,
    payload: dict[str, Any] | None,
) -> None:
    if not _metadata_table_exists(connection):
        return
    if payload is None:
        _clear_document_data(connection, document_id)
        return
    save_document_data(connection, document_id, payload)


def _clear_document_data(connection: sqlite3.Connection, document_id: int) -> None:
    connection.execute("DELETE FROM ict_learning_required_equipment WHERE document_id = ?", (document_id,))
    connection.execute("DELETE FROM ict_learning_required_software WHERE document_id = ?", (document_id,))
    connection.execute("DELETE FROM ict_learning_supported_platforms WHERE document_id = ?", (document_id,))
    connection.execute("DELETE FROM ict_learning_metadata WHERE document_id = ?", (document_id,))


def _metadata_table_exists(connection: sqlite3.Connection) -> bool:
    return bool(
        connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'ict_learning_metadata'"
        ).fetchone()
    )


def _normalize_string_list(value: Any, field: str) -> list[str]:
    if value is None or value == "":
        return []
    if not isinstance(value, list) or not all(isinstance(item, str) and item.strip() for item in value):
        raise ValueError(f"{field} must be a list of strings.")
    return [item.strip() for item in value]


def _normalize_platforms(value: Any) -> list[dict[str, str]]:
    if value is None or value == "":
        return []
    if not isinstance(value, list):
        raise ValueError("supported_platforms must be a list.")
    normalized = []
    for item in value:
        if not isinstance(item, dict):
            raise ValueError("supported_platforms entries must be objects.")
        os_name = item.get("os")
        version = item.get("version")
        if not isinstance(os_name, str) or not os_name.strip() or not isinstance(version, str) or not version.strip():
            raise ValueError("supported_platforms entries require os and version.")
        normalized.append({"os": os_name.strip(), "version": version.strip()})
    return normalized
