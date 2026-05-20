// playwright.config.js — Dev-time E2E harness for doc-platform.
//
// The app is a no-build Python stdlib + vanilla-JS project. This config does NOT
// build anything; it boots the existing `python manage.py serve` against a
// DEDICATED test database (data/_e2e.sqlite3) so real data is never touched.
//
// globalSetup runs `init-db` against that DB so the schema/seed users exist before
// the webServer starts serving. The webServer then `serve`s it on port 8799.

const { defineConfig, devices } = require("@playwright/test");

const PORT = 8799;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const PYTHON = process.env.PYTHON || "python";
const TEST_DB = "data/_e2e.sqlite3";

module.exports = defineConfig({
  testDir: "tests/e2e",
  globalSetup: require.resolve("./tests/e2e/global-setup.js"),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // Boot the SPA in Japanese so the document title resolves to "文書管理"
    // regardless of the host machine's locale. The app reads navigator.language
    // when no language is stored in localStorage.
    locale: "ja-JP",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], locale: "ja-JP" },
    },
  ],

  webServer: {
    command: `${PYTHON} manage.py --database ${TEST_DB} serve --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
  },
});
