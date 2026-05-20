"""PostToolUse hook: run ``node --check`` on edited frontend JS.

This project has NO build step, so a syntax error in a ``<script>`` only
surfaces when the page is loaded in a browser. After any edit to a frontend JS
file we run ``node --check`` and, on failure, feed the error back to the model
(exit code 2) so it can fix the file immediately.

Targets: ``static/js/*.js`` and any ``*/frontend.js`` (plugin frontend modules).
Anything else is allowed through untouched.

Exit codes follow the Claude Code hook contract:
- 0 = nothing to report
- 2 = stderr is surfaced to the model
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path


def _is_js_target(path: Path) -> bool:
    if path.suffix != ".js":
        return False
    if path.name == "frontend.js":  # plugin frontend modules
        return True
    # static/js/*.js — match on the parent dir so relative and absolute paths both work.
    return path.parent.as_posix().endswith("static/js")


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    file_path = (payload.get("tool_input") or {}).get("file_path")
    if not isinstance(file_path, str) or not file_path:
        return 0

    path = Path(file_path)
    if not _is_js_target(path) or not path.exists():
        return 0

    node = shutil.which("node")
    if not node:
        return 0  # node unavailable — nothing we can check

    result = subprocess.run(
        [node, "--check", str(path)],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(
            f"node --check failed for {path.name}:\n{result.stderr.strip()}",
            file=sys.stderr,
        )
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
