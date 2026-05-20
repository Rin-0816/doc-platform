// settings.js — Settings modal: appearance, glossary, plugins, backups, attachments orphans.
// Also: document delete (deleteDocument) used from the creator command bar.

// ── Open / close ─────────────────────────────────────────────────────────────

function openSettingsDialog() {
  const dlg = document.querySelector("#settings-dialog");
  if (!dlg) return;
  renderSettingsDialog();
  dlg.showModal();
}

function closeSettingsDialog() {
  const dlg = document.querySelector("#settings-dialog");
  if (dlg?.open) dlg.close();
}

// ── Render all sections ───────────────────────────────────────────────────────

function renderSettingsDialog() {
  renderSettingsTheme();
  renderSettingsAutolink();
  renderSettingsPlugins();
  // Reset backups and orphans sections on open
  const backupStatus = document.querySelector("#settings-backup-status");
  const backupList = document.querySelector("#settings-backup-list");
  if (backupStatus) backupStatus.textContent = "";
  if (backupList) backupList.replaceChildren();
  const orphanStatus = document.querySelector("#settings-orphan-status");
  const orphanList = document.querySelector("#settings-orphan-list");
  if (orphanStatus) orphanStatus.textContent = "";
  if (orphanList) orphanList.replaceChildren();
  // Taxonomy management — render from the already-loaded state.
  const taxonomyStatus = document.querySelector("#settings-taxonomy-status");
  if (taxonomyStatus) taxonomyStatus.textContent = "";
  renderSettingsTaxonomy();
}

// ── Section 1: Appearance / Theme ────────────────────────────────────────────

function renderSettingsTheme() {
  const btn = document.querySelector("#settings-theme-toggle");
  if (!btn) return;
  btn.textContent = state.theme === "dark" ? t("theme_switch_light") : t("theme_switch_dark");
}

// ── Section 2: Glossary autolink ─────────────────────────────────────────────

function renderSettingsAutolink() {
  const toggle = document.querySelector("#settings-autolink-toggle");
  if (!toggle) return;
  const isOn = state.settings?.glossary_autolink === "on";
  toggle.textContent = isOn ? t("settings_autolink_on") : t("settings_autolink_off");
  toggle.dataset.autolinkState = isOn ? "on" : "off";
}

async function settingsToggleAutolink() {
  if (!hasRoleAtLeast("admin")) return;
  await toggleGlossaryAutolink();
  renderSettingsAutolink();
  // Also sync the avatar-menu status indicator
  renderAutolinkStatus();
}

// ── Section 3: Plugins (mirror of aux-panel list) ────────────────────────────

async function loadSettingsPlugins() {
  const statusEl = document.querySelector("#settings-plugin-status");
  const listEl = document.querySelector("#settings-plugin-list");
  if (!statusEl || !listEl) return;
  if (!hasRoleAtLeast("admin")) return;

  setStatus(statusEl, t("loading_plugins"));
  try {
    const payload = await request("/api/plugins");
    state.plugins = listItems(payload).map(normalizePlugin);
    renderSettingsPlugins();
    setStatus(statusEl, state.plugins.length ? "" : t("no_plugins_installed"));
  } catch (error) {
    renderSettingsPlugins();
    setStatus(statusEl, readableError(error), true);
  }
}

function renderSettingsPlugins() {
  const listEl = document.querySelector("#settings-plugin-list");
  if (!listEl) return;
  if (!hasRoleAtLeast("admin")) return;

  listEl.replaceChildren(
    ...state.plugins.map((plugin) => {
      const item = document.createElement("li");
      item.className = "settings-plugin-item";
      item.innerHTML = `
        <div class="plugin-header">
          <div>
            <strong>${escapeHtml(plugin.name || plugin.id)}</strong>
            <div class="list-meta">${escapeHtml(plugin.version || t("no_version"))}</div>
          </div>
          <span class="chip">${escapeHtml(pluginStatusLabel(plugin.status))}</span>
        </div>
        <div class="plugin-actions">
          <button type="button" data-plugin-id="${escapeAttribute(plugin.id)}" data-plugin-action="compatibility" data-plugin-context="settings">${escapeHtml(t("plugin_action_check"))}</button>
          <button type="button" data-plugin-id="${escapeAttribute(plugin.id)}" data-plugin-action="${plugin.status === "enabled" ? "disable" : "enable"}" data-plugin-context="settings">
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

async function mutateSettingsPlugin(id, action) {
  const plugin = state.plugins.find((item) => String(item.id) === String(id));
  if (!plugin) return;
  const statusEl = document.querySelector("#settings-plugin-status");
  if (statusEl) setStatus(statusEl, pluginActionProgressLabel(action, plugin.name || plugin.id));
  try {
    if (action === "compatibility") {
      plugin.compatibility = await request(`/api/plugins/${encodeURIComponent(id)}/compatibility`);
      renderSettingsPlugins();
      if (statusEl) setStatus(statusEl, "");
    } else {
      await request(`/api/plugins/${encodeURIComponent(id)}/${action}`, { method: "POST" });
      await Promise.all([loadSettingsPlugins(), loadSession()]);
    }
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

// ── Section 4: Backups ───────────────────────────────────────────────────────

async function loadSettingsBackups() {
  if (!hasRoleAtLeast("admin")) return;
  const statusEl = document.querySelector("#settings-backup-status");
  const listEl = document.querySelector("#settings-backup-list");
  if (!statusEl || !listEl) return;

  setStatus(statusEl, t("loading_backups"));
  try {
    const payload = await request("/api/backups");
    const items = listItems(payload);
    renderSettingsBackupList(items);
    setStatus(statusEl, items.length ? "" : t("no_backups_yet"));
  } catch (error) {
    setStatus(statusEl, readableError(error), true);
  }
}

function renderSettingsBackupList(items) {
  const listEl = document.querySelector("#settings-backup-list");
  if (!listEl) return;
  if (!items.length) {
    listEl.replaceChildren();
    return;
  }
  listEl.replaceChildren(
    ...items.map((backup) => {
      const item = document.createElement("li");
      item.className = "settings-backup-item";
      // API returns `file` as the identifier (e.g. "backup_20260520T111615Z.sqlite3")
      const fileName = backup.file || backup.name || "";
      const sizeKb = backup.size_bytes ? Math.ceil(backup.size_bytes / 1024) + " KB" : "";
      const createdAt = backup.created_at ? formatDate(backup.created_at) : t("no_date");
      item.innerHTML = `
        <div class="settings-backup-info">
          <strong class="settings-backup-name">${escapeHtml(fileName)}</strong>
          <span class="list-meta">${escapeHtml(sizeKb)} &middot; ${escapeHtml(createdAt)}</span>
        </div>
        <div class="settings-backup-actions">
          <button type="button" data-action="restore-backup" data-backup-name="${escapeAttribute(fileName)}" data-i18n="restore">${escapeHtml(t("restore"))}</button>
          <button type="button" class="danger" data-action="delete-backup" data-backup-name="${escapeAttribute(fileName)}" data-i18n="delete">${escapeHtml(t("delete"))}</button>
        </div>
      `;
      return item;
    }),
  );
}

async function createBackup() {
  if (!hasRoleAtLeast("admin")) return;
  const statusEl = document.querySelector("#settings-backup-status");
  if (statusEl) setStatus(statusEl, t("creating_backup"));
  try {
    await request("/api/backups", { method: "POST" });
    await loadSettingsBackups();
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

async function restoreBackup(name) {
  if (!hasRoleAtLeast("admin")) return;
  if (!window.confirm(t("backup_restore_confirm", { name }))) return;
  const statusEl = document.querySelector("#settings-backup-status");
  if (statusEl) setStatus(statusEl, t("restoring_backup"));
  try {
    await request("/api/backups/restore", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    if (statusEl) setStatus(statusEl, t("backup_restored") + " " + t("settings_reload_hint"));
    setTimeout(() => { location.reload(); }, 2500);
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

async function deleteBackup(name) {
  if (!hasRoleAtLeast("admin")) return;
  if (!window.confirm(t("backup_delete_confirm", { name }))) return;
  const statusEl = document.querySelector("#settings-backup-status");
  if (statusEl) setStatus(statusEl, t("deleting_backup"));
  try {
    await request(`/api/backups/${encodeURIComponent(name)}`, { method: "DELETE" });
    await loadSettingsBackups();
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

// ── Section 5: Attachments / Orphans ────────────────────────────────────────

async function findOrphanAttachments() {
  if (!hasRoleAtLeast("admin")) return;
  const statusEl = document.querySelector("#settings-orphan-status");
  const listEl = document.querySelector("#settings-orphan-list");
  const purgeBtn = document.querySelector("#settings-orphan-purge-btn");
  if (!statusEl || !listEl) return;

  setStatus(statusEl, t("loading_orphans"));
  try {
    const payload = await request("/api/attachments/orphans");
    const items = listItems(payload);
    renderOrphanList(items);
    if (purgeBtn) purgeBtn.hidden = !items.length;
    setStatus(statusEl, items.length ? t("orphans_found", { count: items.length }) : t("no_orphans_found"));
  } catch (error) {
    setStatus(statusEl, readableError(error), true);
  }
}

function renderOrphanList(items) {
  const listEl = document.querySelector("#settings-orphan-list");
  if (!listEl) return;
  listEl.replaceChildren(
    ...items.map((att) => {
      const item = document.createElement("li");
      item.className = "settings-orphan-item";
      const sizeKb = att.size_bytes ? Math.ceil(att.size_bytes / 1024) + " KB" : "";
      item.innerHTML = `
        <span class="settings-orphan-name">${escapeHtml(att.file_name || att.id || "")}</span>
        <span class="list-meta">${escapeHtml(sizeKb)}</span>
      `;
      return item;
    }),
  );
}

async function purgeOrphanAttachments() {
  if (!hasRoleAtLeast("admin")) return;
  if (!window.confirm(t("purge_orphans_confirm"))) return;
  const statusEl = document.querySelector("#settings-orphan-status");
  const listEl = document.querySelector("#settings-orphan-list");
  const purgeBtn = document.querySelector("#settings-orphan-purge-btn");
  if (statusEl) setStatus(statusEl, t("purging_orphans"));
  try {
    const result = await request("/api/attachments/orphans/purge", { method: "POST" });
    if (listEl) listEl.replaceChildren();
    if (purgeBtn) purgeBtn.hidden = true;
    // API returns {"purged": N}
    const count = result?.purged ?? result?.deleted ?? result?.count ?? 0;
    if (statusEl) setStatus(statusEl, t("orphans_purged", { count }));
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

// ── Section 6: Manage taxonomy (rename / delete) ─────────────────────────────
// Editors+ can rename or delete categories / lessons / tags. Deletes detach the
// reference everywhere (documents.category_id / lesson_id set NULL; tag join rows
// removed) so nothing is left dangling. Lists are sourced from the shared state
// (state.categories / .lessons / .tags) which loadTaxonomy() keeps in sync.

const TAXONOMY_LIST_IDS = {
  categories: "#settings-taxonomy-categories",
  lessons: "#settings-taxonomy-lessons",
  tags: "#settings-taxonomy-tags",
};

function renderSettingsTaxonomy() {
  if (!hasRoleAtLeast("editor")) return;
  renderTaxonomyAdminList("categories", state.categories || []);
  renderTaxonomyAdminList("lessons", state.lessons || []);
  renderTaxonomyAdminList("tags", state.tags || []);
}

function renderTaxonomyAdminList(kind, items) {
  const listEl = document.querySelector(TAXONOMY_LIST_IDS[kind]);
  if (!listEl) return;
  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "settings-taxonomy-empty list-meta";
    empty.textContent = t("taxonomy_empty");
    listEl.replaceChildren(empty);
    return;
  }
  listEl.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.className = "settings-taxonomy-item";
      li.dataset.kind = kind;
      li.dataset.id = String(item.id);

      // Display row: name + usage count + Rename / Delete.
      const display = document.createElement("div");
      display.className = "settings-taxonomy-display";
      const name = document.createElement("span");
      name.className = "settings-taxonomy-name";
      name.textContent = item.name || item.slug || String(item.id);
      const meta = document.createElement("span");
      meta.className = "list-meta";
      meta.textContent = t("taxonomy_usage", { count: Number(item.usage_count || 0) });
      const actions = document.createElement("div");
      actions.className = "settings-taxonomy-actions";
      const renameBtn = document.createElement("button");
      renameBtn.type = "button";
      renameBtn.dataset.action = "rename-taxonomy";
      renameBtn.dataset.kind = kind;
      renameBtn.dataset.id = String(item.id);
      renameBtn.textContent = t("rename");
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "danger";
      deleteBtn.dataset.action = "delete-taxonomy";
      deleteBtn.dataset.kind = kind;
      deleteBtn.dataset.id = String(item.id);
      deleteBtn.dataset.usage = String(item.usage_count || 0);
      deleteBtn.textContent = t("delete");
      actions.append(renameBtn, deleteBtn);
      display.append(name, meta, actions);

      // Inline edit row (hidden until Rename is pressed).
      const edit = document.createElement("div");
      edit.className = "settings-taxonomy-edit";
      edit.hidden = true;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "settings-taxonomy-input";
      input.value = item.name || "";
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "primary";
      saveBtn.dataset.action = "save-taxonomy-rename";
      saveBtn.dataset.kind = kind;
      saveBtn.dataset.id = String(item.id);
      saveBtn.textContent = t("save");
      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.dataset.action = "cancel-taxonomy-rename";
      cancelBtn.dataset.kind = kind;
      cancelBtn.dataset.id = String(item.id);
      cancelBtn.textContent = t("cancel");
      edit.append(input, saveBtn, cancelBtn);

      li.append(display, edit);
      return li;
    }),
  );
  refreshIcons();
}

function findTaxonomyItemEl(kind, id) {
  const listEl = document.querySelector(TAXONOMY_LIST_IDS[kind]);
  if (!listEl) return null;
  return listEl.querySelector(`.settings-taxonomy-item[data-id="${CSS.escape(String(id))}"]`);
}

async function loadTaxonomyAdmin() {
  if (!hasRoleAtLeast("editor")) return;
  const statusEl = document.querySelector("#settings-taxonomy-status");
  if (statusEl) setStatus(statusEl, t("taxonomy_loading"));
  try {
    await loadTaxonomy();
    renderSettingsTaxonomy();
    if (statusEl) setStatus(statusEl, "");
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

function startTaxonomyRename(kind, id) {
  const li = findTaxonomyItemEl(kind, id);
  if (!li) return;
  const display = li.querySelector(".settings-taxonomy-display");
  const edit = li.querySelector(".settings-taxonomy-edit");
  const input = li.querySelector(".settings-taxonomy-input");
  if (display) display.hidden = true;
  if (edit) edit.hidden = false;
  if (input) {
    input.focus();
    input.select();
  }
}

function cancelTaxonomyRename(kind, id) {
  const li = findTaxonomyItemEl(kind, id);
  if (!li) return;
  const display = li.querySelector(".settings-taxonomy-display");
  const edit = li.querySelector(".settings-taxonomy-edit");
  const input = li.querySelector(".settings-taxonomy-input");
  const original = (state[kind] || []).find((item) => String(item.id) === String(id));
  if (input && original) input.value = original.name || "";
  if (edit) edit.hidden = true;
  if (display) display.hidden = false;
}

async function saveTaxonomyRename(kind, id) {
  if (!hasRoleAtLeast("editor")) return;
  const li = findTaxonomyItemEl(kind, id);
  if (!li) return;
  const input = li.querySelector(".settings-taxonomy-input");
  const name = (input?.value || "").trim();
  const statusEl = document.querySelector("#settings-taxonomy-status");
  if (!name) {
    if (statusEl) setStatus(statusEl, t("taxonomy_name_required"), true);
    return;
  }
  if (statusEl) setStatus(statusEl, t("saving"));
  try {
    await request(`/api/${kind}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
    await loadTaxonomy(); // keep rail filters + metadata selects in sync
    renderSettingsTaxonomy();
    if (statusEl) setStatus(statusEl, "");
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

async function deleteTaxonomyItem(kind, id, usage) {
  if (!hasRoleAtLeast("editor")) return;
  const count = Number(usage || 0);
  const confirmKey = kind === "tags" ? "delete_tag_confirm" : "delete_taxonomy_confirm";
  if (!window.confirm(t(confirmKey, { count }))) return;
  const statusEl = document.querySelector("#settings-taxonomy-status");
  if (statusEl) setStatus(statusEl, t("taxonomy_deleting"));
  try {
    await request(`/api/${kind}/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadTaxonomy(); // refresh rail filters + metadata selects
    renderSettingsTaxonomy();
    if (statusEl) setStatus(statusEl, "");
  } catch (error) {
    if (statusEl) setStatus(statusEl, readableError(error), true);
  }
}

// ── Document delete ──────────────────────────────────────────────────────────

// ── Per-document backup / restore ─────────────────────────────────────────────
// Distinct from the admin whole-database backup above. Lets an editor export a
// single article to a .json file and import it back as a NEW document.

async function exportDocument() {
  if (!hasRoleAtLeast("editor")) return;
  const doc = state.selectedDocument;
  if (!doc?.id) return;
  try {
    const envelope = await request(`/api/documents/${encodeURIComponent(doc.id)}/export`);
    const slug = String(doc.slug || envelope?.document?.slug || "document").replace(/[^a-z0-9._-]+/gi, "-");
    const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug || "document"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(elements.creatorSaveState, t("document_exported"));
  } catch (error) {
    window.alert(readableError(error));
  }
}

function importDocument() {
  if (!hasRoleAtLeast("editor")) return;
  const input = document.querySelector("#creator-import-input");
  if (!input) return;
  input.value = "";
  input.click();
}

async function handleImportFile(event) {
  if (!hasRoleAtLeast("editor")) return;
  const file = event.target.files?.[0];
  if (!file) return;
  setStatus(elements.creatorSaveState, t("importing_document"));
  try {
    const text = await file.text();
    let envelope;
    try {
      envelope = JSON.parse(text);
    } catch (parseError) {
      throw new Error(t("import_invalid_file"));
    }
    const result = await request("/api/documents/import", {
      method: "POST",
      body: JSON.stringify(envelope),
    });
    const newId = result?.document?.id;
    const skipped = result?.skipped_attachments?.length || 0;
    if (newId) {
      await loadDocuments(elements.searchInput.value.trim());
      await selectDocument(newId);
    }
    setStatus(
      elements.creatorSaveState,
      skipped ? t("document_imported_skipped", { count: skipped }) : t("document_imported"),
    );
  } catch (error) {
    window.alert(readableError(error));
    setStatus(elements.creatorSaveState, "");
  } finally {
    event.target.value = "";
  }
}

async function deleteDocument() {
  if (!hasRoleAtLeast("editor")) return;
  const doc = state.selectedDocument;
  if (!doc?.id) return;
  if (!window.confirm(t("delete_document_confirm"))) return;

  const docId = doc.id;
  try {
    await request(`/api/documents/${encodeURIComponent(docId)}`, { method: "DELETE" });
    // Clear selected document and return to empty state
    state.selectedDocument = null;
    state.editorSeed = null;
    state.comments = [];
    state.commentDraftTarget = null;
    state.revisions = [];
    state.editorDirty = false;
    state.editorSaving = false;
    state.lastSavedAt = null;
    renderDocumentDetail();
    renderRevisionList();
    // Refresh document list
    await loadDocuments(elements.searchInput.value.trim());
  } catch (error) {
    // Show error in editor status if visible, otherwise alert
    if (elements.editorStatus) {
      setStatus(elements.editorStatus, readableError(error), true);
    } else {
      window.alert(readableError(error));
    }
  }
}
