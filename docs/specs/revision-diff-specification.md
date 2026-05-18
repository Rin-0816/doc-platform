# 履歴・差分仕様書

## 1. 目的

文書更新、差分確認、過去版復元を一貫して追跡できるようにする。

## 2. 基本契約

- 文書の作成、更新、復元で必ずリビジョンを作成する
- 版番号は文書単位で単調増加
- 現在版は `documents`、過去版は `revisions`

## 3. リビジョン情報

- `document_id`
- `version_number`
- `content_markdown`
- `summary`
- `plugin_data`
- `created_by`
- `created_at`
- `restored_from_revision_id`

## 4. 差分

- 初期実装は行単位
- `GET /api/revisions/{id}/diff?against={id}`
- 応答は比較元、比較先、差分本文を含む

## 5. 復元

- editor 以上
- 指定リビジョンの本文を現在版へ反映する
- 指定リビジョンのプラグインメタデータも現在版へ反映する
- 復元操作でも新規リビジョンを作成する
- 新規リビジョンには `restored_from_revision_id` を記録する

## 6. UI 要件

- 履歴一覧に版番号、更新者、更新日時、要約
- 差分画面から復元元が分かる
- 復元前確認を必須とする

## 7. テスト観点

- 更新ごとのリビジョン作成
- 差分生成
- 復元後の新規リビジョン作成
- 復元元追跡
- 権限制御
