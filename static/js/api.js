// api.js — Network requests and utility helpers.

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
      ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error?.message || t("request_failed", { status: response.status }));
    error.code = payload?.error?.code;
    error.status = response.status;
    throw error;
  }

  return payload;
}

function readableError(error) {
  if (error?.status === 401) {
    return t("sign_in_required");
  }
  if (error?.status === 403) {
    return t("no_permission");
  }
  return error?.message || t("something_went_wrong");
}

function setStatus(node, message, error = false) {
  node.textContent = message;
  node.classList.toggle("is-error", error);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value ?? "");
}

function structuredCloneSafe(value) {
  return window.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function numericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function stringId(value) {
  return value ? String(value) : "";
}

function listItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload?.items || [];
}

function debounce(callback, delay) {
  let timeout;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), delay);
  };
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function chip(text) {
  const node = document.createElement("span");
  node.className = "chip";
  node.textContent = text;
  return node;
}

function textNodeSpan(text, className = "") {
  const node = document.createElement("span");
  node.textContent = text;
  if (className) {
    node.className = className;
  }
  return node;
}

function refreshIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

function clampRatio(value) {
  if (!Number.isFinite(value)) {
    return 0.5;
  }
  return Math.min(1, Math.max(0, Number(value.toFixed(4))));
}

function summarizeChecks(checks) {
  if (!Array.isArray(checks)) {
    return "";
  }
  return checks.map((check) => check.message || check.result || check.name).filter(Boolean).join("; ");
}

function normalizeDiff(payload) {
  if (typeof payload === "string") {
    return payload;
  }
  if (Array.isArray(payload?.diff)) {
    return payload.diff.join("\n");
  }
  return payload?.diff || payload?.content || payload?.text || JSON.stringify(payload, null, 2);
}

function normalizeDocument(item = {}) {
  return {
    ...item,
    id: item.id,
    title: item.title || "",
    slug: item.slug || "",
    summary: item.summary || "",
    content_markdown: item.content_markdown || "",
    category_id: numericId(item.category_id ?? item.category?.id),
    lesson_id: numericId(item.lesson_id ?? item.lesson?.id),
    category: item.category || null,
    lesson: item.lesson || null,
    updated_at: item.updated_at || item.created_at || null,
    tags: item.tags || [],
    tag_ids: normalizeTagIds(item),
    plugin_data: item.plugin_data || {},
  };
}

function normalizeComment(item = {}) {
  return {
    ...item,
    id: item.id,
    target_type: item.target_type || "document",
    target: item.target || item.target_payload || {},
    body: item.body || "",
    status: item.status || "open",
  };
}

function normalizeAttachment(item = {}) {
  return {
    ...item,
    id: item.id,
    file_name: item.file_name || item.filename || "",
    url: item.url || item.public_url || item.href || "",
  };
}

function normalizeRevision(item = {}) {
  return {
    ...item,
    id: item.id,
    summary: item.summary || "",
  };
}

function normalizeTerm(item = {}) {
  return {
    ...item,
    id: item.id,
    term: item.term || item.name || "",
    description_markdown: item.description_markdown || item.description || "",
    aliases: item.aliases || [],
    tags: item.tags || [],
    related_documents: item.related_documents || [],
    related_tags: item.related_tags || [],
  };
}

function normalizeTaxonomyItem(item = {}) {
  return {
    ...item,
    id: Number(item.id),
    name: item.name || "",
    slug: item.slug || "",
    position: Number(item.position || 0),
  };
}

function normalizePlugin(item = {}) {
  return {
    ...item,
    id: item.id,
    name: item.name || item.id || "",
    status: item.status || "unknown",
  };
}

function normalizeTagIds(documentItem) {
  if (Array.isArray(documentItem.tag_ids)) {
    return documentItem.tag_ids.map(Number).filter(Boolean);
  }
  return (documentItem.tags || []).map((tag) => Number(typeof tag === "object" ? tag.id : tag)).filter(Boolean);
}

function compareByName(left, right) {
  return String(left.name || left.slug).localeCompare(String(right.name || right.slug), state.language);
}

function compareByPosition(left, right) {
  return (Number(left.position) - Number(right.position)) || compareByName(left, right);
}

function hasOption(select, value) {
  return !value || [...select.options].some((option) => option.value === value);
}

function hasRoleAtLeast(role) {
  const hierarchy = { viewer: 1, editor: 2, admin: 3 };
  const minimum = hierarchy[role] || Number.POSITIVE_INFINITY;
  const actual = Math.max(...(state.session?.roles || []).map((candidate) => hierarchy[candidate] || 0), 0);
  return actual >= minimum;
}

function isPluginEnabled(pluginId) {
  return Boolean(state.session?.enabled_plugins?.includes(pluginId));
}

function canEditComment(comment) {
  return Boolean(
    state.session
    && (hasRoleAtLeast("admin") || String(comment.created_by) === String(state.session.id)),
  );
}

function compareComments(left, right) {
  const statusOrder = { open: 0, orphaned: 1, resolved: 2 };
  const statusDifference = (statusOrder[left.status] ?? 3) - (statusOrder[right.status] ?? 3);
  if (statusDifference) {
    return statusDifference;
  }
  return String(right.created_at || "").localeCompare(String(left.created_at || ""));
}

function commentAuthorLabel(comment) {
  return comment.created_by_name
    || comment.author?.display_name
    || (comment.created_by ? t("user_with_id", { id: comment.created_by }) : t("unknown_author"));
}

function commentTargetLabel(comment) {
  const target = comment.target || {};
  switch (comment.target_type) {
    case "text_selection":
      return target.selected_text ? summarizeTextTarget(target.selected_text) : t("text_selection");
    case "image":
      return target.attachment_id ? t("image_attachment_label", { id: target.attachment_id }) : t("image");
    case "mermaid_block":
      return target.block_id ? `${t("mermaid_block")} ${target.block_id}` : t("mermaid_block");
    default:
      return targetTypeLabel(comment.target_type || "document");
  }
}

function summarizeTextTarget(value) {
  const compact = String(value).replace(/\s+/g, " ").trim();
  return compact.length > 72 ? `"${compact.slice(0, 69)}..."` : `"${compact}"`;
}

function attachmentUrl(attachment) {
  return attachment.url || (attachment.id ? `/api/attachments/${encodeURIComponent(attachment.id)}` : "");
}

function parseAttachmentId(value = "") {
  const match = String(value).match(/\/api\/attachments\/([^/?#]+)/);
  if (!match) {
    return null;
  }
  const attachmentId = Number(decodeURIComponent(match[1]));
  return Number.isInteger(attachmentId) ? attachmentId : null;
}

function imageAltText(fileName = "") {
  const trimmed = String(fileName).replace(/\.[^.]+$/, "").trim();
  return trimmed || t("attached_image");
}

function mermaidBlockId(content, index) {
  let hash = 0;
  for (const character of String(content || "")) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return `mermaid-${index + 1}-${Math.abs(hash).toString(36)}`;
}

function displayName(value) {
  if (!value) {
    return "";
  }
  if (typeof value !== "object") {
    return String(value);
  }
  const localized = localizedTaxonomyNames[state.language]?.[value.slug];
  return localized || value.name || value.title || value.slug || "";
}

function selectedCategoryId() {
  return numericId(elements.metadataCategory?.value);
}

function selectedLessonId() {
  return numericId(elements.metadataLesson?.value);
}

function selectedTagIds() {
  return [...elements.metadataTags.querySelectorAll('input[name="tag_ids"]:checked')]
    .map((input) => Number(input.value))
    .filter(Boolean);
}

function blankDocument() {
  return {
    title: "",
    slug: "",
    summary: "",
    content_markdown: "",
    category_id: null,
    lesson_id: null,
    tag_ids: [],
    plugin_data: createBlankPluginData(),
  };
}

function createBlankPluginData() {
  return Object.fromEntries(
    frontendPlugins
      .filter((plugin) => plugin.createBlankData)
      .map((plugin) => [plugin.id, plugin.createBlankData()]),
  );
}

function buildPluginData(existing = {}) {
  const pluginData = structuredCloneSafe(existing || {});
  enabledFrontendPlugins().forEach((plugin) => {
    if (plugin.readEditor) {
      pluginData[plugin.id] = plugin.readEditor();
    }
  });
  return pluginData;
}

function enabledFrontendPlugins() {
  return frontendPlugins.filter((plugin) => isPluginEnabled(plugin.id));
}
