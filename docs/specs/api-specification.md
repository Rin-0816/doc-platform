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

- `q`
- `category_id`
- `lesson_id`
- `tag`
- `updated_after`
- `page`
- `page_size`

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

## 5. 添付 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `POST` | `/api/documents/{id}/attachments` | editor | 添付追加 |
| `GET` | `/api/attachments/{id}` | viewer | 添付参照 |
| `DELETE` | `/api/attachments/{id}` | editor | 添付削除 |

## 6. コメント API

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

## 7. 履歴 API

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

## 8. 用語 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/glossary` | viewer | 一覧 |
| `GET` | `/api/glossary/{id}` | viewer | 詳細 |

## 9. 検索 API

| Method | Path | 権限 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/api/search` | viewer | 検索 |

クエリ:

- `q`
- `type`
- `category_id`
- `lesson_id`
- `tag`
- `page`
- `page_size`

方針:

- 標準実装は SQLite FTS
- 将来は `search_provider` プラグインで置換可能
- API の応答形はプロバイダ差し替え後も維持する

## 10. プラグイン API

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
