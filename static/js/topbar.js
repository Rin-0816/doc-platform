// topbar.js — Avatar menu, login dialog, theme, settings/autolink, plugins admin, shortcuts.

function renderSession() {
  const signedIn = Boolean(state.session);
  elements.shell.dataset.signedIn = String(signedIn);
  if (signedIn) {
    const username = state.session.username || "";
    const displayName = state.session.display_name || username;
    const roles = (state.session.roles || []).map(roleLabel).join(", ");
    if (elements.avatarInitials) {
      elements.avatarInitials.textContent = (username[0] || "?").toUpperCase();
    }
    if (elements.avatarName) {
      elements.avatarName.textContent = displayName;
    }
    if (elements.avatarMenuName) {
      elements.avatarMenuName.textContent = displayName;
    }
    if (elements.avatarMenuRole) {
      elements.avatarMenuRole.textContent = roles;
    }
  }
  renderRoleAwareControls();
}

function renderRoleAwareControls() {
  document.querySelectorAll("[data-auth-only]").forEach((node) => {
    node.hidden = !state.session;
  });
  document.querySelectorAll("[data-auth-hidden]").forEach((node) => {
    node.hidden = Boolean(state.session);
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
  updateDeleteDocumentButton();
  renderCommentComposer();
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
  if (elements.loginError) {
    elements.loginError.textContent = "";
    elements.loginError.classList.remove("is-error");
  }
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
    closeLoginDialog();
    renderSession();
    await loadSettings();
    // Apply a hash route that was deferred because the user was not yet signed in
    const deferred = pendingHashRoute || parseHashRoute();
    pendingHashRoute = null;
    const hasDeferred = Boolean(deferred);
    await Promise.allSettled([
      loadDocuments(elements.searchInput.value.trim(), { skipAutoSelect: hasDeferred }),
      loadGlossary(),
      loadTaxonomy(),
    ]);
    if (hasDeferred) await applyHashRoute(deferred);
  } catch (error) {
    state.session = null;
    if (elements.loginError) {
      elements.loginError.textContent = readableError(error);
      elements.loginError.classList.add("is-error");
    }
    renderSession();
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
  state.categories = [];
  state.lessons = [];
  state.tags = [];
  // Clear the hash so bookmarks don't immediately re-load on next login
  suppressNextHashChange = true;
  history.replaceState(null, "", location.pathname);
  renderSession();
  renderDocumentList();
  renderRevisionList();
  renderGlossaryList();
  renderTaxonomyControls();
  renderDocumentFilterControls();
  renderDocumentDetail();
  renderComments();
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

function openLoginDialog() {
  if (!elements.loginDialog) return;
  if (elements.loginError) {
    elements.loginError.textContent = "";
    elements.loginError.classList.remove("is-error");
  }
  elements.loginForm.reset();
  elements.loginDialog.showModal();
}

function closeLoginDialog() {
  if (!elements.loginDialog) return;
  elements.loginDialog.close();
}

function toggleAvatarMenu() {
  if (state.avatarMenuOpen) {
    closeAvatarMenu();
  } else {
    openAvatarMenu();
  }
}

function openAvatarMenu() {
  state.avatarMenuOpen = true;
  const menu = elements.avatarMenu;
  if (menu) {
    menu.hidden = false;
    // Position the menu directly beneath the avatar pill
    const pill = document.querySelector('[data-action="toggle-avatar-menu"]');
    if (pill) {
      const rect = pill.getBoundingClientRect();
      menu.style.position = "fixed";
      menu.style.top = `${rect.bottom + 6}px`;
      menu.style.right = `${document.documentElement.clientWidth - rect.right}px`;
      menu.style.left = "auto";
    }
  }
  const pill = document.querySelector('[data-action="toggle-avatar-menu"]');
  if (pill) pill.setAttribute("aria-expanded", "true");
}

function closeAvatarMenu() {
  state.avatarMenuOpen = false;
  if (elements.avatarMenu) {
    elements.avatarMenu.hidden = true;
  }
  const pill = document.querySelector('[data-action="toggle-avatar-menu"]');
  if (pill) pill.setAttribute("aria-expanded", "false");
}

function closeAvatarMenuOnOutsideClick(event) {
  if (!state.avatarMenuOpen) {
    return;
  }
  if (event.target.closest("#avatar-menu") || event.target.closest('[data-action="toggle-avatar-menu"]')) {
    return;
  }
  closeAvatarMenu();
}

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch (_) {
    // ignore
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (_) {
    // ignore
  }
  const themeIcon = document.querySelector('[data-action="toggle-theme"] i[data-lucide]');
  if (themeIcon) {
    themeIcon.setAttribute("data-lucide", theme === "dark" ? "moon" : "sun");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
}

function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

function openShortcutsDialog() {
  const dlg = document.querySelector("#shortcuts-dialog");
  if (dlg && typeof dlg.showModal === "function") dlg.showModal();
}

function closeShortcutsDialog() {
  const dlg = document.querySelector("#shortcuts-dialog");
  if (dlg && typeof dlg.close === "function") dlg.close();
}

// ── Settings / autolink ────────────────────────────────────────────────────

async function loadSettings() {
  try {
    const settings = await request("/api/settings");
    state.settings = settings || { glossary_autolink: "off" };
  } catch (_) {
    state.settings = { glossary_autolink: "off" };
  }
  renderAutolinkStatus();
}

function renderAutolinkStatus() {
  const statusEl = document.querySelector("#autolink-status");
  if (!statusEl) return;
  statusEl.textContent = state.settings?.glossary_autolink === "on" ? "ON" : "OFF";
}

async function toggleGlossaryAutolink() {
  if (!hasRoleAtLeast("admin")) return;
  const currentValue = state.settings?.glossary_autolink || "off";
  const newValue = currentValue === "on" ? "off" : "on";
  try {
    await request("/api/settings/glossary_autolink", {
      method: "PUT",
      body: JSON.stringify({ value: newValue }),
    });
    state.settings = { ...state.settings, glossary_autolink: newValue };
    renderAutolinkStatus();
    // Re-render visible markdown bodies to apply or remove autolinks
    renderDocumentDetail();
    renderTermDetail();
    if (state.viewerContent === "glossary") renderGlossaryIndex();
  } catch (error) {
    // Silently ignore if not admin or server error
  }
}

// ── Plugins admin ────────────────────────────────────────────────────────────

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
