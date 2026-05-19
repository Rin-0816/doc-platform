export const translations = {
  en: {
    ict_learning: "ICT learning",
    ict_learning_metadata: "ICT learning metadata",
    ict_learning_material_info: "ICT learning material info",
    learning_objectives: "Learning objectives",
    prerequisites: "Prerequisites",
    difficulty: "Difficulty",
    not_set: "Not set",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    estimated_minutes: "Estimated minutes",
    last_verified: "Last verified",
    required_equipment: "Required equipment",
    required_software: "Required software",
    supported_platforms: "Supported platforms",
    one_item_per_line: "One item per line",
    platform_format_hint: "One platform per line, for example Windows | 11",
  },
  ja: {
    ict_learning: "ICT教材",
    ict_learning_metadata: "ICT教材情報",
    ict_learning_material_info: "ICT教材情報",
    learning_objectives: "学習目標",
    prerequisites: "前提知識",
    difficulty: "難易度",
    not_set: "未設定",
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
    estimated_minutes: "目安時間 (分)",
    last_verified: "最終確認日",
    required_equipment: "必要機材",
    required_software: "必要ソフトウェア",
    supported_platforms: "対応環境",
    one_item_per_line: "1行に1件ずつ入力",
    platform_format_hint: "1行に1件ずつ入力。例: Windows | 11",
  },
};

export function createFrontendPlugin(api) {
  return {
    id: "ict_learning",
    createBlankData: blankIctLearning,
    createCreatorPanel,
    hydrateEditor,
    readEditor,
    renderDetailPanel: createDetailPanel,
    insertBlocks: [],
  };

  function createDetailPanel(documentItem) {
    const ictLearning = normalizeIctLearning(documentItem.plugin_data?.ict_learning);
    if (!hasValues(ictLearning)) {
      return null;
    }

    const panel = document.createElement("section");
    panel.className = "document-panel ict-panel";

    const heading = document.createElement("h3");
    heading.dataset.i18n = "ict_learning";
    heading.textContent = api.t("ict_learning");

    const fieldsTarget = document.createElement("div");
    fieldsTarget.className = "ict-detail-grid";

    const fields = [
      [api.t("learning_objectives"), ictLearning.learning_objectives, "markdown"],
      [api.t("prerequisites"), ictLearning.prerequisites, "markdown"],
      [api.t("difficulty"), ictLearning.difficulty ? api.difficultyLabel(ictLearning.difficulty) : "", "text"],
      [api.t("estimated_minutes"), ictLearning.estimated_minutes, "text"],
      [api.t("required_equipment"), ictLearning.required_equipment, "list"],
      [api.t("required_software"), ictLearning.required_software, "list"],
      [api.t("supported_platforms"), ictLearning.supported_platforms, "platforms"],
      [api.t("last_verified"), ictLearning.last_verified_on, "text"],
    ];

    fields.forEach(([label, value, type]) => {
      if (hasFieldValue(value)) {
        fieldsTarget.append(renderDetailItem(label, value, type));
      }
    });

    panel.append(heading, fieldsTarget);
    return panel;
  }

  function createCreatorPanel() {
    const panel = document.createElement("details");
    panel.className = "editor-panel ict-editor-panel";
    panel.innerHTML = `
      <summary data-i18n="ict_learning_material_info">${api.escapeHtml(api.t("ict_learning_material_info"))}</summary>
      <div class="ict-editor-grid">
        <label class="span-2">
          <span data-i18n="learning_objectives">${api.escapeHtml(api.t("learning_objectives"))}</span>
          <textarea name="ict_learning_objectives" rows="3"></textarea>
        </label>
        <label class="span-2">
          <span data-i18n="prerequisites">${api.escapeHtml(api.t("prerequisites"))}</span>
          <textarea name="ict_prerequisites" rows="3"></textarea>
        </label>
        <label>
          <span data-i18n="difficulty">${api.escapeHtml(api.t("difficulty"))}</span>
          <select name="ict_difficulty">
            <option value="" data-i18n="not_set">${api.escapeHtml(api.t("not_set"))}</option>
            <option value="beginner" data-i18n="beginner">${api.escapeHtml(api.t("beginner"))}</option>
            <option value="intermediate" data-i18n="intermediate">${api.escapeHtml(api.t("intermediate"))}</option>
            <option value="advanced" data-i18n="advanced">${api.escapeHtml(api.t("advanced"))}</option>
          </select>
        </label>
        <label>
          <span data-i18n="estimated_minutes">${api.escapeHtml(api.t("estimated_minutes"))}</span>
          <input name="ict_estimated_minutes" type="number" min="1" step="1">
        </label>
        <label>
          <span data-i18n="last_verified">${api.escapeHtml(api.t("last_verified"))}</span>
          <input name="ict_last_verified_on" type="date">
        </label>
        <label>
          <span data-i18n="required_equipment">${api.escapeHtml(api.t("required_equipment"))}</span>
          <textarea name="ict_required_equipment" rows="3" placeholder="${api.escapeHtml(api.t("one_item_per_line"))}" data-i18n-placeholder="one_item_per_line"></textarea>
        </label>
        <label>
          <span data-i18n="required_software">${api.escapeHtml(api.t("required_software"))}</span>
          <textarea name="ict_required_software" rows="3" placeholder="${api.escapeHtml(api.t("one_item_per_line"))}" data-i18n-placeholder="one_item_per_line"></textarea>
        </label>
        <label class="span-2">
          <span data-i18n="supported_platforms">${api.escapeHtml(api.t("supported_platforms"))}</span>
          <textarea name="ict_supported_platforms" rows="3" placeholder="${api.escapeHtml(api.t("platform_format_hint"))}" data-i18n-placeholder="platform_format_hint"></textarea>
        </label>
      </div>
    `;
    return panel;
  }

  function hydrateEditor(documentItem) {
    const form = api.editorForm.elements;
    if (!form.ict_learning_objectives) {
      return;
    }
    const ictLearning = normalizeIctLearning(documentItem.plugin_data?.ict_learning);
    form.ict_learning_objectives.value = ictLearning.learning_objectives;
    form.ict_prerequisites.value = ictLearning.prerequisites;
    form.ict_difficulty.value = ictLearning.difficulty;
    form.ict_estimated_minutes.value = ictLearning.estimated_minutes ?? "";
    form.ict_required_equipment.value = formatStringList(ictLearning.required_equipment);
    form.ict_required_software.value = formatStringList(ictLearning.required_software);
    form.ict_supported_platforms.value = formatPlatforms(ictLearning.supported_platforms);
    form.ict_last_verified_on.value = ictLearning.last_verified_on || "";
  }

  function readEditor() {
    const form = api.editorForm.elements;
    if (!form.ict_learning_objectives) {
      return blankIctLearning();
    }
    return {
      learning_objectives: form.ict_learning_objectives.value,
      prerequisites: form.ict_prerequisites.value,
      difficulty: form.ict_difficulty.value,
      estimated_minutes: normalizeOptionalInteger(form.ict_estimated_minutes.value),
      required_equipment: parseStringList(form.ict_required_equipment.value),
      required_software: parseStringList(form.ict_required_software.value),
      supported_platforms: parsePlatforms(form.ict_supported_platforms.value),
      last_verified_on: form.ict_last_verified_on.value || null,
    };
  }

  function renderDetailItem(label, value, type) {
    const item = document.createElement("dl");
    item.className = "ict-detail-item";
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");

    if (type === "markdown") {
      const body = document.createElement("div");
      body.className = "markdown-body";
      description.append(body);
      api.renderMarkdown(body, String(value || ""));
    } else if (type === "list") {
      description.append(renderChipList(value));
    } else if (type === "platforms") {
      description.append(renderChipList(value.map(platformLabel)));
    } else {
      description.textContent = String(value);
    }

    item.append(term, description);
    return item;
  }

  function renderChipList(values) {
    const list = document.createElement("div");
    list.className = "ict-inline-list";
    values.forEach((value) => list.append(api.chip(String(value))));
    return list;
  }
}

function blankIctLearning() {
  return {
    learning_objectives: "",
    prerequisites: "",
    difficulty: "",
    estimated_minutes: null,
    required_equipment: [],
    required_software: [],
    supported_platforms: [],
    last_verified_on: null,
  };
}

function normalizeIctLearning(item = {}) {
  const platforms = Array.isArray(item.supported_platforms)
    ? item.supported_platforms.map(normalizePlatform).filter(Boolean)
    : [];
  return {
    learning_objectives: item.learning_objectives || item.learning_objectives_markdown || "",
    prerequisites: item.prerequisites || item.prerequisites_markdown || "",
    difficulty: item.difficulty || "",
    estimated_minutes: normalizeOptionalInteger(item.estimated_minutes),
    required_equipment: normalizeStringList(item.required_equipment),
    required_software: normalizeStringList(item.required_software),
    supported_platforms: platforms,
    last_verified_on: item.last_verified_on || "",
  };
}

function normalizeOptionalInteger(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function normalizeStringList(values) {
  if (!Array.isArray(values)) {
    return [];
  }
  return values.map((value) => String(value).trim()).filter(Boolean);
}

function parseStringList(value) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatStringList(values) {
  return normalizeStringList(values).join("\n");
}

function normalizePlatform(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    const [os, version = ""] = value.split("|").map((part) => part.trim());
    return os ? { os, version } : null;
  }
  const os = String(value.os || value.platform || "").trim();
  const version = String(value.version || "").trim();
  return os ? { os, version } : null;
}

function parsePlatforms(value) {
  return String(value || "")
    .split("\n")
    .map((line) => normalizePlatform(line))
    .filter(Boolean);
}

function formatPlatforms(values) {
  return values.map((platform) => platform.version ? `${platform.os} | ${platform.version}` : platform.os).join("\n");
}

function platformLabel(platform) {
  return platform.version ? `${platform.os} ${platform.version}` : platform.os;
}

function hasValues(ictLearning) {
  return [
    ictLearning.learning_objectives,
    ictLearning.prerequisites,
    ictLearning.difficulty,
    ictLearning.estimated_minutes,
    ictLearning.required_equipment,
    ictLearning.required_software,
    ictLearning.supported_platforms,
    ictLearning.last_verified_on,
  ].some(hasFieldValue);
}

function hasFieldValue(value) {
  return Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== "";
}
