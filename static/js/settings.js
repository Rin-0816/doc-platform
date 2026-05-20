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

// ── Document delete ──────────────────────────────────────────────────────────

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
