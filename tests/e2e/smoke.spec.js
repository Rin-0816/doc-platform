// smoke.spec.js — home loads and admin login works.

const { test, expect } = require("@playwright/test");
const { loginViaUi } = require("./helpers");

test.describe("smoke", () => {
  test("home page loads with the localized app title", async ({ page }) => {
    await page.goto("/");
    // i18n.js sets document.title from the active language; the ja-JP locale
    // configured in playwright.config.js boots the app in Japanese.
    await expect(page).toHaveTitle(/文書管理/);
    await expect(page.locator(".app-shell")).toBeVisible();
    await expect(page.locator('[data-action="open-login"]')).toBeVisible();
  });

  test("admin can sign in and the avatar appears", async ({ page }) => {
    await page.goto("/");
    await loginViaUi(page, "admin");
    await expect(page.locator('.app-shell[data-signed-in="true"]')).toBeVisible();
    await expect(page.locator('[data-action="toggle-avatar-menu"]')).toBeVisible();
  });
});
