# DB 設計書

## 1. 目的

共通データ、履歴、コメント、検索、プラグイン固有データの保存契約を定義する。

## 2. 基本方針

- 構造化データは SQLite
- 添付本体はファイルシステム、参照情報は DB
- コアテーブルは用途非依存
- プラグイン固有データは専用テーブル
- 論理削除を採用する対象は `documents` と `attachments`

## 3. 主要テーブル

| テーブル | 主な列 |
| --- | --- |
| `users` | `id`, `username`, `password_hash`, `display_name`, `is_active`, `created_at`, `updated_at` |
| `roles` | `id`, `code`, `name` |
| `user_roles` | `user_id`, `role_id` |
| `documents` | `id`, `title`, `slug`, `summary`, `content_markdown`, `category_id`, `lesson_id`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at` |
| `document_sections` | `id`, `document_id`, `anchor`, `heading`, `position` |
| `attachments` | `id`, `document_id`, `file_name`, `storage_path`, `mime_type`, `size_bytes`, `width`, `height`, `created_by`, `created_at`, `deleted_at` |
| `categories` | `id`, `name`, `slug` |
| `lessons` | `id`, `name`, `slug`, `position` |
| `tags` | `id`, `name`, `slug` |
| `document_tags` | `document_id`, `tag_id` |
| `glossary_terms` | `id`, `term`, `slug`, `description_markdown`, `created_at`, `updated_at` |
| `glossary_term_aliases` | `id`, `term_id`, `alias`, `alias_slug`, `position` |
| `glossary_term_tags` | `term_id`, `tag_id` |
| `glossary_term_documents` | `term_id`, `document_id` |
| `glossary_revisions` | `id`, `term_id`, `version_number`, `term`, `slug`, `description_markdown`, `aliases_json`, `tag_ids_json`, `created_by`, `created_at`, `restored_from_revision_id` |
| `comments` | `id`, `document_id`, `target_type`, `target_payload_json`, `body`, `status`, `revision_id`, `created_by`, `created_at`, `updated_at` |
| `revisions` | `id`, `document_id`, `version_number`, `content_markdown`, `summary`, `plugin_data_json`, `created_by`, `created_at`, `restored_from_revision_id` |
| `plugins` | `id`, `name`, `version`, `status`, `enabled_at`, `disabled_at`, `last_checked_at`, `manifest_json` |
| `schema_migrations` | `version`, `applied_at`, `source` |
| `app_settings` | `key`, `value`, `updated_at` |

## 4. 関連と制約

- 全 FK は有効化する
- `documents.slug`、`tags.slug`、`categories.slug`、`lessons.slug`、`glossary_terms.slug` は一意
- `revisions(document_id, version_number)` は一意
- `glossary_revisions(term_id, version_number)` は一意
- `document_tags(document_id, tag_id)` は複合一意
- `glossary_term_aliases(term_id, alias_slug)` は複合一意。`alias_slug` はグロッサリ全体で実質一意 (登録時に既存 `term.slug` / 他用語 `alias_slug` と衝突を拒否)
- `glossary_term_aliases` と `glossary_term_tags` は `glossary_terms(id) ON DELETE CASCADE`
- `comments.revision_id` はコメント作成時の対象版を示す
- `app_settings.key` は文字列主キー。代表値: `glossary_autolink` (`"on"` または `"off"`)

## 5. 削除方針

| 対象 | 方針 |
| --- | --- |
| 文書 | 論理削除 |
| 添付 | 論理削除 |
| コメント | 物理削除しない |
| リビジョン | 物理削除しない |
| プラグイン固有データ | プラグイン無効化時も保持 |

## 6. コメント保存

`comments.target_payload_json` は対象種別ごとの詳細情報を保持する。

- text: 位置、選択文字列、前後文脈
- image: 添付 ID、正規化座標、領域
- mermaid: ブロック ID

## 7. FTS と検索

- 標準検索は SQLite FTS を使用
- `documents_fts` と `glossary_terms_fts` を持つ
- FTS は文書保存時と用語保存時に更新する
- 用語の FTS インデックスには `term` と alias 文字列を含める
- 将来の `search_provider` 差し替え時も、API 契約は維持する

## 7-bis. 用語 (Glossary) 詳細

- `glossary_terms` が用語本体。slug は一意
- `glossary_term_aliases` は別名 (例: `Database` の alias `DB`, `RDBMS`)。`[[]]` 解決時に用語名・slug に加えて alias もマッチ対象
- `glossary_term_tags` は用語自体のタグ。文書タグ表 `document_tags` とは独立だが `tags` テーブルを共用
- `glossary_term_documents` は明示的な関連付け用 (将来の手動キュレーション)。現行の関連文書一覧は本文中の `[[]]` 走査で導出
- `glossary_revisions` で用語ごとの履歴を保持。create/update 時に snapshot、restore 時にも snapshot
- `app_settings.glossary_autolink` が `"on"` のとき、本文中の生テキスト中で既知の用語名・別名を自動リンク化 (既定 `"off"`、誤マッチを避けるため opt-in)

## 8. プラグインデータ

- 例: `ict_learning_metadata`, `ict_learning_exercises`, `ict_learning_quizzes`
- 各専用テーブルは `document_id` を FK として持つ
- 無効化時は UI、検索、検証のみ停止し、データは保持
- 再有効化時に既存データを再利用する
- リビジョンには復元用の `plugin_data_json` スナップショットを保持する

## 9. マイグレーション

- コアと各プラグインは個別に migration 系列を持つ
- `schema_migrations.source` には `core` またはプラグイン ID を保存
- 起動時と有効化時に未適用 migration を検出する
- 初期化時は manifest 定義済み migration を適用する
- 有効化時は未適用 migration を先に適用してから状態を切り替える

## 10. インデックス

- `documents(updated_at)`
- `comments(document_id, status)`
- `revisions(document_id, version_number)`
- `attachments(document_id)`
- `plugins(status)`

## 11. テスト観点

- FK 制約
- 論理削除
- 履歴不変性
- FTS 更新
- プラグイン無効化後のデータ保持
- migration 検出
