// events.js — handleClick, handleGlobalKeydown, bindEvents, outside-click closers.

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
    // Distinguish settings-context plugins from aux-panel plugins
    if (button.dataset.pluginContext === "settings") {
      await mutateSettingsPlugin(button.dataset.pluginId, button.dataset.pluginAction);
    } else {
      await mutatePlugin(button.dataset.pluginId, button.dataset.pluginAction);
    }
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
    case "guard-save":
      await guardSave();
      break;
    case "guard-discard":
      guardDiscard();
      break;
    case "guard-cancel":
      closeGuardDialog();
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
    case "open-settings":
      closeAvatarMenu();
      openSettingsDialog();
      break;
    case "close-settings":
      closeSettingsDialog();
      break;
    case "settings-toggle-theme":
      toggleTheme();
      renderSettingsTheme();
      break;
    case "settings-toggle-autolink":
      await settingsToggleAutolink();
      break;
    case "settings-refresh-plugins":
      await loadSettingsPlugins();
      break;
    case "create-backup":
      await createBackup();
      break;
    case "load-backups":
      await loadSettingsBackups();
      break;
    case "restore-backup": {
      const backupName = button.dataset.backupName;
      if (backupName) await restoreBackup(backupName);
      break;
    }
    case "delete-backup": {
      const backupName = button.dataset.backupName;
      if (backupName) await deleteBackup(backupName);
      break;
    }
    case "find-orphans":
      await findOrphanAttachments();
      break;
    case "purge-orphans":
      await purgeOrphanAttachments();
      break;
    case "delete-document":
      await deleteDocument();
      break;
    default:
      break;
  }
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
  // F8: editor/preview scroll sync — bind once here (no-op if elements missing)
  bindEditorScrollSync();
  document.addEventListener("click", closeInsertMenuOnOutsideClick);
  document.addEventListener("click", closeAvatarMenuOnOutsideClick);
  document.addEventListener("click", closeRailFilterOnOutsideClick);
  document.addEventListener("keydown", handleGlobalKeydown);
  window.addEventListener("beforeunload", (event) => {
    if (state.editorDirty) {
      event.preventDefault();
      // returnValue is required for older browsers
      event.returnValue = "";
    }
  });
}
