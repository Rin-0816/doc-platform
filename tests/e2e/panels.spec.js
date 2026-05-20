// panels.spec.js — collapse the left rail and right aux panel, verify the columns
// hide and edge re-open handles appear, that the collapsed state survives a reload
// (localStorage), then re-open via the edge handles.

const { test, expect } = require("@playwright/test");
const { loginViaUi } = require("./helpers");

test("rail and aux panels collapse, persist across reload, and re-open via edge handles", async ({ page }) => {
  await page.goto("/");
  await loginViaUi(page, "admin");

  const shell = page.locator(".app-shell");
  // Default app mode is "viewer", where toggle-aux collapses the right column.
  await expect(shell).toHaveAttribute("data-app-mode", "viewer");

  const rail = page.locator(".document-rail");
  const aux = page.locator(".auxiliary-panel");
  const railReopen = page.locator(".rail-reopen");
  const auxReopen = page.locator(".aux-reopen");

  // --- Collapse the left rail (rail-heading collapse button) ---
  await page.locator('.rail-collapse-button[data-action="toggle-rail"]').click();
  await expect(shell).toHaveAttribute("data-rail-collapsed", "true");
  await expect(rail).toBeHidden();
  await expect(railReopen).toBeVisible();

  // --- Collapse the right aux panel (topbar toggle) ---
  await page.locator('.topbar-icon-button[data-action="toggle-aux"]').click();
  await expect(shell).toHaveAttribute("data-aux-collapsed", "true");
  await expect(aux).toBeHidden();
  await expect(auxReopen).toBeVisible();

  // --- Reload: collapsed state should persist via localStorage ---
  // The session is cookie-backed and restored on boot, so no re-login is needed.
  await page.reload();
  await expect(shell).toHaveAttribute("data-signed-in", "true");
  await expect(shell).toHaveAttribute("data-rail-collapsed", "true");
  await expect(shell).toHaveAttribute("data-aux-collapsed", "true");
  await expect(rail).toBeHidden();
  await expect(aux).toBeHidden();

  // --- Re-open via the edge handles ---
  await railReopen.click();
  await expect(shell).toHaveAttribute("data-rail-collapsed", "false");
  await expect(rail).toBeVisible();

  await auxReopen.click();
  await expect(shell).toHaveAttribute("data-aux-collapsed", "false");
  await expect(aux).toBeVisible();
});
