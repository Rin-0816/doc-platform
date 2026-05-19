const LANGUAGE_STORAGE_KEY = "doc-platform.language";
const SUPPORTED_LANGUAGES = new Set(["en", "ja"]);
const LANGUAGE_LOCALES = {
  en: "en-US",
  ja: "ja-JP",
};
const translations = {
  en: {
    app_title: "Document Platform",
    docs_short: "Docs",
    show_documents: "Show documents",
    search_documents: "Search documents",
    document_organizer: "Document organization filters",
    filter_category: "Category",
    filter_lesson: "Lesson",
    filter_tag: "Tag",
    sort_by: "Sort",
    sort_updated_desc: "Recently updated",
    sort_title_asc: "Title A-Z",
    clear_filters: "Clear filters",
    all_categories: "All categories",
    all_lessons: "All lessons",
    all_tags: "All tags",
    unfiled: "Unfiled",
    workspace_modes: "Workspace modes",
    viewer: "Viewer",
    creator: "Creator",
    creator_views: "Creator views",
    read: "Read",
    edit: "Edit",
    history: "History",
    username: "Username",
    password: "Password",
    sign_in: "Sign in",
    language: "Language",
    sign_out: "Sign out",
    new: "New",
    panels: "Panels",
    documents: "Documents",
    document_detail: "Document detail",
    select_document: "Select a document",
    choose_document_hint: "Choose a document from the list or create a new one.",
    comments: "Comments",
    refresh: "Refresh",
    target: "Target",
    document: "Document",
    text_selection: "Text selection",
    image: "Image",
    mermaid_block: "Mermaid block",
    use_selection: "Use selection",
    comment: "Comment",
    add_comment: "Add comment",
    document_editor: "Document editor",
    edit_document: "Edit document",
    new_document: "New document",
    toggle_theme: "Toggle theme",
    reset: "Reset",
    save: "Save",
    title: "Title",
    document_title_placeholder: "Document title",
    slug: "URL name",
    slug_help: "Use lowercase letters, numbers, and hyphens.",
    summary: "Summary",
    category: "Category",
    lesson: "Lesson",
    tags: "Tags",
    classification: "Classification",
    no_category: "No category",
    no_lesson: "No lesson",
    new_category: "New category",
    new_lesson: "New lesson",
    category_name: "Category name",
    lesson_name: "Lesson name",
    tag_name: "Tag name",
    add_category: "Add category",
    add_lesson: "Add lesson",
    add_tag: "Add tag",
    image_attachment: "Image attachment",
    image_file: "Image file",
    image_alt_text: "Alt text",
    upload_and_insert: "Upload and insert",
    markdown: "Markdown",
    markdown_editor: "Markdown editor",
    markdown_preview: "Markdown preview",
    preview_mode: "Preview mode",
    preview_mode_split: "Split",
    preview_mode_editor: "Editor",
    preview_mode_preview: "Preview",
    preview: "Preview",
    review: "Review",
    document_preview: "Document preview",
    document_information: "Document information",
    insert_block: "Insert block",
    heading: "Heading",
    heading_placeholder: "Heading",
    table: "Table",
    table_column_1: "Column 1",
    table_column_2: "Column 2",
    code_block: "Code block",
    quote: "Quote",
    quote_placeholder: "Quote",
    done: "Done",
    close: "Close",
    open_comments: "Open comments",
    close_comments: "Close comments",
    draft: "Draft",
    revision_history: "Revision history",
    history_and_diff: "History and diff",
    revision_diff: "Revision diff",
    revision: "Revision",
    against: "Against",
    compare: "Compare",
    restore: "Restore",
    reference_panels: "Reference panels",
    auxiliary_panels: "Auxiliary panels",
    glossary: "Glossary",
    plugins: "Plugins",
    search_glossary: "Search glossary",
    filter_terms: "Filter terms",
    plugin_administration: "Plugin administration",
    mobile_panels: "Mobile panels",
    work: "Work",
    select_document_text_first: "Select document text first.",
    request_failed: "Request failed ({status})",
    loading_documents: "Loading documents...",
    loading_taxonomy: "Loading categories...",
    taxonomy_name_required: "Name is required.",
    taxonomy_created: "Added {name}.",
    no_documents_found: "No documents found.",
    total_count: "{count} total",
    untitled_document: "Untitled document",
    no_summary: "No summary",
    loading_document: "Loading document...",
    updated_at: "Updated {date}",
    save_before_upload: "Save the document before uploading images.",
    no_permission: "You do not have permission for this panel.",
    title_slug_required: "Title and URL name are required.",
    saving: "Saving...",
    saved_revision: "Saved revision {id}.",
    saved: "Saved.",
    choose_image_file: "Choose an image file.",
    uploading_image: "Uploading image...",
    upload_missing_image_url: "Upload response did not include an image URL.",
    image_inserted: "Image inserted.",
    loading_comments: "Loading comments...",
    no_comments_yet: "No comments yet.",
    comment_status_open: "Open",
    comment_status_resolved: "Resolved",
    comment_status_orphaned: "Orphaned",
    comment_action_edit: "Edit",
    comment_action_resolve: "Resolve",
    comment_action_reopen: "Reopen",
    sign_in_required: "Sign in is required.",
    comment_body_required: "Comment body is required.",
    choose_comment_target: "Choose a comment target.",
    adding_comment: "Adding comment...",
    comment_progress_resolve: "Resolve comment...",
    comment_progress_reopen: "Reopen comment...",
    edit_comment_prompt: "Edit comment",
    updating_comment: "Updating comment...",
    image_number: "Image {number}",
    mermaid_number: "Mermaid {number}",
    no_text_selected: "No text selected.",
    no_attachment_images: "No attachment images.",
    no_mermaid_blocks: "No Mermaid blocks.",
    loading_revisions: "Loading revisions...",
    no_revisions_yet: "No revisions yet.",
    need_two_revisions: "At least two revisions are needed for a diff.",
    choose_two_different_revisions: "Choose two different revisions.",
    loading_diff: "Loading diff...",
    choose_revision_to_restore: "Choose a revision to restore.",
    restore_revision_confirm: "Restore revision v{version}?",
    restoring_revision: "Restoring revision...",
    restored_revision: "Restored as revision {id}.",
    restored: "Restored.",
    overview: "Overview",
    term_sections: "Term sections",
    term_revision_list: "Term revision history",
    restore_term_revision_confirm: "Restore term version v{version}?",
    restored_term_revision: "Restored as version v{version}.",
    loading_term_revisions: "Loading term history...",
    no_term_revisions_yet: "No revisions yet.",
    need_two_term_revisions: "At least two revisions are needed for a diff.",
    restoring_term_revision: "Restoring...",
    loading_glossary: "Loading glossary...",
    no_glossary_terms_found: "No glossary terms found.",
    untitled_term: "Untitled term",
    wiki_link_unresolved: "No glossary entry for \"{term}\".",
    wiki_link_unresolved_editor: "No glossary entry for \"{term}\". Click to create.",
    promote_to_term: "Promote selection to glossary term",
    promote_no_selection: "Select text in the editor first.",
    related_terms: "Related terms",
    related_documents: "Related documents",
    no_related_documents: "No documents reference this term yet.",
    back_to_document: "Back to document",
    open_term_page: "Open glossary page",
    loading_plugins: "Loading plugins...",
    no_plugins_installed: "No plugins installed.",
    no_version: "No version",
    plugin_status_unknown: "unknown",
    plugin_status_enabled: "enabled",
    plugin_status_disabled: "disabled",
    plugin_action_check: "Check",
    plugin_action_enable: "Enable",
    plugin_action_disable: "Disable",
    plugin_progress_compatibility: "Check {name}...",
    plugin_progress_enable: "Enable {name}...",
    plugin_progress_disable: "Disable {name}...",
    no_details_returned: "No details returned.",
    role_viewer: "viewer",
    role_editor: "editor",
    role_admin: "admin",
    user_with_id: "User {id}",
    unknown_author: "Unknown author",
    image_attachment_label: "Image attachment {id}",
    attached_image: "Attached image",
    no_date: "No date",
    something_went_wrong: "Something went wrong.",
    format_bold: "Bold",
    format_italic: "Italic",
    format_link: "Link",
    format_heading: "Heading",
    format_unordered_list: "Bulleted list",
    format_ordered_list: "Numbered list",
    format_quote: "Quote",
    format_inline_code: "Inline code",
    format_code_block: "Code block",
    format_wiki_link: "Wiki link",
    format_toolbar: "Formatting toolbar",
    table_of_contents: "Contents",
    route_not_found: "Couldn't find that page.",
    insert_term_link: "Insert [[term]] at cursor",
    new_term: "New term",
    edit_term: "Edit term",
    delete_term: "Delete term",
    description: "Description",
    delete_term_confirm: "Delete this term?",
    cancel: "Cancel",
    term: "Term",
    term_saved: "Term saved.",
    term_deleted: "Term deleted.",
    aliases: "Aliases",
    aliases_placeholder: "One alias per line",
    aliases_help: "Alternative names that also match [[wiki links]].",
    also_known_as: "Also known as",
    own_tags: "Tags",
    related_tags: "Related tags",
    filter_documents: "Filter documents",
    document_tree: "Document tree",
    uncategorized: "Uncategorized",
    no_lesson: "No lesson",
    no_documents_in_filter: "No documents match the current filters.",
    ribbon_home: "Home",
    ribbon_insert: "Insert",
    ribbon_extensions: "Extensions",
    ribbon_view: "View",
    editor_ribbon: "Editor ribbon",
    format: "Format",
    structure: "Structure",
    blocks: "Blocks",
    no_extensions_active: "No extensions are active.",
    save_state_unsaved: "Unsaved changes",
    save_state_saving: "Saving...",
    save_state_saved: "Saved {time}",
    empty_welcome_title: "Welcome to DocPlatform",
    empty_welcome_subtitle: "Select a document from the list to read, or create a new one.",
    empty_action_new: "Create document",
    empty_action_shortcuts: "Keyboard shortcuts",
    empty_tip_search: "Use the search box to quickly find documents.",
    empty_tip_wiki: "Type [[term]] to link to glossary pages.",
    empty_tip_shortcuts: "Press Ctrl+/ for keyboard shortcuts.",
    shortcuts_title: "Keyboard shortcuts",
    shortcuts_open_help: "Open keyboard shortcuts",
    shortcuts_esc: "Close dialogs and drawers",
    used_in: "Used in",
    slug_preview_ok: "URL: {slug}",
    slug_preview_collision: "Slug \"{slug}\" is already used by \"{conflict}\".",
    delete_term_question: "Delete the term \"{term}\"?",
    delete_term_used_warning: "This term is referenced by {count} document(s). Deleting it will leave those references as broken links.",
    delete_term_type_confirm: "Type \"{term}\" to confirm deletion:",
    delete: "Delete",
    glossary_all_terms: "All terms",
    bulk_import: "Bulk import",
    bulk_import_help: "Paste a JSON array of terms. Each item needs at minimum a \"term\" field.",
    import: "Import",
    json: "JSON",
    bulk_import_success: "Imported {created} new, updated {updated}.",
    sort_term_asc: "A-Z",
    sort_term_desc: "Z-A",
    autolink_glossary: "Auto-link glossary",
    view_all_terms: "View all terms",
    filter_tag: "Tag",
    all_tags: "All tags",
  },
  ja: {
    app_title: "文書管理",
    docs_short: "文書",
    show_documents: "文書一覧を表示",
    search_documents: "文書を検索",
    document_organizer: "文書の整理条件",
    filter_category: "分類",
    filter_lesson: "単元",
    filter_tag: "タグ",
    sort_by: "並び順",
    sort_updated_desc: "更新が新しい順",
    sort_title_asc: "タイトル順",
    clear_filters: "条件を解除",
    all_categories: "すべての分類",
    all_lessons: "すべての単元",
    all_tags: "すべてのタグ",
    unfiled: "未分類",
    workspace_modes: "表示モード",
    viewer: "閲覧",
    creator: "作成",
    creator_views: "作成画面",
    read: "閲覧",
    edit: "編集",
    history: "履歴",
    username: "ユーザー名",
    password: "パスワード",
    sign_in: "ログイン",
    language: "言語",
    sign_out: "サインアウト",
    new: "新規",
    panels: "補助",
    documents: "文書一覧",
    document_detail: "文書詳細",
    select_document: "文書を選択",
    choose_document_hint: "一覧から文書を選ぶか、新規作成してください。",
    comments: "コメント",
    refresh: "更新",
    target: "対象",
    document: "文書",
    text_selection: "テキスト選択",
    image: "画像",
    mermaid_block: "図表ブロック",
    use_selection: "選択範囲を使う",
    comment: "コメント",
    add_comment: "コメントを追加",
    document_editor: "文書編集",
    edit_document: "文書を編集",
    new_document: "新規文書",
    toggle_theme: "テーマ切替",
    reset: "リセット",
    save: "保存",
    title: "タイトル",
    document_title_placeholder: "文書タイトル",
    slug: "URL名",
    slug_help: "URLに使う短い名前です。半角英数字とハイフンを使います。",
    summary: "概要",
    category: "分類",
    lesson: "単元",
    tags: "タグ",
    classification: "分類情報",
    no_category: "分類なし",
    no_lesson: "単元なし",
    new_category: "新しい分類",
    new_lesson: "新しい単元",
    category_name: "分類名",
    lesson_name: "単元名",
    tag_name: "タグ名",
    add_category: "分類を追加",
    add_lesson: "単元を追加",
    add_tag: "タグを追加",
    image_attachment: "画像添付",
    image_file: "画像ファイル",
    image_alt_text: "画像の説明",
    upload_and_insert: "アップロードして挿入",
    markdown: "本文",
    markdown_editor: "本文エディター",
    markdown_preview: "本文確認",
    preview_mode: "プレビュー表示",
    preview_mode_split: "分割表示",
    preview_mode_editor: "エディタのみ",
    preview_mode_preview: "プレビューのみ",
    preview: "プレビュー",
    review: "確認",
    document_preview: "文書確認",
    document_information: "文書情報",
    insert_block: "部品を挿入",
    heading: "見出し",
    heading_placeholder: "見出し",
    table: "表",
    table_column_1: "項目1",
    table_column_2: "項目2",
    code_block: "コード",
    quote: "引用",
    quote_placeholder: "引用文",
    done: "完了",
    close: "閉じる",
    open_comments: "コメントを開く",
    close_comments: "コメントを閉じる",
    draft: "下書き",
    revision_history: "改訂履歴",
    history_and_diff: "履歴と差分",
    revision_diff: "改訂差分",
    revision: "改訂",
    against: "比較対象",
    compare: "比較",
    restore: "復元",
    reference_panels: "補助情報",
    auxiliary_panels: "補助情報",
    glossary: "用語集",
    plugins: "拡張機能",
    search_glossary: "用語集を検索",
    filter_terms: "用語を絞り込む",
    plugin_administration: "拡張機能管理",
    mobile_panels: "画面切替",
    work: "本文",
    select_document_text_first: "先に文書本文を選択してください。",
    request_failed: "リクエストに失敗しました ({status})",
    loading_documents: "文書を読み込み中...",
    loading_taxonomy: "分類を読み込み中...",
    taxonomy_name_required: "名前は必須です。",
    taxonomy_created: "{name} を追加しました。",
    no_documents_found: "文書が見つかりません。",
    total_count: "合計 {count} 件",
    untitled_document: "無題の文書",
    no_summary: "概要なし",
    loading_document: "文書を読み込み中...",
    updated_at: "更新 {date}",
    save_before_upload: "画像をアップロードする前に文書を保存してください。",
    no_permission: "この操作の権限がありません。",
    title_slug_required: "タイトルとURL名は必須です。",
    saving: "保存中...",
    saved_revision: "改訂 {id} を保存しました。",
    saved: "保存しました。",
    choose_image_file: "画像ファイルを選択してください。",
    uploading_image: "画像をアップロード中...",
    upload_missing_image_url: "アップロード結果に画像 URL が含まれていません。",
    image_inserted: "画像を挿入しました。",
    loading_comments: "コメントを読み込み中...",
    no_comments_yet: "コメントはまだありません。",
    comment_status_open: "未解決",
    comment_status_resolved: "解決済み",
    comment_status_orphaned: "孤立",
    comment_action_edit: "編集",
    comment_action_resolve: "解決",
    comment_action_reopen: "再開",
    sign_in_required: "サインインが必要です。",
    comment_body_required: "コメント本文は必須です。",
    choose_comment_target: "コメント対象を選択してください。",
    adding_comment: "コメントを追加中...",
    comment_progress_resolve: "コメントを解決中...",
    comment_progress_reopen: "コメントを再開中...",
    edit_comment_prompt: "コメントを編集",
    updating_comment: "コメントを更新中...",
    image_number: "画像 {number}",
    mermaid_number: "Mermaid {number}",
    no_text_selected: "テキストが選択されていません。",
    no_attachment_images: "添付画像がありません。",
    no_mermaid_blocks: "図表ブロックがありません。",
    loading_revisions: "改訂を読み込み中...",
    no_revisions_yet: "改訂はまだありません。",
    need_two_revisions: "差分には 2 件以上の改訂が必要です。",
    choose_two_different_revisions: "異なる 2 件の改訂を選択してください。",
    loading_diff: "差分を読み込み中...",
    choose_revision_to_restore: "復元する改訂を選択してください。",
    restore_revision_confirm: "改訂 v{version} を復元しますか？",
    restoring_revision: "改訂を復元中...",
    restored_revision: "改訂 {id} として復元しました。",
    restored: "復元しました。",
    overview: "概要",
    term_sections: "用語タブ",
    term_revision_list: "用語の改訂履歴",
    restore_term_revision_confirm: "用語をバージョン v{version} に復元しますか？",
    restored_term_revision: "v{version} として復元しました。",
    loading_term_revisions: "用語履歴を読み込み中...",
    no_term_revisions_yet: "改訂はまだありません。",
    need_two_term_revisions: "差分には 2 件以上の改訂が必要です。",
    restoring_term_revision: "復元中...",
    loading_glossary: "用語集を読み込み中...",
    no_glossary_terms_found: "用語が見つかりません。",
    untitled_term: "無題の用語",
    wiki_link_unresolved: "「{term}」の用語ページはまだありません。",
    wiki_link_unresolved_editor: "「{term}」の用語ページはまだありません。クリックして作成。",
    promote_to_term: "選択を用語に昇格",
    promote_no_selection: "先にエディタで文字列を選択してください。",
    related_terms: "関連用語",
    related_documents: "関連文書",
    no_related_documents: "この用語を参照している文書はまだありません。",
    back_to_document: "文書へ戻る",
    open_term_page: "用語ページを開く",
    loading_plugins: "拡張機能を読み込み中...",
    no_plugins_installed: "インストール済み拡張機能はありません。",
    no_version: "バージョンなし",
    plugin_status_unknown: "不明",
    plugin_status_enabled: "有効",
    plugin_status_disabled: "無効",
    plugin_action_check: "確認",
    plugin_action_enable: "有効化",
    plugin_action_disable: "無効化",
    plugin_progress_compatibility: "{name} を確認中...",
    plugin_progress_enable: "{name} を有効化中...",
    plugin_progress_disable: "{name} を無効化中...",
    no_details_returned: "詳細が返されませんでした。",
    role_viewer: "閲覧者",
    role_editor: "編集者",
    role_admin: "管理者",
    user_with_id: "ユーザー {id}",
    unknown_author: "不明な作成者",
    image_attachment_label: "画像添付 {id}",
    attached_image: "添付画像",
    no_date: "日付なし",
    something_went_wrong: "問題が発生しました。",
    format_bold: "太字",
    format_italic: "斜体",
    format_link: "リンク",
    format_heading: "見出し",
    format_unordered_list: "箇条書き",
    format_ordered_list: "番号付きリスト",
    format_quote: "引用",
    format_inline_code: "インラインコード",
    format_code_block: "コードブロック",
    format_wiki_link: "用語リンク",
    format_toolbar: "書式ツールバー",
    table_of_contents: "目次",
    route_not_found: "ページが見つかりませんでした。",
    insert_term_link: "[[用語]] をカーソル位置に挿入",
    new_term: "新規用語",
    edit_term: "用語を編集",
    delete_term: "用語を削除",
    description: "説明",
    delete_term_confirm: "この用語を削除しますか？",
    cancel: "キャンセル",
    term: "用語",
    term_saved: "用語を保存しました。",
    term_deleted: "用語を削除しました。",
    aliases: "別名",
    aliases_placeholder: "1 行に 1 別名",
    aliases_help: "[[ウィキリンク]] にもマッチする別名",
    also_known_as: "別名",
    own_tags: "タグ",
    related_tags: "関連タグ",
    filter_documents: "文書を絞り込み",
    document_tree: "文書ツリー",
    uncategorized: "未分類",
    no_documents_in_filter: "条件に一致する文書はありません。",
    ribbon_home: "ホーム",
    ribbon_insert: "挿入",
    ribbon_extensions: "拡張機能",
    ribbon_view: "表示",
    editor_ribbon: "編集リボン",
    format: "書式",
    structure: "構造",
    blocks: "ブロック",
    no_extensions_active: "有効な拡張機能はありません。",
    save_state_unsaved: "未保存の変更",
    save_state_saving: "保存中...",
    save_state_saved: "{time} に保存",
    empty_welcome_title: "DocPlatform へようこそ",
    empty_welcome_subtitle: "左の一覧から文書を選ぶか、新規作成してください。",
    empty_action_new: "文書を作成",
    empty_action_shortcuts: "ショートカット一覧",
    empty_tip_search: "検索ボックスから文書をすぐに見つけられます。",
    empty_tip_wiki: "[[用語]] と書くと用語ページにリンクします。",
    empty_tip_shortcuts: "Ctrl+/ でショートカット一覧を表示。",
    shortcuts_title: "キーボードショートカット",
    shortcuts_open_help: "ショートカット一覧を開く",
    shortcuts_esc: "ダイアログとドロワーを閉じる",
    used_in: "参照している文書",
    slug_preview_ok: "URL: {slug}",
    slug_preview_collision: "「{slug}」は「{conflict}」で既に使われています。",
    delete_term_question: "用語「{term}」を削除しますか？",
    delete_term_used_warning: "この用語は {count} 件の文書から参照されています。削除すると赤リンクになります。",
    delete_term_type_confirm: "確認のため「{term}」と入力してください:",
    delete: "削除",
    glossary_all_terms: "全用語",
    bulk_import: "一括取り込み",
    bulk_import_help: "用語の JSON 配列を貼り付けてください。各アイテムには最低限 \"term\" フィールドが必要です。",
    import: "取り込む",
    json: "JSON",
    bulk_import_success: "新規 {created} 件、更新 {updated} 件を取り込みました。",
    sort_term_asc: "あいうえお順",
    sort_term_desc: "降順",
    autolink_glossary: "用語の自動リンク",
    view_all_terms: "全用語を表示",
    filter_tag: "タグ",
    all_tags: "すべてのタグ",
  },
};

const CORE_INSERT_BLOCKS = [
  {
    id: "heading",
    labelKey: "heading",
    icon: "heading-2",
    markdown: () => `## ${t("heading_placeholder")}`,
  },
  {
    id: "table",
    labelKey: "table",
    icon: "table",
    markdown: () => `| ${t("table_column_1")} | ${t("table_column_2")} |\n| --- | --- |\n|  |  |`,
  },
  {
    id: "image",
    labelKey: "image",
    icon: "image",
    markdown: () => `![${t("image_alt_text")}](image-url)`,
  },
  {
    id: "code",
    labelKey: "code_block",
    icon: "code-2",
    markdown: "```text\n\n```",
  },
  {
    id: "quote",
    labelKey: "quote",
    icon: "quote",
    markdown: () => `> ${t("quote_placeholder")}`,
  },
  {
    id: "mermaid",
    labelKey: "mermaid_block",
    icon: "workflow",
    markdown: "```mermaid\ngraph TD\n  A --> B\n```",
  },
];

let frontendPlugins = [];
let frontendPluginTranslations = { en: {}, ja: {} };
let suppressNextHashChange = false;
let pendingHashRoute = null;
const collapsedTreeGroups = new Set();
const collapsedTreeSubgroups = new Set();
const localizedTaxonomyNames = {
  ja: {
    general: "未分類",
    "getting-started": "はじめに",
  },
};

const state = {
  session: null,
  documents: [],
  documentTotal: 0,
  selectedDocument: null,
  editorSeed: null,
  comments: [],
  commentDraftTarget: null,
  commentTargetOptions: {
    images: [],
    mermaidBlocks: [],
  },
  revisions: [],
  glossary: [],
  categories: [],
  lessons: [],
  tags: [],
  selectedTerm: null,
  editingTerm: null,
  deleteTermPending: null,
  activeTermTab: "overview",
  termRevisions: [],
  selectedTermRevision: null,
  viewerContent: "document",
  glossaryIndexFilter: { q: "", tag: "", sort: "term_asc" },
  settings: { glossary_autolink: "off" },
  plugins: [],
  activeMode: "viewer",
  activeCreatorView: "edit",
  previewMode: "split",
  activeRibbonTab: "home",
  activePanel: "glossary",
  commentsOpen: false,
  language: getInitialLanguage(),
  avatarMenuOpen: false,
  railFilterOpen: false,
  theme: "light",
  editorDirty: false,
  editorSaving: false,
  lastSavedAt: null,
};

const elements = {
  shell: document.querySelector(".app-shell"),
  searchForm: document.querySelector('[data-form="document-search"]'),
  searchInput: document.querySelector("#document-search"),
  documentCount: document.querySelector("#document-count"),
  documentCategoryFilter: document.querySelector("#document-category-filter"),
  documentLessonFilter: document.querySelector("#document-lesson-filter"),
  documentTagFilter: document.querySelector("#document-tag-filter"),
  documentSort: document.querySelector("#document-sort"),
  documentListStatus: document.querySelector("#document-list-status"),
  documentList: document.querySelector("#document-list"),
  documentEmpty: document.querySelector("#document-empty"),
  documentDetail: document.querySelector("#document-detail"),
  documentContext: document.querySelector("#document-context"),
  documentTitle: document.querySelector("#document-title"),
  documentMeta: document.querySelector("#document-meta"),
  documentSummary: document.querySelector("#document-summary"),
  viewerPluginPanels: document.querySelector("#viewer-plugin-panels"),
  documentMarkdown: document.querySelector("#document-markdown"),
  documentToc: document.querySelector("#document-toc"),
  documentTocList: document.querySelector("#document-toc-list"),
  documentRelatedTerms: document.querySelector("#document-related-terms"),
  documentRelatedTermsChips: document.querySelector("#document-related-terms-chips"),
  termDetail: document.querySelector("#term-detail"),
  termDetailTitle: document.querySelector("#term-detail-title"),
  termDetailTags: document.querySelector("#term-detail-tags"),
  termDetailDescription: document.querySelector("#term-detail-description"),
  termRelatedDocumentsList: document.querySelector("#term-related-documents-list"),
  termRelatedDocumentsStatus: document.querySelector("#term-related-documents-status"),
  termRevisionList: document.querySelector("#term-revision-list"),
  termDiffTarget: document.querySelector("#term-diff-target"),
  termDiffAgainst: document.querySelector("#term-diff-against"),
  termDiffStatus: document.querySelector("#term-diff-status"),
  termDiffOutput: document.querySelector("#term-diff-output"),
  creatorPreviewContext: document.querySelector("#creator-preview-context"),
  creatorPreviewTitle: document.querySelector("#creator-preview-title"),
  creatorPreviewMeta: document.querySelector("#creator-preview-meta"),
  creatorPreviewSummary: document.querySelector("#creator-preview-summary"),
  creatorPreviewPluginPanels: document.querySelector("#creator-preview-plugin-panels"),
  creatorPreviewMarkdown: document.querySelector("#creator-preview-markdown"),
  creatorDocumentLabel: document.querySelector("#creator-document-label"),
  creatorSaveState: document.querySelector("#creator-save-state"),
  commentsPanel: document.querySelector("#comments-panel"),
  commentsToggle: document.querySelector('[data-action="toggle-comments"]'),
  commentsCountBadge: document.querySelector("#comments-count-badge"),
  commentsStatus: document.querySelector("#comments-status"),
  commentList: document.querySelector("#comment-list"),
  commentForm: document.querySelector("#comment-form"),
  commentImageField: document.querySelector("#comment-image-field"),
  commentImageTarget: document.querySelector("#comment-image-target"),
  commentMermaidField: document.querySelector("#comment-mermaid-field"),
  commentMermaidTarget: document.querySelector("#comment-mermaid-target"),
  commentTargetSummary: document.querySelector("#comment-target-summary"),
  editorForm: document.querySelector("#editor-form"),
  editorHeading: document.querySelector("#editor-heading"),
  editorStatus: document.querySelector("#editor-status"),
  creatorPluginPanels: document.querySelector("#creator-plugin-panels"),
  attachmentFile: document.querySelector("#attachment-file"),
  attachmentStatus: document.querySelector("#attachment-status"),
  attachmentUploadButton: document.querySelector('[data-action="upload-image"]'),
  historyStatus: document.querySelector("#history-status"),
  revisionList: document.querySelector("#revision-list"),
  diffTarget: document.querySelector("#diff-target"),
  diffAgainst: document.querySelector("#diff-against"),
  diffStatus: document.querySelector("#diff-status"),
  diffOutput: document.querySelector("#diff-output"),
  glossarySearch: document.querySelector("#glossary-search"),
  glossaryStatus: document.querySelector("#glossary-status"),
  glossaryList: document.querySelector("#glossary-list"),
  glossaryDetail: document.querySelector("#glossary-detail"),
  pluginStatus: document.querySelector("#plugin-status"),
  pluginList: document.querySelector("#plugin-list"),
  loginForm: document.querySelector("#login-form"),
  loginDialog: document.querySelector("#login-dialog"),
  loginError: document.querySelector("#login-error"),
  avatarMenu: document.querySelector("#avatar-menu"),
  avatarInitials: document.querySelector("#avatar-initials"),
  avatarName: document.querySelector("#avatar-name"),
  avatarMenuName: document.querySelector("#avatar-menu-name"),
  avatarMenuRole: document.querySelector("#avatar-menu-role"),
  languageSelect: document.querySelector("#language-select"),
  metadataDialog: document.querySelector("#metadata-dialog"),
  termEditorDialog: document.querySelector("#term-editor-dialog"),
  metadataCategory: document.querySelector("#metadata-category"),
  metadataLesson: document.querySelector("#metadata-lesson"),
  metadataTags: document.querySelector("#metadata-tags"),
  metadataNewCategory: document.querySelector("#metadata-new-category"),
  metadataNewLesson: document.querySelector("#metadata-new-lesson"),
  metadataNewTag: document.querySelector("#metadata-new-tag"),
  editorLivePreview: document.querySelector("#editor-live-preview"),
  writingStage: document.querySelector(".writing-stage"),
};

let dateFormatter = createDateFormatter();

if (window.mermaid) {
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "strict",
  });
}

applyTranslations();
boot();

async function boot() {
  setTheme(getInitialTheme());
  bindEvents();
  window.addEventListener("hashchange", onHashChange);
  elements.shell.dataset.mobileView = "documents";
  setCommentsOpen(false);
  setAppMode(state.activeMode);
  setCreatorView(state.activeCreatorView);
  setPreviewMode(state.previewMode);
  setRibbonTab(state.activeRibbonTab);
  renderInsertBlocks();
  renderRoleAwareControls();
  renderSaveState();
  await loadSession();
  if (state.session) {
    await loadSettings();
    const initial = parseHashRoute();
    const hasInitialRoute = Boolean(initial);
    await Promise.allSettled([
      loadDocuments("", { skipAutoSelect: hasInitialRoute }),
      loadGlossary(),
      loadTaxonomy(),
    ]);
    if (hasInitialRoute) {
      await applyHashRoute(initial);
    }
  } else {
    // Defer hash route application until after login
    pendingHashRoute = parseHashRoute();
    renderDocumentList();
    renderGlossaryList();
    renderTaxonomyControls();
    renderDocumentFilterControls();
  }
}

function parseHashRoute() {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#/") return null;
  // Remove leading '#' then split on '/'
  const path = hash.replace(/^#\/?/, "");
  const parts = path.split("/").filter(Boolean);
  if (!parts.length) return null;
  const type = parts[0];
  // Glossary index: #/glossary (no slug required)
  if (type === "glossary" && parts.length === 1) {
    return { type: "glossary", slug: "" };
  }
  if (type !== "doc" && type !== "term") return null;
  if (parts.length < 2) return null;
  const slug = decodeURIComponent(parts.slice(1).join("/").replace(/\/+$/, ""));
  if (!slug) return null;
  return { type, slug };
}

function updateHashRoute({ type, slug }, { replace = false } = {}) {
  suppressNextHashChange = true;
  let hash = "#/" + type;
  if (slug) hash += "/" + encodeURIComponent(slug);
  if (replace) {
    history.replaceState(null, "", location.pathname + location.search + hash);
  } else {
    history.pushState(null, "", location.pathname + location.search + hash);
  }
}

async function applyHashRoute(route) {
  if (!route) return;
  if (route.type === "glossary") {
    showGlossaryIndex();
    return;
  }
  if (route.type === "doc") {
    let doc = state.documents.find((d) => d.slug === route.slug);
    if (!doc) {
      // Fallback: search API
      try {
        const params = new URLSearchParams({ q: route.slug, type: "document", page_size: "5" });
        const payload = await request(`/api/search?${params}`);
        const results = listItems(payload).map(normalizeDocument);
        doc = results.find((d) => d.slug === route.slug);
        if (doc && !state.documents.some((d) => d.slug === doc.slug)) {
          state.documents = [doc, ...state.documents];
          renderDocumentList();
        }
      } catch (_) {
        // ignore search errors; fall through to not-found
      }
    }
    if (!doc) {
      setStatus(elements.documentListStatus, t("route_not_found"), true);
      return;
    }
    await selectDocument(doc.id, { skipHashUpdate: true });
  } else if (route.type === "term") {
    const term = state.glossary.find((term) => term.slug === route.slug);
    if (!term) {
      setStatus(elements.glossaryStatus, t("route_not_found"), true);
      return;
    }
    await selectTerm(term.id, { focusViewer: true, skipHashUpdate: true });
  }
}

function onHashChange() {
  if (suppressNextHashChange) {
    suppressNextHashChange = false;
    return;
  }
  applyHashRoute(parseHashRoute());
}

function bindEvents() {
  document.addEventListener("click", handleClick);
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadDocuments(elements.searchInput.value.trim());
  });
  elements.searchInput.addEventListener("input", debounce(() => {
    loadDocuments(elements.searchInput.value.trim());
  }, 240));
  [
    elements.documentCategoryFilter,
    elements.documentLessonFilter,
    elements.documentTagFilter,
    elements.documentSort,
  ].forEach((control) => {
    control.addEventListener("change", () => {
      updateFilterActiveDot();
      loadDocuments(elements.searchInput.value.trim());
    });
  });
  elements.editorForm.addEventListener("submit", saveDocument);
  document.querySelector("#term-editor-form")?.addEventListener("submit", submitTermForm);
  elements.editorForm.addEventListener("input", () => {
    markEditorDirty();
    renderCreatorDraft();
    renderCreatorMetadataSummary();
  });
  elements.editorForm.addEventListener("change", () => {
    markEditorDirty();
    renderCreatorDraft();
    renderCreatorMetadataSummary();
  });
  elements.editorForm.elements.content_markdown.addEventListener(
    "input",
    debounce(renderEditorLivePreview, 300),
  );
  const termTextarea = document.querySelector("#term-editor-description-textarea");
  if (termTextarea) {
    termTextarea.addEventListener("input", debounce(renderTermEditorPreview, 300));
  }
  const termEditorForm = document.querySelector("#term-editor-form");
  if (termEditorForm) {
    termEditorForm.elements.term?.addEventListener("input", updateSlugPreview);
    termEditorForm.elements.slug?.addEventListener("input", updateSlugPreview);
  }
  elements.commentForm.addEventListener("submit", createComment);
  elements.commentForm.elements.target_type.addEventListener("change", () => {
    state.commentDraftTarget = null;
    updateCommentTargetControls();
  });
  elements.commentImageTarget.addEventListener("change", () => updateCommentTargetControls());
  elements.commentMermaidTarget.addEventListener("change", () => updateCommentTargetControls());
  elements.documentMarkdown.addEventListener("mouseup", () => {
    if (elements.commentForm.elements.target_type.value === "text_selection") {
      captureTextCommentTarget();
    }
  });
  elements.documentMarkdown.addEventListener("keyup", () => {
    if (elements.commentForm.elements.target_type.value === "text_selection") {
      captureTextCommentTarget();
    }
  });
  elements.documentMarkdown.addEventListener("click", captureImageCommentTarget);
  elements.glossarySearch.addEventListener("input", () => renderGlossaryList());
  elements.loginForm.addEventListener("submit", login);
  // Bulk import form
  document.querySelector("#bulk-import-form")?.addEventListener("submit", submitBulkImport);
  // Glossary index filter controls
  document.querySelector("#glossary-index-search")?.addEventListener("input", (event) => {
    state.glossaryIndexFilter.q = event.target.value;
    renderGlossaryIndex();
  });
  document.querySelector("#glossary-index-tag-filter")?.addEventListener("change", (event) => {
    state.glossaryIndexFilter.tag = event.target.value;
    renderGlossaryIndex();
  });
  document.querySelector("#glossary-index-sort")?.addEventListener("change", (event) => {
    state.glossaryIndexFilter.sort = event.target.value;
    renderGlossaryIndex();
  });
  elements.languageSelect.addEventListener("change", (event) => setLanguage(event.target.value));
  document.addEventListener("click", closeInsertMenuOnOutsideClick);
  document.addEventListener("click", closeAvatarMenuOnOutsideClick);
  document.addEventListener("click", closeRailFilterOnOutsideClick);
  document.addEventListener("keydown", handleGlobalKeydown);
}

async function handleClick(event) {
  const wikiLink = event.target.closest("a.wiki-link");
  if (wikiLink) {
    event.preventDefault();
    if (wikiLink.dataset.termId) {
      await selectTerm(wikiLink.dataset.termId);
    } else if (wikiLink.classList.contains("is-missing") && hasRoleAtLeast("editor")) {
      const target = wikiLink.dataset.wikiTarget || wikiLink.textContent || "";
      openTermEditorForCreation(target);
    }
    return;
  }

  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  if (button.dataset.mode) {
    setAppMode(button.dataset.mode);
    return;
  }

  if (button.dataset.creatorView) {
    setCreatorView(button.dataset.creatorView);
    return;
  }

  if (button.dataset.ribbonTab) {
    setRibbonTab(button.dataset.ribbonTab);
    return;
  }

  if (button.dataset.previewMode) {
    setPreviewMode(button.dataset.previewMode);
    return;
  }

  if (button.dataset.formatAction) {
    applyFormatAction(button.dataset.formatAction, button.dataset.formatTarget || "document");
    return;
  }

  if (button.dataset.insertKind) {
    insertMarkdownBlock(button.dataset.insertKind);
    return;
  }

  if (button.dataset.panel) {
    setAuxPanel(button.dataset.panel);
    return;
  }

  if (button.dataset.mobileTarget) {
    setMobileView(button.dataset.mobileTarget);
    return;
  }

  if (button.dataset.documentId) {
    setMobileView("workspace");
    await selectDocument(button.dataset.documentId);
    return;
  }

  if (button.dataset.termId) {
    await selectTerm(button.dataset.termId);
    return;
  }

  if (button.dataset.revisionId) {
    selectRevision(button.dataset.revisionId);
    return;
  }

  if (button.dataset.termTab) {
    setTermTab(button.dataset.termTab);
    return;
  }

  if (button.dataset.termRevisionId) {
    selectTermRevision(button.dataset.termRevisionId);
    return;
  }

  if (button.dataset.pluginAction) {
    await mutatePlugin(button.dataset.pluginId, button.dataset.pluginAction);
    return;
  }

  if (button.dataset.commentAction) {
    await mutateComment(button.dataset.commentId, button.dataset.commentAction);
    return;
  }

  if (button.dataset.action === "toggle-tree-group") {
    const key = button.dataset.groupKey;
    if (key) {
      if (collapsedTreeGroups.has(key)) {
        collapsedTreeGroups.delete(key);
      } else {
        collapsedTreeGroups.add(key);
      }
      renderDocumentList();
    }
    return;
  }

  if (button.dataset.action === "toggle-tree-subgroup") {
    const key = button.dataset.subgroupKey;
    if (key) {
      if (collapsedTreeSubgroups.has(key)) {
        collapsedTreeSubgroups.delete(key);
      } else {
        collapsedTreeSubgroups.add(key);
      }
      renderDocumentList();
    }
    return;
  }

  switch (button.dataset.action) {
    case "show-documents":
      setMobileView("documents");
      break;
    case "open-login":
      openLoginDialog();
      break;
    case "close-login":
      closeLoginDialog();
      break;
    case "toggle-avatar-menu":
      toggleAvatarMenu();
      break;
    case "toggle-theme":
      toggleTheme();
      closeAvatarMenu();
      break;
    case "new-document":
      startNewDocument();
      break;
    case "open-metadata":
      openMetadataDialog();
      break;
    case "close-metadata":
      closeMetadataDialog();
      break;
    case "toggle-insert-menu":
      // insert trigger removed — ribbon Insert tab replaces it
      break;
    case "create-category":
      await createTaxonomyItem("categories");
      break;
    case "create-lesson":
      await createTaxonomyItem("lessons");
      break;
    case "create-tag":
      await createTaxonomyItem("tags");
      break;
    case "clear-document-filters":
      clearDocumentFilters();
      break;
    case "back-to-document":
      showSelectedDocument();
      break;
    case "new-term":
      openTermEditor(null);
      break;
    case "edit-term":
      openTermEditor(state.selectedTerm);
      break;
    case "delete-term":
      await confirmDeleteTerm();
      break;
    case "close-term-editor":
      closeTermEditor();
      break;
    case "close-delete-term":
      closeDeleteTermDialog();
      break;
    case "confirm-delete-term":
      await executeDeleteTerm();
      break;
    case "toggle-rail-filters":
      setRailFilterOpen(!state.railFilterOpen);
      break;
    case "toggle-aux":
      elements.shell.dataset.auxOpen = elements.shell.dataset.auxOpen !== "true";
      break;
    case "insert-glossary-term-link": {
      const termName = button.dataset.termName || "";
      if (state.activeMode !== "creator") {
        setAppMode("creator");
        setCreatorView("edit");
      } else {
        setCreatorView("edit");
      }
      const textarea = elements.editorForm.elements.content_markdown;
      const linkText = `[[${termName}]]`;
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      textarea.setRangeText(linkText, start, end, "end");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
      if (window.innerWidth <= 760) {
        setMobileView("workspace");
      }
      break;
    }
    case "toggle-comments":
      setCommentsOpen(!state.commentsOpen);
      break;
    case "close-comments":
      setCommentsOpen(false);
      break;
    case "reset-editor":
      hydrateEditor(state.editorSeed || blankDocument());
      break;
    case "refresh-comments":
      if (state.selectedDocument?.id) {
        await loadComments(state.selectedDocument.id);
      }
      break;
    case "capture-text-target":
      if (!captureTextCommentTarget()) {
        setStatus(elements.commentsStatus, t("select_document_text_first"), true);
      }
      break;
    case "promote-to-term":
      promoteSelectionToTerm();
      break;
    case "upload-image":
      await uploadImageAttachment();
      break;
    case "refresh-history":
      if (state.selectedDocument?.id) {
        await loadRevisions(state.selectedDocument.id);
      }
      break;
    case "load-diff":
      await loadDiff();
      break;
    case "restore-revision":
      await restoreRevision();
      break;
    case "load-term-diff":
      await loadTermDiff();
      break;
    case "restore-term-revision":
      await restoreTermRevision();
      break;
    case "refresh-plugins":
      await loadPlugins();
      break;
    case "logout":
      closeAvatarMenu();
      await logout();
      break;
    case "show-shortcuts":
      openShortcutsDialog();
      break;
    case "close-shortcuts":
      closeShortcutsDialog();
      break;
    case "show-glossary-index":
      showGlossaryIndex();
      break;
    case "open-bulk-import":
      openBulkImportDialog();
      break;
    case "close-bulk-import":
      closeBulkImportDialog();
      break;
    case "toggle-glossary-autolink":
      await toggleGlossaryAutolink();
      break;
    default:
      break;
  }
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
      ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error?.message || t("request_failed", { status: response.status }));
    error.code = payload?.error?.code;
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function syncFrontendPlugins(descriptors = []) {
  const plugins = [];
  frontendPluginTranslations = { en: {}, ja: {} };
  for (const descriptor of descriptors) {
    if (!descriptor?.module_url) {
      continue;
    }
    try {
      const module = await import(descriptor.module_url);
      const plugin = module.createFrontendPlugin?.({
        t,
        escapeHtml,
        renderMarkdown,
        chip,
        difficultyLabel,
        editorForm: elements.editorForm,
      });
      if (plugin?.id === descriptor.id) {
        plugins.push(plugin);
      }
      ["en", "ja"].forEach((language) => {
        Object.assign(frontendPluginTranslations[language], module.translations?.[language] || {});
      });
    } catch (error) {
      console.error(`Failed to load frontend plugin ${descriptor.id || descriptor.module_url}.`, error);
    }
  }
  frontendPlugins = plugins;
}

async function loadSession() {
  try {
    state.session = await request("/api/auth/session");
    await syncFrontendPlugins(state.session.frontend_plugins);
  } catch (error) {
    state.session = null;
    frontendPlugins = [];
    frontendPluginTranslations = { en: {}, ja: {} };
  }
  renderSession();
}

async function login(event) {
  event.preventDefault();
  const formData = new FormData(elements.loginForm);
  if (elements.loginError) {
    elements.loginError.textContent = "";
    elements.loginError.classList.remove("is-error");
  }
  try {
    state.session = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: String(formData.get("username") || ""),
        password: String(formData.get("password") || ""),
      }),
    });
    await syncFrontendPlugins(state.session.frontend_plugins);
    elements.loginForm.reset();
    closeLoginDialog();
    renderSession();
    await loadSettings();
    // Apply a hash route that was deferred because the user was not yet signed in
    const deferred = pendingHashRoute || parseHashRoute();
    pendingHashRoute = null;
    const hasDeferred = Boolean(deferred);
    await Promise.allSettled([
      loadDocuments(elements.searchInput.value.trim(), { skipAutoSelect: hasDeferred }),
      loadGlossary(),
      loadTaxonomy(),
    ]);
    if (hasDeferred) await applyHashRoute(deferred);
  } catch (error) {
    state.session = null;
    if (elements.loginError) {
      elements.loginError.textContent = readableError(error);
      elements.loginError.classList.add("is-error");
    }
    renderSession();
  }
}

async function logout() {
  try {
    await request("/api/auth/logout", { method: "POST" });
  } catch (error) {
    // Session may already be gone; clear client state either way.
  }
  state.session = null;
  frontendPlugins = [];
  frontendPluginTranslations = { en: {}, ja: {} };
  state.documents = [];
  state.documentTotal = 0;
  state.selectedDocument = null;
  state.editorSeed = null;
  state.comments = [];
  state.commentDraftTarget = null;
  state.revisions = [];
  state.glossary = [];
  state.categories = [];
  state.lessons = [];
  state.tags = [];
  // Clear the hash so bookmarks don't immediately re-load on next login
  suppressNextHashChange = true;
  history.replaceState(null, "", location.pathname);
  renderSession();
  renderDocumentList();
  renderRevisionList();
  renderGlossaryList();
  renderTaxonomyControls();
  renderDocumentFilterControls();
  renderDocumentDetail();
  renderComments();
}

function renderSession() {
  const signedIn = Boolean(state.session);
  elements.shell.dataset.signedIn = String(signedIn);
  if (signedIn) {
    const username = state.session.username || "";
    const displayName = state.session.display_name || username;
    const roles = (state.session.roles || []).map(roleLabel).join(", ");
    if (elements.avatarInitials) {
      elements.avatarInitials.textContent = (username[0] || "?").toUpperCase();
    }
    if (elements.avatarName) {
      elements.avatarName.textContent = displayName;
    }
    if (elements.avatarMenuName) {
      elements.avatarMenuName.textContent = displayName;
    }
    if (elements.avatarMenuRole) {
      elements.avatarMenuRole.textContent = roles;
    }
  }
  renderRoleAwareControls();
}

async function loadDocuments(query = "", { skipAutoSelect = false } = {}) {
  setStatus(elements.documentListStatus, t("loading_documents"));
  const params = documentQueryParams(query);
  const hasSearch = query || params.has("category_id") || params.has("lesson_id") || params.has("tag");
  const path = hasSearch
    ? `/api/search?${params}`
    : `/api/documents?${params}`;

  try {
    const payload = await request(path);
    state.documents = listItems(payload).map(normalizeDocument);
    state.documentTotal = payload?.total ?? state.documents.length;
    renderDocumentList();
    setStatus(elements.documentListStatus, state.documents.length ? "" : t("no_documents_found"));

    if (!skipAutoSelect) {
      const selectedStillVisible = state.selectedDocument
        && state.documents.some((documentItem) => String(documentItem.id) === String(state.selectedDocument.id));
      if (state.documents[0] && !selectedStillVisible) {
        await selectDocument(state.documents[0].id);
      } else if (!state.documents.length) {
        state.selectedDocument = null;
        state.editorSeed = null;
        state.comments = [];
        renderDocumentDetail();
        renderComments();
      }
    }
  } catch (error) {
    state.documents = [];
    state.documentTotal = 0;
    renderDocumentList();
    setStatus(elements.documentListStatus, readableError(error), true);
  }
}

function documentQueryParams(query = "") {
  const params = new URLSearchParams({ page_size: "20", sort: elements.documentSort.value || "updated_desc" });
  if (query) {
    params.set("q", query);
    params.set("type", "document");
  }
  const categoryId = elements.documentCategoryFilter.value;
  const lessonId = elements.documentLessonFilter.value;
  const tag = elements.documentTagFilter.value;
  if (categoryId) {
    params.set("category_id", categoryId);
    params.set("type", "document");
  }
  if (lessonId) {
    params.set("lesson_id", lessonId);
    params.set("type", "document");
  }
  if (tag) {
    params.set("tag", tag);
    params.set("type", "document");
  }
  return params;
}

async function loadTaxonomy() {
  try {
    const [categories, lessons, tags] = await Promise.all([
      request("/api/categories"),
      request("/api/lessons"),
      request("/api/tags"),
    ]);
    state.categories = listItems(categories).map(normalizeTaxonomyItem).sort(compareByName);
    state.lessons = listItems(lessons).map(normalizeTaxonomyItem).sort(compareByPosition);
    state.tags = listItems(tags).map(normalizeTaxonomyItem).sort(compareByName);
    renderTaxonomyControls();
    renderDocumentFilterControls();
  } catch (error) {
    state.categories = [];
    state.lessons = [];
    state.tags = [];
    renderTaxonomyControls();
    renderDocumentFilterControls();
    if (state.session) {
      setStatus(elements.editorStatus, readableError(error), true);
    }
  }
}

function renderDocumentFilterControls() {
  const selectedCategory = elements.documentCategoryFilter.value;
  const selectedLesson = elements.documentLessonFilter.value;
  const selectedTag = elements.documentTagFilter.value;
  replaceTaxonomyOptions(elements.documentCategoryFilter, state.categories, t("all_categories"));
  replaceTaxonomyOptions(elements.documentLessonFilter, state.lessons, t("all_lessons"));
  replaceTaxonomyOptions(elements.documentTagFilter, state.tags, t("all_tags"), "slug");
  elements.documentCategoryFilter.value = hasOption(elements.documentCategoryFilter, selectedCategory) ? selectedCategory : "";
  elements.documentLessonFilter.value = hasOption(elements.documentLessonFilter, selectedLesson) ? selectedLesson : "";
  elements.documentTagFilter.value = hasOption(elements.documentTagFilter, selectedTag) ? selectedTag : "";
}

function renderTaxonomyControls(documentItem = state.editorSeed || blankDocument()) {
  if (!elements.metadataCategory || !elements.metadataLesson || !elements.metadataTags) {
    return;
  }
  const categoryValue = stringId(documentItem.category_id ?? documentItem.category?.id ?? selectedCategoryId());
  const lessonValue = stringId(documentItem.lesson_id ?? documentItem.lesson?.id ?? selectedLessonId());
  const tagValues = new Set(normalizeTagIds(documentItem).map(String));

  replaceTaxonomyOptions(elements.metadataCategory, state.categories, t("no_category"));
  replaceTaxonomyOptions(elements.metadataLesson, state.lessons, t("no_lesson"));
  elements.metadataCategory.value = hasOption(elements.metadataCategory, categoryValue) ? categoryValue : "";
  elements.metadataLesson.value = hasOption(elements.metadataLesson, lessonValue) ? lessonValue : "";

  elements.metadataTags.replaceChildren(
    ...state.tags.map((tag) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "tag_ids";
      checkbox.value = tag.id;
      checkbox.checked = tagValues.has(String(tag.id));
      label.append(checkbox, document.createTextNode(tag.name || tag.slug || String(tag.id)));
      return label;
    }),
  );
}

function replaceTaxonomyOptions(select, items, emptyLabel, valueKey = "id") {
  select.replaceChildren(
    new Option(emptyLabel, ""),
    ...items.map((item) => new Option(displayName(item) || String(item.id), item[valueKey] || item.id)),
  );
}

function clearDocumentFilters() {
  elements.documentCategoryFilter.value = "";
  elements.documentLessonFilter.value = "";
  elements.documentTagFilter.value = "";
  elements.documentSort.value = "updated_desc";
  elements.searchInput.value = "";
  setRailFilterOpen(false);
  updateFilterActiveDot();
  loadDocuments();
}

async function createTaxonomyItem(kind) {
  if (!hasRoleAtLeast("editor")) {
    setStatus(elements.editorStatus, t("no_permission"), true);
    return;
  }

  const config = {
    categories: {
      input: elements.metadataNewCategory,
      collection: "categories",
      endpoint: "/api/categories",
      select: elements.metadataCategory,
    },
    lessons: {
      input: elements.metadataNewLesson,
      collection: "lessons",
      endpoint: "/api/lessons",
      select: elements.metadataLesson,
    },
    tags: {
      input: elements.metadataNewTag,
      collection: "tags",
      endpoint: "/api/tags",
      select: null,
    },
  }[kind];
  const name = String(config?.input?.value || "").trim();
  if (!config || !name) {
    setStatus(elements.editorStatus, t("taxonomy_name_required"), true);
    return;
  }

  setStatus(elements.editorStatus, t("loading_taxonomy"));
  try {
    const created = normalizeTaxonomyItem(await request(config.endpoint, {
      method: "POST",
      body: JSON.stringify({ name }),
    }));
    state[config.collection] = [...state[config.collection], created].sort(
      kind === "lessons" ? compareByPosition : compareByName,
    );
    config.input.value = "";
    renderTaxonomyControls(documentFromEditorDraft());
    renderDocumentFilterControls();
    if (config.select) {
      config.select.value = String(created.id);
    } else {
      const checkbox = [...elements.metadataTags.querySelectorAll('input[name="tag_ids"]')]
        .find((input) => input.value === String(created.id));
      if (checkbox) {
        checkbox.checked = true;
      }
    }
    renderCreatorDraft();
    renderCreatorMetadataSummary();
    setStatus(elements.editorStatus, t("taxonomy_created", { name: created.name || name }));
  } catch (error) {
    setStatus(elements.editorStatus, readableError(error), true);
  }
}

function renderDocumentList() {
  elements.documentCount.textContent = state.documentTotal
    ? t("total_count", { count: state.documentTotal })
    : "";

  const list = elements.documentList;
  if (!list) return;

  if (!state.documents.length) {
    const msg = document.createElement("p");
    msg.className = "status-line";
    msg.textContent = t("no_documents_in_filter");
    list.replaceChildren(msg);
    updateFilterActiveDot();
    return;
  }

  // Build: category_key → { category, lessons: Map<lesson_key, { lesson, docs }>, directDocs: [] }
  const NONE_KEY = "_none";
  const groups = new Map(); // category_key → group

  function ensureGroup(catKey, category) {
    if (!groups.has(catKey)) {
      groups.set(catKey, { category, lessons: new Map(), directDocs: [] });
    }
    return groups.get(catKey);
  }

  for (const doc of state.documents) {
    const catKey = doc.category_id ? String(doc.category_id) : NONE_KEY;
    const category = doc.category || null;
    const group = ensureGroup(catKey, category);

    if (doc.lesson_id) {
      const lessonKey = String(doc.lesson_id);
      if (!group.lessons.has(lessonKey)) {
        group.lessons.set(lessonKey, { lesson: doc.lesson || null, docs: [] });
      }
      group.lessons.get(lessonKey).docs.push(doc);
    } else {
      group.directDocs.push(doc);
    }
  }

  // Move NONE_KEY group to end if it exists
  const noneGroup = groups.get(NONE_KEY);
  if (noneGroup) {
    groups.delete(NONE_KEY);
    groups.set(NONE_KEY, noneGroup);
  }

  function makeChevron() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "chevron");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    path.setAttribute("points", "6 9 12 15 18 9");
    svg.appendChild(path);
    return svg;
  }

  function makeDocButton(doc) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tree-doc";
    btn.dataset.documentId = doc.id;
    btn.classList.toggle("is-active", String(doc.id) === String(state.selectedDocument?.id));

    const titleSpan = document.createElement("span");
    titleSpan.className = "tree-doc-title";
    titleSpan.textContent = doc.title || t("untitled_document");

    btn.appendChild(titleSpan);

    if (doc.summary) {
      const metaSpan = document.createElement("span");
      metaSpan.className = "tree-doc-meta";
      metaSpan.textContent = doc.summary;
      btn.appendChild(metaSpan);
    }

    return btn;
  }

  const groupNodes = [];

  for (const [catKey, group] of groups) {
    const groupEl = document.createElement("div");
    groupEl.className = "tree-group";
    groupEl.dataset.groupKey = catKey;
    const isGroupCollapsed = collapsedTreeGroups.has(catKey);
    if (isGroupCollapsed) groupEl.dataset.collapsed = "true";

    // Group toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "tree-group-toggle";
    toggleBtn.dataset.action = "toggle-tree-group";
    toggleBtn.dataset.groupKey = catKey;

    const chevron = makeChevron();
    const labelSpan = document.createElement("span");
    if (catKey === NONE_KEY) {
      labelSpan.textContent = t("uncategorized");
    } else {
      labelSpan.textContent = displayName(group.category) || t("uncategorized");
    }

    toggleBtn.append(chevron, labelSpan);
    groupEl.appendChild(toggleBtn);

    // Group body
    const bodyEl = document.createElement("div");
    bodyEl.className = "tree-group-body";

    // Render lessons (subgroups)
    for (const [lessonKey, { lesson, docs }] of group.lessons) {
      const subgroupKey = `${catKey}::${lessonKey}`;
      const subEl = document.createElement("div");
      subEl.className = "tree-subgroup";
      subEl.dataset.subgroupKey = subgroupKey;
      const isSubCollapsed = collapsedTreeSubgroups.has(subgroupKey);
      if (isSubCollapsed) subEl.dataset.collapsed = "true";

      const subToggle = document.createElement("button");
      subToggle.type = "button";
      subToggle.className = "tree-subgroup-toggle";
      subToggle.dataset.action = "toggle-tree-subgroup";
      subToggle.dataset.subgroupKey = subgroupKey;

      const subChevron = makeChevron();
      const subLabel = document.createElement("span");
      subLabel.textContent = displayName(lesson) || t("no_lesson");
      subToggle.append(subChevron, subLabel);
      subEl.appendChild(subToggle);

      const subBody = document.createElement("div");
      subBody.className = "tree-subgroup-body";
      for (const doc of docs) {
        subBody.appendChild(makeDocButton(doc));
      }
      subEl.appendChild(subBody);
      bodyEl.appendChild(subEl);
    }

    // Render direct docs (no lesson)
    for (const doc of group.directDocs) {
      bodyEl.appendChild(makeDocButton(doc));
    }

    groupEl.appendChild(bodyEl);
    groupNodes.push(groupEl);
  }

  list.replaceChildren(...groupNodes);
  updateFilterActiveDot();
}

function hasActiveFilter() {
  const catFilter = elements.documentCategoryFilter?.value;
  const lessonFilter = elements.documentLessonFilter?.value;
  const tagFilter = elements.documentTagFilter?.value;
  const sortFilter = elements.documentSort?.value;
  return Boolean(catFilter || lessonFilter || tagFilter || (sortFilter && sortFilter !== "updated_desc"));
}

function updateFilterActiveDot() {
  const dot = document.querySelector("#rail-filter-active-dot");
  if (dot) {
    dot.hidden = !hasActiveFilter();
  }
}

function documentOrganizationLabel(documentItem) {
  const location = [
    displayName(documentItem.category),
    displayName(documentItem.lesson),
  ].filter(Boolean).join(" / ");
  const tags = (documentItem.tags || []).map((tag) => displayName(tag)).filter(Boolean).join(", ");
  return [location || t("unfiled"), tags].filter(Boolean).join(" · ");
}

async function selectDocument(id, { skipHashUpdate = false } = {}) {
  setStatus(elements.documentListStatus, t("loading_document"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(id)}`);
    state.selectedDocument = normalizeDocument(payload);
    state.editorSeed = structuredCloneSafe(state.selectedDocument);
    state.comments = [];
    state.commentDraftTarget = null;
    state.viewerContent = "document";
    state.editorDirty = false;
    state.editorSaving = false;
    state.lastSavedAt = state.selectedDocument.updated_at || null;
    setCommentsOpen(false);
    renderDocumentDetail();
    renderTermDetail();
    renderComments();
    hydrateEditor(state.selectedDocument);
    renderDocumentList();
    renderSaveState();
    setStatus(elements.documentListStatus, "");
    if (!skipHashUpdate && state.selectedDocument?.slug) {
      updateHashRoute({ type: "doc", slug: state.selectedDocument.slug });
    }
    await Promise.allSettled([loadRevisions(id), loadComments(id)]);
  } catch (error) {
    setStatus(elements.documentListStatus, readableError(error), true);
  }
}

function showSelectedDocument() {
  state.viewerContent = "document";
  renderDocumentDetail();
  renderTermDetail();
  if (state.selectedDocument?.slug) {
    updateHashRoute({ type: "doc", slug: state.selectedDocument.slug });
  }
}

function renderDocumentDetail() {
  const documentItem = state.selectedDocument;
  const showingDocument =
    state.viewerContent === "document" && Boolean(documentItem);
  elements.documentEmpty.hidden =
    Boolean(documentItem) || state.viewerContent === "term" || state.viewerContent === "glossary";
  elements.documentDetail.hidden = !showingDocument;
  // Hide glossary index when showing a document or nothing specific
  const glossaryIndexEl = document.querySelector("#glossary-index");
  if (glossaryIndexEl) {
    glossaryIndexEl.hidden = state.viewerContent !== "glossary";
  }
  if (!documentItem) {
    elements.viewerPluginPanels.replaceChildren();
    state.commentTargetOptions.images = [];
    state.commentTargetOptions.mermaidBlocks = [];
    replaceTargetOptions(elements.commentImageTarget, []);
    replaceTargetOptions(elements.commentMermaidTarget, []);
    renderDocumentRelatedTerms(null);
    if (elements.documentToc) {
      elements.documentToc.hidden = true;
      elements.documentTocList.replaceChildren();
    }
    return;
  }

  elements.documentContext.textContent = [
    displayName(documentItem.category),
    displayName(documentItem.lesson),
  ].filter(Boolean).join(" / ");
  elements.documentTitle.textContent = documentItem.title || t("untitled_document");
  elements.documentSummary.textContent = documentItem.summary || "";
  elements.documentMeta.replaceChildren(
    chip(t("updated_at", { date: formatDate(documentItem.updated_at) })),
    ...(documentItem.tags || []).map((tag) => chip(displayName(tag))),
  );
  renderDocumentRelatedTerms(documentItem);
  renderPluginDetailPanels(elements.viewerPluginPanels, documentItem, "viewer");
  renderMarkdown(elements.documentMarkdown, documentItem.content_markdown);
  renderDocumentToc(elements.documentMarkdown);
  refreshCommentTargetOptions();
  updateCommentTargetControls();
}

function renderDocumentRelatedTerms(documentItem) {
  if (!elements.documentRelatedTerms) return;
  if (!documentItem) {
    elements.documentRelatedTerms.hidden = true;
    elements.documentRelatedTermsChips.replaceChildren();
    return;
  }
  const matches = collectReferencedTerms(documentItem.content_markdown || "");
  if (!matches.length) {
    elements.documentRelatedTerms.hidden = true;
    elements.documentRelatedTermsChips.replaceChildren();
    return;
  }
  elements.documentRelatedTerms.hidden = false;
  elements.documentRelatedTermsChips.replaceChildren(
    ...matches.map((term) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip term-chip";
      button.dataset.termId = term.id;
      button.textContent = term.term || t("untitled_term");
      return button;
    }),
  );
}

function collectReferencedTerms(markdown) {
  if (!markdown) return [];
  const seen = new Set();
  const matches = [];
  const pattern = /\[\[([^\]|\n]+?)(?:\|[^\]\n]+)?\]\]/g;
  let match = pattern.exec(markdown);
  while (match) {
    const target = (match[1] || "").trim().toLowerCase();
    if (target && !seen.has(target)) {
      seen.add(target);
      const term = resolveGlossaryTerm(target);
      if (term) matches.push(term);
    }
    match = pattern.exec(markdown);
  }
  return matches;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9぀-ヿ一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "section";
}

function renderDocumentToc(rootElement) {
  if (!elements.documentToc || !elements.documentTocList) return;

  const headings = Array.from(rootElement.querySelectorAll("h1, h2, h3"));
  if (headings.length < 2) {
    elements.documentToc.hidden = true;
    elements.documentTocList.replaceChildren();
    return;
  }

  // Assign stable IDs to headings that don't already have one
  const seenSlugs = new Map();
  headings.forEach((heading) => {
    if (!heading.id) {
      const base = slugify(heading.textContent);
      const count = seenSlugs.get(base) ?? 0;
      seenSlugs.set(base, count + 1);
      heading.id = count === 0 ? base : `${base}-${count}`;
    }
  });

  // Build list items
  const items = headings.map((heading) => {
    const level = parseInt(heading.tagName[1], 10);
    const li = document.createElement("li");
    li.className = "document-toc-item";
    li.dataset.level = String(level);
    const a = document.createElement("a");
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.addEventListener("click", (event) => {
      event.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    li.appendChild(a);
    return li;
  });

  elements.documentTocList.replaceChildren(...items);
  elements.documentToc.hidden = false;
}

function renderTermDetail() {
  const term = state.selectedTerm;
  const showingTerm = state.viewerContent === "term" && Boolean(term);
  if (!elements.termDetail) return;
  elements.termDetail.hidden = !showingTerm;
  // Also update glossary index visibility when switching to term view
  const glossaryIndexEl = document.querySelector("#glossary-index");
  if (glossaryIndexEl) {
    glossaryIndexEl.hidden = state.viewerContent !== "glossary";
  }
  const backButton = document.querySelector("#term-back-button");
  if (backButton) {
    backButton.hidden = !state.selectedDocument;
  }
  if (!showingTerm) {
    if (elements.termDetailTags) elements.termDetailTags.replaceChildren();
    if (elements.termDetailDescription) elements.termDetailDescription.replaceChildren();
    if (elements.termRelatedDocumentsList) elements.termRelatedDocumentsList.replaceChildren();
    return;
  }
  // Sync tab display state
  setTermTab(state.activeTermTab);

  elements.termDetailTitle.textContent = term.term || t("untitled_term");

  // Build meta row: own tags + related_tags + aliases
  const metaChildren = [];
  const ownTags = term.tags || [];
  if (ownTags.length) {
    const ownTagsLabel = document.createElement("span");
    ownTagsLabel.className = "meta-label muted";
    ownTagsLabel.textContent = t("own_tags") + ":";
    metaChildren.push(ownTagsLabel);
    ownTags.forEach((tag) => metaChildren.push(chip(displayName(tag))));
  }
  const relatedTags = term.related_tags || [];
  if (relatedTags.length) {
    const relatedTagsLabel = document.createElement("span");
    relatedTagsLabel.className = "meta-label muted";
    relatedTagsLabel.textContent = (ownTags.length ? " " : "") + t("related_tags") + ":";
    metaChildren.push(relatedTagsLabel);
    relatedTags.forEach((tag) => metaChildren.push(chip(displayName(tag))));
  }
  const aliases = term.aliases || [];
  if (aliases.length) {
    const aliasLabel = document.createElement("span");
    aliasLabel.className = "meta-label muted";
    aliasLabel.textContent = (metaChildren.length ? " " : "") + t("also_known_as") + ":";
    metaChildren.push(aliasLabel);
    aliases.forEach((a) => {
      const aliasChip = chip(a.alias || a.alias_slug || "");
      metaChildren.push(aliasChip);
    });
  }
  elements.termDetailTags.replaceChildren(...metaChildren);

  renderMarkdown(elements.termDetailDescription, term.description_markdown || "");

  const relatedDocs = term.related_documents || [];
  if (!relatedDocs.length) {
    setStatus(elements.termRelatedDocumentsStatus, t("no_related_documents"));
    elements.termRelatedDocumentsList.replaceChildren();
    return;
  }
  setStatus(elements.termRelatedDocumentsStatus, "");
  elements.termRelatedDocumentsList.replaceChildren(
    ...relatedDocs.map((doc) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.documentId = doc.id;
      button.className = "related-document-card";
      const title = document.createElement("span");
      title.className = "related-document-title";
      title.textContent = doc.title || t("untitled_document");
      const context = document.createElement("span");
      context.className = "related-document-context";
      context.textContent = [
        displayName(doc.category),
        displayName(doc.lesson),
      ].filter(Boolean).join(" / ");
      const summary = document.createElement("span");
      summary.className = "related-document-summary";
      summary.textContent = doc.summary || "";
      button.append(title);
      if (context.textContent) button.append(context);
      if (summary.textContent) button.append(summary);
      item.append(button);
      return item;
    }),
  );
}

function startNewDocument() {
  if (!hasRoleAtLeast("editor")) {
    return;
  }
  state.selectedDocument = null;
  state.editorSeed = blankDocument();
  state.comments = [];
  state.commentDraftTarget = null;
  state.revisions = [];
  state.editorDirty = false;
  state.editorSaving = false;
  state.lastSavedAt = null;
  renderDocumentDetail();
  renderDocumentList();
  renderRevisionList();
  hydrateEditor(state.editorSeed);
  renderSaveState();
  setAppMode("creator");
  setCreatorView("edit");
  setMobileView("workspace");
}

function hydrateEditor(documentItem) {
  updateEditorHeading(documentItem);
  elements.editorForm.elements.title.value = documentItem.title || "";
  elements.editorForm.elements.slug.value = documentItem.slug || "";
  elements.editorForm.elements.summary.value = documentItem.summary || "";
  elements.editorForm.elements.content_markdown.value = documentItem.content_markdown || "";
  renderTaxonomyControls(documentItem);
  syncCreatorPluginPanels();
  hydratePluginEditors(documentItem);
  renderCreatorDraft();
  renderCreatorMetadataSummary();
  renderEditorLivePreview();
  renderSaveState();
  setStatus(elements.editorStatus, "");
  setStatus(elements.attachmentStatus, documentItem.id ? "" : t("save_before_upload"));
  updateAttachmentControls();
}

function updateEditorHeading(documentItem = state.editorSeed || blankDocument()) {
  elements.editorHeading.textContent = documentItem.id ? t("edit_document") : t("new_document");
}

function renderCreatorDraft() {
  const documentItem = documentFromEditorDraft();
  renderCreatorPreview(documentItem);
}

function renderCreatorMetadataSummary(documentItem = documentFromEditorDraft()) {
  elements.creatorDocumentLabel.textContent = documentItem.title || t("untitled_document");
}

function documentFromEditorDraft() {
  const seed = state.editorSeed || blankDocument();
  const form = elements.editorForm.elements;
  const categoryId = selectedCategoryId();
  const lessonId = selectedLessonId();
  const tagIds = selectedTagIds();
  return normalizeDocument({
    ...seed,
    title: form.title.value,
    slug: form.slug.value,
    summary: form.summary.value,
    content_markdown: form.content_markdown.value,
    category_id: categoryId,
    lesson_id: lessonId,
    tag_ids: tagIds,
    category: state.categories.find((item) => item.id === categoryId) || null,
    lesson: state.lessons.find((item) => item.id === lessonId) || null,
    tags: state.tags.filter((tag) => tagIds.includes(tag.id)),
    plugin_data: buildPluginData(seed.plugin_data),
  });
}

function renderCreatorPreview(documentItem = documentFromEditorDraft()) {
  elements.creatorPreviewContext.textContent = [
    displayName(documentItem.category),
    displayName(documentItem.lesson),
  ].filter(Boolean).join(" / ");
  elements.creatorPreviewTitle.textContent = documentItem.title || t("untitled_document");
  elements.creatorPreviewSummary.textContent = documentItem.summary || "";
  elements.creatorPreviewMeta.replaceChildren(
    chip(documentItem.updated_at ? t("updated_at", { date: formatDate(documentItem.updated_at) }) : t("draft")),
    ...(documentItem.tags || []).map((tag) => chip(displayName(tag))),
  );
  renderPluginDetailPanels(elements.creatorPreviewPluginPanels, documentItem, "preview");
  renderMarkdown(elements.creatorPreviewMarkdown, documentItem.content_markdown);
}

function openMetadataDialog() {
  if (!elements.metadataDialog.open) {
    elements.metadataDialog.showModal();
  }
}

function closeMetadataDialog() {
  elements.metadataDialog.close();
  renderCreatorDraft();
  renderCreatorMetadataSummary();
}

function toggleInsertMenu() {
  // insert menu removed — no-op (ribbon Insert tab replaces it)
}

function setInsertMenuOpen(_open) {
  // insert menu removed — no-op (ribbon Insert tab replaces it)
}

function renderInsertMenu() {
  // insert menu removed — delegate to ribbon block buttons
  renderInsertBlocks();
}

function renderInsertBlocks() {
  const host = document.querySelector("#ribbon-insert-blocks");
  if (!host) return;
  const blocks = getAvailableInsertBlocks();
  host.replaceChildren(
    ...blocks.map((block) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ribbon-block-button";
      btn.dataset.insertKind = block.id;
      btn.textContent = t(block.labelKey || block.id);
      return btn;
    }),
  );
}

function getAvailableInsertBlocks() {
  return [
    ...CORE_INSERT_BLOCKS,
    ...enabledFrontendPlugins().flatMap((plugin) => plugin.insertBlocks || []),
  ];
}

function closeInsertMenuOnOutsideClick(_event) {
  // insert menu removed — no-op (ribbon Insert tab replaces it)
}

function closeAvatarMenuOnOutsideClick(event) {
  if (!state.avatarMenuOpen) {
    return;
  }
  if (event.target.closest("#avatar-menu") || event.target.closest('[data-action="toggle-avatar-menu"]')) {
    return;
  }
  closeAvatarMenu();
}

function openLoginDialog() {
  if (!elements.loginDialog) return;
  if (elements.loginError) {
    elements.loginError.textContent = "";
    elements.loginError.classList.remove("is-error");
  }
  elements.loginForm.reset();
  elements.loginDialog.showModal();
}

function closeLoginDialog() {
  if (!elements.loginDialog) return;
  elements.loginDialog.close();
}

function toggleAvatarMenu() {
  if (state.avatarMenuOpen) {
    closeAvatarMenu();
  } else {
    openAvatarMenu();
  }
}

function openAvatarMenu() {
  state.avatarMenuOpen = true;
  if (elements.avatarMenu) {
    elements.avatarMenu.hidden = false;
  }
  const pill = document.querySelector('[data-action="toggle-avatar-menu"]');
  if (pill) pill.setAttribute("aria-expanded", "true");
}

function closeAvatarMenu() {
  state.avatarMenuOpen = false;
  if (elements.avatarMenu) {
    elements.avatarMenu.hidden = true;
  }
  const pill = document.querySelector('[data-action="toggle-avatar-menu"]');
  if (pill) pill.setAttribute("aria-expanded", "false");
}

function setRailFilterOpen(open) {
  state.railFilterOpen = Boolean(open);
  const popover = document.querySelector("#rail-filter-popover");
  const btn = document.querySelector('[data-action="toggle-rail-filters"]');
  if (popover) popover.hidden = !state.railFilterOpen;
  if (btn) btn.setAttribute("aria-expanded", String(state.railFilterOpen));
}

function closeRailFilterOnOutsideClick(event) {
  if (!state.railFilterOpen) return;
  if (
    event.target.closest("#rail-filter-popover") ||
    event.target.closest('[data-action="toggle-rail-filters"]')
  ) return;
  setRailFilterOpen(false);
}

const THEME_STORAGE_KEY = "doc-platform.theme";

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch (_) {
    // ignore
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (_) {
    // ignore
  }
  const themeIcon = document.querySelector('[data-action="toggle-theme"] i[data-lucide]');
  if (themeIcon) {
    themeIcon.setAttribute("data-lucide", theme === "dark" ? "moon" : "sun");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
}

function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

function markEditorDirty() {
  state.editorDirty = true;
  renderSaveState();
}

function formatSavedTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(LANGUAGE_LOCALES[state.language] || "en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function renderSaveState() {
  const el = elements.creatorSaveState;
  if (!el) return;
  el.classList.remove("is-saving", "is-dirty", "is-saved", "is-idle");
  if (state.editorSaving) {
    el.textContent = t("save_state_saving");
    el.classList.add("is-saving");
  } else if (state.editorDirty) {
    el.textContent = t("save_state_unsaved");
    el.classList.add("is-dirty");
  } else if (state.lastSavedAt) {
    el.textContent = t("save_state_saved", { time: formatSavedTime(state.lastSavedAt) });
    el.classList.add("is-saved");
  } else {
    el.textContent = "";
    el.classList.add("is-idle");
  }
}

function openShortcutsDialog() {
  const dlg = document.querySelector("#shortcuts-dialog");
  if (dlg && typeof dlg.showModal === "function") dlg.showModal();
}

function closeShortcutsDialog() {
  const dlg = document.querySelector("#shortcuts-dialog");
  if (dlg && typeof dlg.close === "function") dlg.close();
}

function handleGlobalKeydown(event) {
  if (event.key === "Escape" && state.avatarMenuOpen) {
    closeAvatarMenu();
    event.preventDefault();
    return;
  }

  if (event.key === "Escape" && state.railFilterOpen) {
    setRailFilterOpen(false);
    document.querySelector('[data-action="toggle-rail-filters"]')?.focus();
    event.preventDefault();
    return;
  }

  if (event.key === "Escape" && state.commentsOpen) {
    setCommentsOpen(false);
    elements.commentsToggle?.focus();
    event.preventDefault();
    return;
  }

  // insert menu removed — Escape handler for it is no longer needed

  if (event.ctrlKey || event.metaKey) {
    if (event.key === "/") {
      event.preventDefault();
      openShortcutsDialog();
      return;
    }
    const inTermEditor = document.activeElement && document.activeElement.id === "term-editor-description-textarea";
    const inDocEditor = elements.editorForm?.elements?.content_markdown && document.activeElement === elements.editorForm.elements.content_markdown;
    if (!inTermEditor && !inDocEditor) {
      return;
    }
    const fmtTarget = inTermEditor ? "term" : "document";
    if (event.key === "b" || event.key === "B") {
      event.preventDefault();
      applyFormatAction("bold", fmtTarget);
    } else if (event.key === "i" || event.key === "I") {
      event.preventDefault();
      applyFormatAction("italic", fmtTarget);
    } else if (event.key === "k" || event.key === "K") {
      event.preventDefault();
      applyFormatAction("link", fmtTarget);
    }
  }
}

function insertMarkdownBlock(kind) {
  const block = getAvailableInsertBlocks().find((item) => item.id === kind);
  const markdown = typeof block?.markdown === "function" ? block.markdown() : block?.markdown;
  if (!markdown) {
    return;
  }
  insertAtCursor(elements.editorForm.elements.content_markdown, markdown);
  setInsertMenuOpen(false);
  renderCreatorDraft();
}

function applyFormatAction(action, target = "document") {
  const textarea = target === "term"
    ? document.querySelector("#term-editor-description-textarea")
    : elements.editorForm?.elements?.content_markdown;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);

  // Compute line start/end boundaries
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndRaw = value.indexOf("\n", end);
  const lineEnd = lineEndRaw === -1 ? value.length : lineEndRaw;

  let replacement;
  let newSelStart;
  let newSelEnd;

  switch (action) {
    case "bold": {
      if (selected) {
        replacement = `**${selected}**`;
        newSelStart = start;
        newSelEnd = start + replacement.length;
      } else {
        replacement = "**bold**";
        newSelStart = start + 2;
        newSelEnd = start + 6;
      }
      textarea.focus();
      textarea.setRangeText(replacement, start, end, "select");
      textarea.setSelectionRange(newSelStart, newSelEnd);
      break;
    }
    case "italic": {
      if (selected) {
        replacement = `*${selected}*`;
        newSelStart = start;
        newSelEnd = start + replacement.length;
      } else {
        replacement = "*italic*";
        newSelStart = start + 1;
        newSelEnd = start + 7;
      }
      textarea.focus();
      textarea.setRangeText(replacement, start, end, "select");
      textarea.setSelectionRange(newSelStart, newSelEnd);
      break;
    }
    case "inline-code": {
      if (selected) {
        replacement = `\`${selected}\``;
        newSelStart = start;
        newSelEnd = start + replacement.length;
      } else {
        replacement = "`code`";
        newSelStart = start + 1;
        newSelEnd = start + 5;
      }
      textarea.focus();
      textarea.setRangeText(replacement, start, end, "select");
      textarea.setSelectionRange(newSelStart, newSelEnd);
      break;
    }
    case "link": {
      if (selected) {
        replacement = `[${selected}](url)`;
        // Place cursor on "url"
        newSelStart = start + selected.length + 3;
        newSelEnd = newSelStart + 3;
      } else {
        replacement = "[text](url)";
        newSelStart = start + 1;
        newSelEnd = start + 5;
      }
      textarea.focus();
      textarea.setRangeText(replacement, start, end, "select");
      textarea.setSelectionRange(newSelStart, newSelEnd);
      break;
    }
    case "wiki-link": {
      if (selected) {
        replacement = `[[${selected}]]`;
        newSelStart = start;
        newSelEnd = start + replacement.length;
      } else {
        replacement = "[[term]]";
        newSelStart = start + 2;
        newSelEnd = start + 6;
      }
      textarea.focus();
      textarea.setRangeText(replacement, start, end, "select");
      textarea.setSelectionRange(newSelStart, newSelEnd);
      break;
    }
    case "heading": {
      const currentLine = value.slice(lineStart, lineEnd);
      const headingMatch = currentLine.match(/^(#{1,3}) /);
      let newLine;
      if (headingMatch) {
        const level = headingMatch[1].length;
        const nextLevel = level < 3 ? level + 1 : 1;
        newLine = currentLine.replace(/^#{1,3} /, "#".repeat(nextLevel) + " ");
      } else {
        newLine = "## " + currentLine;
      }
      textarea.focus();
      textarea.setRangeText(newLine, lineStart, lineEnd, "select");
      // Move cursor to same relative position
      const delta = newLine.length - currentLine.length;
      const newCursor = Math.max(lineStart, Math.min(end + delta, lineStart + newLine.length));
      textarea.setSelectionRange(newCursor, newCursor);
      break;
    }
    case "ul": {
      const selectionText = selected || value.slice(lineStart, lineEnd);
      const selStart2 = selected ? start : lineStart;
      const selEnd2 = selected ? end : lineEnd;
      const lines = selectionText.split("\n");
      const newText = lines.map((line) => `- ${line}`).join("\n");
      textarea.focus();
      textarea.setRangeText(newText, selStart2, selEnd2, "select");
      textarea.setSelectionRange(selStart2, selStart2 + newText.length);
      break;
    }
    case "ol": {
      const selectionText = selected || value.slice(lineStart, lineEnd);
      const selStart2 = selected ? start : lineStart;
      const selEnd2 = selected ? end : lineEnd;
      const lines = selectionText.split("\n");
      const newText = lines.map((line, i) => `${i + 1}. ${line}`).join("\n");
      textarea.focus();
      textarea.setRangeText(newText, selStart2, selEnd2, "select");
      textarea.setSelectionRange(selStart2, selStart2 + newText.length);
      break;
    }
    case "quote": {
      const selectionText = selected || value.slice(lineStart, lineEnd);
      const selStart2 = selected ? start : lineStart;
      const selEnd2 = selected ? end : lineEnd;
      const lines = selectionText.split("\n");
      const newText = lines.map((line) => `> ${line}`).join("\n");
      textarea.focus();
      textarea.setRangeText(newText, selStart2, selEnd2, "select");
      textarea.setSelectionRange(selStart2, selStart2 + newText.length);
      break;
    }
    case "code-block": {
      if (selected) {
        replacement = "```\n" + selected + "\n```";
      } else {
        replacement = "```\n\n```";
      }
      textarea.focus();
      textarea.setRangeText(replacement, start, end, "select");
      const innerStart = start + 4;
      const innerEnd = innerStart + (selected ? selected.length : 0);
      textarea.setSelectionRange(innerStart, innerEnd);
      break;
    }
    default:
      return;
  }

  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const prefix = before && !before.endsWith("\n") ? "\n" : "";
  const suffix = after && !after.startsWith("\n") ? "\n" : "";
  const inserted = `${prefix}${text}${suffix}`;
  textarea.value = `${before}${inserted}${after}`;
  const cursor = before.length + inserted.length;
  textarea.focus();
  textarea.setSelectionRange(cursor, cursor);
}

async function saveDocument(event) {
  event.preventDefault();
  if (!hasRoleAtLeast("editor")) {
    setStatus(elements.editorStatus, t("no_permission"), true);
    return;
  }
  const formData = new FormData(elements.editorForm);
  const seed = state.editorSeed || blankDocument();
  const body = {
    title: String(formData.get("title") || "").trim(),
    slug: String(formData.get("slug") || "").trim(),
    summary: String(formData.get("summary") || ""),
    content_markdown: String(formData.get("content_markdown") || ""),
    category_id: selectedCategoryId(),
    lesson_id: selectedLessonId(),
    tag_ids: selectedTagIds(),
    plugin_data: buildPluginData(seed.plugin_data),
  };

  if (!body.title || !body.slug) {
    setStatus(elements.editorStatus, t("title_slug_required"), true);
    return;
  }

  const editing = Boolean(state.selectedDocument?.id);
  const path = editing
    ? `/api/documents/${encodeURIComponent(state.selectedDocument.id)}`
    : "/api/documents";

  state.editorSaving = true;
  renderSaveState();
  setStatus(elements.editorStatus, t("saving"));
  try {
    const payload = await request(path, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(body),
    });
    const saved = normalizeDocument(payload?.document || payload);
    state.selectedDocument = saved.id ? saved : { ...seed, ...body };
    state.editorSeed = structuredCloneSafe(state.selectedDocument);
    state.editorSaving = false;
    state.editorDirty = false;
    state.lastSavedAt = state.selectedDocument.updated_at || new Date().toISOString();
    renderSaveState();
    updateAttachmentControls();
    renderCreatorMetadataSummary(state.selectedDocument);
    renderDocumentDetail();
    renderComments();
    await loadDocuments(elements.searchInput.value.trim());
    if (state.selectedDocument.id) {
      await loadRevisions(state.selectedDocument.id);
    }
    setStatus(
      elements.editorStatus,
      payload?.revision_id ? t("saved_revision", { id: payload.revision_id }) : t("saved"),
    );
    setAppMode("creator");
    setCreatorView("preview");
  } catch (error) {
    state.editorSaving = false;
    renderSaveState();
    setStatus(elements.editorStatus, readableError(error), true);
  }
}

async function uploadImageAttachment() {
  if (!hasRoleAtLeast("editor")) {
    setStatus(elements.attachmentStatus, t("no_permission"), true);
    return;
  }

  const documentId = state.selectedDocument?.id || state.editorSeed?.id;
  const file = elements.attachmentFile.files?.[0];
  if (!documentId) {
    setStatus(elements.attachmentStatus, t("save_before_upload"), true);
    return;
  }
  if (!file) {
    setStatus(elements.attachmentStatus, t("choose_image_file"), true);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  setStatus(elements.attachmentStatus, t("uploading_image"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(documentId)}/attachments`, {
      method: "POST",
      body: formData,
    });
    const attachment = normalizeAttachment(payload?.attachment || payload);
    const url = attachmentUrl(attachment);
    if (!url) {
      throw new Error(t("upload_missing_image_url"));
    }
    appendMarkdownImage(url, attachment.file_name || file.name);
    elements.attachmentFile.value = "";
    setStatus(elements.attachmentStatus, t("image_inserted"));
  } catch (error) {
    setStatus(elements.attachmentStatus, readableError(error), true);
  }
}

function updateAttachmentControls() {
  elements.attachmentUploadButton.disabled = !hasRoleAtLeast("editor") || !Boolean(state.selectedDocument?.id || state.editorSeed?.id);
}

function appendMarkdownImage(url, fileName) {
  const textarea = elements.editorForm.elements.content_markdown;
  const alt = imageAltText(fileName);
  const markdown = `![${alt}](${url})`;
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const prefix = textarea.value.slice(0, start);
  const suffix = textarea.value.slice(end);
  const before = prefix && !prefix.endsWith("\n") ? "\n" : "";
  const after = suffix && !suffix.startsWith("\n") ? "\n" : "";
  const inserted = `${before}${markdown}${after}`;
  textarea.value = `${prefix}${inserted}${suffix}`;
  const cursor = prefix.length + inserted.length;
  textarea.focus();
  textarea.setSelectionRange(cursor, cursor);
  renderCreatorDraft();
}

function renderPluginDetailPanels(host, documentItem, slot) {
  host.replaceChildren(
    ...enabledFrontendPlugins()
      .map((plugin) => plugin.renderDetailPanel?.(documentItem, slot))
      .filter(Boolean),
  );
}

function syncCreatorPluginPanels() {
  const enabledPlugins = enabledFrontendPlugins();
  const enabledIds = new Set(enabledPlugins.map((plugin) => plugin.id));

  elements.creatorPluginPanels.querySelectorAll("[data-plugin-id]").forEach((panel) => {
    if (!enabledIds.has(panel.dataset.pluginId)) {
      panel.remove();
    }
  });

  const mountedIds = new Set(
    [...elements.creatorPluginPanels.querySelectorAll("[data-plugin-id]")]
      .map((panel) => panel.dataset.pluginId),
  );
  const mountedPlugins = [];

  enabledPlugins.forEach((plugin) => {
    if (!plugin.createCreatorPanel || mountedIds.has(plugin.id)) {
      return;
    }
    const panel = plugin.createCreatorPanel();
    if (!panel) {
      return;
    }
    panel.dataset.pluginId = plugin.id;
    elements.creatorPluginPanels.append(panel);
    mountedPlugins.push(plugin);
  });

  refreshIcons();
  return mountedPlugins;
}

function hydratePluginEditors(documentItem, plugins = enabledFrontendPlugins()) {
  plugins.forEach((plugin) => plugin.hydrateEditor?.(documentItem));
}

function enabledFrontendPlugins() {
  return frontendPlugins.filter((plugin) => isPluginEnabled(plugin.id));
}

async function loadComments(documentId) {
  setStatus(elements.commentsStatus, t("loading_comments"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(documentId)}/comments`);
    state.comments = listItems(payload).map(normalizeComment);
    renderComments();
  } catch (error) {
    state.comments = [];
    renderComments();
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

function renderComments() {
  const comments = [...state.comments].sort(compareComments);
  elements.commentList.replaceChildren(
    ...comments.map((comment) => {
      const item = document.createElement("li");
      item.dataset.status = comment.status;

      const header = document.createElement("div");
      header.className = "comment-header";
      const meta = document.createElement("div");
      meta.className = "comment-meta";
      meta.append(
        chip(commentStatusLabel(comment.status)),
        textNodeSpan(commentAuthorLabel(comment)),
        textNodeSpan(formatDate(comment.updated_at || comment.created_at), "list-meta"),
      );
      header.append(meta);

      const actions = document.createElement("div");
      actions.className = "comment-actions";
      if (canEditComment(comment)) {
        actions.append(commentActionButton(comment.id, "edit", t("comment_action_edit")));
      }
      if (hasRoleAtLeast("editor") && comment.status === "open") {
        actions.append(commentActionButton(comment.id, "resolve", t("comment_action_resolve")));
      }
      if (hasRoleAtLeast("editor") && comment.status === "resolved") {
        actions.append(commentActionButton(comment.id, "reopen", t("comment_action_reopen")));
      }
      header.append(actions);

      const target = document.createElement("div");
      target.className = "comment-target";
      target.textContent = commentTargetLabel(comment);

      const body = document.createElement("p");
      body.className = "comment-body";
      body.textContent = comment.body;

      item.append(header, target, body);
      return item;
    }),
  );

  setStatus(elements.commentsStatus, comments.length ? "" : t("no_comments_yet"));
  renderCommentComposer();

  // Update count badge (unresolved = open + orphaned)
  const unresolvedCount = state.comments.filter(
    (c) => c.status === "open" || c.status === "orphaned",
  ).length;
  if (elements.commentsCountBadge) {
    elements.commentsCountBadge.textContent = String(unresolvedCount);
    elements.commentsCountBadge.dataset.empty = unresolvedCount === 0 ? "true" : "false";
  }

  // Show toggle only when a document is selected
  if (elements.commentsToggle) {
    elements.commentsToggle.hidden = !state.selectedDocument;
  }
}

function commentActionButton(id, action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.commentId = id;
  button.dataset.commentAction = action;
  button.textContent = label;
  return button;
}

async function createComment(event) {
  event.preventDefault();
  if (!state.selectedDocument?.id) {
    return;
  }
  if (!state.session) {
    setStatus(elements.commentsStatus, t("sign_in_required"), true);
    return;
  }

  const body = elements.commentForm.elements.body.value.trim();
  const targetType = elements.commentForm.elements.target_type.value;
  const target = currentCommentTarget(targetType);
  if (!body) {
    setStatus(elements.commentsStatus, t("comment_body_required"), true);
    return;
  }
  if (!target) {
    setStatus(elements.commentsStatus, t("choose_comment_target"), true);
    return;
  }

  setStatus(elements.commentsStatus, t("adding_comment"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(state.selectedDocument.id)}/comments`, {
      method: "POST",
      body: JSON.stringify({
        target_type: targetType,
        target,
        body,
        revision_id: state.revisions[0]?.id ?? null,
      }),
    });
    state.comments.unshift(normalizeComment(payload));
    elements.commentForm.elements.body.value = "";
    renderComments();
  } catch (error) {
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

async function mutateComment(id, action) {
  const comment = state.comments.find((item) => String(item.id) === String(id));
  if (!comment) {
    return;
  }

  if (action === "edit") {
    await editComment(comment);
    return;
  }

  setStatus(elements.commentsStatus, t(`comment_progress_${action}`));
  try {
    const payload = await request(`/api/comments/${encodeURIComponent(id)}/${action}`, {
      method: "POST",
    });
    replaceComment(payload);
    renderComments();
  } catch (error) {
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

async function editComment(comment) {
  const body = window.prompt(t("edit_comment_prompt"), comment.body);
  if (body === null) {
    return;
  }
  if (!body.trim()) {
    setStatus(elements.commentsStatus, t("comment_body_required"), true);
    return;
  }

  setStatus(elements.commentsStatus, t("updating_comment"));
  try {
    const payload = await request(`/api/comments/${encodeURIComponent(comment.id)}`, {
      method: "PUT",
      body: JSON.stringify({ body: body.trim() }),
    });
    replaceComment(payload);
    renderComments();
  } catch (error) {
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

function replaceComment(payload) {
  const next = normalizeComment(payload);
  const index = state.comments.findIndex((comment) => String(comment.id) === String(next.id));
  if (index >= 0) {
    state.comments.splice(index, 1, next);
  }
}

function refreshCommentTargetOptions() {
  state.commentTargetOptions.images = [...elements.documentMarkdown.querySelectorAll("img")]
    .map((image, index) => {
      const attachmentId = parseAttachmentId(image.currentSrc || image.src);
      if (!attachmentId) {
        return null;
      }
      image.dataset.commentImageIndex = index;
      return {
        index,
        label: image.alt || image.getAttribute("src") || t("image_number", { number: index + 1 }),
        target: {
          attachment_id: attachmentId,
          x_ratio: 0.5,
          y_ratio: 0.5,
        },
      };
    })
    .filter(Boolean);

  state.commentTargetOptions.mermaidBlocks = [...elements.documentMarkdown.querySelectorAll(".mermaid")]
    .map((block, index) => {
      const blockId = block.dataset.commentBlockId;
      if (!blockId) {
        return null;
      }
      block.dataset.commentMermaidIndex = index;
      return {
        index,
        label: t("mermaid_number", { number: index + 1 }),
        target: { block_id: blockId },
      };
    })
    .filter(Boolean);

  replaceTargetOptions(elements.commentImageTarget, state.commentTargetOptions.images);
  replaceTargetOptions(elements.commentMermaidTarget, state.commentTargetOptions.mermaidBlocks);
}

function replaceTargetOptions(select, options) {
  select.replaceChildren(
    ...options.map((optionItem, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = optionItem.label;
      return option;
    }),
  );
}

function updateCommentTargetControls() {
  const targetType = elements.commentForm.elements.target_type.value;
  const captureButton = elements.commentForm.querySelector('[data-action="capture-text-target"]');
  elements.commentImageField.hidden = targetType !== "image";
  elements.commentMermaidField.hidden = targetType !== "mermaid_block";
  captureButton.hidden = targetType !== "text_selection";
  clearCommentTargetHighlights();

  const target = currentCommentTarget(targetType);
  if (targetType === "document") {
    elements.commentTargetSummary.textContent = t("document");
  } else if (targetType === "text_selection") {
    elements.commentTargetSummary.textContent = target?.selected_text
      ? summarizeTextTarget(target.selected_text)
      : t("no_text_selected");
  } else if (targetType === "image") {
    const selected = selectedTargetOption(state.commentTargetOptions.images, elements.commentImageTarget);
    elements.commentTargetSummary.textContent = selected ? selected.label : t("no_attachment_images");
    if (selected) {
      elements.documentMarkdown.querySelector(`[data-comment-image-index="${selected.index}"]`)?.classList.add("is-comment-target");
    }
    elements.documentMarkdown.querySelectorAll("img").forEach((image) => image.classList.add("is-comment-targetable"));
  } else if (targetType === "mermaid_block") {
    const selected = selectedTargetOption(state.commentTargetOptions.mermaidBlocks, elements.commentMermaidTarget);
    elements.commentTargetSummary.textContent = selected ? selected.label : t("no_mermaid_blocks");
    if (selected) {
      elements.documentMarkdown.querySelector(`[data-comment-mermaid-index="${selected.index}"]`)?.classList.add("is-comment-target");
    }
  }
}

function currentCommentTarget(targetType) {
  if (targetType === "document") {
    return {};
  }
  if (targetType === "text_selection") {
    return state.commentDraftTarget?.target_type === "text_selection"
      ? state.commentDraftTarget.target
      : null;
  }
  if (targetType === "image") {
    return selectedTargetOption(state.commentTargetOptions.images, elements.commentImageTarget)?.target || null;
  }
  if (targetType === "mermaid_block") {
    return selectedTargetOption(state.commentTargetOptions.mermaidBlocks, elements.commentMermaidTarget)?.target || null;
  }
  return null;
}

function selectedTargetOption(options, select) {
  const index = Number(select.value);
  return Number.isInteger(index) ? options[index] : null;
}

function captureTextCommentTarget() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return false;
  }
  const range = selection.getRangeAt(0);
  if (!elements.documentMarkdown.contains(range.commonAncestorContainer)) {
    return false;
  }

  const selectedText = selection.toString();
  if (!selectedText.trim()) {
    return false;
  }

  const prefixRange = range.cloneRange();
  prefixRange.selectNodeContents(elements.documentMarkdown);
  prefixRange.setEnd(range.startContainer, range.startOffset);
  const renderedStartOffset = prefixRange.toString().length;
  const renderedText = elements.documentMarkdown.textContent || "";
  const sourceText = state.selectedDocument?.content_markdown || "";
  const sourceStartOffset = sourceText.indexOf(selectedText);
  const useSourceOffsets = sourceStartOffset >= 0
    && sourceText.indexOf(selectedText, sourceStartOffset + selectedText.length) === -1;
  const text = useSourceOffsets ? sourceText : renderedText;
  const startOffset = useSourceOffsets ? sourceStartOffset : renderedStartOffset;
  const endOffset = startOffset + selectedText.length;
  state.commentDraftTarget = {
    target_type: "text_selection",
    target: {
      start_offset: startOffset,
      end_offset: endOffset,
      selected_text: selectedText,
      prefix_context: text.slice(Math.max(0, startOffset - 32), startOffset),
      suffix_context: text.slice(endOffset, endOffset + 32),
    },
  };
  updateCommentTargetControls();
  setStatus(elements.commentsStatus, "");
  return true;
}

function captureImageCommentTarget(event) {
  if (elements.commentForm.elements.target_type.value !== "image") {
    return;
  }
  const image = event.target.closest("img");
  if (!image) {
    return;
  }
  const index = Number(image.dataset.commentImageIndex);
  const option = state.commentTargetOptions.images.find((item) => item.index === index);
  if (!option) {
    return;
  }
  const rect = image.getBoundingClientRect();
  option.target.x_ratio = clampRatio((event.clientX - rect.left) / rect.width);
  option.target.y_ratio = clampRatio((event.clientY - rect.top) / rect.height);
  elements.commentImageTarget.value = String(state.commentTargetOptions.images.indexOf(option));
  updateCommentTargetControls();
}

function clearCommentTargetHighlights() {
  elements.documentMarkdown.querySelectorAll(".is-comment-target, .is-comment-targetable").forEach((node) => {
    node.classList.remove("is-comment-target", "is-comment-targetable");
  });
}

async function loadRevisions(documentId) {
  setStatus(elements.historyStatus, t("loading_revisions"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(documentId)}/revisions`);
    state.revisions = listItems(payload).map(normalizeRevision);
    renderRevisionList();
    setStatus(elements.historyStatus, state.revisions.length ? "" : t("no_revisions_yet"));
  } catch (error) {
    state.revisions = [];
    renderRevisionList();
    setStatus(elements.historyStatus, readableError(error), true);
  }
}

function renderRevisionList({ preserveSelection = false } = {}) {
  const previousTarget = elements.diffTarget.value;
  const previousAgainst = elements.diffAgainst.value;
  elements.revisionList.replaceChildren(
    ...state.revisions.map((revision) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.revisionId = revision.id;
      button.innerHTML = `
        <strong>v${escapeHtml(String(revision.version_number ?? "?"))}</strong>
        <span class="list-summary">${escapeHtml(revision.summary || t("no_summary"))}</span>
        <span class="list-meta">${escapeHtml(formatDate(revision.created_at))}</span>
      `;
      item.append(button);
      return item;
    }),
  );

  const options = state.revisions.map((revision) => {
    const option = document.createElement("option");
    option.value = revision.id;
    option.textContent = `v${revision.version_number ?? "?"}`;
    return option;
  });
  elements.diffTarget.replaceChildren(...options.map((option) => option.cloneNode(true)));
  elements.diffAgainst.replaceChildren(...options);

  if (state.revisions.length >= 2) {
    elements.diffTarget.value = preserveSelection && state.revisions.some((revision) => String(revision.id) === previousTarget)
      ? previousTarget
      : state.revisions[0].id;
    elements.diffAgainst.value = preserveSelection && state.revisions.some((revision) => String(revision.id) === previousAgainst)
      ? previousAgainst
      : state.revisions[1].id;
  }
  if (!preserveSelection) {
    elements.diffOutput.textContent = "";
  }
  setStatus(elements.diffStatus, state.revisions.length < 2 ? t("need_two_revisions") : "");
}

function selectRevision(id) {
  elements.revisionList.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.revisionId === id);
  });
  elements.diffTarget.value = id;
}

async function loadDiff() {
  const revisionId = elements.diffTarget.value;
  const againstId = elements.diffAgainst.value;
  if (!revisionId || !againstId || revisionId === againstId) {
    setStatus(elements.diffStatus, t("choose_two_different_revisions"), true);
    return;
  }

  setStatus(elements.diffStatus, t("loading_diff"));
  try {
    const payload = await request(
      `/api/revisions/${encodeURIComponent(revisionId)}/diff?against=${encodeURIComponent(againstId)}`,
    );
    elements.diffOutput.textContent = normalizeDiff(payload);
    setStatus(elements.diffStatus, "");
  } catch (error) {
    elements.diffOutput.textContent = "";
    setStatus(elements.diffStatus, readableError(error), true);
  }
}

async function restoreRevision() {
  if (!hasRoleAtLeast("editor")) {
    setStatus(elements.diffStatus, t("no_permission"), true);
    return;
  }
  const revisionId = elements.diffTarget.value;
  if (!revisionId) {
    setStatus(elements.diffStatus, t("choose_revision_to_restore"), true);
    return;
  }

  const revision = state.revisions.find((item) => String(item.id) === revisionId);
  if (!window.confirm(t("restore_revision_confirm", { version: revision?.version_number ?? "?" }))) {
    return;
  }

  setStatus(elements.diffStatus, t("restoring_revision"));
  try {
    const payload = await request(`/api/revisions/${encodeURIComponent(revisionId)}/restore`, {
      method: "POST",
    });
    if (state.selectedDocument?.id) {
      await selectDocument(state.selectedDocument.id);
    }
    setStatus(
      elements.diffStatus,
      payload?.revision_id ? t("restored_revision", { id: payload.revision_id }) : t("restored"),
    );
  } catch (error) {
    setStatus(elements.diffStatus, readableError(error), true);
  }
}

function setTermTab(tab) {
  state.activeTermTab = tab;
  document.querySelectorAll(".term-detail-tabs button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.termTab === tab);
  });
  document.querySelectorAll(".term-section").forEach((section) => {
    const id = section.id;
    const active = id === `term-section-${tab}`;
    section.classList.toggle("is-active", active);
    section.hidden = !active;
  });
  if (tab === "history" && state.selectedTerm?.id && !state.termRevisions.length) {
    loadTermRevisions(state.selectedTerm.id);
  }
}

async function loadTermRevisions(termId) {
  if (!elements.termDiffStatus) return;
  setStatus(elements.termDiffStatus, t("loading_term_revisions"));
  try {
    const payload = await request(`/api/glossary/${encodeURIComponent(termId)}/revisions`);
    state.termRevisions = (payload?.items || []);
    renderTermRevisionList();
    setStatus(elements.termDiffStatus, state.termRevisions.length ? "" : t("no_term_revisions_yet"));
  } catch (error) {
    state.termRevisions = [];
    renderTermRevisionList();
    setStatus(elements.termDiffStatus, readableError(error), true);
  }
}

function renderTermRevisionList() {
  if (!elements.termRevisionList) return;
  elements.termRevisionList.replaceChildren(
    ...state.termRevisions.map((rev) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.termRevisionId = rev.id;
      const author = rev.author_display_name || rev.author_username || t("unknown_author");
      button.innerHTML = `
        <strong>v${escapeHtml(String(rev.version_number ?? "?"))}</strong>
        <span class="list-summary">${escapeHtml(author)}</span>
        <span class="list-meta">${escapeHtml(formatDate(rev.created_at))}</span>
      `;
      item.append(button);
      return item;
    }),
  );

  if (!elements.termDiffTarget || !elements.termDiffAgainst) return;
  const options = state.termRevisions.map((rev) => {
    const option = document.createElement("option");
    option.value = rev.id;
    option.textContent = `v${rev.version_number ?? "?"}`;
    return option;
  });
  elements.termDiffTarget.replaceChildren(...options.map((o) => o.cloneNode(true)));
  elements.termDiffAgainst.replaceChildren(...options);

  if (state.termRevisions.length >= 2) {
    elements.termDiffTarget.value = state.termRevisions[0].id;
    elements.termDiffAgainst.value = state.termRevisions[1].id;
  }
  if (elements.termDiffOutput) {
    elements.termDiffOutput.textContent = "";
  }
  if (state.termRevisions.length < 2) {
    setStatus(elements.termDiffStatus, t("need_two_term_revisions"));
  }
}

function selectTermRevision(id) {
  if (!elements.termRevisionList) return;
  elements.termRevisionList.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.termRevisionId === String(id));
  });
  if (elements.termDiffTarget) {
    elements.termDiffTarget.value = id;
  }
}

async function loadTermDiff() {
  if (!elements.termDiffTarget || !elements.termDiffAgainst || !elements.termDiffStatus) return;
  const aId = elements.termDiffTarget.value;
  const bId = elements.termDiffAgainst.value;
  if (!aId || !bId || aId === bId) {
    setStatus(elements.termDiffStatus, t("choose_two_different_revisions"), true);
    return;
  }
  setStatus(elements.termDiffStatus, t("loading_diff"));
  try {
    const payload = await request(`/api/glossary/revisions/diff?a=${encodeURIComponent(aId)}&b=${encodeURIComponent(bId)}`);
    if (elements.termDiffOutput) {
      elements.termDiffOutput.textContent = Array.isArray(payload?.diff)
        ? payload.diff.join("\n")
        : (payload?.diff || "");
    }
    setStatus(elements.termDiffStatus, "");
  } catch (error) {
    if (elements.termDiffOutput) elements.termDiffOutput.textContent = "";
    setStatus(elements.termDiffStatus, readableError(error), true);
  }
}

async function restoreTermRevision() {
  if (!hasRoleAtLeast("editor")) {
    if (elements.termDiffStatus) setStatus(elements.termDiffStatus, t("no_permission"), true);
    return;
  }
  if (!elements.termDiffTarget) return;
  const revisionId = elements.termDiffTarget.value;
  if (!revisionId) {
    setStatus(elements.termDiffStatus, t("choose_revision_to_restore"), true);
    return;
  }
  const rev = state.termRevisions.find((r) => String(r.id) === String(revisionId));
  if (!window.confirm(t("restore_term_revision_confirm", { version: rev?.version_number ?? "?" }))) {
    return;
  }
  setStatus(elements.termDiffStatus, t("restoring_term_revision"));
  try {
    const term = await request(`/api/glossary/revisions/${encodeURIComponent(revisionId)}/restore`, {
      method: "POST",
    });
    const normalized = normalizeTerm(term);
    state.selectedTerm = normalized;
    // Update glossary state to reflect new term data
    const idx = state.glossary.findIndex((g) => String(g.id) === String(normalized.id));
    if (idx >= 0) state.glossary.splice(idx, 1, normalized);
    renderTermDetail();
    renderGlossaryList();
    // Reload revisions to show the new restoration revision
    if (state.selectedTerm?.id) {
      await loadTermRevisions(state.selectedTerm.id);
    }
    setStatus(elements.termDiffStatus, t("restored_term_revision", { version: rev?.version_number ?? "?" }));
  } catch (error) {
    setStatus(elements.termDiffStatus, readableError(error), true);
  }
}

async function loadGlossary() {
  setStatus(elements.glossaryStatus, t("loading_glossary"));
  try {
    const payload = await request("/api/glossary?page_size=100");
    state.glossary = listItems(payload).map(normalizeTerm);
    renderGlossaryList();
    setStatus(elements.glossaryStatus, state.glossary.length ? "" : t("no_glossary_terms_found"));
  } catch (error) {
    state.glossary = [];
    renderGlossaryList();
    setStatus(elements.glossaryStatus, readableError(error), true);
  }
}

function renderGlossaryList() {
  const query = elements.glossarySearch.value.trim().toLowerCase();
  const terms = state.glossary.filter((term) => {
    return !query || `${term.term} ${term.description_markdown}`.toLowerCase().includes(query);
  });
  const inCreator = state.activeMode === "creator";

  elements.glossaryList.replaceChildren(
    ...terms.map((term) => {
      const item = document.createElement("li");
      item.className = "glossary-list-item";
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.termId = term.id;
      button.classList.toggle("is-active", term.id === state.selectedTerm?.id);
      button.textContent = term.term || t("untitled_term");
      item.append(button);
      if (inCreator) {
        const insert = document.createElement("button");
        insert.type = "button";
        insert.className = "glossary-insert-button icon-button";
        insert.dataset.action = "insert-glossary-term-link";
        insert.dataset.termName = term.term;
        insert.dataset.termSlug = term.slug;
        insert.setAttribute("aria-label", t("insert_term_link"));
        insert.innerHTML = '<i data-lucide="link-2" aria-hidden="true"></i>';
        item.append(insert);
      }
      return item;
    }),
  );
  refreshIcons();
}

async function selectTerm(id, { focusViewer = true, skipHashUpdate = false } = {}) {
  try {
    const payload = await request(`/api/glossary/${encodeURIComponent(id)}`);
    state.selectedTerm = normalizeTerm(payload);
  } catch (error) {
    const fallback = state.glossary.find((term) => String(term.id) === String(id));
    state.selectedTerm = fallback || null;
    if (!fallback) {
      setStatus(elements.glossaryStatus, readableError(error), true);
      return;
    }
  }

  // Reset term tab and revision state when switching terms
  state.activeTermTab = "overview";
  state.termRevisions = [];
  state.selectedTermRevision = null;

  if (focusViewer) {
    state.viewerContent = "term";
    setAppMode("viewer");
    setMobileView("workspace");
  }
  renderGlossaryList();
  renderGlossaryDetail();
  renderDocumentDetail();
  renderTermDetail();
  if (focusViewer && !skipHashUpdate && state.selectedTerm?.slug) {
    updateHashRoute({ type: "term", slug: state.selectedTerm.slug });
  }
  // Eagerly load revisions so history tab is ready
  if (state.selectedTerm?.id) {
    loadTermRevisions(state.selectedTerm.id);
  }
}

function renderGlossaryDetail() {
  const term = state.selectedTerm;
  if (!term) {
    elements.glossaryDetail.replaceChildren();
    return;
  }

  elements.glossaryDetail.innerHTML = `<h3>${escapeHtml(term.term || t("untitled_term"))}</h3>`;
  const body = document.createElement("div");
  body.className = "markdown-body";
  elements.glossaryDetail.append(body);
  renderMarkdown(body, term.description_markdown || "");
}

function clientNormalizeSlug(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function updateSlugPreview() {
  const dialog = elements.termEditorDialog;
  if (!dialog || !dialog.open) return;
  const form = dialog.querySelector("#term-editor-form");
  const previewEl = document.querySelector("#term-slug-preview");
  if (!form || !previewEl) return;
  const termName = String(form.elements.term.value || "").trim();
  const slugInput = String(form.elements.slug.value || "").trim();
  const proposed = slugInput
    ? clientNormalizeSlug(slugInput)
    : clientNormalizeSlug(termName);
  if (!proposed) {
    previewEl.hidden = true;
    return;
  }
  const editingId = state.editingTerm?.id ?? null;
  const collision = state.glossary.find(
    (t) => t.id !== editingId && (t.slug === proposed || (t.aliases || []).some((a) => a.alias_slug === proposed)),
  );
  previewEl.hidden = false;
  previewEl.dataset.status = collision ? "collision" : "ok";
  if (collision) {
    previewEl.innerHTML = escapeHtml(t("slug_preview_collision", { slug: proposed, conflict: collision.term || "" }));
  } else {
    previewEl.innerHTML = t("slug_preview_ok", { slug: `<code>/term/${escapeHtml(proposed)}</code>` });
  }
}

function renderTermEditorUsedIn(term) {
  const host = document.querySelector("#term-editor-usedin");
  const list = document.querySelector("#term-editor-usedin-list");
  const countEl = document.querySelector("#term-editor-usedin-count");
  if (!host || !list || !countEl) return;
  const docs = term?.related_documents || [];
  if (!term || docs.length === 0) {
    host.hidden = true;
    list.replaceChildren();
    countEl.textContent = "";
    return;
  }
  host.hidden = false;
  countEl.textContent = `(${docs.length})`;
  list.replaceChildren(...docs.map((doc) => {
    const li = document.createElement("li");
    li.textContent = doc.title || t("untitled_document");
    return li;
  }));
}

function openTermEditor(term) {
  state.editingTerm = term || null;
  const dialog = elements.termEditorDialog;
  if (!dialog) return;
  const form = dialog.querySelector("#term-editor-form");
  if (!form) return;
  const titleEl = dialog.querySelector("#term-editor-title");
  if (titleEl) {
    titleEl.textContent = term ? t("edit_term") : t("new_term");
    titleEl.dataset.i18n = term ? "edit_term" : "new_term";
  }
  form.elements.term.value = term?.term || "";
  form.elements.slug.value = term?.slug || "";
  form.elements.description_markdown.value = term?.description_markdown || "";
  // Populate aliases textarea
  if (form.elements.aliases) {
    form.elements.aliases.value = (term?.aliases || []).map((a) => a.alias).join("\n");
  }
  // Populate term tags checkboxes
  const termTagsContainer = dialog.querySelector("#term-editor-tags");
  if (termTagsContainer) {
    const checkedIds = new Set((term?.tags || []).map((tg) => String(tg.id)));
    termTagsContainer.replaceChildren(
      ...(state.tags || []).map((tag) => {
        const label = document.createElement("label");
        label.className = "tag-chip-label";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "term_tag_ids";
        input.value = String(tag.id);
        if (checkedIds.has(String(tag.id))) input.checked = true;
        const span = document.createElement("span");
        span.className = "chip";
        span.textContent = tag.name;
        label.append(input, span);
        return label;
      }),
    );
  }
  renderTermEditorPreview();
  renderTermEditorUsedIn(term);
  updateSlugPreview();
  if (!dialog.open) {
    dialog.showModal();
  }
  form.elements.term.focus();
}

function closeTermEditor() {
  const dialog = elements.termEditorDialog;
  if (dialog?.open) {
    dialog.close();
  }
  state.editingTerm = null;
}

function openTermEditorForCreation(seedName) {
  state.editingTerm = null;
  const dialog = elements.termEditorDialog;
  if (!dialog) return;
  const form = dialog.querySelector("#term-editor-form");
  if (!form) return;
  // Reset form
  form.elements.term.value = (seedName || "").trim();
  form.elements.slug.value = "";
  form.elements.description_markdown.value = "";
  if (form.elements.aliases) form.elements.aliases.value = "";
  // Reset tag checkboxes
  const tagsHost = dialog.querySelector("#term-editor-tags");
  if (tagsHost) {
    tagsHost.querySelectorAll('input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
  }
  const titleEl = dialog.querySelector("#term-editor-title");
  if (titleEl) {
    titleEl.textContent = t("new_term");
    titleEl.dataset.i18n = "new_term";
  }
  if (!dialog.open) dialog.showModal();
  renderTermEditorPreview();
  renderTermEditorUsedIn(null);
  updateSlugPreview();
  form.elements.term.focus();
  form.elements.term.select();
}

function promoteSelectionToTerm() {
  if (!hasRoleAtLeast("editor")) return;
  const textarea = elements.editorForm?.elements?.content_markdown;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end).trim();
  if (!selected) {
    setStatus(elements.editorStatus, t("promote_no_selection"));
    return;
  }
  // Replace selection with [[selected]] so the link will resolve once the term is saved.
  textarea.focus();
  textarea.setRangeText(`[[${selected}]]`, start, end, "select");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  // Open the term editor pre-filled.
  openTermEditorForCreation(selected);
}

async function submitTermForm(event) {
  event.preventDefault();
  const form = event.target;
  const termText = String(form.elements.term.value || "").trim();
  const slug = String(form.elements.slug.value || "").trim();
  const description_markdown = String(form.elements.description_markdown.value || "");
  if (!termText) {
    return;
  }
  const editing = state.editingTerm?.id;
  const path = editing ? `/api/glossary/${encodeURIComponent(editing)}` : "/api/glossary";
  const body = { term: termText, description_markdown };
  if (slug) body.slug = slug;
  // Collect aliases from textarea (one per line)
  if (form.elements.aliases) {
    body.aliases = String(form.elements.aliases.value || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  // Collect tag_ids from checkboxes
  const checkedTagInputs = form.querySelectorAll('input[name="term_tag_ids"]:checked');
  if (checkedTagInputs.length > 0 || form.querySelector('input[name="term_tag_ids"]')) {
    body.tag_ids = [...checkedTagInputs].map((input) => Number(input.value)).filter(Boolean);
  }
  try {
    const savedTerm = normalizeTerm(await request(path, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(body),
    }));
    closeTermEditor();
    setStatus(elements.glossaryStatus, t("term_saved"));
    await loadGlossary();
    if (state.selectedDocument) {
      renderDocumentDetail();
    }
    if (state.viewerContent === "term" && state.selectedTerm) {
      renderTermDetail();
    }
    if (savedTerm?.id) {
      await selectTerm(savedTerm.id);
    }
  } catch (error) {
    setStatus(elements.glossaryStatus, readableError(error), true);
  }
}

function confirmDeleteTerm() {
  const term = state.selectedTerm;
  if (!term?.id) return;
  state.deleteTermPending = term;
  const dialog = document.querySelector("#delete-term-dialog");
  if (!dialog) return;
  const question = document.querySelector("#delete-term-question");
  const warning = document.querySelector("#delete-term-warning-region");
  const usedInList = document.querySelector("#delete-term-usedin-list");
  const confirmRegion = document.querySelector("#delete-term-confirm-region");
  const confirmLabel = document.querySelector("#delete-term-confirm-label");
  const confirmInput = document.querySelector("#delete-term-confirm-input");
  const confirmButton = document.querySelector("#delete-term-confirm-button");
  if (question) question.textContent = t("delete_term_question", { term: term.term || "" });
  const docs = term.related_documents || [];
  if (docs.length > 0) {
    if (warning) {
      warning.hidden = false;
      warning.textContent = t("delete_term_used_warning", { count: String(docs.length) });
    }
    if (usedInList) {
      usedInList.replaceChildren(...docs.map((doc) => {
        const li = document.createElement("li");
        li.textContent = doc.title || t("untitled_document");
        return li;
      }));
    }
    if (confirmRegion) confirmRegion.hidden = false;
    if (confirmLabel) confirmLabel.textContent = t("delete_term_type_confirm", { term: term.term || "" });
    if (confirmInput) {
      confirmInput.value = "";
      confirmInput.addEventListener("input", updateDeleteTermButtonState);
    }
    if (confirmButton) confirmButton.disabled = true;
  } else {
    if (warning) warning.hidden = true;
    if (usedInList) usedInList.replaceChildren();
    if (confirmRegion) confirmRegion.hidden = true;
    if (confirmButton) confirmButton.disabled = false;
  }
  if (!dialog.open) dialog.showModal();
}

function updateDeleteTermButtonState() {
  const term = state.deleteTermPending;
  const input = document.querySelector("#delete-term-confirm-input");
  const button = document.querySelector("#delete-term-confirm-button");
  if (!term || !input || !button) return;
  const docs = term.related_documents || [];
  if (docs.length === 0) {
    button.disabled = false;
    return;
  }
  button.disabled = input.value.trim() !== term.term;
}

function closeDeleteTermDialog() {
  const dialog = document.querySelector("#delete-term-dialog");
  if (dialog?.open) dialog.close();
  state.deleteTermPending = null;
}

async function executeDeleteTerm() {
  const term = state.deleteTermPending;
  if (!term?.id) return;
  const docs = term.related_documents || [];
  const input = document.querySelector("#delete-term-confirm-input");
  if (docs.length > 0 && input && input.value.trim() !== term.term) {
    return;
  }
  try {
    await request(`/api/glossary/${encodeURIComponent(term.id)}`, { method: "DELETE" });
    setStatus(elements.glossaryStatus, t("term_deleted"));
    state.selectedTerm = null;
    state.viewerContent = "document";
    renderDocumentDetail();
    renderTermDetail();
    closeDeleteTermDialog();
    await loadGlossary();
    if (state.selectedDocument) renderDocumentDetail();
  } catch (error) {
    setStatus(elements.glossaryStatus, readableError(error), true);
  }
}

async function loadPlugins() {
  setStatus(elements.pluginStatus, t("loading_plugins"));
  try {
    const payload = await request("/api/plugins");
    state.plugins = listItems(payload).map(normalizePlugin);
    renderPlugins();
    setStatus(elements.pluginStatus, state.plugins.length ? "" : t("no_plugins_installed"));
  } catch (error) {
    state.plugins = [];
    renderPlugins();
    setStatus(elements.pluginStatus, readableError(error), true);
  }
}

function renderPlugins() {
  elements.pluginList.replaceChildren(
    ...state.plugins.map((plugin) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <div class="plugin-header">
          <div>
            <strong>${escapeHtml(plugin.name || plugin.id)}</strong>
            <div class="list-meta">${escapeHtml(plugin.version || t("no_version"))}</div>
          </div>
          <span class="chip">${escapeHtml(pluginStatusLabel(plugin.status))}</span>
        </div>
        <div class="plugin-actions">
          <button type="button" data-plugin-id="${escapeAttribute(plugin.id)}" data-plugin-action="compatibility">${escapeHtml(t("plugin_action_check"))}</button>
          <button type="button" data-plugin-id="${escapeAttribute(plugin.id)}" data-plugin-action="${plugin.status === "enabled" ? "disable" : "enable"}">
            ${escapeHtml(plugin.status === "enabled" ? t("plugin_action_disable") : t("plugin_action_enable"))}
          </button>
        </div>
      `;
      if (plugin.compatibility) {
        item.append(renderCompatibility(plugin.compatibility));
      }
      return item;
    }),
  );
}

async function mutatePlugin(id, action) {
  const plugin = state.plugins.find((item) => String(item.id) === String(id));
  if (!plugin) {
    return;
  }

  setStatus(elements.pluginStatus, pluginActionProgressLabel(action, plugin.name || plugin.id));
  try {
    if (action === "compatibility") {
      plugin.compatibility = await request(`/api/plugins/${encodeURIComponent(id)}/compatibility`);
    } else {
      await request(`/api/plugins/${encodeURIComponent(id)}/${action}`, { method: "POST" });
      await Promise.all([loadPlugins(), loadSession()]);
      return;
    }
    renderPlugins();
    setStatus(elements.pluginStatus, "");
  } catch (error) {
    setStatus(elements.pluginStatus, readableError(error), true);
  }
}

function renderCompatibility(payload) {
  const node = document.createElement("div");
  const result = payload?.result || "unknown";
  node.className = "compatibility";
  node.dataset.result = result;
  node.textContent = `${pluginStatusLabel(result)}: ${payload?.remediation || summarizeChecks(payload?.checks) || t("no_details_returned")}`;
  return node;
}

function setAppMode(mode) {
  if (mode === "creator" && !hasRoleAtLeast("editor")) {
    mode = "viewer";
  }
  state.activeMode = mode;
  elements.shell.dataset.appMode = mode;
  document.querySelectorAll(".app-tabs button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  document.querySelectorAll(".app-mode").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${mode}-mode`);
  });
  if (mode === "creator") {
    if (["glossary", "plugins"].includes(elements.shell.dataset.mobileView)) {
      setMobileView("workspace");
    }
    setCreatorView(state.activeCreatorView);
    setCommentsOpen(false);
  }
  if (state.glossary?.length) {
    renderGlossaryList();
  }
}

function setCommentsOpen(open) {
  state.commentsOpen = Boolean(open);
  elements.shell.dataset.commentsOpen = String(state.commentsOpen);
  if (elements.commentsToggle) {
    elements.commentsToggle.setAttribute(
      "aria-label",
      state.commentsOpen ? t("close_comments") : t("open_comments"),
    );
  }
}

function setCreatorView(view) {
  state.activeCreatorView = view;
  document.querySelectorAll(".creator-tabs button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.creatorView === view);
  });
  document.querySelectorAll(".creator-view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${view}-view`);
  });
  if (view === "preview") {
    renderCreatorPreview();
  }
  if (view === "edit") {
    renderEditorLivePreview();
  }
}

function setRibbonTab(tab) {
  if (!tab) return;
  state.activeRibbonTab = tab;
  document.querySelectorAll(".ribbon-tabs button").forEach((btn) => {
    const active = btn.dataset.ribbonTab === tab;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".ribbon-panel").forEach((panel) => {
    const active = panel.id === `ribbon-panel-${tab}`;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

function setPreviewMode(mode) {
  if (!["split", "editor", "preview"].includes(mode)) return;
  state.previewMode = mode;
  if (elements.writingStage) {
    elements.writingStage.dataset.previewMode = mode;
  }
  document.querySelectorAll(".preview-mode-toggle button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.previewMode === mode);
  });
  if (mode === "split" || mode === "preview") {
    renderEditorLivePreview();
  }
}

function renderEditorLivePreview() {
  if (!elements.editorLivePreview) return;
  const value = elements.editorForm.elements.content_markdown.value;
  renderMarkdown(elements.editorLivePreview, value);
}

function renderTermEditorPreview() {
  const textarea = document.querySelector("#term-editor-description-textarea");
  const preview = document.querySelector("#term-editor-live-preview");
  if (!textarea || !preview) return;
  renderMarkdown(preview, textarea.value || "");
}

function setAuxPanel(panel) {
  if (panel === "plugins" && !hasRoleAtLeast("admin")) {
    panel = "glossary";
  }
  state.activePanel = panel;
  document.querySelectorAll(".panel-tabs button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panel === panel);
  });
  document.querySelectorAll(".aux-panel").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${panel}-panel`);
  });
  if (panel === "plugins" && !state.plugins.length) {
    loadPlugins();
  }
}

function setMobileView(view) {
  if (view === "plugins" && !hasRoleAtLeast("admin")) {
    view = "glossary";
  }
  elements.shell.dataset.mobileView = view;
  if (view === "glossary" || view === "plugins") {
    setAuxPanel(view);
  }
  document.querySelectorAll(".mobile-nav button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mobileTarget === view);
  });
}

function renderMarkdown(target, markdown) {
  if (!window.marked) {
    target.textContent = markdown || "";
    return;
  }

  target.innerHTML = sanitizeHtml(marked.parse(markdown || ""));
  target.querySelectorAll("pre > code.language-mermaid").forEach((code, index) => {
    const diagram = document.createElement("div");
    diagram.className = "mermaid";
    diagram.dataset.commentBlockId = mermaidBlockId(code.textContent, index);
    diagram.textContent = code.textContent;
    code.parentElement.replaceWith(diagram);
  });
  applyWikiLinks(target);
  if (window.mermaid) {
    mermaid.run({ nodes: target.querySelectorAll(".mermaid") }).catch(() => {});
  }
}

const WIKI_LINK_PATTERN = /\[\[([^\]|\n]+?)(?:\|([^\]\n]+))?\]\]/g;
const WIKI_LINK_SKIP_TAGS = new Set(["A", "CODE", "PRE", "SCRIPT", "STYLE"]);

function applyWikiLinks(root) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.includes("[[")) {
        return NodeFilter.FILTER_REJECT;
      }
      let parent = node.parentNode;
      while (parent && parent !== root) {
        if (WIKI_LINK_SKIP_TAGS.has(parent.nodeName)) {
          return NodeFilter.FILTER_REJECT;
        }
        parent = parent.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => replaceWikiLinksInTextNode(node));

  // Auto-link pass: only if setting is enabled
  if (state.settings?.glossary_autolink === "on") {
    applyGlossaryAutolinks(root);
  }
}

function replaceWikiLinksInTextNode(node) {
  const text = node.nodeValue;
  WIKI_LINK_PATTERN.lastIndex = 0;
  let match = WIKI_LINK_PATTERN.exec(text);
  if (!match) return;

  const fragment = document.createDocumentFragment();
  let cursor = 0;
  do {
    if (match.index > cursor) {
      fragment.append(document.createTextNode(text.slice(cursor, match.index)));
    }
    const targetRaw = (match[1] || "").trim();
    const displayRaw = (match[2] || "").trim();
    fragment.append(buildWikiLink(targetRaw, displayRaw || targetRaw));
    cursor = WIKI_LINK_PATTERN.lastIndex;
    match = WIKI_LINK_PATTERN.exec(text);
  } while (match);

  if (cursor < text.length) {
    fragment.append(document.createTextNode(text.slice(cursor)));
  }
  node.parentNode.replaceChild(fragment, node);
}

function resolveGlossaryTerm(target) {
  if (!target) return null;
  const needle = target.toLowerCase();
  return (
    state.glossary.find(
      (term) =>
        (term.term || "").toLowerCase() === needle ||
        (term.slug || "").toLowerCase() === needle ||
        (term.aliases || []).some(
          (a) =>
            (a.alias || "").toLowerCase() === needle ||
            (a.alias_slug || "").toLowerCase() === needle,
        ),
    ) || null
  );
}

function buildWikiLink(target, display) {
  const anchor = document.createElement("a");
  anchor.className = "wiki-link";
  anchor.dataset.wikiTarget = target;
  anchor.textContent = display || target;
  const term = resolveGlossaryTerm(target);
  if (term) {
    anchor.dataset.termId = term.id;
    anchor.href = `#term-${term.id}`;
    anchor.title = term.term || target;
  } else {
    anchor.classList.add("is-missing");
    anchor.href = "#";
    anchor.title = hasRoleAtLeast("editor")
      ? t("wiki_link_unresolved_editor", { term: target })
      : t("wiki_link_unresolved", { term: target });
  }
  return anchor;
}

// ── Glossary index ────────────────────────────────────────────────────────

function showGlossaryIndex() {
  state.viewerContent = "glossary";
  setAppMode("viewer");
  setMobileView("workspace");
  renderDocumentDetail();
  renderTermDetail();
  renderGlossaryIndex();
  updateHashRoute({ type: "glossary", slug: "" });
}

function renderGlossaryIndex() {
  const article = document.querySelector("#glossary-index");
  if (!article) return;
  article.hidden = state.viewerContent !== "glossary";
  if (article.hidden) return;
  populateGlossaryIndexTagFilter();
  const filter = state.glossaryIndexFilter;
  const q = (filter.q || "").toLowerCase();
  const tag = (filter.tag || "").toLowerCase();
  const sort = filter.sort || "term_asc";

  let items = state.glossary.slice();
  if (q) {
    items = items.filter((term) => {
      const hay = `${term.term} ${term.description_markdown || ""} ${(term.aliases || []).map((a) => a.alias).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (tag) {
    items = items.filter((term) => (term.tags || []).some((tg) => (tg.slug || "").toLowerCase() === tag));
  }
  items.sort((a, b) => {
    if (sort === "term_asc") return (a.term || "").localeCompare(b.term || "");
    if (sort === "term_desc") return (b.term || "").localeCompare(a.term || "");
    if (sort === "updated_desc") return (b.updated_at || "").localeCompare(a.updated_at || "");
    return 0;
  });

  const listEl = document.querySelector("#glossary-index-list");
  if (!listEl) return;
  listEl.replaceChildren(...items.map((term) => {
    const li = document.createElement("li");
    li.className = "glossary-index-item";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.termId = term.id;
    button.className = "glossary-index-button";
    const name = document.createElement("span");
    name.className = "glossary-index-name";
    name.textContent = term.term || t("untitled_term");
    button.append(name);
    if ((term.aliases || []).length) {
      const aliasSpan = document.createElement("span");
      aliasSpan.className = "glossary-index-aliases muted";
      aliasSpan.textContent = (term.aliases || []).map((a) => a.alias).join(", ");
      button.append(aliasSpan);
    }
    if (term.description_markdown) {
      const desc = document.createElement("span");
      desc.className = "glossary-index-desc muted";
      desc.textContent = String(term.description_markdown).slice(0, 200);
      button.append(desc);
    }
    li.append(button);
    return li;
  }));
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = t("no_glossary_terms_found");
    listEl.append(li);
  }
  refreshIcons();
}

function populateGlossaryIndexTagFilter() {
  const select = document.querySelector("#glossary-index-tag-filter");
  if (!select) return;
  const seen = new Map();
  state.glossary.forEach((term) => {
    (term.tags || []).forEach((tag) => {
      if (!seen.has(tag.slug)) seen.set(tag.slug, tag.name);
    });
  });
  const current = state.glossaryIndexFilter.tag || "";
  select.replaceChildren();
  const optAll = document.createElement("option");
  optAll.value = "";
  optAll.textContent = t("all_tags");
  select.append(optAll);
  for (const [slug, name] of seen) {
    const opt = document.createElement("option");
    opt.value = slug;
    opt.textContent = name;
    if (slug === current) opt.selected = true;
    select.append(opt);
  }
}

// ── Bulk import ────────────────────────────────────────────────────────────

function openBulkImportDialog() {
  if (!hasRoleAtLeast("admin")) return;
  const dialog = document.querySelector("#bulk-import-dialog");
  if (!dialog) return;
  const form = document.querySelector("#bulk-import-form");
  if (form) form.reset();
  const statusEl = document.querySelector("#bulk-import-status");
  if (statusEl) { statusEl.textContent = ""; statusEl.classList.remove("is-error"); }
  if (!dialog.open) dialog.showModal();
}

function closeBulkImportDialog() {
  const dialog = document.querySelector("#bulk-import-dialog");
  if (dialog?.open) dialog.close();
}

async function submitBulkImport(event) {
  event.preventDefault();
  const form = event.target;
  const statusEl = document.querySelector("#bulk-import-status");
  const raw = String(form.elements.json?.value || "").trim();
  let items;
  try {
    items = JSON.parse(raw);
  } catch (err) {
    if (statusEl) { statusEl.textContent = "Invalid JSON: " + err.message; statusEl.classList.add("is-error"); }
    return;
  }
  if (!Array.isArray(items)) {
    if (statusEl) { statusEl.textContent = "Expected a JSON array."; statusEl.classList.add("is-error"); }
    return;
  }
  if (statusEl) { statusEl.textContent = "Importing..."; statusEl.classList.remove("is-error"); }
  try {
    const summary = await request("/api/glossary/bulk", {
      method: "POST",
      body: JSON.stringify(items),
    });
    await loadGlossary();
    closeBulkImportDialog();
    if (state.viewerContent === "glossary") renderGlossaryIndex();
    setStatus(elements.glossaryStatus, t("bulk_import_success", {
      created: String(summary.created?.length ?? 0),
      updated: String(summary.updated?.length ?? 0),
    }));
  } catch (error) {
    if (statusEl) { statusEl.textContent = readableError(error); statusEl.classList.add("is-error"); }
  }
}

// ── Settings / autolink ────────────────────────────────────────────────────

async function loadSettings() {
  try {
    const settings = await request("/api/settings");
    state.settings = settings || { glossary_autolink: "off" };
  } catch (_) {
    state.settings = { glossary_autolink: "off" };
  }
  renderAutolinkStatus();
}

function renderAutolinkStatus() {
  const statusEl = document.querySelector("#autolink-status");
  if (!statusEl) return;
  statusEl.textContent = state.settings?.glossary_autolink === "on" ? "ON" : "OFF";
}

async function toggleGlossaryAutolink() {
  if (!hasRoleAtLeast("admin")) return;
  const currentValue = state.settings?.glossary_autolink || "off";
  const newValue = currentValue === "on" ? "off" : "on";
  try {
    await request("/api/settings/glossary_autolink", {
      method: "PUT",
      body: JSON.stringify({ value: newValue }),
    });
    state.settings = { ...state.settings, glossary_autolink: newValue };
    renderAutolinkStatus();
    // Re-render visible markdown bodies to apply or remove autolinks
    renderDocumentDetail();
    renderTermDetail();
    if (state.viewerContent === "glossary") renderGlossaryIndex();
  } catch (error) {
    // Silently ignore if not admin or server error
  }
}

// ── Autolink pass ──────────────────────────────────────────────────────────

function applyGlossaryAutolinks(root) {
  if (!root || !state.glossary.length) return;

  // Build needle list: longest first so multi-word terms match before substrings
  const needles = [];
  state.glossary.forEach((term) => {
    if (term.term) needles.push({ needle: term.term, term });
    (term.aliases || []).forEach((a) => {
      if (a.alias) needles.push({ needle: a.alias, term });
    });
  });
  needles.sort((a, b) => b.needle.length - a.needle.length);

  const AUTOLINK_SKIP_TAGS = new Set(["A", "CODE", "PRE", "SCRIPT", "STYLE"]);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let parent = node.parentNode;
      while (parent && parent !== root) {
        if (AUTOLINK_SKIP_TAGS.has(parent.nodeName)) return NodeFilter.FILTER_REJECT;
        parent = parent.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  let cur = walker.nextNode();
  while (cur) { textNodes.push(cur); cur = walker.nextNode(); }

  textNodes.forEach((node) => {
    const text = node.nodeValue;
    // Find the earliest match across all needles
    let bestIndex = -1;
    let bestLength = 0;
    let bestTerm = null;

    for (const { needle, term } of needles) {
      // Simple case-insensitive word-boundary search
      const ltext = text.toLowerCase();
      const lneedle = needle.toLowerCase();
      let pos = ltext.indexOf(lneedle);
      while (pos !== -1) {
        const before = pos === 0 ? true : !/\w/.test(text[pos - 1]);
        const after = (pos + needle.length >= text.length) ? true : !/\w/.test(text[pos + needle.length]);
        if (before && after) {
          if (bestIndex === -1 || pos < bestIndex || (pos === bestIndex && needle.length > bestLength)) {
            bestIndex = pos;
            bestLength = needle.length;
            bestTerm = term;
          }
          break;
        }
        pos = ltext.indexOf(lneedle, pos + 1);
      }
    }

    if (bestIndex === -1 || !bestTerm) return;

    const fragment = document.createDocumentFragment();
    if (bestIndex > 0) fragment.append(document.createTextNode(text.slice(0, bestIndex)));
    const anchor = document.createElement("a");
    anchor.className = "wiki-link";
    anchor.dataset.termId = bestTerm.id;
    anchor.href = `#term-${bestTerm.id}`;
    anchor.title = bestTerm.term;
    anchor.textContent = text.slice(bestIndex, bestIndex + bestLength);
    fragment.append(anchor);
    if (bestIndex + bestLength < text.length) {
      fragment.append(document.createTextNode(text.slice(bestIndex + bestLength)));
    }
    node.parentNode.replaceChild(fragment, node);
  });
}

function sanitizeHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("script, iframe, object, embed, link, style").forEach((node) => node.remove());
  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on") || (["href", "src"].includes(name) && value.startsWith("javascript:"))) {
        node.removeAttribute(attribute.name);
      }
    });
  });
  return template.innerHTML;
}

function normalizeDocument(item = {}) {
  return {
    ...item,
    id: item.id,
    title: item.title || "",
    slug: item.slug || "",
    summary: item.summary || "",
    content_markdown: item.content_markdown || "",
    category_id: numericId(item.category_id ?? item.category?.id),
    lesson_id: numericId(item.lesson_id ?? item.lesson?.id),
    category: item.category || null,
    lesson: item.lesson || null,
    updated_at: item.updated_at || item.created_at || null,
    tags: item.tags || [],
    tag_ids: normalizeTagIds(item),
    plugin_data: item.plugin_data || {},
  };
}

function normalizeComment(item = {}) {
  return {
    ...item,
    id: item.id,
    target_type: item.target_type || "document",
    target: item.target || item.target_payload || {},
    body: item.body || "",
    status: item.status || "open",
  };
}

function normalizeAttachment(item = {}) {
  return {
    ...item,
    id: item.id,
    file_name: item.file_name || item.filename || "",
    url: item.url || item.public_url || item.href || "",
  };
}

function normalizeRevision(item = {}) {
  return {
    ...item,
    id: item.id,
    summary: item.summary || "",
  };
}

function normalizeTerm(item = {}) {
  return {
    ...item,
    id: item.id,
    term: item.term || item.name || "",
    description_markdown: item.description_markdown || item.description || "",
    aliases: item.aliases || [],
    tags: item.tags || [],
    related_documents: item.related_documents || [],
    related_tags: item.related_tags || [],
  };
}

function normalizeTaxonomyItem(item = {}) {
  return {
    ...item,
    id: Number(item.id),
    name: item.name || "",
    slug: item.slug || "",
    position: Number(item.position || 0),
  };
}

function normalizePlugin(item = {}) {
  return {
    ...item,
    id: item.id,
    name: item.name || item.id || "",
    status: item.status || "unknown",
  };
}

function normalizeTagIds(documentItem) {
  if (Array.isArray(documentItem.tag_ids)) {
    return documentItem.tag_ids.map(Number).filter(Boolean);
  }
  return (documentItem.tags || []).map((tag) => Number(typeof tag === "object" ? tag.id : tag)).filter(Boolean);
}

function selectedCategoryId() {
  return numericId(elements.metadataCategory?.value);
}

function selectedLessonId() {
  return numericId(elements.metadataLesson?.value);
}

function selectedTagIds() {
  return [...elements.metadataTags.querySelectorAll('input[name="tag_ids"]:checked')]
    .map((input) => Number(input.value))
    .filter(Boolean);
}

function numericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function stringId(value) {
  return value ? String(value) : "";
}

function hasOption(select, value) {
  return !value || [...select.options].some((option) => option.value === value);
}

function compareByName(left, right) {
  return String(left.name || left.slug).localeCompare(String(right.name || right.slug), state.language);
}

function compareByPosition(left, right) {
  return (Number(left.position) - Number(right.position)) || compareByName(left, right);
}

function normalizeDiff(payload) {
  if (typeof payload === "string") {
    return payload;
  }
  if (Array.isArray(payload?.diff)) {
    return payload.diff.join("\n");
  }
  return payload?.diff || payload?.content || payload?.text || JSON.stringify(payload, null, 2);
}

function listItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload?.items || [];
}

function buildPluginData(existing = {}) {
  const pluginData = structuredCloneSafe(existing || {});
  enabledFrontendPlugins().forEach((plugin) => {
    if (plugin.readEditor) {
      pluginData[plugin.id] = plugin.readEditor();
    }
  });
  return pluginData;
}

function blankDocument() {
  return {
    title: "",
    slug: "",
    summary: "",
    content_markdown: "",
    category_id: null,
    lesson_id: null,
    tag_ids: [],
    plugin_data: createBlankPluginData(),
  };
}

function createBlankPluginData() {
  return Object.fromEntries(
    frontendPlugins
      .filter((plugin) => plugin.createBlankData)
      .map((plugin) => [plugin.id, plugin.createBlankData()]),
  );
}

function renderRoleAwareControls() {
  document.querySelectorAll("[data-auth-only]").forEach((node) => {
    node.hidden = !state.session;
  });
  document.querySelectorAll("[data-auth-hidden]").forEach((node) => {
    node.hidden = Boolean(state.session);
  });
  document.querySelectorAll("[data-role-min]").forEach((node) => {
    node.hidden = !hasRoleAtLeast(node.dataset.roleMin);
  });
  if (!hasRoleAtLeast("editor") && state.activeMode === "creator") {
    setAppMode("viewer");
  }
  if (!hasRoleAtLeast("admin") && state.activePanel === "plugins") {
    setAuxPanel("glossary");
  }
  const mountedPlugins = syncCreatorPluginPanels();
  if (mountedPlugins.length) {
    hydratePluginEditors(state.editorSeed || blankDocument(), mountedPlugins);
  }
  renderInsertMenu();
  renderPluginDetailPanels(elements.viewerPluginPanels, state.selectedDocument || blankDocument(), "viewer");
  renderCreatorDraft();
  updateAttachmentControls();
  renderCommentComposer();
}

function renderCommentComposer() {
  elements.commentForm.hidden = !Boolean(state.session && state.selectedDocument?.id);
}

function getInitialLanguage() {
  const stored = getStoredLanguage();
  if (stored) {
    return stored;
  }
  return window.navigator.language?.toLowerCase().startsWith("ja") ? "ja" : "en";
}

function getStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.has(stored) ? stored : null;
  } catch (error) {
    return null;
  }
}

function createDateFormatter() {
  return new Intl.DateTimeFormat(LANGUAGE_LOCALES[state.language] || LANGUAGE_LOCALES.en, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function t(key, values = {}) {
  const template = frontendPluginTranslations[state.language]?.[key]
    ?? translations[state.language]?.[key]
    ?? frontendPluginTranslations.en[key]
    ?? translations.en[key]
    ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = t("app_title");
  elements.languageSelect.value = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES.has(language) || language === state.language) {
    return;
  }
  state.language = language;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // Some browsers can block storage; the selected language still applies for this session.
  }
  dateFormatter = createDateFormatter();
  applyTranslations();
  rerenderLocalizedContent();
}

function rerenderLocalizedContent() {
  renderSession();
  renderDocumentList();
  renderDocumentDetail();
  renderComments();
  renderRevisionList({ preserveSelection: true });
  renderGlossaryList();
  renderGlossaryDetail();
  renderTaxonomyControls();
  renderDocumentFilterControls();
  renderPlugins();
  updateEditorHeading();
  renderCreatorDraft();
  renderCreatorMetadataSummary();
  updateCommentTargetControls();
  renderInsertBlocks();
}

function roleLabel(role) {
  return translations[state.language]?.[`role_${role}`] ? t(`role_${role}`) : role;
}

function difficultyLabel(difficulty) {
  return frontendPluginTranslations[state.language]?.[difficulty] || translations[state.language]?.[difficulty]
    ? t(difficulty)
    : difficulty;
}

function commentStatusLabel(status = "open") {
  return translations[state.language]?.[`comment_status_${status}`]
    ? t(`comment_status_${status}`)
    : capitalize(status);
}

function targetTypeLabel(type = "document") {
  return translations[state.language]?.[type] ? t(type) : capitalize(String(type).replaceAll("_", " "));
}

function pluginStatusLabel(status = "unknown") {
  return translations[state.language]?.[`plugin_status_${status}`]
    ? t(`plugin_status_${status}`)
    : status;
}

function pluginActionProgressLabel(action, name) {
  return translations[state.language]?.[`plugin_progress_${action}`]
    ? t(`plugin_progress_${action}`, { name })
    : `${capitalize(action)} ${name}...`;
}

function hasRoleAtLeast(role) {
  const hierarchy = { viewer: 1, editor: 2, admin: 3 };
  const minimum = hierarchy[role] || Number.POSITIVE_INFINITY;
  const actual = Math.max(...(state.session?.roles || []).map((candidate) => hierarchy[candidate] || 0), 0);
  return actual >= minimum;
}

function isPluginEnabled(pluginId) {
  return Boolean(state.session?.enabled_plugins?.includes(pluginId));
}

function canEditComment(comment) {
  return Boolean(
    state.session
    && (hasRoleAtLeast("admin") || String(comment.created_by) === String(state.session.id)),
  );
}

function compareComments(left, right) {
  const statusOrder = { open: 0, orphaned: 1, resolved: 2 };
  const statusDifference = (statusOrder[left.status] ?? 3) - (statusOrder[right.status] ?? 3);
  if (statusDifference) {
    return statusDifference;
  }
  return String(right.created_at || "").localeCompare(String(left.created_at || ""));
}

function commentAuthorLabel(comment) {
  return comment.created_by_name
    || comment.author?.display_name
    || (comment.created_by ? t("user_with_id", { id: comment.created_by }) : t("unknown_author"));
}

function commentTargetLabel(comment) {
  const target = comment.target || {};
  switch (comment.target_type) {
    case "text_selection":
      return target.selected_text ? summarizeTextTarget(target.selected_text) : t("text_selection");
    case "image":
      return target.attachment_id ? t("image_attachment_label", { id: target.attachment_id }) : t("image");
    case "mermaid_block":
      return target.block_id ? `${t("mermaid_block")} ${target.block_id}` : t("mermaid_block");
    default:
      return targetTypeLabel(comment.target_type || "document");
  }
}

function summarizeTextTarget(value) {
  const compact = String(value).replace(/\s+/g, " ").trim();
  return compact.length > 72 ? `"${compact.slice(0, 69)}..."` : `"${compact}"`;
}

function textNodeSpan(text, className = "") {
  const node = document.createElement("span");
  node.textContent = text;
  if (className) {
    node.className = className;
  }
  return node;
}

function attachmentUrl(attachment) {
  return attachment.url || (attachment.id ? `/api/attachments/${encodeURIComponent(attachment.id)}` : "");
}

function parseAttachmentId(value = "") {
  const match = String(value).match(/\/api\/attachments\/([^/?#]+)/);
  if (!match) {
    return null;
  }
  const attachmentId = Number(decodeURIComponent(match[1]));
  return Number.isInteger(attachmentId) ? attachmentId : null;
}

function imageAltText(fileName = "") {
  const trimmed = String(fileName).replace(/\.[^.]+$/, "").trim();
  return trimmed || t("attached_image");
}

function mermaidBlockId(content, index) {
  let hash = 0;
  for (const character of String(content || "")) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return `mermaid-${index + 1}-${Math.abs(hash).toString(36)}`;
}

function clampRatio(value) {
  if (!Number.isFinite(value)) {
    return 0.5;
  }
  return Math.min(1, Math.max(0, Number(value.toFixed(4))));
}

function chip(text) {
  const node = document.createElement("span");
  node.className = "chip";
  node.textContent = text;
  return node;
}

function setStatus(node, message, error = false) {
  node.textContent = message;
  node.classList.toggle("is-error", error);
}

function readableError(error) {
  if (error?.status === 401) {
    return t("sign_in_required");
  }
  if (error?.status === 403) {
    return t("no_permission");
  }
  return error?.message || t("something_went_wrong");
}

function summarizeChecks(checks) {
  if (!Array.isArray(checks)) {
    return "";
  }
  return checks.map((check) => check.message || check.result || check.name).filter(Boolean).join("; ");
}

function displayName(value) {
  if (!value) {
    return "";
  }
  if (typeof value !== "object") {
    return String(value);
  }
  const localized = localizedTaxonomyNames[state.language]?.[value.slug];
  return localized || value.name || value.title || value.slug || "";
}

function formatDate(value) {
  if (!value) {
    return t("no_date");
  }
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? String(value) : dateFormatter.format(date);
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function debounce(callback, delay) {
  let timeout;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), delay);
  };
}

function structuredCloneSafe(value) {
  return window.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value ?? "");
}
