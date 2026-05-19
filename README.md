# doc-platform

社内向けドキュメント管理基盤の設計・実装 workspace です。Python 標準ライブラリ + SQLite で動く軽量プロトタイプとして、文書編集・閲覧・コメント・履歴・検索・添付・用語 Wiki・プラグイン基盤まで実装済みです。

## 目的

- Markdown、画像、Mermaid 図を扱える文書基盤を作る
- メインプログラムとプラグインを分離し、用途別に拡張できる構成にする
- コメント、検索、履歴、差分、用語 Wiki を備える
- 互換性チェックと機能テストを最初から組み込む

## 現在の実装状態

### コア

- ローカル認証 (modal sign-in + avatar popover)
- 文書 CRUD、検索、履歴、差分、復元
- カテゴリ・レッスン・タグの list/create API と quick-add
- 文書一覧の Category → Lesson → Document ツリー表示 + Filter popover
- 検索の分類・単元・タグ絞り込みと用語横断検索
- Markdown、画像添付、Mermaid 図の表示
- 文書、テキスト選択、画像、Mermaid ブロックへのコメント (右側 drawer)
- 文書詳細の **自動目次 (TOC)** (H1/H2/H3 から生成、sticky)
- 日本語/英語 UI 切替とブラウザ保存
- ライト/ダークテーマ切替

### エディタ (Creator)

- 上部にタイトルインライン入力
- Word/Excel 風リボンタブ (Home / Insert / Extensions / View)
- ライブ分割プレビュー (Editor / Split / Preview)
- 書式ツールバー (Bold / Italic / Code / Link / `[[]]` / Heading / List / Quote / CodeBlock)
- Ctrl+B / Ctrl+I / Ctrl+K ショートカット
- 保存状態インジケータ (未保存 / 保存中 / 保存済 HH:MM)
- 選択テキストの「Promote to term」アクション

### 用語 (Wiki)

- 文書中の `[[Term]]` / `[[Term|表示]]` で用語ページにリンク
- 用語ページ (Viewer フルページ) で説明、別名、関連タグ、関連文書を表示
- 用語の **改訂履歴**: 自動 snapshot、差分、復元
- 用語 CRUD (editor 権限): リッチエディタ (split preview + 書式 toolbar)
- 別名 (aliases) で `[[]]` 解決 (例: `[[DB]]` → "Database")
- 用語ごとのタグ (`tags` を共有)
- Used-in パネル: 編集中に「この用語を参照中の文書」を表示
- slug プレビュー + 衝突警告
- スマート削除 (参照あり時は用語名入力で確認)
- 赤リンク (`is-missing`) クリックで用語作成ダイアログ
- 用語フルページ一覧 (`#/glossary`) — タグフィルタ + A-Z / 更新順 ソート
- 一括取り込み (admin、JSON 配列)
- Auto-link トグル (admin) — `app_settings.glossary_autolink` で opt-in

### プラグイン

- プラグイン検出、有効化、無効化、migration、互換性チェック
- 有効プラグイン runtime への `plugin_data` 読込・保存・復元委譲
- frontend module による panel、翻訳、挿入ブロックの差し込み
- 公式 `ict_learning` プラグイン

### 永続 URL

- ハッシュルーティング: `#/doc/<slug>`, `#/term/<slug>`, `#/glossary`
- ブラウザ戻る/進む対応、リロード時に同じ画面を再現、URL 共有可能

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
  .claude/        # 開発支援 (hook + skills)
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

新規プラグイン作成は `.claude/skills/new-plugin/` の scaffold を参照。`.claude/hooks/block_applied_migration_edit.py` が適用済み migration への書き換えをブロックします。

## UI デザイン方針

UI は Notion 風 (白基調 + 青 #2563eb accent + 細い線 + 控えめなシャドウ) を採用。デザイントークン (`:root` の CSS 変数) で色・タイポ・スペース・radius を統一。ダークテーマは `[data-theme="dark"]` で切替。執筆は本文中心、補助情報 (用語・コメント・プラグイン拡張) は drawer/popover/ribbon タブに格納し、無用な常時占有を避ける。

## キーボードショートカット

| キー | 動作 |
| --- | --- |
| `Ctrl+B` | 太字 |
| `Ctrl+I` | 斜体 |
| `Ctrl+K` | リンク挿入 |
| `Ctrl+/` | ショートカット一覧を表示 |
| `Esc` | ダイアログ / drawer を閉じる |

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

1. 認証 provider / 検索 provider プラグインの実 runtime 対応
2. 主要ブラウザ (Firefox / Safari / Edge) の動作確認
3. バックアップ自動化と運用 tooling
4. プラグイン用 frontend testing 基盤
