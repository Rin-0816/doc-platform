// taxonomy.spec.js — as admin, create a category via the API, then in
// Settings → Manage taxonomy rename it inline and delete it (confirm dialog),
// asserting it disappears from the list.

const { test, expect } = require("@playwright/test");
const { loginViaUi, createCategoryViaApi, uniqueName } = require("./helpers");

test("admin can rename and delete a category from Settings → Manage taxonomy", async ({ page }) => {
  await page.goto("/");
  await loginViaUi(page, "admin");

  const originalName = `分類 ${uniqueName("cat")}`;
  const renamedName = `${originalName} 改`;

  const category = await createCategoryViaApi(page, originalName);
  const categoryId = category.id;
  expect(categoryId, "created category should have an id").toBeTruthy();

  // Open Settings via the avatar menu.
  await page.locator('[data-action="toggle-avatar-menu"]').click();
  await page.locator('[data-action="open-settings"]').click();
  await expect(page.locator("#settings-dialog")).toBeVisible();

  // Load the admin taxonomy lists.
  await page.locator('[data-action="load-taxonomy-admin"]').click();

  const item = page.locator(`#settings-taxonomy-categories .settings-taxonomy-item[data-id="${categoryId}"]`);
  await expect(item).toBeVisible();
  await expect(item.locator(".settings-taxonomy-name")).toHaveText(originalName);

  // --- Rename inline ---
  await item.locator('[data-action="rename-taxonomy"]').click();
  const input = item.locator(".settings-taxonomy-input");
  await expect(input).toBeVisible();
  await input.fill(renamedName);
  await item.locator('[data-action="save-taxonomy-rename"]').click();
  await expect(item.locator(".settings-taxonomy-name")).toHaveText(renamedName);

  // --- Delete (confirm dialog) ---
  page.on("dialog", (dialog) => dialog.accept());
  await item.locator('[data-action="delete-taxonomy"]').click();

  // The item should be removed from the list.
  await expect(item).toHaveCount(0);

  // And gone from the API too.
  await expect(async () => {
    const response = await page.request.get("/api/categories");
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    const items = Array.isArray(payload) ? payload : payload.items || [];
    expect(items.some((c) => String(c.id) === String(categoryId))).toBeFalsy();
  }).toPass({ timeout: 10000 });
});
