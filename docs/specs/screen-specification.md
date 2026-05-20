# 画面仕様書

## 1. 目的

本書は、主要画面の目的、表示要素、操作、API 依存、権限、状態表現を定義する。

## 2. 共通方針

- 画面は API からデータを取得する
- 主要画面は PC、タブレット、モバイルで利用できる
- 空状態、読込中、エラー状態を定義する
- 権限によって表示可能な操作を切り替える

## 3. 主要画面

| 画面 | 目的 | 主操作 |
| --- | --- | --- |
| ホーム / 空状態 | オンボーディングと主要導線 | 文書作成、ショートカット閲覧 |
| 文書一覧 (左 rail) | 文書の探索 | ツリー展開 (Category → Lesson → 文書)、Filter ボタン (popover)、検索、並び替え |
| 文書詳細 (Viewer) | 本文閲覧と関連情報確認 | 目次 (sticky 右側) 移動、関連用語 chip、コメント drawer 開閉、用語参照 (`[[]]`) |
| 文書編集 (Creator) | 文書作成と更新 | 上部にタイトル input、リボン (Home/Insert/Extensions/View) でツール切替、ライブ分割プレビュー |
| 履歴 (Creator) | 文書の版管理 | 版選択、差分、復元 |
| 用語詳細 (Viewer) | 用語理解 | Overview / History タブ。関連タグ、別名、関連文書、用語編集 |
| 用語一覧 | 用語探索 | A-Z / 更新順ソート、タグフィルタ、新規作成、Bulk import (admin) |
| 履歴 (Term) | 用語の版管理 | 版選択、差分、復元 |
| コメント (drawer) | コメントの追加・確認 | 対象選択 (文書/テキスト/画像/Mermaid)、解決/再オープン |
| プラグイン管理 (aux) | 拡張機能管理 | 有効化、無効化、互換性確認 |
| Sign in modal | ログイン | ユーザー名/パスワード、cancel |
| Avatar popover | アカウントメニュー | 言語切替、ダーク/ライト、Auto-link トグル (admin)、Sign out |
| Shortcuts overlay | キーボードショートカット一覧 | Ctrl+/ で表示

## 4. 画面別仕様

### 4.1 ホーム

- 表示: 検索窓、最近更新、カテゴリ、レッスン、タグ
- 操作: キーワード検索、一覧画面へ遷移
- 空状態: 最近更新がない場合は案内文を表示
- 主 API: Search API、Document API

### 4.2 文書一覧

- 表示: 文書名、要約、タグ、カテゴリ、更新日時、更新者
- 操作: キーワード検索、分類絞り込み、単元絞り込み、タグ絞り込み、更新順/タイトル順の並び替え
- 主 API: Document API、Search API

### 4.3 文書詳細

- 表示: タイトル、本文、目次、タグ、カテゴリ、レッスン、関連用語、コメント
- 操作: セクション移動、用語参照、コメント表示、編集画面へ遷移
- コメント対象: 文章、画像、Mermaid 図
- コメント位置マーカー: テキスト選択コメントは本文の対象テキストをハイライト + クリック可能マーカー (message-square) で示し、クリックで drawer の該当コメントへフォーカス・フラッシュする
- コメント編集: drawer 内のインライン編集 (textarea + Save/Cancel、`Ctrl/Cmd+Enter` 保存・`Esc` 取消)。`window.prompt` は廃止
- 主 API: Document API、Comment API、Glossary API

### 4.4 文書編集

- 表示: 上部にタイトル input (常時) と、その直下に常時表示のインライン「URL名」(slug) フィールド、コマンドバー、リボンタブ (Home / Insert / Extensions / View)、ライブ分割プレビュー (Editor / Split / Preview の 3 モード)、保存状態インジケータ
- URL名 (slug): タイトルから自動サジェストし、編集可能。ユーザーが手入力すると自動追従を止め、空にすると再びタイトル追従に戻る。metadata dialog からは外出しした (新規文書で必須 slug が空・非表示のまま保存に失敗していた不具合の修正)
- コマンドバー: metadata 編集、保存状態、Export / Import (editor+)、Delete (editor+)、Save
- リボン Home: Bold / Italic / Code / Link / `[[]]` 用語リンク / Heading / List / Quote / CodeBlock / Promote to term (選択 → 用語化)
- リボン Insert: ブロック挿入ボタン群 (コア + 有効プラグイン定義)、画像アップロード、添付ファイルマネージャ (§4.4.1)
- リボン Extensions: 有効プラグインのパネル (例: ICT learning メタデータ)
- リボン View: プレビュー表示モード切替
- 基本情報: 概要、カテゴリ、レッスン、タグは metadata dialog で編集する (slug は上記のとおりインライン化)
- 操作: 保存 (`Ctrl+S` で submit)、書式ショートカット `Ctrl+B/I/K`、Markdown 入力時に live preview 自動更新
- 保存方針: 自動保存はせず、手動保存 + 未保存変更ガード (アプリ内遷移 + `beforeunload`) で確定
- 権限: 編集者以上
- 主 API: Document API、Taxonomy API、Attachment API、Plugin API、Glossary API

#### 4.4.1 添付ファイルマネージャ (Insert タブ)

- editor+ のみ表示。当該文書の未削除添付をサムネイル / ファイル名 / サイズ + 削除ボタンの一覧で表示する
- 削除は確認後に DB 論理削除 + ディスク上の実ファイル削除を行う。本文に当該画像 URL がまだ参照されている場合は警告メッセージで確認する
- 未保存 (id 未確定) の新規文書では「保存後にアップロード可能」のヒントを表示する
- 主 API: `GET /api/documents/{id}/attachments`、`DELETE /api/attachments/{id}`

#### 4.4.2 記事単位のエクスポート / インポート

- コマンドバーの Export / Import (editor+) で 1 文書を JSON エンベロープとして書き出し / 取り込みできる
- Export: 文書・リビジョン・添付 (base64) を含む JSON をダウンロード
- Import: ファイル選択後、常に**新規文書**を作成する (slug 衝突は `-copy` 等で一意化、分類は名前で解決/作成、添付 URL を再マップ)。復元できなかった添付件数を通知する
- 管理者の DB 全体バックアップ (設定画面) とは別機能
- 主 API: `GET /api/documents/{id}/export`、`POST /api/documents/import`

### 4.5 履歴 (タイムライン駆動)

- 表示: 新しい順のコンパクトなクリック可能タイムライン。各エントリに版番号・更新日時・要約。最新版に「現在 (Current)」バッジ、選択中エントリをハイライト
- 操作: 版をクリックすると、その版 (右/新) と直前版 (左/旧) の side-by-side diff を表示。履歴を開いた時点では最新版の diff を自動表示。最古版は「最初の版 — 比較対象なし」と表示
- 復元はタイムラインで選択中の版を対象とし、確認後に実行する
- 権限: 閲覧は閲覧者以上、復元は編集者以上
- 主 API: Revision API

### 4.6 差分

- 表示: GitHub 風の左右並列 (side-by-side) 差分 (旧/新)。行ごとに equal/insert/delete/replace を色分けし、ダークモードでは行アクセントバー (緑/赤/橙) を付ける
- 操作: タイムラインの版クリックで直前版との比較を表示。任意の 2 版比較は「詳細比較 (Advanced compare)」ディスクロージャ内の版選択 2 つ + Compare ボタンで行う
- 主 API: Revision API (応答の `rows` 配列を並列描画に使用)

### 4.7 用語一覧 / 詳細

- 用語一覧 (`#/glossary`): 用語名、別名 (alias chip)、説明抜粋、タグ。検索ボックス、タグフィルタ、A-Z / Z-A / 最終更新ソート。「New term」(editor+) と「Bulk import」(admin) ボタン
- 用語詳細 (`#/term/<slug>`): タブで Overview / History を切替
  - Overview: 用語名、別名 (Also known as)、自前タグ、関連タグ (関連文書からの集約)、説明 markdown (本文も `[[]]` 解決済)、関連文書カード一覧
  - History: 改訂一覧、2 版間 diff、復元 (editor+)
- 用語編集 (modal): タイトル / slug (preview + 衝突警告) / 別名 (1 行 1 件) / タグ / 説明 (書式ツールバー + ライブ分割プレビュー)、Used-in パネル、削除時は参照文書一覧を提示 + 名前入力で確認
- 主 API: Glossary API、Settings API (Auto-link)

### 4.8 コメント一覧

- 表示: 未解決コメント、対象文書、対象種別、作成者、更新日時
- 操作: 絞り込み、解決状態変更
- 主 API: Comment API

### 4.9 プラグイン管理

- 表示: プラグイン名、バージョン、状態、互換性結果
- 操作: 有効化、無効化、再チェック
- 権限: 管理者
- 主 API: Plugin API

## 5. レイアウト構造 (Notion 風刷新後)

- トップバー: 左にブランド + Viewer/Creator タブ、中央にグローバル検索、右に「New」「Reference」「Sign in」 または「アバター pill」。`position: sticky; top: 0` で固定し、スクロールしてもアバターが右上に留まる
- 文書 rail: Category 折りたたみツリー + Filter popover
- ワークスペース: Viewer は文書詳細または用語詳細または用語一覧を表示 (`state.viewerContent`)、Creator は edit / review / history タブ
- コメント drawer (右側): 文書詳細時に開閉可能、z-index で aux panel より前面
- 補助 (aux) パネル (右側): 用語クイック参照 + プラグイン管理
- 大画面 (>1120px): ツリー + ワークスペース + aux パネル の 3 段表示。Creator 時は aux はオーバーレイ
- タブレット (≤1120px): aux パネルは右からスライドする overlay
- モバイル (≤760px): mobile-nav (下部) で文書/作業/用語/プラグインを切替、ライブプレビューは非表示、リボンは横スクロール

### 5.1 折りたたみ可能なサイドパネル

- 左の文書 rail と右の用語/補助パネルは完全に折りたたみ可能。折りたたみ時は細い edge ハンドル (» / «) で再展開できる
- 折りたたみ状態は localStorage に永続化し、再読込時に復元する
- Viewer では両カラム (左 rail + 右カラム) に適用。Creator では左 rail に適用し、右側は従来どおりスライドオーバー挙動を保つ

## 5-bis. テーマ

- ライト/ダークの 2 テーマ。`[data-theme]` 属性で切替、localStorage 永続化
- アバターメニューからトグル

## 6. 重点操作

- 文書検索から詳細到達まで
- 文章選択からコメント追加まで (drawer)
- 画像または Mermaid 図へのコメント追加
- 文書編集、保存、履歴作成 (ライブプレビューと書式ショートカット)
- 差分確認と過去版復元
- `[[用語]]` 構文によるリンク作成と用語ページ参照
- 赤リンクからの用語作成、選択テキストの用語化 (Promote)
- 用語の編集、別名追加、履歴復元、CSV/JSON 一括取り込み
- プラグイン互換性確認
- ダーク/ライト切替、Auto-link 設定
