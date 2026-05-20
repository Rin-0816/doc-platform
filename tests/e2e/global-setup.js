// global-setup.js — runs once before the Playwright suite.
//
// Initializes the DEDICATED E2E database (data/_e2e.sqlite3) so the schema and
// seed logins (admin/admin, editor/editor, viewer/viewer) exist before the
// webServer starts `serve`-ing it. This keeps the real data/doc_platform.sqlite3
// untouched.

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const PYTHON = process.env.PYTHON || "python";
const TEST_DB = "data/_e2e.sqlite3";

module.exports = async function globalSetup() {
  const repoRoot = path.resolve(__dirname, "..", "..");
  // shell:true lets Windows resolve "python" via PATH / the App Execution Alias
  // (spawnSync with shell:false fails with ENOENT for PATH-resolved executables on Windows).
  const result = spawnSync(PYTHON, ["manage.py", "--database", TEST_DB, "init-db"], {
    cwd: repoRoot,
    stdio: "inherit",
    shell: true,
  });

  if (result.error) {
    throw new Error(`Failed to launch "${PYTHON} manage.py init-db": ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`"${PYTHON} manage.py init-db" exited with code ${result.status}`);
  }
};
