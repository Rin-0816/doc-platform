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
      const item = document.createElement("li");
      item.dataset.status = comment.status;

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
      if (canEditComment(comment)) {
        actions.append(commentActionButton(comment.id, "edit", t("comment_action_edit")));
      }
      if (hasRoleAtLeast("editor") && comment.status === "open") {
        actions.append(commentActionButton(comment.id, "resolve", t("comment_action_resolve")));
      }
      if (hasRoleAtLeast("editor") && comment.status === "resolved") {
        actions.append(commentActionButton(comment.id, "reopen", t("comment_action_reopen")));
      }
      header.append(actions);

      const target = document.createElement("div");
      target.className = "comment-target";
      target.textContent = commentTargetLabel(comment);

      const body = document.createElement("p");
      body.className = "comment-body";
      body.textContent = comment.body;

      item.append(header, target, body);
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
    await editComment(comment);
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

async function editComment(comment) {
  const body = window.prompt(t("edit_comment_prompt"), comment.body);
  if (body === null) {
    return;
  }
  if (!body.trim()) {
    setStatus(elements.commentsStatus, t("comment_body_required"), true);
    return;
  }

  setStatus(elements.commentsStatus, t("updating_comment"));
  try {
    const payload = await request(`/api/comments/${encodeURIComponent(comment.id)}`, {
      method: "PUT",
      body: JSON.stringify({ body: body.trim() }),
    });
    replaceComment(payload);
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
