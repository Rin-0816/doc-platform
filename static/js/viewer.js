// viewer.js — Document detail rendering, TOC, related terms, term detail, glossary index.

async function selectDocument(id, { skipHashUpdate = false, skipGuard = false } = {}) {
  if (!skipGuard && state.editorDirty) {
    guardUnsavedChanges(() => selectDocument(id, { skipHashUpdate, skipGuard: true }));
    return;
  }
  setStatus(elements.documentListStatus, t("loading_document"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(id)}`);
    state.selectedDocument = normalizeDocument(payload);
    state.editorSeed = structuredCloneSafe(state.selectedDocument);
    state.comments = [];
    state.commentDraftTarget = null;
    state.editingCommentId = null;
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
  renderCommentAnchors();
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
