// documents.spec.js — create a document with a Japanese title and an EMPTY slug
// through the editor UI, then confirm the server auto-derived a non-empty slug.

const { test, expect } = require("@playwright/test");
const { loginViaUi, uniqueName } = require("./helpers");

test("create a document with a Japanese title and empty slug, slug is auto-derived", async ({ page }) => {
  await page.goto("/");
  await loginViaUi(page, "admin");

  // Unique Japanese title so the spec is isolated and re-runnable.
  const title = `テスト文書 ${uniqueName("doc")}`;

  // Enter the editor for a brand-new document.
  await page.locator('.topbar-icon-button[data-action="new-document"]').click();

  const form = page.locator("#editor-form");
  await expect(form).toBeVisible();

  await form.locator('[name="title"]').fill(title);
  await form.locator('[name="content_markdown"]').fill("# 見出し\n\n本文のテキストです。");

  // The slug field auto-follows the title client-side; clear it LAST so the form
  // is submitted with an EMPTY slug, exercising the server-side auto-derive path.
  const slugField = form.locator('[name="slug"]');
  await slugField.fill("");
  await expect(slugField).toHaveValue("");

  // Capture the create response so we can assert on the persisted record directly.
  const createResponsePromise = page.waitForResponse(
    (res) => res.url().includes("/api/documents") && res.request().method() === "POST" && res.ok(),
  );

  // Save = submit the editor form via its Save button.
  await page.locator('button[type="submit"][form="editor-form"]').click();

  const createResponse = await createResponsePromise;
  const created = await createResponse.json();
  const savedDoc = created.document || created;
  const savedId = savedDoc.id;
  expect(savedId, "created document should have an id").toBeTruthy();

  // The save handler reports success in #editor-status.
  await expect(page.locator("#editor-status")).not.toBeEmpty();

  // Verify via the API that the document was persisted with a NON-EMPTY slug.
  await expect(async () => {
    const response = await page.request.get(`/api/documents/${savedId}`);
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    const doc = payload.document || payload;
    expect(doc.title).toBe(title);
    expect(doc.slug, "auto-derived slug should not be empty").toBeTruthy();
    expect(String(doc.slug).length).toBeGreaterThan(0);
  }).toPass({ timeout: 10000 });
});
