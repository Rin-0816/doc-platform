from __future__ import annotations

import argparse
import json
from pathlib import Path

from app import db
from app.plugins import apply_pending_migrations, compatibility, list_plugins, sync_plugins
from app.server import create_server


ROOT = Path(__file__).resolve().parent
DEFAULT_DB = ROOT / "data" / "doc_platform.sqlite3"


def command_init_db(args) -> None:
    db.initialize_database(args.database)
    with db.connect(args.database) as connection:
        sync_plugins(connection, ROOT / "plugins")
        for plugin in list_plugins(connection):
            apply_pending_migrations(connection, plugin["id"], ROOT / "plugins")
    print(f"initialized {args.database}")


def command_serve(args) -> None:
    server = create_server(ROOT, args.database, args.host, args.port)
    print(f"serving http://{args.host}:{args.port}")
    server.serve_forever()


def command_check_plugins(args) -> int:
    db.initialize_database(args.database)
    with db.connect(args.database) as connection:
        sync_plugins(connection, ROOT / "plugins")
        results = [compatibility(connection, plugin["id"], ROOT / "plugins") for plugin in list_plugins(connection)]
    print(json.dumps(results, indent=2))
    return _compatibility_exit_code(results)


def _compatibility_exit_code(results) -> int:
    if any(result["result"] == "ERROR" for result in results):
        return 2
    if any(result["result"] == "WARN" for result in results):
        return 1
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument("--database", type=Path, default=DEFAULT_DB)
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_db = subparsers.add_parser("init-db")
    init_db.set_defaults(func=command_init_db)

    serve = subparsers.add_parser("serve")
    serve.add_argument("--host", default="127.0.0.1")
    serve.add_argument("--port", type=int, default=8000)
    serve.set_defaults(func=command_serve)

    check_plugins = subparsers.add_parser("check-plugins")
    check_plugins.set_defaults(func=command_check_plugins)
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    result = args.func(args)
    if isinstance(result, int):
        raise SystemExit(result)


if __name__ == "__main__":
    main()
