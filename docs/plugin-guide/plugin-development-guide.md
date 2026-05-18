# プラグイン開発ガイド

## 1. 目的

プラグイン開発者が、コアを壊さず拡張機能を追加するための基本手順を示す。

## 2. 開発手順

1. `manifest.json` を作成する
2. extension descriptor を作成する
3. 必要な拡張点を選ぶ
4. 専用データ構造を定義する
5. runtime を実装し、読込、保存、復元、検証を host API へ登録する
6. frontend module を実装し、表示パネル、編集パネル、翻訳、必要なら挿入ブロックを登録する
7. テストを作成する
8. 互換性チェックを通す

## 3. 守るべき原則

- コアテーブルを直接変更しない
- 未公開 API を使わない
- 他プラグインの内部実装へ依存しない
- 互換性情報を manifest に明記する
- provider 系プラグインは既存 API 契約を変えない
- 無効化時も専用データを保持する
- コアにプラグイン固有 field、保存処理、UI markup、validation を直書きしない
- 作成ツールとビューアーの UI は panel host 経由で追加する

## 4. 必須成果物

- manifest
- extension descriptor
- runtime
- 専用テーブル定義
- 画面拡張
- バリデーション
- テスト
- 仕様メモ

## 5. runtime 実装

- manifest は識別、互換性、依存、migration、capability、runtime/frontend 入口を宣言する
- extension descriptor は schema、panel、template、検索拡張などの静的定義を持つ
- runtime は `plugin_data.<plugin_id>` の読込、保存、復元、validation、panel/provider 登録を担う
- frontend module は panel host に描画実装、翻訳、挿入ブロックを登録する
- core host は active plugin の runtime を呼び出すだけにとどめる
- 無効化中は runtime hook を呼ばず、UI、検索拡張、validation を停止する
- 無効化中も専用データ、migration 履歴、リビジョンスナップショットは削除しない

## 6. UI 拡張の進め方

UI を新規追加または大きく変更する場合は、次の順で進める。

1. 利用文脈、既存 UI、近い製品事例を調査する
2. 調査結果を踏まえた参考画像を生成する
3. 参考画像を比較材料にして実装へ反映する

参考画像は完成仕様そのものではなく、密度、余白、情報階層、操作配置を検討する材料として扱う。

## 7. レビュー観点

- 拡張点の使い方が適切か
- runtime と declarative descriptor の責務が混ざっていないか
- コア責務を侵食していないか
- 互換性条件が明確か
- 無効化時の影響が説明されているか
- panel host を使わずコア画面を直接編集していないか

## 8. provider 系プラグイン

- `auth_provider` は内蔵認証に追加するログイン手段として実装する
- `search_provider` は検索実装を置換しても API 応答契約を維持する
- provider 名は重複不可
