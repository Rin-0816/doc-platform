from __future__ import annotations

import importlib.util
import json
import sqlite3
from dataclasses import dataclass
from pathlib import Path
from types import ModuleType
from typing import Any


DEFAULT_PLUGINS_ROOT = Path(__file__).resolve().parents[1] / "plugins"
_RUNTIME_CACHE: dict[Path, ModuleType] = {}


@dataclass(frozen=True)
class DocumentPluginRuntime:
    plugin_id: str
    module: ModuleType


def save_document_plugin_data(
    connection: sqlite3.Connection,
    document_id: int,
    plugin_data: dict[str, Any] | None,
) -> None:
    if not plugin_data:
        return
    for runtime in enabled_document_runtimes(connection):
        if runtime.plugin_id not in plugin_data:
            continue
        save = getattr(runtime.module, "save_document_data", None)
        if callable(save):
            save(connection, document_id, plugin_data.get(runtime.plugin_id) or {})


def load_document_plugin_data(connection: sqlite3.Connection, document_id: int) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for runtime in enabled_document_runtimes(connection):
        load = getattr(runtime.module, "load_document_data", None)
        if not callable(load):
            continue
        payload = load(connection, document_id)
        if payload is not None:
            result[runtime.plugin_id] = payload
    return result


def restore_document_plugin_data(
    connection: sqlite3.Connection,
    document_id: int,
    plugin_data: dict[str, Any],
) -> None:
    for runtime in enabled_document_runtimes(connection):
        payload = plugin_data.get(runtime.plugin_id) if runtime.plugin_id in plugin_data else None
        restore = getattr(runtime.module, "restore_document_data", None)
        if callable(restore):
            restore(connection, document_id, payload)
            continue
        if payload is not None:
            save = getattr(runtime.module, "save_document_data", None)
            if callable(save):
                save(connection, document_id, payload)


def enabled_document_runtimes(
    connection: sqlite3.Connection,
    plugins_root: Path | None = None,
) -> list[DocumentPluginRuntime]:
    runtimes = []
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
        runtime_path = manifest.get("runtime")
        if not runtime_path:
            continue
        path = _resolve_runtime_path(row["id"], runtime_path, plugins_root)
        runtimes.append(DocumentPluginRuntime(row["id"], _load_runtime_module(row["id"], path)))
    return runtimes


def _resolve_runtime_path(plugin_id: str, runtime_path: str, plugins_root: Path | None) -> Path:
    plugin_root = ((plugins_root or DEFAULT_PLUGINS_ROOT) / plugin_id).resolve()
    path = (plugin_root / runtime_path).resolve()
    try:
        path.relative_to(plugin_root)
    except ValueError as exc:
        raise ValueError(f"Plugin {plugin_id} runtime escapes its plugin directory.") from exc
    if not path.is_file():
        raise FileNotFoundError(f"Runtime file not found: {path}")
    return path


def _load_runtime_module(plugin_id: str, path: Path) -> ModuleType:
    cached = _RUNTIME_CACHE.get(path)
    if cached is not None:
        return cached
    spec = importlib.util.spec_from_file_location(f"doc_platform_plugin_{plugin_id}_runtime", path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to load plugin runtime: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    _RUNTIME_CACHE[path] = module
    return module
