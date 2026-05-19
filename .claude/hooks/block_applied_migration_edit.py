"""PreToolUse hook: prevent edits to plugin migration files.

Migration files under ``plugins/<id>/migrations/*.sql`` are write-once. Editing
an applied migration silently desyncs any database that already ran it; the
right move is always to add a new migration with a higher version number.

Behavior:
- Edit / MultiEdit targeting a migration path  -> block.
- Write to an existing migration file          -> block.
- Write to a new migration file                -> allow.
- Anything else                                -> allow.

Exit codes follow the Claude Code hook contract:
- 0 = allow
- 2 = block (stderr is shown to the user / model)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

MIGRATION_GLOB_PARTS = ("plugins", "*", "migrations")


def _is_migration_path(path: Path) -> bool:
    parts = path.parts
    if len(parts) < 4:
        return False
    try:
        idx = parts.index("plugins")
    except ValueError:
        return False
    tail = parts[idx : idx + 4]
    if len(tail) < 4:
        return False
    return (
        tail[0] == "plugins"
        and tail[2] == "migrations"
        and tail[3].endswith(".sql")
    )


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    tool_name = payload.get("tool_name") or ""
    tool_input = payload.get("tool_input") or {}
    file_path = tool_input.get("file_path")
    if not isinstance(file_path, str) or not file_path:
        return 0

    path = Path(file_path)
    if not _is_migration_path(path):
        return 0

    if tool_name in {"Edit", "MultiEdit"}:
        print(
            f"Refusing to edit migration file: {path}\n"
            "Migrations are write-once. Add a NEW migration with the next version "
            "number (e.g. 0002_*.sql) and register it in the plugin manifest.",
            file=sys.stderr,
        )
        return 2

    if tool_name == "Write" and path.exists():
        print(
            f"Refusing to overwrite existing migration file: {path}\n"
            "Create a NEW migration file with the next version number instead.",
            file=sys.stderr,
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
