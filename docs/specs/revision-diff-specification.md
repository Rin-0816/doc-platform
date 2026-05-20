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

- 行単位の比較
- `GET /api/revisions/{id}/diff?against={id}`
- 応答は比較元 (`against`, 古い側)、比較先 (`target`, 新しい側)、従来の unified `diff` 文字列を含む
- 加えて左右並列 (side-by-side) 描画用の `rows` 配列を返す
  - `rows` は difflib の opcode (`SequenceMatcher.get_opcodes`) を整列した行配列
  - 各行は `{type, left_no, left, right_no, right}`
    - `type`: `equal` / `insert` / `delete` / `replace`
    - `left` は古い側 (`against`)、`right` は新しい側 (`target`)
    - 行番号は 1 始まり。片側に対応行が無い場合 (`insert` / `delete` / 長さの異なる `replace`) はその側の `*_no` と本文を `null` にする
- 用語 (glossary) の説明 diff も同じ `rows` 形状を返す (`GET /api/glossary/revisions/diff?a=&b=`、`a`=新・`b`=旧、`left_version` / `right_version` 付き)

## 5. 復元

- editor 以上
- 指定リビジョンの本文を現在版へ反映する
- 指定リビジョンのプラグインメタデータも現在版へ反映する
- 復元操作でも新規リビジョンを作成する
- 新規リビジョンには `restored_from_revision_id` を記録する

## 6. UI 要件

文書の履歴画面はタイムライン駆動とする。

- 履歴一覧は新しい順のコンパクトなクリック可能タイムライン。各エントリに版番号・更新日時・要約を表示し、最新版に「現在 (Current)」バッジ、選択中エントリをハイライトする
- タイムラインの版をクリックすると、その版 (右/新) と**直前の版** (左/旧) の GitHub 風 side-by-side diff を表示する
- 履歴を開いた時点では最新版の diff を自動表示する
- 最古版 (比較対象なし) は「最初の版 — 比較対象なし」の旨を表示する
- 任意の 2 版を比較する版選択 (`<select>` 2 つ) + Compare ボタンは「詳細比較 (Advanced compare)」ディスクロージャ内に折りたたんで配置する
- 復元は現在タイムラインで選択中の版を対象とし、復元前確認を必須とする
- ダークモードの side-by-side diff は行ごとにアクセントバー (緑/赤/橙) を付け視認性を確保する
- 用語の履歴画面は版選択ドロップダウン式を維持しつつ、同じ side-by-side レンダラを用いる

## 7. テスト観点

- 更新ごとのリビジョン作成
- 差分生成
- 復元後の新規リビジョン作成
- 復元元追跡
- 権限制御
