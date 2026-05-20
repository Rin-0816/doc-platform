# コメント仕様書

## 1. 目的

文章、画像、Mermaid 図へのコメントを、更新後も追跡しやすい形で保持する。

## 2. 対象

- `document`
- `section`
- `text_selection`
- `image`
- `mermaid_block`

## 3. 共通属性

- `id`
- `document_id`
- `target_type`
- `target_payload`
- `body`
- `status`
- `revision_id`
- `created_by`
- `created_at`
- `updated_at`

## 4. 状態

- `open`
- `resolved`
- `orphaned`

## 5. 対象別契約

### 5.1 文章

ハイブリッドアンカーを採用する。

- `start_offset`
- `end_offset`
- `selected_text`
- `prefix_context`
- `suffix_context`

再表示時:

1. offset が一致すればその位置を使う
2. 一致しなければ `selected_text + context` で再探索する
3. 再探索できなければ `orphaned`

### 5.2 画像

- `attachment_id`
- `x_ratio`
- `y_ratio`
- 任意で `width_ratio`, `height_ratio`

座標は `0.0` から `1.0` の正規化値で保存する。

### 5.3 Mermaid

- 初期仕様では `block_id` 単位のみ正式対応
- 要素単位コメントは将来拡張

## 6. 失敗時の扱い

- 対象削除、再アンカー失敗、添付欠損時は `orphaned`
- 孤立コメントは削除せず、元リビジョン参照を表示する
- 孤立コメントも履歴として閲覧できる

## 7. 操作権限

| 操作 | 権限 |
| --- | --- |
| 閲覧 | viewer 以上 |
| 投稿 | 認証済み |
| 編集 | 投稿者または admin |
| 解決 / 再オープン | editor 以上 |

## 8. UI 要件

- 未解決を優先表示
- 孤立コメントは通常コメントと区別する
- 画像コメントは対象位置を復元する
- Mermaid コメントはブロック単位で表示する

### 8.1 位置マーカー (テキスト選択)

- 孤立していないテキスト選択コメントは、本文中の対象テキストに視覚的な位置マーカーを表示する
  - 対象テキストを `<mark class="comment-anchor">` で囲み、その末尾にクリック可能なマーカー (lucide `message-square` アイコン) を付ける
  - マーカーをクリックするとコメント drawer を開き、該当コメントへスクロール・フラッシュ表示する
  - drawer のコメント項目をホバーすると、対応する本文アンカーをハイライトする
- アンカー位置の解決はバックエンドの再アンカー処理と同じ規則に従う (`selected_text` を prefix/suffix コンテキストで一意化して探索)
- 既存の DOM テキストノードのみを包むため XSS 安全 (innerHTML は使わない)

### 8.2 コメント編集

- コメント編集は drawer 内のインライン編集で行う (旧来の `window.prompt` は廃止)
  - 編集対象は textarea + 保存 / キャンセルボタンを表示する
  - 同時に編集できるコメントは 1 件
  - キーボード: `Ctrl/Cmd+Enter` で保存、`Esc` でキャンセル
  - 空本文は保存できない

## 9. テスト観点

- ハイブリッド再アンカー成功
- 再アンカー失敗から orphaned への遷移
- 正規化座標の再現
- Mermaid ブロックコメント
- 権限制御
