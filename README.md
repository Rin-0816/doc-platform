# doc-platform

社内向けドキュメント管理基盤の設計・実装 workspace です。現在は標準 Python + SQLite の軽量プロトタイプとして、文書作成、閲覧、コメント、履歴、検索、添付、プラグイン基盤まで実装済みです。

## 目的

- Markdown、画像、Mermaid 図を扱える文書基盤を作る
- メインプログラムとプラグインを分離し、用途別に拡張できる構成にする
- コメント、検索、履歴、差分、用語ページを備える
- 互換性チェックと機能テストを最初から組み込む

## 現在の実装状態

- ローカル認証、文書 CRUD、検索、履歴、差分、復元
- Markdown、画像添付、Mermaid 図の表示
- 文書、テキスト選択、画像、Mermaid ブロックへのコメント
- 作成ツールとビューアーの画面分離
- 日本語/英語 UI 切替とブラウザ保存
- プラグイン検出、有効化、無効化、migration、互換性チェック
- 有効プラグイン runtime への `plugin_data` 読込、保存、復元委譲
- frontend module による作成/閲覧 panel、翻訳、挿入ブロックの差し込み
- 公式 `ict_learning` プラグイン

コアは plugin id ごとの委譲だけを扱い、ICT 教材固有の保存処理、validation、UI、翻訳は `plugins/ict_learning/` 側へ分離しています。

## ディレクトリ

```text
doc-platform/
  app/
    db.py
    plugin_runtime.py
    plugins.py
    server.py
  docs/
    requirements/
    architecture/
    specs/
    testing/
    operations/
  plugins/
    ict_learning/
  tests/
  static/
  templates/
```

## 起動

```bash
python3 manage.py init-db
python3 manage.py serve --host 127.0.0.1 --port 8000
```

ブラウザで開きます。

```text
http://127.0.0.1:8000
```

初期ユーザー:

| Role | Username | Password |
| --- | --- | --- |
| admin | `admin` | `admin` |
| editor | `editor` | `editor` |
| viewer | `viewer` | `viewer` |

## 確認コマンド

```bash
python3 -m unittest discover -s tests -v
python3 -m unittest discover -s plugins/ict_learning/tests -v
node --check static/app.js
node --check plugins/ict_learning/frontend.js
python3 manage.py --database /tmp/doc-platform-check.sqlite3 check-plugins
```

`check-plugins` は未初期化 DB では migration 未適用のため `WARN` を返します。`init-db` 後は `OK` になります。

## プラグイン構成

`ict_learning` は公式サンプル兼初期プラグインです。

- `manifest.json`: core/plugin API 互換性、migration、runtime、frontend module を宣言
- `runtime.py`: ICT 教材 metadata の読込、保存、復元、validation
- `frontend.js`: 作成ツール/ビューアーの panel、翻訳、挿入ブロック定義
- `extensions.json`: metadata schema、panel、template、検索拡張などの静的定義
- `migrations/`: plugin-owned table 定義

## UI デザイン方針

UI を大きく変更する場合は、調査、参考画像生成、実装反映の順で進めます。作成ツールは本文編集を主役にし、タイトルや概要、ICT metadata は補助 panel またはダイアログへ置きます。ビューアーは閲覧を主役にし、コメントや用語、プラグイン panel は補助情報として扱います。

## 文書一覧

- [要件定義書](docs/requirements/requirements-definition.md)
- [要件対応表](docs/requirements/traceability-matrix.md)
- [作業台帳](docs/work-plan.md)
- [全体アーキテクチャ設計書](docs/architecture/system-architecture.md)
- [API 設計方針書](docs/specs/api-design-principles.md)
- [画面仕様書](docs/specs/screen-specification.md)
- [プラグイン仕様書](docs/specs/plugin-specification.md)
- [DB 設計書](docs/specs/database-design.md)
- [コメント仕様書](docs/specs/comment-specification.md)
- [履歴・差分仕様書](docs/specs/revision-diff-specification.md)
- [互換性チェック仕様書](docs/specs/compatibility-check-specification.md)
- [コア機能仕様書](docs/specs/core-functional-specification.md)
- [権限設計書](docs/specs/permission-design.md)
- [API 設計書](docs/specs/api-specification.md)
- [ICT 教材プラグイン仕様書](docs/specs/ict-learning-plugin-specification.md)
- [プラグイン開発ガイド](docs/plugin-guide/plugin-development-guide.md)
- [総合テスト計画書](docs/testing/master-test-plan.md)
- [運用手順書](docs/operations/operations-manual.md)
- [文書一覧](docs/README.md)

## 次の作業候補

1. タグ、カテゴリ、レッスン管理 API と編集 UI
2. 用語の作成/編集 API と関連文書リンク
3. 認証 provider / 検索 provider の実 runtime 対応
4. Chrome 以外のブラウザ確認
5. バックアップ自動化と運用 tooling
