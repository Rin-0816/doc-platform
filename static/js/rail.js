// rail.js — Document list/tree, filters, taxonomy controls.

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
