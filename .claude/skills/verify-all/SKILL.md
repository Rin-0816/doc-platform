---
name: verify-all
description: Run the full doc-platform verification suite — backend unittests, plugin tests, JS syntax checks, and plugin compatibility. Use to confirm the project is green before reporting work done or committing.
---

# verify-all

`doc-platform` has no build step; verification IS this command sequence. Run each step from the repo root and report pass/fail per step. If any step fails, surface the error and stop — do not report success.

1. **Backend tests**
   ```
   python -m unittest discover -s tests
   ```

2. **Plugin scaffold tests**
   ```
   python -m unittest discover -s plugins/ict_learning/tests
   ```

3. **JS syntax check** — every frontend JS file (a no-build project has nothing else to catch syntax errors before the browser):
   - bash:
     ```
     for f in static/js/*.js plugins/ict_learning/frontend.js; do node --check "$f" || echo "FAIL: $f"; done
     ```
   - PowerShell:
     ```
     Get-ChildItem static/js/*.js, plugins/ict_learning/frontend.js | ForEach-Object { node --check $_.FullName }
     ```

4. **Plugin compatibility** — use a throwaway database so the real one is untouched, then clean it up:
   ```
   python manage.py --database data/_verify.sqlite3 check-plugins
   ```
   Then remove `data/_verify.sqlite3*`.

Expected green baseline: backend 61+ tests OK, plugin 5 tests OK, all JS `node --check` clean.

5. **End-to-end tests (optional)** — a dev-time Playwright (`@playwright/test`) harness lives at the repo root. It is additive tooling and does NOT change the no-build app. It boots `python manage.py serve` against a dedicated test DB (`data/_e2e.sqlite3`) on port 8799, so real data is untouched.
   First-time setup (run once):
   ```
   npm install
   npm run test:e2e:install   # downloads the Chromium browser
   ```
   Then run the suite (specs in `tests/e2e/`):
   ```
   npm run test:e2e
   ```
   Note: requires Node and the ability to download the Chromium browser. Skip this step if the environment blocks browser downloads.
