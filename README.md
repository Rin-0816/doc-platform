# doc-platform

社内向けドキュメント管理基盤の設計・実装 workspace です。

## 目的

- Markdown、画像、Mermaid 図を扱える文書基盤を作る
- メインプログラムとプラグインを分離し、用途別に拡張できる構成にする
- コメント、検索、履歴、差分、用語ページを備える
- 互換性チェックと機能テストを最初から組み込む

## ディレクトリ

```text
doc-platform/
  docs/
    requirements/
    architecture/
    specs/
    testing/
    operations/
  plugins/
  tests/
```

## 文書一覧

- [要件定義書](docs/requirements/requirements-definition.md)
- [要件対応表](docs/requirements/traceability-matrix.md)
- [作業台帳](docs/work-plan.md)
- [全体アーキテクチャ設計書](docs/architecture/system-architecture.md)
- [API 設計方針書](docs/specs/api-design-principles.md)
- [画面仕様書](docs/specs/screen-specification.md)
- [プラグイン仕様書](docs/specs/plugin-specification.md)
- [DB 設計書](docs/specs/database-design.md)
- [コメント仕様書](docs/specs/comment-specification.md)
- [履歴・差分仕様書](docs/specs/revision-diff-specification.md)
- [互換性チェック仕様書](docs/specs/compatibility-check-specification.md)
- [コア機能仕様書](docs/specs/core-functional-specification.md)
- [権限設計書](docs/specs/permission-design.md)
- [API 設計書](docs/specs/api-specification.md)
- [ICT 教材プラグイン仕様書](docs/specs/ict-learning-plugin-specification.md)
- [プラグイン開発ガイド](docs/plugin-guide/plugin-development-guide.md)
- [総合テスト計画書](docs/testing/master-test-plan.md)
- [運用手順書](docs/operations/operations-manual.md)
- [文書一覧](docs/README.md)

## 次に作成する文書

1. 詳細レビュー
2. 実装計画
3. 初期アプリ骨格
