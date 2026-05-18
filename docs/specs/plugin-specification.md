# プラグイン仕様書

## 1. 目的

用途別機能をコアから分離し、追加、停止、再有効化できる拡張契約を定義する。

## 2. 設計方針

- コアは host と runtime contract を提供し、プラグイン固有ロジックを持たない
- プラグインは公開拡張点を通じて runtime、固有 UI、検証、検索拡張を登録する
- プラグイン固有データは専用テーブルで保持する
- 無効化時は runtime 呼び出しと UI 拡張を停止し、専用データは残す
- 互換性チェックに合格したものだけ有効化する

## 3. manifest

必須:

- `id`
- `name`
- `version`
- `requires_core`
- `plugin_api`
- `capabilities`

任意:

- `dependencies`
- `description`
- `author`
- `migrations`
- `runtime`
- `frontend`
- `extensions`

バージョン指定は SemVer 範囲を使う。

manifest はプラグインの識別、互換性、依存、migration、公開能力、runtime 入口を宣言する。  
プラグイン固有 field 名、画面文言、保存処理の詳細は manifest に埋め込まず、runtime と extension descriptor 側で持つ。

### 3.1 manifest と runtime の分担

| 要素 | 責務 |
| --- | --- |
| manifest | ID、互換性、依存、migration、capability、runtime/frontend/extension descriptor の場所 |
| extension descriptor | metadata schema、panel 宣言、template、検索拡張などの静的定義 |
| runtime | 読込、保存、復元、検証、provider 登録、lifecycle hook などの実行処理 |
| frontend module | 作成ツール/ビューアーへ差し込む UI 実装、翻訳、挿入ブロック定義 |

## 4. runtime 契約

コアは有効プラグインの runtime を host API 経由で呼び出す。プラグイン runtime は次を担う。

| hook | 用途 |
| --- | --- |
| `load_document_data` | 専用テーブルから `plugin_data.<plugin_id>` を組み立てる |
| `save_document_data` | `plugin_data.<plugin_id>` を専用テーブルへ保存する |
| `restore_document_data` | リビジョンスナップショットから専用データを復元する |
| `validate_document` | 保存前にプラグイン固有入力を検証する |
| `register_edit_panels` | 作成ツールの panel host へ編集 UI を登録する |
| `register_view_panels` | ビューアーの panel host へ閲覧 UI を登録する |
| `register_search_extensions` | 標準検索へ固有条件を登録する |
| `on_enable` / `on_disable` / `on_update` | lifecycle 処理を実行する |

命名は実装時に同等の host API 名へ調整してよいが、責務の所在は変えない。コアは plugin id ごとの委譲だけを扱い、プラグイン固有テーブルや field 名を直接参照しない。

## 5. 拡張点

| 拡張点 | 用途 |
| --- | --- |
| `document_metadata` | 専用メタデータ |
| `templates` | 作成テンプレート |
| `view_panels` | 詳細表示追加 |
| `edit_panels` | 編集 UI 追加 |
| `validators` | 保存時検証 |
| `search_extensions` | 標準検索への項目追加 |
| `auth_provider` | 内蔵認証に追加する外部認証 |
| `search_provider` | 標準検索を置換する検索基盤 |
| `lifecycle_hooks` | 有効化、無効化、更新 |

panel 系拡張は panel host が受け取り、作成ツールとビューアーは有効プラグインだけを描画する。コア画面はプラグイン固有 markup やラベルを直書きせず、frontend module を動的読込する。

## 6. provider 系プラグイン

### 6.1 認証

- 内蔵認証は常に残す
- `auth_provider` は追加ログイン手段として登録する
- プロバイダ障害時も内蔵認証で管理者ログインを維持する

### 6.2 検索

- 初期標準は SQLite FTS
- `search_provider` は検索実装を置換できる
- 置換後も API 応答契約は変えない

## 7. 無効化

- 停止するもの: runtime 呼び出し、UI 拡張、検索拡張、provider 登録、validators、hooks
- 残すもの: manifest 記録、migration 記録、専用データ、リビジョン内の `plugin_data` スナップショット
- 再有効化時は既存データを再利用する
- 無効化中の作成ツールとビューアーは、そのプラグインの panel と操作を表示しない

## 8. 制約

- コアテーブルを直接変更しない
- 未公開 API を利用しない
- 他プラグイン内部へ直接依存しない
- 依存関係は manifest に宣言する
- プラグイン固有 UI、validation、保存処理をコアへ直書きしない

## 9. テスト要件

- manifest 読込
- SemVer 判定
- 依存解決
- migration 適合
- runtime hook 登録
- runtime 委譲による読込、保存、復元
- panel host への登録
- provider 登録
- 有効時のみ UI 拡張が表示されること
- 無効化後のデータ保持
- 再有効化

## 10. 初期公式プラグイン

`ict_learning`
