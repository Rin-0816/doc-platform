# 全体アーキテクチャ設計書

## 1. 目的

本書は、社内向けドキュメント管理基盤の構成要素、責務分離、データの流れ、拡張方式を定義する。

## 2. 設計原則

- コア機能と用途別機能を分離する
- 画面は API 経由でのみ業務データを扱う
- プラグインは公開済みの拡張点のみを利用する
- 互換性確認に失敗したプラグインは有効化しない
- 主要機能は自動テスト可能な構造にする

## 3. 論理構成

```text
Browser UI
  |
  v
HTTP API
  |
  +-- Auth / Permission
  +-- Document Service
  +-- Comment Service
  +-- Revision Service
  +-- Glossary Service
  +-- Search Service
  +-- Plugin Host
       |
       +-- Plugin Manager
       +-- Active Plugin Runtimes
  |
  v
SQLite / File Storage
```

## 4. 主要コンポーネント

| コンポーネント | 責務 |
| --- | --- |
| Browser UI | 一覧、詳細、編集、差分、管理画面の表示と操作 |
| HTTP API | UI とサービス層の境界。JSON ベースで入出力を行う |
| Auth / Permission | 認証済みユーザーとロールの判定 |
| Document Service | 文書、セクション、タグ、カテゴリ、レッスンの管理 |
| Comment Service | 文章、画像、Mermaid 図へのコメント管理 |
| Revision Service | 更新履歴、差分、復元 |
| Glossary Service | 用語ページと関連文書 |
| Search Service | 文書、用語、タグ、カテゴリの検索 |
| Plugin Host | 公開 runtime contract、panel host、runtime hook 呼出、コアとプラグインの境界 |
| Plugin Manager | プラグイン検出、登録、有効化、無効化、互換性確認 |
| Plugin Runtime | 専用データの読込、保存、復元、検証、固有 UI、検索拡張、lifecycle hook |
| SQLite | 構造化データ保存 |
| File Storage | 画像などの添付ファイル保存 |

## 5. データフロー

### 5.1 文書閲覧

1. UI が文書取得 API を呼ぶ
2. Document Service が文書本体、関連タグ、カテゴリ、レッスンを取得する
3. Plugin Host が有効プラグイン runtime へ専用データ読込を委譲する
4. UI が Markdown、画像、Mermaid 図を描画する

### 5.2 文書更新

1. 編集画面が API へ更新内容を送る
2. Permission が編集権限を確認する
3. Plugin Host が有効プラグイン runtime の検証処理を実行する
4. Document Service が本文を保存する
5. Plugin Host が有効プラグイン runtime へ専用データ保存を委譲する
6. Revision Service が plugin data スナップショットを含むリビジョンを生成する

### 5.3 プラグイン有効化

1. 管理者がプラグインを選択する
2. Plugin Manager が manifest を読む
3. 互換性チェックが core version、plugin API、依存関係、DB schema、必須設定を検証する
4. 合格した場合のみ runtime を Plugin Host へ登録する
5. UI は有効プラグインの panel だけを panel host から描画する

## 6. コアとプラグインの境界

### 6.1 コア側

- ユーザー
- 権限
- 文書
- コメント
- 履歴
- 用語
- 検索
- プラグイン host
- runtime contract
- panel host
- 互換性チェック
- plugin id ごとの委譲と lifecycle 管理

### 6.2 プラグイン側

- runtime 実装
- 専用メタデータ
- 専用テンプレート
- 専用表示部品
- 専用入力フォーム
- 専用検証処理
- 専用検索項目
- 専用データの読込、保存、復元

コアは `ict_learning` など個別プラグインの field 名、保存先、画面文言を知らない。プラグインは manifest と extension descriptor で公開能力を宣言し、runtime で実行責務を持つ。

## 7. UI 方針

- 同一アプリ内で静的ファイルを配信する軽量 UI とする
- 業務データは API 経由で取得し、サーバー内部構造に直接依存しない
- Markdown 表示、Mermaid 描画、差分表示には CDN ライブラリを利用できる
- 作成ツールとビューアーは panel host を持ち、有効プラグインの UI だけを描画する
- PC、タブレット、モバイル表示を確認対象とする
- UI を大きく変更する場合は、調査、参考画像生成、実装反映の順で進める

## 8. 保存方針

- 構造化データは SQLite に保存する
- 画像などの添付ファイルはファイルシステムに保存し、DB で参照情報を管理する
- 文書本文は履歴管理しやすい形式で保存する
- プラグイン固有データは専用テーブルで保持する

## 9. 拡張方針

- プラグインは manifest によって識別する
- manifest は互換性と公開能力を宣言し、extension descriptor は静的定義、runtime は実行処理を持つ
- 追加できる拡張点は、メタデータ、テンプレート、表示部品、検証、検索拡張とする
- 無効化時は runtime 呼出と UI 拡張を止め、専用データ、migration 履歴、リビジョンスナップショットを保持する
- 将来の追加プラグインは ICT 教材以外の領域にも対応できる

## 10. 運用観点

- 起動時に互換性チェックを実行できる
- 管理画面から再チェックできる
- テストは単体、結合、機能、互換性の層で分ける
- 設計文書を基準に実装と検証を進める
