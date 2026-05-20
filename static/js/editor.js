// editor.js — Editor hydration, ribbon, format actions, preview, save, dirty guard, metadata, attachments.

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
  updateDeleteDocumentButton();
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

// F8 — Editor/preview scroll sync (split mode only) ----------------------

function bindEditorScrollSync() {
  const textarea = elements.editorForm?.elements?.content_markdown;
  const preview = elements.editorLivePreview;
  if (!textarea || !preview) return;

  // Attach once; guard flag prevents feedback loops
  if (textarea.dataset.scrollSyncBound) return;
  textarea.dataset.scrollSyncBound = "1";

  let syncing = false;

  textarea.addEventListener("scroll", function () {
    if (state.previewMode !== "split") return;
    if (syncing) return;
    const scrollable = preview.scrollHeight - preview.clientHeight;
    if (scrollable <= 0) return;
    const ratio = textarea.scrollTop / Math.max(1, textarea.scrollHeight - textarea.clientHeight);
    syncing = true;
    preview.scrollTop = ratio * scrollable;
    syncing = false;
  });

  preview.addEventListener("scroll", function () {
    if (state.previewMode !== "split") return;
    if (syncing) return;
    const scrollable = textarea.scrollHeight - textarea.clientHeight;
    if (scrollable <= 0) return;
    const ratio = preview.scrollTop / Math.max(1, preview.scrollHeight - preview.clientHeight);
    syncing = true;
    textarea.scrollTop = ratio * scrollable;
    syncing = false;
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
    // Re-hydrate so the editor form and preview exactly match the saved values
    hydrateEditor(state.selectedDocument);
    renderEditorLivePreview();
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
    await refreshAttachmentManager();
  } catch (error) {
    setStatus(elements.attachmentStatus, readableError(error), true);
  }
}

function updateAttachmentControls() {
  elements.attachmentUploadButton.disabled = !hasRoleAtLeast("editor") || !Boolean(state.selectedDocument?.id || state.editorSeed?.id);
  refreshAttachmentManager();
}

function currentDocumentId() {
  return state.selectedDocument?.id || state.editorSeed?.id || null;
}

function formatAttachmentSize(bytes) {
  return Number.isFinite(bytes) && bytes > 0 ? Math.ceil(bytes / 1024) + " KB" : "";
}

async function refreshAttachmentManager() {
  const group = elements.attachmentManagerGroup;
  if (!group) {
    return;
  }
  // Editor+ only management view; hide entirely for viewers.
  if (!hasRoleAtLeast("editor")) {
    group.hidden = true;
    return;
  }
  group.hidden = false;
  const documentId = currentDocumentId();
  if (!documentId) {
    // Brand-new unsaved document: no id yet, show a hint.
    renderAttachmentList([], false);
    return;
  }
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(documentId)}/attachments`);
    const items = (payload?.items || []).map((item) => normalizeAttachment(item));
    renderAttachmentList(items, true);
  } catch (error) {
    renderAttachmentList([], true);
    setStatus(elements.attachmentStatus, readableError(error), true);
  }
}

function renderAttachmentList(items, hasDocument) {
  const list = elements.attachmentList;
  const empty = elements.attachmentListEmpty;
  if (!list || !empty) {
    return;
  }
  list.replaceChildren();
  if (!items.length) {
    empty.hidden = false;
    empty.textContent = hasDocument ? t("attachments_none") : t("attachments_empty_hint");
    return;
  }
  empty.hidden = true;
  items.forEach((attachment) => {
    list.append(buildAttachmentRow(attachment));
  });
}

function buildAttachmentRow(attachment) {
  const url = attachmentUrl(attachment);
  const fileName = attachment.file_name || String(attachment.id);

  const row = document.createElement("li");
  row.className = "attachment-item";

  const thumb = document.createElement("img");
  thumb.className = "attachment-thumb";
  thumb.src = url;
  thumb.alt = fileName; // attribute assignment is XSS-safe (no markup parsing)
  thumb.loading = "lazy";
  row.append(thumb);

  const meta = document.createElement("div");
  meta.className = "attachment-meta";

  const name = document.createElement("span");
  name.className = "attachment-name";
  name.textContent = fileName; // textContent — never innerHTML for file names
  meta.append(name);

  const size = formatAttachmentSize(attachment.size_bytes);
  if (size) {
    const sizeEl = document.createElement("span");
    sizeEl.className = "list-meta attachment-size";
    sizeEl.textContent = size;
    meta.append(sizeEl);
  }
  row.append(meta);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "attachment-delete";
  deleteBtn.textContent = t("delete_attachment");
  deleteBtn.setAttribute("aria-label", t("delete_attachment_aria", { name: fileName }));
  deleteBtn.addEventListener("click", () => {
    deleteAttachment(attachment);
  });
  row.append(deleteBtn);

  return row;
}

async function deleteAttachment(attachment) {
  if (!hasRoleAtLeast("editor")) {
    setStatus(elements.attachmentStatus, t("no_permission"), true);
    return;
  }
  const url = attachmentUrl(attachment);
  // Warn if the image is still referenced in the current editor content.
  const content = elements.editorForm.elements.content_markdown.value || "";
  const stillReferenced = Boolean(url) && content.includes(url);
  const confirmMessage = stillReferenced
    ? t("delete_attachment_in_use_confirm")
    : t("delete_attachment_confirm");
  if (!window.confirm(confirmMessage)) {
    return;
  }
  try {
    await request(`/api/attachments/${encodeURIComponent(attachment.id)}`, { method: "DELETE" });
    setStatus(elements.attachmentStatus, t("attachment_deleted"));
    await refreshAttachmentManager();
  } catch (error) {
    setStatus(elements.attachmentStatus, readableError(error), true);
  }
}

function updateDeleteDocumentButton() {
  const isEditor = hasRoleAtLeast("editor");
  const hasSavedDoc = Boolean(state.selectedDocument?.id);
  const btn = document.querySelector("#creator-delete-btn");
  if (btn) {
    // Show only when editing an existing saved document as editor+
    btn.hidden = !isEditor || !hasSavedDoc;
  }
  // Per-document backup: export needs an existing doc; import is editor+ always.
  const exportBtn = document.querySelector("#creator-export-btn");
  if (exportBtn) exportBtn.hidden = !isEditor || !hasSavedDoc;
  const importBtn = document.querySelector("#creator-import-btn");
  if (importBtn) importBtn.hidden = !isEditor;
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

function markEditorDirty() {
  state.editorDirty = true;
  renderSaveState();
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

// Unsaved-changes guard ---------------------------------------------------

/**
 * If the editor has unsaved changes, shows the guard dialog and wires
 * Save / Discard / Cancel. If clean, calls proceed() immediately.
 */
function guardUnsavedChanges(proceed) {
  if (!state.editorDirty) {
    proceed();
    return;
  }
  _guardProceed = proceed;
  const dlg = document.querySelector("#unsaved-guard-dialog");
  if (dlg && typeof dlg.showModal === "function") {
    dlg.showModal();
  } else {
    // Fallback — discard and proceed if dialog unavailable
    state.editorDirty = false;
    proceed();
  }
}

function closeGuardDialog() {
  const dlg = document.querySelector("#unsaved-guard-dialog");
  if (dlg?.open) dlg.close();
  _guardProceed = null;
}

// These are called from the guard dialog's buttons (wired in handleClick):
async function guardSave() {
  const proceed = _guardProceed;
  closeGuardDialog();
  if (!proceed) return;
  // Simulate form submission by calling saveDocument with a synthetic event
  const form = elements.editorForm;
  if (form) {
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    // Temporarily hijack: save inline so we can await it
    await (async () => {
      if (!hasRoleAtLeast("editor")) return;
      const formData = new FormData(form);
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
      if (!body.title || !body.slug) return;
      const editing = Boolean(state.selectedDocument?.id);
      const path = editing
        ? `/api/documents/${encodeURIComponent(state.selectedDocument.id)}`
        : "/api/documents";
      state.editorSaving = true;
      renderSaveState();
      try {
        const payload = await request(path, { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
        const saved = normalizeDocument(payload?.document || payload);
        state.selectedDocument = saved.id ? saved : { ...seed, ...body };
        state.editorSeed = structuredCloneSafe(state.selectedDocument);
        state.editorSaving = false;
        state.editorDirty = false;
        state.lastSavedAt = state.selectedDocument.updated_at || new Date().toISOString();
        renderSaveState();
        hydrateEditor(state.selectedDocument);
        renderEditorLivePreview();
        updateAttachmentControls();
        renderCreatorMetadataSummary(state.selectedDocument);
        renderDocumentDetail();
      } catch (err) {
        state.editorSaving = false;
        renderSaveState();
        setStatus(elements.editorStatus, readableError(err), true);
        return; // don't proceed on error
      }
    })();
    if (!state.editorDirty) proceed();
  }
}

function guardDiscard() {
  const proceed = _guardProceed;
  closeGuardDialog();
  state.editorDirty = false;
  renderSaveState();
  if (proceed) proceed();
}

function startNewDocument({ skipGuard = false } = {}) {
  if (!hasRoleAtLeast("editor")) {
    return;
  }
  if (!skipGuard && state.editorDirty) {
    guardUnsavedChanges(() => startNewDocument({ skipGuard: true }));
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
    elements.diffOutput.replaceChildren();
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
    const leftLabel = `v${payload?.against?.version_number ?? "?"}`;
    const rightLabel = `v${payload?.target?.version_number ?? "?"}`;
    renderSideBySideDiff(elements.diffOutput, payload?.rows, leftLabel, rightLabel);
    setStatus(elements.diffStatus, "");
  } catch (error) {
    elements.diffOutput.replaceChildren();
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
