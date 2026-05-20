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
