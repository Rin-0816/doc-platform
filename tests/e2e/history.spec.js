// history.spec.js — create a document and edit it (2 revisions) via the API, then
// open the document History view in the UI and assert the side-by-side diff renders
// rows.

const { test, expect } = require("@playwright/test");
const { loginViaUi, createDocumentViaApi, updateDocumentViaApi, uniqueName } = require("./helpers");

test("document history view renders a side-by-side diff with rows", async ({ page }) => {
  await page.goto("/");
  // UI login establishes the session cookie that page.request reuses.
  await loginViaUi(page, "admin");

  const slug = uniqueName("hist");
  const title = `履歴テスト ${slug}`;

  // Revision 1 (create) + revision 2 (edit) via the API. Use an explicit, unique
  // slug so navigation is unambiguous (Japanese-only titles auto-derive to a
  // shared "document"/"document-copy" slug, which could collide between tests).
  const created = await createDocumentViaApi(page, {
    title,
    slug,
    content_markdown: "最初の本文。\n二行目。",
  });
  await updateDocumentViaApi(page, created.id, {
    title,
    content_markdown: "更新後の本文。\n二行目は変更済み。\n三行目を追加。",
  });

  // Reload so the freshly-created doc appears in the rail, then filter the list by
  // the unique slug so the target is in view even if the shared DB has many docs.
  await page.reload();
  await expect(page.locator('.app-shell[data-signed-in="true"]')).toBeVisible();
  await page.locator("#document-search").fill(slug);

  // Select the document directly by its title (deterministic).
  const docButton = page.locator(".document-tree .tree-doc", { hasText: title });
  await expect(docButton).toBeVisible();
  await docButton.click();
  await expect(page.locator("#document-title")).toHaveText(title);

  // Switch to creator mode and open the History view.
  await page.locator('.app-tabs button[data-mode="creator"]').click();
  await page.locator('.creator-tabs button[data-creator-view="history"]').click();

  // The revision timeline should list both revisions.
  const revisionEntries = page.locator("#revision-list .revision-timeline-entry");
  await expect(revisionEntries).toHaveCount(2);

  // The side-by-side diff should render data rows (header + at least one body row).
  const diffRows = page.locator("#diff-output .diff-sxs-row");
  await expect(diffRows.first()).toBeVisible();
  await expect(async () => {
    expect(await diffRows.count()).toBeGreaterThan(1);
  }).toPass({ timeout: 10000 });
});
