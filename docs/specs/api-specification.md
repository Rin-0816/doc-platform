# API 設計書

## 1. 目的

UI とバックエンドの契約を定義し、実装者が追加判断なしで API を実装できる状態にする。

## 2. 共通仕様

- 形式は JSON
- 認証済み API はサーバー側で必ず権限判定する
- 一覧 API は `items`、`total`、`page`、`page_size` を返す
- ページング既定値は `page=1`、`page_size=20`
- 日時は ISO 8601 UTC
- エラー形式は次で統一する

```json
{
  "error": {
    "code": "permission_denied",
    "message": "You do not have permission to perform this action.",
    "details": {}
  }
}
```

主なエラーコード:

- `validation_error`
- `authentication_required`
- `permission_denied`
- `not_found`
- `conflict`
- `compatibility_error`
- `internal_error`

## 3. 認証 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | 未認証 | 内蔵認証ログイン |
| `POST` | `/api/auth/logout` | 認証済み | ログアウト |
| `GET` | `/api/auth/session` | 認証済み | 現在ユーザーと権限 |
| `GET` | `/api/auth/providers` | 未認証 | 利用可能な追加認証プロバイダ |

方針:

- 内蔵認証は常に利用可能
- 外部認証は `auth_provider` プラグインで追加する
- 追加プロバイダは `/api/auth/providers` に列挙される
- `/api/auth/session` は UI 表示制御用に有効プラグイン ID も返す

## 4. 文書 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/documents` | viewer | 一覧 |
| `POST` | `/api/documents` | editor | 作成 |
| `GET` | `/api/documents/{id}` | viewer | 詳細 |
| `PUT` | `/api/documents/{id}` | editor | 更新 |
| `DELETE` | `/api/documents/{id}` | editor | 論理削除 |

一覧クエリ:

- `page`
- `page_size`
- `sort` (`updated_desc` または `title_asc`)

絞り込み検索は Search API で扱う。

作成・更新入力:

- `title`
- `slug`
- `summary`
- `content_markdown`
- `category_id`
- `lesson_id`
- `tag_ids`
- `plugin_data`

更新応答:

- 更新後の文書
- 新規 `revision_id`

## 5. 分類 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | viewer | カテゴリ一覧 |
| `POST` | `/api/categories` | editor | カテゴリ作成 |
| `GET` | `/api/lessons` | viewer | レッスン一覧 |
| `POST` | `/api/lessons` | editor | レッスン作成 |
| `GET` | `/api/tags` | viewer | タグ一覧 |
| `POST` | `/api/tags` | editor | タグ作成 |

作成入力:

- `name`
- `slug` 任意。未指定時は `name` から生成する
- `position` 任意。`lessons` のみ対応

現行実装では作成ツールの metadata dialog から quick-add できる。更新・削除の管理 UI は次段階で扱う。

## 6. 添付 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `POST` | `/api/documents/{id}/attachments` | editor | 添付追加 |
| `GET` | `/api/attachments/{id}` | viewer | 添付参照 |
| `DELETE` | `/api/attachments/{id}` | editor | 添付削除 |

## 7. コメント API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/documents/{id}/comments` | viewer | 一覧 |
| `POST` | `/api/documents/{id}/comments` | 認証済み | 作成 |
| `GET` | `/api/comments/{id}` | viewer | 詳細 |
| `PUT` | `/api/comments/{id}` | 投稿者または admin | 更新 |
| `POST` | `/api/comments/{id}/resolve` | editor | 解決 |
| `POST` | `/api/comments/{id}/reopen` | editor | 再オープン |

作成入力:

- `target_type`
- `target`
- `body`
- `revision_id`

検証:

- `target_type` は定義済み種別のみ
- 画像コメントは同一文書の添付を参照する
- `revision_id` は同一文書の版を参照する
- 不正入力は `validation_error`

一覧クエリ:

- `status`
- `target_type`
- `page`
- `page_size`

## 8. 履歴 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/documents/{id}/revisions` | viewer | 履歴一覧 |
| `GET` | `/api/revisions/{id}` | viewer | 版詳細 |
| `GET` | `/api/revisions/{id}/diff?against={id}` | viewer | 差分 |
| `POST` | `/api/revisions/{id}/restore` | editor | 復元 |

復元時:

- 復元元を現在版へ反映する
- 復元元の `plugin_data` も現在版へ反映する
- 必ず新規リビジョンを作成する
- 応答に新規 `revision_id` を含める

## 9. 用語 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/glossary` | viewer | 一覧 (各項目に `aliases` を含む) |
| `POST` | `/api/glossary` | editor | 作成 |
| `GET` | `/api/glossary/{id}` | viewer | 詳細 (関連文書・関連タグ・履歴用メタ含む) |
| `PUT` | `/api/glossary/{id}` | editor | 更新 |
| `DELETE` | `/api/glossary/{id}` | editor | 削除 |
| `POST` | `/api/glossary/bulk` | admin | 一括 upsert (slug をキー) |
| `GET` | `/api/glossary/{id}/revisions` | viewer | 用語の履歴一覧 |
| `GET` | `/api/glossary/revisions/{rid}` | viewer | 用語版詳細 |
| `GET` | `/api/glossary/revisions/diff?a=&b=` | viewer | 用語の説明 unified diff |
| `POST` | `/api/glossary/revisions/{rid}/restore` | editor | 用語復元 (新規 revision を作成) |

作成・更新入力:

- `term` (必須)
- `slug` (任意、未指定時は `term` から生成)
- `description_markdown`
- `aliases` (文字列配列、別名)
- `tag_ids` (整数配列、`tags` テーブルを参照)

詳細応答が追加で返すフィールド:

- `aliases`: `[{id, alias, alias_slug, position}]`
- `tags`: その用語に紐づくタグ
- `related_documents`: 本文に `[[term]]` または `[[alias]]` を含む文書 (id/title/slug/summary/category/lesson/updated_at)
- `related_tags`: 関連文書のタグを集約

`bulk` 入力: 用語オブジェクトの配列、または `{ "items": [...] }` 形式。`slug` 一致で更新、なければ作成。応答は `{ created: [id...], updated: [id...], errors: [...] }`。

## 9-bis. アプリ設定 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/settings` | viewer | 設定一覧 (`{key: value, ...}`) |
| `PUT` | `/api/settings/{key}` | admin | 設定値の更新 (`{"value": "..."}`) |

代表キー:

- `glossary_autolink`: `"on"` / `"off"`。ON 時はビューアー側で本文中の生テキスト中の既知用語名・別名を自動リンク化。既定 `"off"`

## 9-ter. Wiki 構文の解決

- 本文中の `[[Term Name]]` または `[[Term Name|表示文字列]]` はビューアー側で用語ページへの anchor に変換される
- 解決順位: 用語の `term` (大文字小文字無視) → `slug` → 別名 (`alias` / `alias_slug`)
- 該当用語がない場合は `.wiki-link.is-missing` (赤リンク)。editor 権限ありの場合、クリックで用語作成ダイアログを起動
- 関連文書 (`related_documents`) はサーバー側で本文を走査して導出する。手動の `glossary_term_documents` 紐付けは将来用に予約

## 10. 検索 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/search` | viewer | 検索 |

クエリ:

- `q`
- `type` (`document` または `glossary`)
- `category_id`
- `lesson_id`
- `tag`
- `sort` (`updated_desc` または `title_asc`)
- `page`
- `page_size`

方針:

- 標準実装は文書 SQLite FTS と用語 LIKE 検索
- 将来は `search_provider` プラグインで置換可能
- API の応答形はプロバイダ差し替え後も維持する

## 11. プラグイン API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/plugins` | admin | 一覧 |
| `GET` | `/api/plugins/{id}` | admin | 詳細 |
| `POST` | `/api/plugins/{id}/enable` | admin | 有効化 |
| `POST` | `/api/plugins/{id}/disable` | admin | 無効化 |
| `GET` | `/api/plugins/{id}/compatibility` | admin | 互換性確認 |

無効化時:

- UI 拡張、検索拡張、検証処理を停止
- 専用データは保持

## 11. テスト観点

- 正常系、異常系、未存在、競合、権限制御
- ページング、検索条件、エラー形式
- 認証プロバイダ追加
- 検索プロバイダ差し替え
- 復元後の新規履歴生成
