// glossary.js — Glossary list, term editor, CRUD, slug preview, delete, revisions/diff/restore, bulk import, settings/autolink.

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

async function selectTerm(id, { focusViewer = true, skipHashUpdate = false, skipGuard = false } = {}) {
  if (!skipGuard && state.editorDirty) {
    guardUnsavedChanges(() => selectTerm(id, { focusViewer, skipHashUpdate, skipGuard: true }));
    return;
  }
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
    elements.termDiffOutput.replaceChildren();
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
      const leftLabel = `v${payload?.left_version ?? "?"}`;
      const rightLabel = `v${payload?.right_version ?? "?"}`;
      renderSideBySideDiff(elements.termDiffOutput, payload?.rows, leftLabel, rightLabel);
    }
    setStatus(elements.termDiffStatus, "");
  } catch (error) {
    if (elements.termDiffOutput) elements.termDiffOutput.replaceChildren();
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
