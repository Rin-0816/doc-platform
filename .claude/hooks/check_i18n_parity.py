"""PostToolUse hook: warn when the i18n en/ja maps in globals.js diverge.

Every user-facing string must exist in BOTH the ``en`` and ``ja`` maps inside
the ``translations`` object in ``static/js/globals.js``. After an edit to that
file this advisory hook compares the two key sets and, if they differ, reports
the missing keys to the model (exit code 2) so they can be added right away.

The translation maps are flat (``key: "value"`` per line, bare identifier keys),
so keys are extracted per-line within each map's brace-matched body.

Exit codes follow the Claude Code hook contract:
- 0 = maps agree (or file not applicable)
- 2 = stderr (the divergence report) is surfaced to the model
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def _slice_object(text: str, key: str) -> str | None:
    """Return the inner body of ``<key>: { ... }`` (brace + string aware)."""
    match = re.search(r"\b" + re.escape(key) + r"\s*:\s*\{", text)
    if not match:
        return None
    i = match.end()
    start = i
    depth = 1
    quote: str | None = None
    n = len(text)
    while i < n:
        c = text[i]
        if quote is not None:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start:i]
        i += 1
    return None


def _keys(body: str) -> set[str]:
    """Collect property names at depth 0 of an object body.

    String- and bracket-aware so it works regardless of line formatting and
    ignores any nested-object keys. Values are string/number literals, so the
    only depth-0 identifiers immediately followed by ``:`` are property keys.
    """
    keys: set[str] = set()
    i, n, depth = 0, len(body), 0
    while i < n:
        c = body[i]
        if c in "\"'`":  # skip string literal
            quote = c
            i += 1
            while i < n:
                if body[i] == "\\":
                    i += 2
                    continue
                if body[i] == quote:
                    i += 1
                    break
                i += 1
            continue
        if c in "{[(":
            depth += 1
            i += 1
            continue
        if c in "}])":
            depth -= 1
            i += 1
            continue
        if depth == 0 and (c.isalpha() or c in "_$"):
            j = i
            while j < n and (body[j].isalnum() or body[j] in "_$"):
                j += 1
            k = j
            while k < n and body[k].isspace():
                k += 1
            if k < n and body[k] == ":":
                keys.add(body[i:j])
            i = j
            continue
        i += 1
    return keys


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    file_path = (payload.get("tool_input") or {}).get("file_path")
    if not isinstance(file_path, str) or not file_path:
        return 0

    path = Path(file_path)
    if path.name != "globals.js" or "static" not in path.parts:
        return 0
    if not path.exists():
        return 0

    text = path.read_text(encoding="utf-8", errors="replace")
    if not re.search(r"\btranslations\s*=\s*\{", text):
        return 0

    en = _slice_object(text, "en")
    ja = _slice_object(text, "ja")
    if en is None or ja is None:
        return 0

    en_keys = _keys(en)
    ja_keys = _keys(ja)
    missing_ja = sorted(en_keys - ja_keys)
    missing_en = sorted(ja_keys - en_keys)
    if not missing_ja and not missing_en:
        return 0

    lines = [
        "i18n parity check (static/js/globals.js): the en and ja translation maps differ.",
    ]
    if missing_ja:
        lines.append("  Missing in ja: " + ", ".join(missing_ja))
    if missing_en:
        lines.append("  Missing in en: " + ", ".join(missing_en))
    lines.append("  Add the missing keys so every user-facing string exists in BOTH maps.")
    print("\n".join(lines), file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
