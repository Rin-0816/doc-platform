// i18n.js — Translation helpers, date formatting, language switching.

function t(key, values = {}) {
  const template = frontendPluginTranslations[state.language]?.[key]
    ?? translations[state.language]?.[key]
    ?? frontendPluginTranslations.en[key]
    ?? translations.en[key]
    ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = t("app_title");
  elements.languageSelect.value = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    const label = t(node.dataset.i18nAriaLabel);
    node.setAttribute("aria-label", label);
    // F9: set title for native tooltip on icon-only interactive elements.
    // Limit to button/a/[role=tab] that have no visible text content.
    const tag = node.tagName;
    const role = node.getAttribute("role") || "";
    if (tag === "BUTTON" || tag === "A" || role === "tab") {
      const visibleText = (node.textContent || "").trim();
      if (!visibleText) {
        node.title = label;
      }
    }
  });
  refreshIcons();
}

function createDateFormatter() {
  return new Intl.DateTimeFormat(LANGUAGE_LOCALES[state.language] || LANGUAGE_LOCALES.en, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES.has(language) || language === state.language) {
    return;
  }
  state.language = language;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // Some browsers can block storage; the selected language still applies for this session.
  }
  dateFormatter = createDateFormatter();
  applyTranslations();
  rerenderLocalizedContent();
}

// getInitialLanguage / getStoredLanguage live in globals.js because the
// state object initializes its language at load time (before i18n.js runs).

function roleLabel(role) {
  return translations[state.language]?.[`role_${role}`] ? t(`role_${role}`) : role;
}

function difficultyLabel(difficulty) {
  return frontendPluginTranslations[state.language]?.[difficulty] || translations[state.language]?.[difficulty]
    ? t(difficulty)
    : difficulty;
}

function commentStatusLabel(status = "open") {
  return translations[state.language]?.[`comment_status_${status}`]
    ? t(`comment_status_${status}`)
    : capitalize(status);
}

function targetTypeLabel(type = "document") {
  return translations[state.language]?.[type] ? t(type) : capitalize(String(type).replaceAll("_", " "));
}

function pluginStatusLabel(status = "unknown") {
  return translations[state.language]?.[`plugin_status_${status}`]
    ? t(`plugin_status_${status}`)
    : status;
}

function pluginActionProgressLabel(action, name) {
  return translations[state.language]?.[`plugin_progress_${action}`]
    ? t(`plugin_progress_${action}`, { name })
    : `${capitalize(action)} ${name}...`;
}

function formatDate(value) {
  if (!value) {
    return t("no_date");
  }
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? String(value) : dateFormatter.format(date);
}

function formatSavedTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(LANGUAGE_LOCALES[state.language] || "en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function rerenderLocalizedContent() {
  renderSession();
  renderDocumentList();
  renderDocumentDetail();
  renderComments();
  renderRevisionList();
  renderGlossaryList();
  renderGlossaryDetail();
  renderTaxonomyControls();
  renderDocumentFilterControls();
  renderPlugins();
  updateEditorHeading();
  renderCreatorDraft();
  renderCreatorMetadataSummary();
  updateCommentTargetControls();
  renderInsertBlocks();
}
