// comments.js — Comments drawer, comment CRUD, target capture.

async function loadComments(documentId) {
  setStatus(elements.commentsStatus, t("loading_comments"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(documentId)}/comments`);
    state.comments = listItems(payload).map(normalizeComment);
    renderComments();
  } catch (error) {
    state.comments = [];
    renderComments();
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

function renderComments() {
  const comments = [...state.comments].sort(compareComments);
  elements.commentList.replaceChildren(
    ...comments.map((comment) => {
      const editing = String(state.editingCommentId) === String(comment.id);
      const item = document.createElement("li");
      item.dataset.status = comment.status;
      item.dataset.commentId = comment.id;

      const header = document.createElement("div");
      header.className = "comment-header";
      const meta = document.createElement("div");
      meta.className = "comment-meta";
      meta.append(
        chip(commentStatusLabel(comment.status)),
        textNodeSpan(commentAuthorLabel(comment)),
        textNodeSpan(formatDate(comment.updated_at || comment.created_at), "list-meta"),
      );
      header.append(meta);

      const actions = document.createElement("div");
      actions.className = "comment-actions";
      if (!editing) {
        if (canEditComment(comment)) {
          actions.append(commentActionButton(comment.id, "edit", t("comment_action_edit")));
        }
        if (hasRoleAtLeast("editor") && comment.status === "open") {
          actions.append(commentActionButton(comment.id, "resolve", t("comment_action_resolve")));
        }
        if (hasRoleAtLeast("editor") && comment.status === "resolved") {
          actions.append(commentActionButton(comment.id, "reopen", t("comment_action_reopen")));
        }
      }
      header.append(actions);

      const target = document.createElement("div");
      target.className = "comment-target";
      target.textContent = commentTargetLabel(comment);

      item.append(header, target, editing ? commentEditor(comment) : commentBody(comment));
      if (comment.target_type === "text_selection" && comment.status !== "orphaned") {
        item.addEventListener("mouseenter", () => setAnchorHoverHighlight(comment.id, true));
        item.addEventListener("mouseleave", () => setAnchorHoverHighlight(comment.id, false));
      }
      return item;
    }),
  );

  setStatus(elements.commentsStatus, comments.length ? "" : t("no_comments_yet"));
  renderCommentComposer();

  // Update count badge (unresolved = open + orphaned)
  const unresolvedCount = state.comments.filter(
    (c) => c.status === "open" || c.status === "orphaned",
  ).length;
  if (elements.commentsCountBadge) {
    elements.commentsCountBadge.textContent = String(unresolvedCount);
    elements.commentsCountBadge.dataset.empty = unresolvedCount === 0 ? "true" : "false";
  }

  // Show toggle only when a document is selected
  if (elements.commentsToggle) {
    elements.commentsToggle.hidden = !state.selectedDocument;
  }

  // Keep in-document anchor markers in sync with comment state.
  renderCommentAnchors();
}

function commentActionButton(id, action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.commentId = id;
  button.dataset.commentAction = action;
  button.textContent = label;
  return button;
}

async function createComment(event) {
  event.preventDefault();
  if (!state.selectedDocument?.id) {
    return;
  }
  if (!state.session) {
    setStatus(elements.commentsStatus, t("sign_in_required"), true);
    return;
  }

  const body = elements.commentForm.elements.body.value.trim();
  const targetType = elements.commentForm.elements.target_type.value;
  const target = currentCommentTarget(targetType);
  if (!body) {
    setStatus(elements.commentsStatus, t("comment_body_required"), true);
    return;
  }
  if (!target) {
    setStatus(elements.commentsStatus, t("choose_comment_target"), true);
    return;
  }

  setStatus(elements.commentsStatus, t("adding_comment"));
  try {
    const payload = await request(`/api/documents/${encodeURIComponent(state.selectedDocument.id)}/comments`, {
      method: "POST",
      body: JSON.stringify({
        target_type: targetType,
        target,
        body,
        revision_id: state.revisions[0]?.id ?? null,
      }),
    });
    state.comments.unshift(normalizeComment(payload));
    elements.commentForm.elements.body.value = "";
    renderComments();
  } catch (error) {
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

async function mutateComment(id, action) {
  const comment = state.comments.find((item) => String(item.id) === String(id));
  if (!comment) {
    return;
  }

  if (action === "edit") {
    editComment(comment);
    return;
  }

  setStatus(elements.commentsStatus, t(`comment_progress_${action}`));
  try {
    const payload = await request(`/api/comments/${encodeURIComponent(id)}/${action}`, {
      method: "POST",
    });
    replaceComment(payload);
    renderComments();
  } catch (error) {
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

function commentBody(comment) {
  const body = document.createElement("p");
  body.className = "comment-body";
  body.textContent = comment.body;
  return body;
}

function commentEditor(comment) {
  // Inline edit view: textarea + Save/Cancel. Only one comment is editable at a time
  // (state.editingCommentId). Keyboard: Ctrl/Cmd+Enter saves, Esc cancels.
  const wrap = document.createElement("div");
  wrap.className = "comment-edit";

  const textarea = document.createElement("textarea");
  textarea.className = "comment-edit-input";
  textarea.rows = 3;
  textarea.value = comment.body;

  const controls = document.createElement("div");
  controls.className = "comment-edit-actions";

  const save = document.createElement("button");
  save.type = "button";
  save.className = "primary";
  save.textContent = t("comment_action_save");
  save.addEventListener("click", () => saveCommentEdit(comment.id, textarea.value));

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = t("comment_action_cancel");
  cancel.addEventListener("click", () => cancelCommentEdit());

  controls.append(save, cancel);

  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      saveCommentEdit(comment.id, textarea.value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelCommentEdit();
    }
  });

  wrap.append(textarea, controls);
  // Focus once attached to the DOM.
  window.requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  });
  return wrap;
}

function editComment(comment) {
  if (!canEditComment(comment)) {
    return;
  }
  state.editingCommentId = comment.id;
  setStatus(elements.commentsStatus, "");
  renderComments();
}

function cancelCommentEdit() {
  state.editingCommentId = null;
  renderComments();
}

async function saveCommentEdit(id, rawBody) {
  const comment = state.comments.find((item) => String(item.id) === String(id));
  if (!comment || !canEditComment(comment)) {
    return;
  }
  const body = String(rawBody || "").trim();
  if (!body) {
    setStatus(elements.commentsStatus, t("comment_body_required"), true);
    return;
  }

  setStatus(elements.commentsStatus, t("updating_comment"));
  try {
    const payload = await request(`/api/comments/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({ body }),
    });
    replaceComment(payload);
    state.editingCommentId = null;
    renderComments();
  } catch (error) {
    setStatus(elements.commentsStatus, readableError(error), true);
  }
}

function replaceComment(payload) {
  const next = normalizeComment(payload);
  const index = state.comments.findIndex((comment) => String(comment.id) === String(next.id));
  if (index >= 0) {
    state.comments.splice(index, 1, next);
  }
}

function refreshCommentTargetOptions() {
  state.commentTargetOptions.images = [...elements.documentMarkdown.querySelectorAll("img")]
    .map((image, index) => {
      const attachmentId = parseAttachmentId(image.currentSrc || image.src);
      if (!attachmentId) {
        return null;
      }
      image.dataset.commentImageIndex = index;
      return {
        index,
        label: image.alt || image.getAttribute("src") || t("image_number", { number: index + 1 }),
        target: {
          attachment_id: attachmentId,
          x_ratio: 0.5,
          y_ratio: 0.5,
        },
      };
    })
    .filter(Boolean);

  state.commentTargetOptions.mermaidBlocks = [...elements.documentMarkdown.querySelectorAll(".mermaid")]
    .map((block, index) => {
      const blockId = block.dataset.commentBlockId;
      if (!blockId) {
        return null;
      }
      block.dataset.commentMermaidIndex = index;
      return {
        index,
        label: t("mermaid_number", { number: index + 1 }),
        target: { block_id: blockId },
      };
    })
    .filter(Boolean);

  replaceTargetOptions(elements.commentImageTarget, state.commentTargetOptions.images);
  replaceTargetOptions(elements.commentMermaidTarget, state.commentTargetOptions.mermaidBlocks);
}

function replaceTargetOptions(select, options) {
  select.replaceChildren(
    ...options.map((optionItem, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = optionItem.label;
      return option;
    }),
  );
}

function updateCommentTargetControls() {
  const targetType = elements.commentForm.elements.target_type.value;
  const captureButton = elements.commentForm.querySelector('[data-action="capture-text-target"]');
  elements.commentImageField.hidden = targetType !== "image";
  elements.commentMermaidField.hidden = targetType !== "mermaid_block";
  captureButton.hidden = targetType !== "text_selection";
  clearCommentTargetHighlights();

  const target = currentCommentTarget(targetType);
  if (targetType === "document") {
    elements.commentTargetSummary.textContent = t("document");
  } else if (targetType === "text_selection") {
    elements.commentTargetSummary.textContent = target?.selected_text
      ? summarizeTextTarget(target.selected_text)
      : t("no_text_selected");
  } else if (targetType === "image") {
    const selected = selectedTargetOption(state.commentTargetOptions.images, elements.commentImageTarget);
    elements.commentTargetSummary.textContent = selected ? selected.label : t("no_attachment_images");
    if (selected) {
      elements.documentMarkdown.querySelector(`[data-comment-image-index="${selected.index}"]`)?.classList.add("is-comment-target");
    }
    elements.documentMarkdown.querySelectorAll("img").forEach((image) => image.classList.add("is-comment-targetable"));
  } else if (targetType === "mermaid_block") {
    const selected = selectedTargetOption(state.commentTargetOptions.mermaidBlocks, elements.commentMermaidTarget);
    elements.commentTargetSummary.textContent = selected ? selected.label : t("no_mermaid_blocks");
    if (selected) {
      elements.documentMarkdown.querySelector(`[data-comment-mermaid-index="${selected.index}"]`)?.classList.add("is-comment-target");
    }
  }
}

function currentCommentTarget(targetType) {
  if (targetType === "document") {
    return {};
  }
  if (targetType === "text_selection") {
    return state.commentDraftTarget?.target_type === "text_selection"
      ? state.commentDraftTarget.target
      : null;
  }
  if (targetType === "image") {
    return selectedTargetOption(state.commentTargetOptions.images, elements.commentImageTarget)?.target || null;
  }
  if (targetType === "mermaid_block") {
    return selectedTargetOption(state.commentTargetOptions.mermaidBlocks, elements.commentMermaidTarget)?.target || null;
  }
  return null;
}

function selectedTargetOption(options, select) {
  const index = Number(select.value);
  return Number.isInteger(index) ? options[index] : null;
}

function captureTextCommentTarget() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return false;
  }
  const range = selection.getRangeAt(0);
  if (!elements.documentMarkdown.contains(range.commonAncestorContainer)) {
    return false;
  }

  const selectedText = selection.toString();
  if (!selectedText.trim()) {
    return false;
  }

  const prefixRange = range.cloneRange();
  prefixRange.selectNodeContents(elements.documentMarkdown);
  prefixRange.setEnd(range.startContainer, range.startOffset);
  const renderedStartOffset = prefixRange.toString().length;
  const renderedText = elements.documentMarkdown.textContent || "";
  const sourceText = state.selectedDocument?.content_markdown || "";
  const sourceStartOffset = sourceText.indexOf(selectedText);
  const useSourceOffsets = sourceStartOffset >= 0
    && sourceText.indexOf(selectedText, sourceStartOffset + selectedText.length) === -1;
  const text = useSourceOffsets ? sourceText : renderedText;
  const startOffset = useSourceOffsets ? sourceStartOffset : renderedStartOffset;
  const endOffset = startOffset + selectedText.length;
  state.commentDraftTarget = {
    target_type: "text_selection",
    target: {
      start_offset: startOffset,
      end_offset: endOffset,
      selected_text: selectedText,
      prefix_context: text.slice(Math.max(0, startOffset - 32), startOffset),
      suffix_context: text.slice(endOffset, endOffset + 32),
    },
  };
  updateCommentTargetControls();
  setStatus(elements.commentsStatus, "");
  return true;
}

function captureImageCommentTarget(event) {
  if (elements.commentForm.elements.target_type.value !== "image") {
    return;
  }
  const image = event.target.closest("img");
  if (!image) {
    return;
  }
  const index = Number(image.dataset.commentImageIndex);
  const option = state.commentTargetOptions.images.find((item) => item.index === index);
  if (!option) {
    return;
  }
  const rect = image.getBoundingClientRect();
  option.target.x_ratio = clampRatio((event.clientX - rect.left) / rect.width);
  option.target.y_ratio = clampRatio((event.clientY - rect.top) / rect.height);
  elements.commentImageTarget.value = String(state.commentTargetOptions.images.indexOf(option));
  updateCommentTargetControls();
}

function clearCommentTargetHighlights() {
  elements.documentMarkdown.querySelectorAll(".is-comment-target, .is-comment-targetable").forEach((node) => {
    node.classList.remove("is-comment-target", "is-comment-targetable");
  });
}

// ── Text-selection anchor markers ──────────────────────────────────────────
// Places a clickable highlight + marker in #document-markdown at the position of
// each non-orphaned text_selection comment. Mirrors the backend re-anchor logic
// (db.py find_reanchored_offset): match selected_text disambiguated by
// prefix/suffix context. XSS-safe — only existing DOM text nodes are wrapped
// (createElement / textContent), never innerHTML, like highlight.js.

function clearCommentAnchors() {
  const root = elements.documentMarkdown;
  if (!root) return;
  root.querySelectorAll("mark.comment-anchor").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) {
      // Marker icon is appended after text; drop it, keep the text content.
      if (mark.firstChild.classList && mark.firstChild.classList.contains("comment-anchor-marker")) {
        mark.removeChild(mark.firstChild);
      } else {
        parent.insertBefore(mark.firstChild, mark);
      }
    }
    parent.removeChild(mark);
    parent.normalize();
  });
}

function renderCommentAnchors() {
  const root = elements.documentMarkdown;
  if (!root) return;
  clearCommentAnchors();

  const anchored = state.comments.filter(
    (comment) =>
      comment.target_type === "text_selection"
      && comment.status !== "orphaned"
      && comment.target?.selected_text,
  );
  if (!anchored.length) return;

  let placed = false;
  anchored.forEach((comment) => {
    if (wrapCommentAnchor(root, comment)) {
      placed = true;
    }
  });
  if (placed) {
    refreshIcons();
  }
}

// Find a contiguous run of text nodes whose combined text matches selected_text,
// disambiguated by prefix/suffix context, then wrap that run in <mark>.
function wrapCommentAnchor(root, comment) {
  const target = comment.target || {};
  const selected = target.selected_text || "";
  const prefix = target.prefix_context || "";
  const suffix = target.suffix_context || "";
  if (!selected) return false;

  // Collect text nodes (skip those already inside an anchor / wiki-link / code).
  const SKIP_TAGS = new Set(["MARK", "SCRIPT", "STYLE"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
      let parent = node.parentNode;
      while (parent && parent !== root) {
        if (SKIP_TAGS.has(parent.nodeName)) return NodeFilter.FILTER_REJECT;
        parent = parent.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  let cur = walker.nextNode();
  while (cur) {
    nodes.push(cur);
    cur = walker.nextNode();
  }
  if (!nodes.length) return false;

  // Concatenate node text and remember each node's [start,end) in the joined string.
  const spans = [];
  let full = "";
  nodes.forEach((node) => {
    spans.push({ node, start: full.length, end: full.length + node.nodeValue.length });
    full += node.nodeValue;
  });

  // Locate selected_text, disambiguated by prefix/suffix context (same rule as
  // find_reanchored_offset: prefix must immediately precede, suffix must follow).
  let from = 0;
  let index = -1;
  while (true) {
    const found = full.indexOf(selected, from);
    if (found < 0) break;
    const before = full.slice(Math.max(0, found - prefix.length), found);
    const after = full.slice(found + selected.length, found + selected.length + suffix.length);
    if ((!prefix || before.endsWith(prefix)) && (!suffix || after.startsWith(suffix))) {
      index = found;
      break;
    }
    from = found + 1;
  }
  if (index < 0) return false;

  const rangeStart = index;
  const rangeEnd = index + selected.length;

  // Split boundary text nodes so the match aligns to node edges.
  const startSpan = spans.find((s) => rangeStart >= s.start && rangeStart < s.end);
  const endSpan = spans.find((s) => rangeEnd > s.start && rangeEnd <= s.end);
  if (!startSpan || !endSpan) return false;

  let startNode = startSpan.node;
  if (rangeStart > startSpan.start) {
    startNode = startNode.splitText(rangeStart - startSpan.start);
  }
  let endNode = endSpan.node === startSpan.node ? startNode : endSpan.node;
  const endOffsetInNode = rangeEnd - endSpan.start
    - (endSpan.node === startSpan.node ? (rangeStart - startSpan.start) : 0);
  if (endOffsetInNode < endNode.nodeValue.length) {
    endNode.splitText(endOffsetInNode);
  }

  // Gather the text nodes spanning [startNode .. endNode] in document order.
  const toWrap = [];
  const collect = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let walking = false;
  let probe = collect.nextNode();
  while (probe) {
    if (probe === startNode) walking = true;
    if (walking) toWrap.push(probe);
    if (probe === endNode) break;
    probe = collect.nextNode();
  }
  if (!toWrap.length) return false;

  // Wrap each text node in its own <mark> (handles matches that cross elements
  // like <strong>, while never reordering DOM via innerHTML).
  let lastMark = null;
  toWrap.forEach((textNode) => {
    const mark = document.createElement("mark");
    mark.className = "comment-anchor";
    mark.dataset.commentId = comment.id;
    const parent = textNode.parentNode;
    if (!parent) return;
    parent.replaceChild(mark, textNode);
    mark.appendChild(textNode);
    lastMark = mark;
  });
  if (!lastMark) return false;

  // Append a clickable marker icon to the final mark.
  const marker = document.createElement("button");
  marker.type = "button";
  marker.className = "comment-anchor-marker";
  marker.dataset.commentId = comment.id;
  marker.setAttribute("aria-label", t("comment_anchor_marker"));
  marker.title = t("comment_anchor_marker");
  const icon = document.createElement("i");
  icon.dataset.lucide = "message-square";
  marker.appendChild(icon);
  lastMark.appendChild(marker);
  return true;
}

// Open the drawer, scroll the matching comment into view, and flash it.
function focusCommentFromAnchor(commentId) {
  if (!commentId) return;
  if (!state.commentsOpen) {
    setCommentsOpen(true);
  }
  const item = elements.commentList?.querySelector(`li[data-comment-id="${CSS.escape(String(commentId))}"]`);
  if (!item) return;
  item.scrollIntoView({ behavior: "smooth", block: "center" });
  item.classList.add("is-comment-flash");
  window.setTimeout(() => item.classList.remove("is-comment-flash"), 1600);
}

// Nice-to-have: highlight a comment's anchor span while hovering the drawer item.
function setAnchorHoverHighlight(commentId, on) {
  const root = elements.documentMarkdown;
  if (!root || !commentId) return;
  root.querySelectorAll(`mark.comment-anchor[data-comment-id="${CSS.escape(String(commentId))}"]`).forEach((mark) => {
    mark.classList.toggle("is-anchor-hover", Boolean(on));
  });
}

function setCommentsOpen(open) {
  state.commentsOpen = Boolean(open);
  elements.shell.dataset.commentsOpen = String(state.commentsOpen);
  if (elements.commentsToggle) {
    elements.commentsToggle.setAttribute(
      "aria-label",
      state.commentsOpen ? t("close_comments") : t("open_comments"),
    );
  }
}

function renderCommentComposer() {
  elements.commentForm.hidden = !Boolean(state.session && state.selectedDocument?.id);
}
