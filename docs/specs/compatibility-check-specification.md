# 互換性チェック仕様書

## 1. 目的

プラグイン有効化と更新の安全性を保証する。

## 2. チェック契機

- 起動時
- 有効化時
- 更新時
- 管理画面からの手動実行
- CLI 実行

## 3. 判定対象

- `requires_core` の SemVer 範囲
- `plugin_api` の SemVer 範囲
- 依存プラグインの存在と版
- 未適用 migration
- 必須設定
- ID 重複
- ルート、表示領域、provider 名の重複

## 4. 判定

| 判定 | 動作 |
| --- | --- |
| `OK` | 有効化可 |
| `WARN` | 有効化可、管理画面へ表示 |
| `ERROR` | 有効化不可 |

## 5. 出力

- 管理画面
- CLI
- JSON

最低限含める項目:

- plugin id
- plugin version
- result
- checks
- remediation

CLI 終了コード:

- `0`: すべて OK
- `1`: WARN を含む
- `2`: ERROR を含む

## 6. 無効化時

- UI 拡張、provider、検索拡張、validator を停止
- 専用データ、migration 履歴、manifest は保持

## 7. テスト観点

- SemVer 適合 / 不適合
- 依存不足
- migration 未適用
- provider 名重複
- 無効化後のデータ保持
- CLI 終了コード
