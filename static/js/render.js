// render.js — Markdown rendering, HTML sanitization, wiki-links, glossary autolinks.

function renderMarkdown(target, markdown) {
  if (!window.marked) {
    target.textContent = markdown || "";
    return;
  }

  target.innerHTML = sanitizeHtml(marked.parse(markdown || ""));
  target.querySelectorAll("pre > code.language-mermaid").forEach((code, index) => {
    const diagram = document.createElement("div");
    diagram.className = "mermaid";
    diagram.dataset.commentBlockId = mermaidBlockId(code.textContent, index);
    diagram.textContent = code.textContent;
    code.parentElement.replaceWith(diagram);
  });
  applyWikiLinks(target);
  if (window.mermaid) {
    mermaid.run({ nodes: target.querySelectorAll(".mermaid") }).catch(() => {});
  }
}

function sanitizeHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("script, iframe, object, embed, link, style").forEach((node) => node.remove());
  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on") || (["href", "src"].includes(name) && value.startsWith("javascript:"))) {
        node.removeAttribute(attribute.name);
      }
    });
  });
  return template.innerHTML;
}

function applyWikiLinks(root) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.includes("[[")) {
        return NodeFilter.FILTER_REJECT;
      }
      let parent = node.parentNode;
      while (parent && parent !== root) {
        if (WIKI_LINK_SKIP_TAGS.has(parent.nodeName)) {
          return NodeFilter.FILTER_REJECT;
        }
        parent = parent.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => replaceWikiLinksInTextNode(node));

  // Auto-link pass: only if setting is enabled
  if (state.settings?.glossary_autolink === "on") {
    applyGlossaryAutolinks(root);
  }
}

function replaceWikiLinksInTextNode(node) {
  const text = node.nodeValue;
  WIKI_LINK_PATTERN.lastIndex = 0;
  let match = WIKI_LINK_PATTERN.exec(text);
  if (!match) return;

  const fragment = document.createDocumentFragment();
  let cursor = 0;
  do {
    if (match.index > cursor) {
      fragment.append(document.createTextNode(text.slice(cursor, match.index)));
    }
    const targetRaw = (match[1] || "").trim();
    const displayRaw = (match[2] || "").trim();
    fragment.append(buildWikiLink(targetRaw, displayRaw || targetRaw));
    cursor = WIKI_LINK_PATTERN.lastIndex;
    match = WIKI_LINK_PATTERN.exec(text);
  } while (match);

  if (cursor < text.length) {
    fragment.append(document.createTextNode(text.slice(cursor)));
  }
  node.parentNode.replaceChild(fragment, node);
}

function resolveGlossaryTerm(target) {
  if (!target) return null;
  const needle = target.toLowerCase();
  return (
    state.glossary.find(
      (term) =>
        (term.term || "").toLowerCase() === needle ||
        (term.slug || "").toLowerCase() === needle ||
        (term.aliases || []).some(
          (a) =>
            (a.alias || "").toLowerCase() === needle ||
            (a.alias_slug || "").toLowerCase() === needle,
        ),
    ) || null
  );
}

function buildWikiLink(target, display) {
  const anchor = document.createElement("a");
  anchor.className = "wiki-link";
  anchor.dataset.wikiTarget = target;
  anchor.textContent = display || target;
  const term = resolveGlossaryTerm(target);
  if (term) {
    anchor.dataset.termId = term.id;
    anchor.href = `#term-${term.id}`;
    anchor.title = term.term || target;
  } else {
    anchor.classList.add("is-missing");
    anchor.href = "#";
    anchor.title = hasRoleAtLeast("editor")
      ? t("wiki_link_unresolved_editor", { term: target })
      : t("wiki_link_unresolved", { term: target });
  }
  return anchor;
}

function applyGlossaryAutolinks(root) {
  if (!root || !state.glossary.length) return;

  // Build needle list: longest first so multi-word terms match before substrings
  const needles = [];
  state.glossary.forEach((term) => {
    if (term.term) needles.push({ needle: term.term, term });
    (term.aliases || []).forEach((a) => {
      if (a.alias) needles.push({ needle: a.alias, term });
    });
  });
  needles.sort((a, b) => b.needle.length - a.needle.length);

  const AUTOLINK_SKIP_TAGS = new Set(["A", "CODE", "PRE", "SCRIPT", "STYLE"]);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let parent = node.parentNode;
      while (parent && parent !== root) {
        if (AUTOLINK_SKIP_TAGS.has(parent.nodeName)) return NodeFilter.FILTER_REJECT;
        parent = parent.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  let cur = walker.nextNode();
  while (cur) { textNodes.push(cur); cur = walker.nextNode(); }

  textNodes.forEach((node) => {
    const text = node.nodeValue;
    // Find the earliest match across all needles
    let bestIndex = -1;
    let bestLength = 0;
    let bestTerm = null;

    for (const { needle, term } of needles) {
      // Simple case-insensitive word-boundary search
      const ltext = text.toLowerCase();
      const lneedle = needle.toLowerCase();
      let pos = ltext.indexOf(lneedle);
      while (pos !== -1) {
        const before = pos === 0 ? true : !/\w/.test(text[pos - 1]);
        const after = (pos + needle.length >= text.length) ? true : !/\w/.test(text[pos + needle.length]);
        if (before && after) {
          if (bestIndex === -1 || pos < bestIndex || (pos === bestIndex && needle.length > bestLength)) {
            bestIndex = pos;
            bestLength = needle.length;
            bestTerm = term;
          }
          break;
        }
        pos = ltext.indexOf(lneedle, pos + 1);
      }
    }

    if (bestIndex === -1 || !bestTerm) return;

    const fragment = document.createDocumentFragment();
    if (bestIndex > 0) fragment.append(document.createTextNode(text.slice(0, bestIndex)));
    const anchor = document.createElement("a");
    anchor.className = "wiki-link";
    anchor.dataset.termId = bestTerm.id;
    anchor.href = `#term-${bestTerm.id}`;
    anchor.title = bestTerm.term;
    anchor.textContent = text.slice(bestIndex, bestIndex + bestLength);
    fragment.append(anchor);
    if (bestIndex + bestLength < text.length) {
      fragment.append(document.createTextNode(text.slice(bestIndex + bestLength)));
    }
    node.parentNode.replaceChild(fragment, node);
  });
}
