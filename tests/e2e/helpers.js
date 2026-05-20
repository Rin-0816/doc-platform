// helpers.js — shared E2E utilities (UI login + same-origin API setup).
//
// Specs stay ISOLATED: each test mints unique names via uniqueName() and creates
// its own data, so order/parallelism does not matter.

const { expect } = require("@playwright/test");

const CREDENTIALS = {
  admin: { username: "admin", password: "admin" },
  editor: { username: "editor", password: "editor" },
  viewer: { username: "viewer", password: "viewer" },
};

// A name guaranteed unique within a run (timestamp + random suffix).
function uniqueName(prefix = "e2e") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

// Sign in through the real login modal and wait for the signed-in shell state.
async function loginViaUi(page, role = "admin") {
  const creds = CREDENTIALS[role];
  if (!creds) throw new Error(`Unknown role: ${role}`);

  await page.locator('[data-action="open-login"]').click();
  await page.locator("#login-username").fill(creds.username);
  await page.locator("#login-password").fill(creds.password);
  await page.locator("#login-password").press("Enter");

  await expect(page.locator('.app-shell[data-signed-in="true"]')).toBeVisible();
  await expect(page.locator('[data-action="toggle-avatar-menu"]')).toBeVisible();
}

// Authenticate the browser context against the same-origin REST API so subsequent
// page.request calls carry the session cookie. Returns nothing; cookies persist on
// the context shared with `page`.
async function loginViaApi(page, role = "admin") {
  const creds = CREDENTIALS[role];
  if (!creds) throw new Error(`Unknown role: ${role}`);
  const response = await page.request.post("/api/auth/login", { data: creds });
  expect(response.ok(), `login as ${role} failed: ${response.status()}`).toBeTruthy();
  return response.json();
}

// Create a document via the API. Pass slug:"" to exercise server-side auto-derive.
async function createDocumentViaApi(page, { title, slug, content_markdown = "" }) {
  const data = { title, content_markdown };
  if (slug !== undefined) data.slug = slug;
  const response = await page.request.post("/api/documents", { data });
  expect(response.ok(), `create document failed: ${response.status()}`).toBeTruthy();
  const payload = await response.json();
  return payload.document || payload;
}

// Update a document (creates a new revision).
async function updateDocumentViaApi(page, id, patch) {
  const response = await page.request.put(`/api/documents/${id}`, { data: patch });
  expect(response.ok(), `update document failed: ${response.status()}`).toBeTruthy();
  const payload = await response.json();
  return payload.document || payload;
}

async function createCategoryViaApi(page, name) {
  const response = await page.request.post("/api/categories", { data: { name } });
  expect(response.ok(), `create category failed: ${response.status()}`).toBeTruthy();
  return response.json();
}

module.exports = {
  CREDENTIALS,
  uniqueName,
  loginViaUi,
  loginViaApi,
  createDocumentViaApi,
  updateDocumentViaApi,
  createCategoryViaApi,
};
