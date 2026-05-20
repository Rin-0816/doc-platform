// boot.js — Bootstrap. Loaded LAST. All globals and feature functions are defined before this runs.

dateFormatter = createDateFormatter();

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
