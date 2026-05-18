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
    reset: "Reset",
    save: "Save",
    title: "Title",
    slug: "Slug",
    summary: "Summary",
    image_attachment: "Image attachment",
    image_file: "Image file",
    upload_and_insert: "Upload and insert",
    markdown: "Markdown",
    markdown_editor: "Markdown editor",
    markdown_preview: "Markdown preview",
    preview: "Preview",
    review: "Review",
    document_preview: "Document preview",
    document_information: "Document information",
    insert_block: "Insert block",
    heading: "Heading",
    table: "Table",
    code_block: "Code block",
    quote: "Quote",
    done: "Done",
    close: "Close",
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
    no_documents_found: "No documents found.",
    total_count: "{count} total",
    untitled_document: "Untitled document",
    no_summary: "No summary",
    loading_document: "Loading document...",
    updated_at: "Updated {date}",
    save_before_upload: "Save the document before uploading images.",
    no_permission: "You do not have permission for this panel.",
    title_slug_required: "Title and slug are required.",
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
    loading_glossary: "Loading glossary...",
    no_glossary_terms_found: "No glossary terms found.",
    untitled_term: "Untitled term",
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
  },
  ja: {
    app_title: "ドキュメントプラットフォーム",
    docs_short: "文書",
    show_documents: "ドキュメントを表示",
    search_documents: "ドキュメントを検索",
    workspace_modes: "ワークスペースモード",
    viewer: "ビューアー",
    creator: "作成ツール",
    creator_views: "作成ツール表示",
    read: "閲覧",
    edit: "編集",
    history: "履歴",
    username: "ユーザー名",
    password: "パスワード",
    sign_in: "サインイン",
    language: "言語",
    sign_out: "サインアウト",
    new: "新規",
    panels: "パネル",
    documents: "ドキュメント",
    document_detail: "ドキュメント詳細",
    select_document: "ドキュメントを選択",
    choose_document_hint: "一覧からドキュメントを選ぶか、新規作成してください。",
    comments: "コメント",
    refresh: "更新",
    target: "対象",
    document: "ドキュメント",
    text_selection: "テキスト選択",
    image: "画像",
    mermaid_block: "Mermaid ブロック",
    use_selection: "選択範囲を使う",
    comment: "コメント",
    add_comment: "コメントを追加",
    document_editor: "ドキュメントエディター",
    edit_document: "ドキュメントを編集",
    new_document: "新規ドキュメント",
    reset: "リセット",
    save: "保存",
    title: "タイトル",
    slug: "スラッグ",
    summary: "概要",
    image_attachment: "画像添付",
    image_file: "画像ファイル",
    upload_and_insert: "アップロードして挿入",
    markdown: "Markdown",
    markdown_editor: "Markdown エディター",
    markdown_preview: "Markdown プレビュー",
    preview: "プレビュー",
    review: "確認",
    document_preview: "ドキュメント確認",
    document_information: "ドキュメント情報",
    insert_block: "ブロックを挿入",
    heading: "見出し",
    table: "表",
    code_block: "コードブロック",
    quote: "引用",
    done: "完了",
    close: "閉じる",
    draft: "下書き",
    revision_history: "改訂履歴",
    history_and_diff: "履歴と差分",
    revision_diff: "改訂差分",
    revision: "改訂",
    against: "比較対象",
    compare: "比較",
    restore: "復元",
    reference_panels: "参照パネル",
    auxiliary_panels: "補助パネル",
    glossary: "用語集",
    plugins: "プラグイン",
    search_glossary: "用語集を検索",
    filter_terms: "用語を絞り込む",
    plugin_administration: "プラグイン管理",
    mobile_panels: "モバイルパネル",
    work: "作業",
    select_document_text_first: "先にドキュメント本文を選択してください。",
    request_failed: "リクエストに失敗しました ({status})",
    loading_documents: "ドキュメントを読み込み中...",
    no_documents_found: "ドキュメントが見つかりません。",
    total_count: "合計 {count} 件",
    untitled_document: "無題のドキュメント",
    no_summary: "概要なし",
    loading_document: "ドキュメントを読み込み中...",
    updated_at: "更新 {date}",
    save_before_upload: "画像をアップロードする前にドキュメントを保存してください。",
    no_permission: "このパネルを操作する権限がありません。",
    title_slug_required: "タイトルとスラッグは必須です。",
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
    no_mermaid_blocks: "Mermaid ブロックがありません。",
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
    loading_glossary: "用語集を読み込み中...",
    no_glossary_terms_found: "用語が見つかりません。",
    untitled_term: "無題の用語",
    loading_plugins: "プラグインを読み込み中...",
    no_plugins_installed: "インストール済みプラグインはありません。",
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
  },
};

const CORE_INSERT_BLOCKS = [
  {
    id: "heading",
    labelKey: "heading",
    icon: "heading-2",
    markdown: "## Heading",
  },
  {
    id: "table",
    labelKey: "table",
    icon: "table",
    markdown: "| Column 1 | Column 2 |\n| --- | --- |\n|  |  |",
  },
  {
    id: "image",
    labelKey: "image",
    icon: "image",
    markdown: "![Alt text](image-url)",
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
    markdown: "> Quote",
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
  selectedTerm: null,
  plugins: [],
  activeMode: "viewer",
  activeCreatorView: "edit",
  activePanel: "glossary",
  language: getInitialLanguage(),
};

const elements = {
  shell: document.querySelector(".app-shell"),
  searchForm: document.querySelector('[data-form="document-search"]'),
  searchInput: document.querySelector("#document-search"),
  documentCount: document.querySelector("#document-count"),
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
  creatorPreviewContext: document.querySelector("#creator-preview-context"),
  creatorPreviewTitle: document.querySelector("#creator-preview-title"),
  creatorPreviewMeta: document.querySelector("#creator-preview-meta"),
  creatorPreviewSummary: document.querySelector("#creator-preview-summary"),
  creatorPreviewPluginPanels: document.querySelector("#creator-preview-plugin-panels"),
  creatorPreviewMarkdown: document.querySelector("#creator-preview-markdown"),
  creatorDocumentLabel: document.querySelector("#creator-document-label"),
  creatorSaveState: document.querySelector("#creator-save-state"),
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
  sessionLabel: document.querySelector("#session-label"),
  languageSelect: document.querySelector("#language-select"),
  metadataDialog: document.querySelector("#metadata-dialog"),
  insertMenu: document.querySelector("#insert-menu"),
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
  bindEvents();
  elements.shell.dataset.mobileView = "documents";
  setAppMode(state.activeMode);
  setCreatorView(state.activeCreatorView);
  renderRoleAwareControls();
  await loadSession();
  if (state.session) {
    await Promise.allSettled([loadDocuments(), loadGlossary()]);
  } else {
    renderDocumentList();
    renderGlossaryList();
  }
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
  elements.editorForm.addEventListener("submit", saveDocument);
  elements.editorForm.addEventListener("input", () => {
    renderCreatorDraft();
    renderCreatorMetadataSummary();
  });
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
  elements.languageSelect.addEventListener("change", (event) => setLanguage(event.target.value));
  document.addEventListener("click", closeInsertMenuOnOutsideClick);
}

async function handleClick(event) {
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
    await selectDocument(button.dataset.documentId);
    setMobileView("workspace");
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

  if (button.dataset.pluginAction) {
    await mutatePlugin(button.dataset.pluginId, button.dataset.pluginAction);
    return;
  }

  if (button.dataset.commentAction) {
    await mutateComment(button.dataset.commentId, button.dataset.commentAction);
    return;
  }

  switch (button.dataset.action) {
    case "show-documents":
      setMobileView("documents");
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
      toggleInsertMenu();
      break;
    case "toggle-aux":
      elements.shell.dataset.auxOpen = elements.shell.dataset.auxOpen !== "true";
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
    case "refresh-plugins":
      await loadPlugins();
      break;
    case "logout":
      await logout();
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
    renderSession();
    await Promise.allSettled([loadDocuments(elements.searchInput.value.trim()), loadGlossary()]);
  } catch (error) {
    state.session = null;
    renderSession(readableError(error));
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
  renderSession();
  renderDocumentList();
  renderRevisionList();
  renderGlossaryList();
  renderDocumentDetail();
  renderComments();
}

function renderSession(errorMessage = "") {
  const signedIn = Boolean(state.session);
  elements.shell.dataset.signedIn = String(signedIn);
  elements.loginForm.hidden = signedIn;
  elements.sessionLabel.textContent = signedIn
    ? `${state.session.display_name || state.session.username} (${(state.session.roles || []).map(roleLabel).join(", ")})`
    : errorMessage;
  renderRoleAwareControls();
}

async function loadDocuments(query = "") {
  setStatus(elements.documentListStatus, t("loading_documents"));
  const path = query
    ? `/api/search?${new URLSearchParams({ q: query, type: "document", page_size: "20" })}`
    : "/api/documents?page_size=20";

  try {
    const payload = await request(path);
    state.documents = listItems(payload).map(normalizeDocument);
    state.documentTotal = payload?.total ?? state.documents.length;
    renderDocumentList();
    setStatus(elements.documentListStatus, state.documents.length ? "" : t("no_documents_found"));

    if (!state.selectedDocument && state.documents[0]) {
      await selectDocument(state.documents[0].id);
    }
  } catch (error) {
    state.documents = [];
    state.documentTotal = 0;
    renderDocumentList();
    setStatus(elements.documentListStatus, readableError(error), true);
  }
}

function renderDocumentList() {
  elements.documentCount.textContent = state.documentTotal
    ? t("total_count", { count: state.documentTotal })
    : "";
  elements.documentList.replaceChildren(
    ...state.documents.map((documentItem) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.documentId = documentItem.id;
      button.classList.toggle("is-active", documentItem.id === state.selectedDocument?.id);
      button.innerHTML = `
        <span class="list-title">${escapeHtml(documentItem.title || t("untitled_document"))}</span>
        <span class="list-summary">${escapeHtml(documentItem.summary || t("no_summary"))}</span>
        <span class="list-meta">${escapeHtml(formatDate(documentItem.updated_at))}</span>
      `;
      item.append(button);
      return item;
    }),
  );
}

async function selectDocument(id) {
  setStatus(elements.documentListStatus, t("loading_document"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(id)}`);
    state.selectedDocument = normalizeDocument(payload);
    state.editorSeed = structuredCloneSafe(state.selectedDocument);
    state.comments = [];
    state.commentDraftTarget = null;
    renderDocumentDetail();
    renderComments();
    hydrateEditor(state.selectedDocument);
    renderDocumentList();
    setStatus(elements.documentListStatus, "");
    await Promise.allSettled([loadRevisions(id), loadComments(id)]);
  } catch (error) {
    setStatus(elements.documentListStatus, readableError(error), true);
  }
}

function renderDocumentDetail() {
  const documentItem = state.selectedDocument;
  elements.documentEmpty.hidden = Boolean(documentItem);
  elements.documentDetail.hidden = !documentItem;
  if (!documentItem) {
    elements.viewerPluginPanels.replaceChildren();
    state.commentTargetOptions.images = [];
    state.commentTargetOptions.mermaidBlocks = [];
    replaceTargetOptions(elements.commentImageTarget, []);
    replaceTargetOptions(elements.commentMermaidTarget, []);
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
  renderPluginDetailPanels(elements.viewerPluginPanels, documentItem, "viewer");
  renderMarkdown(elements.documentMarkdown, documentItem.content_markdown);
  refreshCommentTargetOptions();
  updateCommentTargetControls();
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
  renderDocumentDetail();
  renderDocumentList();
  renderRevisionList();
  hydrateEditor(state.editorSeed);
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
  syncCreatorPluginPanels();
  hydratePluginEditors(documentItem);
  renderCreatorDraft();
  renderCreatorMetadataSummary();
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
  elements.creatorDocumentLabel.textContent = [
    documentItem.title || t("untitled_document"),
    documentItem.summary || t("no_summary"),
  ].join(" / ");
  elements.creatorSaveState.textContent = documentItem.id
    ? t("updated_at", { date: formatDate(documentItem.updated_at) })
    : t("draft");
}

function documentFromEditorDraft() {
  const seed = state.editorSeed || blankDocument();
  const form = elements.editorForm.elements;
  return normalizeDocument({
    ...seed,
    title: form.title.value,
    slug: form.slug.value,
    summary: form.summary.value,
    content_markdown: form.content_markdown.value,
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
  elements.insertMenu.hidden = !elements.insertMenu.hidden;
}

function renderInsertMenu() {
  elements.insertMenu.replaceChildren(
    ...getAvailableInsertBlocks().map((block) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.insertKind = block.id;

      const icon = document.createElement("i");
      icon.dataset.lucide = block.icon;
      icon.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.dataset.i18n = block.labelKey;
      label.textContent = t(block.labelKey);

      button.append(icon, label);
      return button;
    }),
  );
  refreshIcons();
}

function getAvailableInsertBlocks() {
  return [
    ...CORE_INSERT_BLOCKS,
    ...enabledFrontendPlugins().flatMap((plugin) => plugin.insertBlocks || []),
  ];
}

function closeInsertMenuOnOutsideClick(event) {
  if (elements.insertMenu.hidden) {
    return;
  }
  if (event.target.closest("#insert-menu") || event.target.closest('[data-action="toggle-insert-menu"]')) {
    return;
  }
  elements.insertMenu.hidden = true;
}

function insertMarkdownBlock(kind) {
  const block = getAvailableInsertBlocks().find((item) => item.id === kind);
  const markdown = typeof block?.markdown === "function" ? block.markdown() : block?.markdown;
  if (!markdown) {
    return;
  }
  insertAtCursor(elements.editorForm.elements.content_markdown, markdown);
  elements.insertMenu.hidden = true;
  renderCreatorDraft();
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
    category_id: seed.category_id ?? seed.category?.id ?? null,
    lesson_id: seed.lesson_id ?? seed.lesson?.id ?? null,
    tag_ids: normalizeTagIds(seed),
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

  setStatus(elements.editorStatus, t("saving"));
  try {
    const payload = await request(path, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(body),
    });
    const saved = normalizeDocument(payload?.document || payload);
    state.selectedDocument = saved.id ? saved : { ...seed, ...body };
    state.editorSeed = structuredCloneSafe(state.selectedDocument);
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

  elements.glossaryList.replaceChildren(
    ...terms.map((term) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.termId = term.id;
      button.classList.toggle("is-active", term.id === state.selectedTerm?.id);
      button.textContent = term.term || t("untitled_term");
      item.append(button);
      return item;
    }),
  );
}

async function selectTerm(id) {
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

  renderGlossaryList();
  renderGlossaryDetail();
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
  if (window.mermaid) {
    mermaid.run({ nodes: target.querySelectorAll(".mermaid") }).catch(() => {});
  }
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
    updated_at: item.updated_at || item.created_at || null,
    tags: item.tags || [],
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
    return documentItem.tag_ids;
  }
  return (documentItem.tags || []).map((tag) => typeof tag === "object" ? tag.id : tag).filter(Boolean);
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
  renderPlugins();
  updateEditorHeading();
  renderCreatorDraft();
  renderCreatorMetadataSummary();
  updateCommentTargetControls();
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
  return typeof value === "object" ? value.name || value.title || value.slug || "" : String(value);
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
