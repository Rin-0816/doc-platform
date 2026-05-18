from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from .db import utc_now

CORE_VERSION = "0.1.0"
PLUGIN_API_VERSION = "0.1.0"
DEFAULT_PLUGINS_ROOT = Path(__file__).resolve().parents[1] / "plugins"


def discover_plugins(root: Path) -> list[dict[str, Any]]:
    manifests = []
    for path in sorted(root.glob("*/manifest.json")):
        manifests.append(json.loads(path.read_text()))
    return manifests


def sync_plugins(connection: sqlite3.Connection, root: Path) -> None:
    for manifest in discover_plugins(root):
        connection.execute(
            """
            INSERT INTO plugins (id, name, version, status, manifest_json)
            VALUES (?, ?, ?, 'disabled', ?)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              version = excluded.version,
              manifest_json = excluded.manifest_json
            """,
            (manifest["id"], manifest["name"], manifest["version"], json.dumps(manifest, sort_keys=True)),
        )
    connection.commit()


def list_plugins(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    return [dict(row) for row in connection.execute("SELECT * FROM plugins ORDER BY id")]


def get_plugin(connection: sqlite3.Connection, plugin_id: str) -> dict[str, Any] | None:
    row = connection.execute("SELECT * FROM plugins WHERE id = ?", (plugin_id,)).fetchone()
    return dict(row) if row else None


def enabled_frontend_plugins(connection: sqlite3.Connection) -> list[dict[str, str]]:
    items = []
    rows = connection.execute(
        """
        SELECT id, manifest_json
        FROM plugins
        WHERE status = 'enabled'
        ORDER BY id
        """
    )
    for row in rows:
        manifest = json.loads(row["manifest_json"])
        frontend_path = manifest.get("frontend")
        if not isinstance(frontend_path, str) or not frontend_path.strip():
            continue
        relative_path = frontend_path.removeprefix("./")
        items.append({"id": row["id"], "module_url": f"/plugins/{row['id']}/{relative_path}"})
    return items


def discover_migrations(manifest: dict[str, Any], root: Path | None = None) -> list[dict[str, Any]]:
    plugin_root = ((root or DEFAULT_PLUGINS_ROOT) / manifest["id"]).resolve()
    migrations = []
    seen_versions = set()
    for migration in manifest.get("migrations", []):
        if not isinstance(migration, dict) or "version" not in migration or "path" not in migration:
            raise ValueError(f"Plugin {manifest['id']} has an invalid migration declaration.")
        version = str(migration["version"])
        if version in seen_versions:
            raise ValueError(f"Plugin {manifest['id']} declares migration {version} more than once.")
        seen_versions.add(version)
        path = (plugin_root / migration["path"]).resolve()
        try:
            path.relative_to(plugin_root)
        except ValueError as exc:
            raise ValueError(f"Plugin {manifest['id']} migration {version} escapes its plugin directory.") from exc
        migrations.append({"version": version, "path": path})
    return migrations


def pending_migrations(
    connection: sqlite3.Connection, plugin_id: str, root: Path | None = None
) -> list[dict[str, Any]] | None:
    plugin = get_plugin(connection, plugin_id)
    if not plugin:
        return None
    manifest = json.loads(plugin["manifest_json"])
    applied_versions = {
        row["version"]
        for row in connection.execute("SELECT version FROM schema_migrations WHERE source = ?", (plugin_id,))
    }
    return [migration for migration in discover_migrations(manifest, root) if migration["version"] not in applied_versions]


def apply_pending_migrations(
    connection: sqlite3.Connection, plugin_id: str, root: Path | None = None
) -> list[str] | None:
    pending = pending_migrations(connection, plugin_id, root)
    if pending is None:
        return None

    applied = []
    for migration in pending:
        path = migration["path"]
        if not path.is_file():
            raise FileNotFoundError(f"Migration file not found: {path}")
        sql = path.read_text()
        try:
            connection.executescript(f"BEGIN IMMEDIATE;\n{sql}")
            connection.execute(
                "INSERT INTO schema_migrations (version, applied_at, source) VALUES (?, ?, ?)",
                (migration["version"], utc_now(), plugin_id),
            )
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        applied.append(migration["version"])
    return applied


def compatibility(
    connection: sqlite3.Connection, plugin_id: str, root: Path | None = None
) -> dict[str, Any] | None:
    plugin = get_plugin(connection, plugin_id)
    if not plugin:
        return None
    manifest = json.loads(plugin["manifest_json"])
    checks = [
        _range_check("core_version", CORE_VERSION, manifest["requires_core"]),
        _range_check("plugin_api", PLUGIN_API_VERSION, manifest["plugin_api"]),
        _migration_check(connection, plugin_id, manifest, root),
    ]
    for dependency in manifest.get("dependencies", []):
        dependency_id = dependency["id"] if isinstance(dependency, dict) else dependency
        checks.append(
            {
                "name": f"dependency:{dependency_id}",
                "result": "OK" if get_plugin(connection, dependency_id) else "ERROR",
                "message": f"Dependency {dependency_id} {'is present' if get_plugin(connection, dependency_id) else 'is missing'}",
            }
        )
    result = _combined_result(checks)
    if result == "ERROR":
        remediation = "Resolve compatibility errors before enabling."
    elif result == "WARN":
        remediation = "Pending migrations will be applied when the plugin is enabled."
    else:
        remediation = "Compatible."
    return {"plugin_id": plugin_id, "plugin_version": plugin["version"], "result": result, "checks": checks, "remediation": remediation}


def set_plugin_status(
    connection: sqlite3.Connection, plugin_id: str, enabled: bool, root: Path | None = None
) -> dict[str, Any] | None:
    plugin = get_plugin(connection, plugin_id)
    if not plugin:
        return None
    if enabled:
        apply_pending_migrations(connection, plugin_id, root)
    now = utc_now()
    connection.execute(
        """
        UPDATE plugins
        SET status = ?, enabled_at = ?, disabled_at = ?
        WHERE id = ?
        """,
        ("enabled" if enabled else "disabled", now if enabled else plugin["enabled_at"], None if enabled else now, plugin_id),
    )
    connection.commit()
    return get_plugin(connection, plugin_id)


def _range_check(name: str, version: str, requirement: str) -> dict[str, str]:
    ok = _version_in_range(version, requirement)
    return {
        "name": name,
        "result": "OK" if ok else "ERROR",
        "message": f"{version} {'matches' if ok else 'does not match'} {requirement}",
    }


def _migration_check(
    connection: sqlite3.Connection, plugin_id: str, manifest: dict[str, Any], root: Path | None
) -> dict[str, str]:
    try:
        migrations = discover_migrations(manifest, root)
        missing = [migration["version"] for migration in migrations if not migration["path"].is_file()]
        if missing:
            versions = ", ".join(missing)
            return {
                "name": "migrations",
                "result": "ERROR",
                "message": f"Migration files are missing for: {versions}",
            }
        pending = pending_migrations(connection, plugin_id, root) or []
    except ValueError as exc:
        return {"name": "migrations", "result": "ERROR", "message": str(exc)}

    if pending:
        versions = ", ".join(migration["version"] for migration in pending)
        return {
            "name": "migrations",
            "result": "WARN",
            "message": f"Pending migrations: {versions}",
        }
    return {"name": "migrations", "result": "OK", "message": "All migrations are applied."}


def _combined_result(checks: list[dict[str, str]]) -> str:
    if any(check["result"] == "ERROR" for check in checks):
        return "ERROR"
    if any(check["result"] == "WARN" for check in checks):
        return "WARN"
    return "OK"


def _version_in_range(version: str, requirement: str) -> bool:
    current = _parse_version(version)
    for token in requirement.split():
        if token.startswith(">="):
            if current < _parse_version(token[2:]):
                return False
        elif token.startswith(">"):
            if current <= _parse_version(token[1:]):
                return False
        elif token.startswith("<="):
            if current > _parse_version(token[2:]):
                return False
        elif token.startswith("<"):
            if current >= _parse_version(token[1:]):
                return False
    return True


def _parse_version(value: str) -> tuple[int, int, int]:
    major, minor, patch = value.split(".")
    return int(major), int(minor), int(patch)
