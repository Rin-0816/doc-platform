// routing.js — Hash routing, app mode, creator view, mobile view, aux panel.

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
  // pushState/replaceState do NOT fire a hashchange event, so there is nothing
  // to suppress here — the only hashchange events come from genuine browser
  // back/forward navigation, which onHashChange must always handle.
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
    showGlossaryIndex({ skipHashUpdate: true });
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
  // Fires only on real back/forward navigation between hash entries.
  applyHashRoute(parseHashRoute());
}

function setAppMode(mode, { skipGuard = false } = {}) {
  if (mode === "creator" && !hasRoleAtLeast("editor")) {
    mode = "viewer";
  }
  // Guard unsaved changes when leaving creator mode
  if (!skipGuard && mode !== "creator" && state.activeMode === "creator" && state.editorDirty) {
    guardUnsavedChanges(() => setAppMode(mode, { skipGuard: true }));
    return;
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
  if (view === "history") {
    enterHistoryView();
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
