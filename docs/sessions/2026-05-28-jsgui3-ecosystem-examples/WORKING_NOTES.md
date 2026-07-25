# Working Notes

Date: 2026-05-28
Track: jsgui3-ecosystem-examples

## Commands Run

- `git status --short --branch` in `jsgui3-ecosystem`
- `git log --oneline --decorate --max-count=30 --all` in `jsgui3-ecosystem`
- `rg --files` and `find` for ecosystem docs/examples/tests
- `rg -n "example|demo|tutorial|smoke|jsgui3-|npm run|node "` across ecosystem docs
- `find` for example/doc/test surfaces in sibling repos
- `node -e` package metadata reads for sibling repos
- `git log --oneline` for example/test/doc paths in sibling repos
- `git status --short --branch` in `jsgui3-html` and `jsgui3-server`
- `npm test` in `jsgui3-ecosystem`
- `npm run docs:check` in `jsgui3-ecosystem`
- `npm run docs:viewer:check` in `jsgui3-ecosystem`
- `npm run smoke:examples` in `jsgui3-ecosystem`
- `npm run smoke:examples:startup` in `jsgui3-ecosystem`
- `npm run examples:list` in `jsgui3-ecosystem`
- `npm run examples:scan` in `jsgui3-ecosystem`
- `npm run examples:scan:summary` in `jsgui3-ecosystem`
- `npm run smoke:examples:summary` in `jsgui3-ecosystem`
- `rg -n "DocAppControl|documentation viewer|component source|example source|activated|gallery|Code_Editor|Markdown_Viewer"` across referenced sibling repos
- Direct bounded starts for `jsgui3-modern-examples/serve-site-multipage/server.js` and `plain-control-document/server.js` with and without `PORT=0`
- `timeout 300 node tests/smoke.test.js` in `jsgui3-modern-examples`
- `npm run smoke` in `jsgui3-simple-example`
- `node --check scripts/example_smoke.js`
- `node --check tests/example_smoke.test.js`
- `git diff --check`
- `git status --short --branch` in `jsgui3-server` after the recursive prompt update
- `rg -n "[ \t]+$" AGENTS.md README.md package.json scripts tests docs/examples docs/sessions/2026-05-28-jsgui3-ecosystem-examples docs/README.md docs/ai/AGENT.md`
- `sed` reads for `jsgui3-server/AGENTS.md`, `server.js`, `serve-factory.js`, `examples/html-server.js`, `examples/jsgui3-html/01) mvvm-counter/server.js`, `tests/serve.test.js`, `tests/serve-site.test.js`, `controls/site-page-composer.js`, and `docs/guides/JSGUI3_UI_ARCHITECTURE_GUIDE.md`
- `git status --short --branch` in `jsgui3-server` during the docs-viewer shell pass
- Created `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md`
- `git status --short --branch` in `jsgui3-server` on 2026-05-29 for owner readiness recheck
- `node --check scripts/example_smoke.js`
- `node --check tests/example_smoke.test.js`
- `npm test`
- `npm run docs:check`
- `npm run docs:viewer:check`
- `npm run smoke:examples`
- `npm run smoke:examples:summary`
- `npm run examples:scan:summary`
- `rg -n "[ \t]+$" AGENTS.md scripts/example_smoke.js tests/example_smoke.test.js docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/WORKING_NOTES.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md`
- `git diff --check`
- `sed` reads for `AGENTS.md`, `README.md`, `package.json`, `docs/examples/INDEX.md`, `docs/examples/examples_manifest.json`, `docs/examples/DOCS_VIEWER_SPEC.md`, `docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md`, `docs/examples/docs_viewer_inventory.json`, `docs/examples/docs_viewer_shell_contract.json`, `scripts/example_smoke.js`, `tests/example_smoke.test.js`, and active session files on 2026-06-03
- `git status --short --branch` in `jsgui3-ecosystem`, `jsgui3-server`, and `jsgui3-html` on 2026-06-03
- `rg -n "DocAppControl|Code_Editor|Markdown_Viewer|source[-_ ]view|gallery|activation|activated"` in `jsgui3-server` and `jsgui3-html`
- `sed` reads for `jsgui3-html` `Code_Editor.js`, `Markdown_Viewer.js`, `test/e2e/gallery_server.js`, `docs/control-design-book/09-platform-advancement.md`, and `jsgui3-server/docs/guides/JSGUI3_UI_ARCHITECTURE_GUIDE.md`
- `find` and `node` inventory checks for docs-viewer README/source path availability
- `node --check scripts/example_smoke.js`
- `node --check tests/example_smoke.test.js`
- `npm run docs:viewer:check`
- `sed` reads for source-of-truth files during the 2026-06-04 manifest-quality continuation turn
- `node` reads for `docs/examples/*.json` manifest, inventory, and contract summaries
- `git status --short --branch` in `jsgui3-ecosystem`, `jsgui3-server`, `jsgui3-webpage`, and `jsgui3-website`
- `node --check scripts/example_smoke.js`
- `node --check tests/example_smoke.test.js`
- `npm test`
- `npm run docs:check`
- `npm run docs:viewer:check`
- `npm run smoke:examples`
- `npm run smoke:examples:summary`
- `npm run examples:scan:summary`
- `rg -n "[ \t]+$" AGENTS.md README.md package.json scripts/example_smoke.js tests/example_smoke.test.js docs/examples/INDEX.md docs/examples/DOCS_VIEWER_SPEC.md docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md docs/examples/OWNERSHIP_STATUS.md docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md docs/examples/docs_viewer_inventory.json docs/examples/docs_viewer_shell_contract.json docs/examples/webpage_website_served_example_contract.json docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/WORKING_NOTES.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md`
- `git diff --check`
- `ps -ef | rg "docs-viewer|examples/docs-viewer|webpage-website|example_smoke|jsgui3-server" | rg -v "rg|bash -lc"`
- Added `/api/docs-viewer/status` in `jsgui3-server/examples/docs-viewer/docs-viewer-shell.js`
- Extended `jsgui3-server/tests/docs-viewer-shell.test.js` to assert the status route returns inventory status, entry/deferred counts, smoke status counts, routes, source kinds, and missing refs.
- Extended `scripts/example_smoke.js` and `tests/example_smoke.test.js` so `npm run docs:viewer:check` requires the status route and required owner test coverage.
- `npm test`
- `npm run docs:check`
- `npm run docs:viewer:check`
- `npm run smoke:examples`
- `npm run smoke:examples:summary`
- `npm run examples:scan:summary`
- `rg -n "[ \t]+$" AGENTS.md README.md package.json scripts/example_smoke.js tests/example_smoke.test.js docs/examples/INDEX.md docs/examples/DOCS_VIEWER_SPEC.md docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md docs/examples/OWNERSHIP_STATUS.md docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md docs/examples/docs_viewer_inventory.json docs/examples/docs_viewer_shell_contract.json docs/examples/webpage_website_served_example_contract.json docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/WORKING_NOTES.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md`
- `git diff --check`
- `git status --short --branch`
- `git status --short --branch` in `jsgui3-ecosystem`, `jsgui3-server`, `jsgui3-html`, `jsgui3-webpage`, and `jsgui3-website` during the owner-shell implementation turn on 2026-06-04
- Added `examples/docs-viewer/server.js`, `examples/docs-viewer/docs-viewer-shell.js`, `examples/docs-viewer/client.js`, `examples/docs-viewer/controls/Docs_Viewer_App.js`, and `tests/docs-viewer-shell.test.js` in `jsgui3-server`
- Registered `docs-viewer-shell.test.js` in `jsgui3-server/tests/test-runner.js`
- `node --check examples/docs-viewer/server.js` in `jsgui3-server`
- `node --check examples/docs-viewer/docs-viewer-shell.js` in `jsgui3-server`
- `node --check examples/docs-viewer/client.js` in `jsgui3-server`
- `node --check examples/docs-viewer/controls/Docs_Viewer_App.js` in `jsgui3-server`
- `node --check tests/docs-viewer-shell.test.js` in `jsgui3-server`
- `node tests/test-runner.js --test=docs-viewer-shell.test.js` in `jsgui3-server`
- `git diff --check` in `jsgui3-server`
- `rg -n "[ \t]+$" examples/docs-viewer tests/docs-viewer-shell.test.js tests/test-runner.js` in `jsgui3-server`
- `node --check scripts/example_smoke.js`
- `node --check tests/example_smoke.test.js`
- `npm test`
- `npm run docs:check`
- `npm run docs:viewer:check`
- `npm run smoke:examples`
- `npm run smoke:examples:summary`
- `npm run examples:scan:summary`
- `rg -n "[ \t]+$" AGENTS.md README.md package.json scripts/example_smoke.js tests/example_smoke.test.js docs/examples/INDEX.md docs/examples/DOCS_VIEWER_SPEC.md docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md docs/examples/OWNERSHIP_STATUS.md docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md docs/examples/docs_viewer_inventory.json docs/examples/docs_viewer_shell_contract.json docs/examples/webpage_website_served_example_contract.json docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/WORKING_NOTES.md docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md`
- `git diff --check`
- `ps -ef | rg "docs-viewer|examples/docs-viewer|webpage-website|example_smoke|jsgui3-server" | rg -v "rg|bash -lc"`
- `sed` reads for the required docs/examples viewer source-of-truth files during the owner-shell-or-deferred-wrapper continuation turn on 2026-06-03
- `git status --short --branch` in `jsgui3-ecosystem`, `jsgui3-server`, `jsgui3-html`, and `jsgui3-simple-example`
- `git rev-parse --show-toplevel` in `jsgui3-modern-examples`
- `node --check scripts/example_smoke.js`
- `node --check tests/example_smoke.test.js`
- `npm run docs:viewer:check`
- `sed` reads for docs-viewer source-of-truth files during the 2026-06-04 awaiting-owner-shell-readiness turn
- `git status --short --branch` in `jsgui3-server`, `jsgui3-webpage`, `jsgui3-website`, and `jsgui3-ecosystem`
- `node` reads for `webpage.composition-tests` and `website.resolved-model-tests` manifest entries
- Added `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md`
- Added `docs/examples/webpage_website_served_example_contract.json`
- `node --check scripts/example_smoke.js`
- `node --check tests/example_smoke.test.js`
- `npm run docs:viewer:check`
- Implemented `jsgui3-own-website` docs viewer Phase 1 on 2026-06-06: added `controls/Docs_Viewer_Shell.js`, `client.js`, `server.js`, `tests/docs-viewer.test.js`; changed `package.json` test script to `node --test "tests/**/*.test.js"` for Node 25.
- `node --check client.js server.js controls/Source_Code_Viewer.js controls/Docs_Viewer_Shell.js tests/docs-viewer.test.js` in `jsgui3-own-website` (all clean)
- `npm install` in `jsgui3-own-website` (0 vulnerabilities)
- `npm test` in `jsgui3-own-website` (2/2 passing)
- Flipped Phase 1 statuses in `docs/examples/own_website_docs_viewer_contract.json` to `implemented` and updated `owner_readiness`
- `node --check scripts/example_smoke.js`
- `npm run docs:viewer:check`
- `npm run docs:check`
- `npm test`
- `npm run smoke:examples:summary`
- `npm run examples:scan:summary`
- targeted whitespace scan of touched `jsgui3-own-website` files and the own-website contract (clean)
- `git diff --check` in `jsgui3-own-website` (only the pre-existing README.md trailing-whitespace edit, untouched)
- lingering-server scan (only unrelated persistent MCP servers; no docs-viewer/own-website servers left running)

## Sibling Repos Inspected

- `/mnt/c/Users/james/Documents/repos/jsgui3-html`
- `/mnt/c/Users/james/Documents/repos/jsgui3-client`
- `/mnt/c/Users/james/Documents/repos/jsgui3-server`
- `/mnt/c/Users/james/Documents/repos/jsgui3-gfx-core`
- `/mnt/c/Users/james/Documents/repos/jsgui3-webpage`
- `/mnt/c/Users/james/Documents/repos/jsgui3-website`
- `/mnt/c/Users/james/Documents/repos/jsgui3-designer`
- `/mnt/c/Users/james/Documents/repos/jsgui3-own-website`
- `/mnt/c/Users/james/Documents/repos/jsgui3-modern-examples`
- `/mnt/c/Users/james/Documents/repos/jsgui3-simple-example`

## Findings

- `jsgui3-ecosystem` had no root `AGENTS.md`, no `package.json`, and no local `examples/`, `demos/`, or `tests/` directory at session start.
- The ecosystem repo history is only the initial commit; example-related ecosystem work was in uncommitted docs, especially `docs/GETTING_STARTED_TUTORIAL.md` and `docs/DEVELOPMENT_WORKFLOW.md`.
- `jsgui3-html` contains broad example surfaces: `examples/`, `dev-examples/`, lab scripts, and E2E tests, with recent work around controls, visual checks, themes, and example health.
- `jsgui3-server` contains broad server examples and explicit tests for controls, windows, and `jsgui3-html` examples.
- `jsgui3-client` contains three window/control examples and Node/Puppeteer test scripts.
- `jsgui3-gfx-core` contains command-line graphics examples and `docs/EXAMPLES.md`.
- `jsgui3-webpage` and `jsgui3-website` have tests but no example directories.
- Added ecosystem guidance for `jsgui3-webpage` and `jsgui3-website` in `docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md`; current status remains test-backed reference, not a standalone runnable example.
- `jsgui3-designer` and `jsgui3-own-website` have docs/README surfaces but no runnable example directories found in the bounded scan.
- `jsgui3-modern-examples` is present locally with two examples and a smoke test, but it is not a git repo.
- Direct bounded starts in `jsgui3-modern-examples` initially timed out before the expected example readiness log. A longer direct start showed `plain-control-document` eventually prints ready after a long first-run bundle.
- `timeout 300 node tests/smoke.test.js` passed in `jsgui3-modern-examples` after about 4 minutes. The earlier ecosystem startup failure was the coordinator's 150s process timeout, not an example assertion failure.
- `jsgui3-simple-example` has a package smoke script, but `tests/smoke.test.js` was not present in the bounded scan. `npm run smoke` fails with `MODULE_NOT_FOUND`.
- `jsgui3-simple-example` has a dirty worktree, so this pass documents the owner-side fix path instead of editing that sibling repo.
- `/mnt/c/Users/james/Documents/repos/jsgui3` and `/mnt/c/Users/james/Documents/repos/jsgui3-controls` were not present locally.
- Documentation viewer requirements are now part of the near-term plan. Existing relevant sibling docs/code include `DocAppControl` in `jsgui3-server/docs/guides/JSGUI3_UI_ARCHITECTURE_GUIDE.md`, component-gallery guidance in `jsgui3-html/docs/control-design-book/09-platform-advancement.md`, live-control activation guidance in `jsgui3-designer/docs/books/design/ch03-the-jsgui3-control-system.md`, and source-capable controls such as `Code_Editor`/`Markdown_Viewer` in the `jsgui3-html` showcase/gallery material.
- The first docs-viewer implementation owner is `jsgui3-server`; `jsgui3-ecosystem` owns inventory/spec/checks, while `jsgui3-html` owns `Code_Editor`, `Markdown_Viewer`, and source-display controls.
- Webpage/Website stay out of the live docs-viewer inventory until a served example exists.
- The inspected `jsgui3-server` patterns are sufficient for a narrow shell: use `Server.serve({ pages, api })` or explicit route publication, raw GET API handlers via `server.publish(..., { raw: true, method: 'GET' })`, app-level controls following the `DocAppControl` guidance, and bounded local HTTP assertions like `tests/serve.test.js`.
- `jsgui3-server` is not safe to edit in this coordinator pass because its worktree has active changes in `.gitattributes`, `.gitignore`, `README.md`, `module.js`, `server.js`, `serve-factory.js`, bundler internals, website models, serve/client-activation tests, and untracked serve-site/client-activation fixtures.
- Added a checked shell contract instead of owner implementation: `docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md` and `docs/examples/docs_viewer_shell_contract.json`.
- `npm run docs:viewer:check` now validates both `docs_viewer_inventory.json` and `docs_viewer_shell_contract.json`.
- Added the first agent-generated continuation prompt at `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md`.
- Rechecked `jsgui3-server` on 2026-05-29 and confirmed it is still blocked for owner-side docs-viewer shell implementation; added `owner_readiness` to `docs/examples/docs_viewer_shell_contract.json`.
- Updated `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md` to include the owner-readiness gate and the requirement that future continuation prompts appear in chat output.
- The curated manifest now covers all server-hosted `jsgui3-html` examples 01 through 10.
- Upgraded `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md` to the explicit recursive state-machine format requested by the user, with planning-turn recovery, active/completed/pending nodes, a broad examples-reliability workload, final response state bundle, last turns, backlog, and horizon requirements.
- `npm run docs:check` now validates both the examples index and the active continuation prompt structure so future handoffs do not silently collapse back to a narrow docs-viewer-only prompt.
- Rechecked `jsgui3-server` after the recursive prompt update. It was dirty in core serving/test paths including `module.js`, `serve-factory.js`, `server.js`, bundler tests, `tests/test-runner.js`, website models, and untracked serve-site/client-activation files, so owner-side docs-viewer implementation remained blocked without explicit owner acceptance at that time.
- Rechecked `jsgui3-server` on 2026-06-03. It was dirty in core serving/test paths and related untracked files, so the first docs-viewer shell remained blocked unless the owner explicitly accepted the additive `examples/docs-viewer` change.
- Rechecked `jsgui3-html` on 2026-06-03. It has a large dirty worktree including controls, dev examples, docs, tests, and package metadata, so this pass treated it as read-only and used it only for source/control contract evidence.
- `Code_Editor` already supports `language`, `value`, `readonly`, and emits change events from a textarea; it is suitable as the read-only source display control for the viewer contract.
- `Markdown_Viewer` renders markdown as a jsgui control tree and exposes `set_markdown`; it is suitable as the docs/prose display control for the viewer contract.
- `jsgui3-html/test/e2e/gallery_server.js` provides a bounded reference for client bundling and activation via registered controls, `pre_activate`, and `activate`.
- `docs/examples/docs_viewer_inventory.json` now requires docs, owner repo, expected result, framework source, component source, example source, live route/activation, related tests, and smoke/status fields for each viewer-ready entry.
- `docs/examples/docs_viewer_shell_contract.json` now records the first runnable owner path: `jsgui3-server/examples/docs-viewer/server.js`, command `node examples/docs-viewer/server.js`, URL `/docs/examples`, and first entry `server.jsgui3-html-mvvm-counter`.
- The source API contract now covers `kind=docs`, `kind=framework`, `kind=component`, and `kind=example`; the previous `component|example` wording was too narrow for the updated inventory.
- Rechecked `jsgui3-server` again during the owner-shell-or-deferred-wrapper continuation turn on 2026-06-03. The same core serving/test worktree blocker remains, including `server.js`, `serve-factory.js`, `module.js`, bundler/test helper files, website models, and untracked `serve-site`/client-activation fixtures.
- Because there was no explicit owner acceptance and the owner worktree is still dirty, no `jsgui3-server/examples/docs-viewer` files were added in this turn.
- Tightened the docs-viewer rendering contract so entry pages must include docs and framework source slots in addition to live preview, component source, and example source.
- Tightened the shell contract checker so required owner-side tests must explicitly cover source API `kind=docs`, `kind=framework`, `kind=component`, and `kind=example`.
- Rechecked `jsgui3-server` on 2026-06-04. The same core serving/test blocker remains, so the docs-viewer owner shell was not implemented.
- Rechecked `jsgui3-webpage` and `jsgui3-website` on 2026-06-04. Both have active model/test worktree changes, so the Webpage/Website served example remains contract-only.
- Added a checked Webpage/Website served-example contract with the future owner files, routes, required features, owner tests, and docs-viewer promotion gate.
- `npm run docs:viewer:check` now validates `docs_viewer_inventory.json`, `docs_viewer_shell_contract.json`, and `webpage_website_served_example_contract.json`.
- The 2026-06-04 contract addition exposed a stale single-entry unit-test fixture for docs-viewer inventory checks; the tests now use a multi-entry manifest when the inventory fixture includes deferred Webpage/Website ids.
- Rechecked `jsgui3-server`, `jsgui3-webpage`, and `jsgui3-website` again during the 2026-06-04 manifest-quality continuation. All were dirty in the same owner implementation/model areas at that time, so no sibling repo was edited.
- Added `check_manifest_quality` to `scripts/example_smoke.js` and wired it into `npm run docs:check`.
- `npm run docs:check` now validates manifest schema/version metadata, duplicate ids, required fields, documented categories and complexity values, boolean server/browser flags, owner-relative entry/test paths, package arrays, and smoke metadata shape before checking index drift and continuation prompt structure.
- Rechecked `jsgui3-server` again later on 2026-06-04. It was clean before the additive docs-viewer shell was added.
- Added the first owner-side docs-viewer shell in `jsgui3-server/examples/docs-viewer`. It registers checked `/docs/examples` pages plus `/api/docs-viewer/inventory` and `/api/docs-viewer/source` routes.
- The owner source route handles `kind=docs`, `kind=framework`, `kind=component`, and `kind=example`; unknown manifest ids and missing source files return explicit 404 responses.
- Added owner route/source tests in `jsgui3-server/tests/docs-viewer-shell.test.js`; the focused owner test passed.
- Added the bounded `/api/docs-viewer/status` route to the owner shell. It is read-only, inventory-derived, and reports missing declared docs/source/test refs without launching examples.
- The docs-viewer shell contract now treats `/api/docs-viewer/status` as a required route and requires owner-side test coverage for it.
- Rechecked `jsgui3-html`; it was clean during this turn.
- Rechecked `jsgui3-webpage` and `jsgui3-website`; both still have active model/test worktree changes, so the served Webpage/Website example remains deferred and no model-owner repo was edited.

## Blockers And Cautions

- `jsgui3-server` was clean on the later 2026-06-04 recheck and now contains only the additive docs-viewer shell changes made in this turn.
- The docs-viewer shell readiness gate is now machine-readable in `docs/examples/docs_viewer_shell_contract.json` and records the shell as implemented.
- Older 2026-06-03 and earlier 2026-06-04 `jsgui3-server` dirty snapshots remain historical evidence only; they should not be treated as the current blocker for the first docs-viewer shell.
- The Webpage/Website served-example path is still blocked by dirty `jsgui3-webpage` and `jsgui3-website` model/test worktrees.
- `jsgui3-designer` has a placeholder failing `npm test`; ecosystem smoke should not treat it as a ready example.
- Browser-level smoke should remain optional until a bounded, stable cross-repo harness is agreed.
- `npm run smoke:examples:startup` previously failed in the `modern.plain-control-document` startup path because the coordinator timeout was 150s. The manifest now sets `startup_timeout_ms: 360000` for that shared modern smoke command.
- Startup smoke output included `jsgui3-html` deprecation warnings for `FormField`/`PropertyEditor` aliases and many esbuild case-sensitive path warnings. These belong to sibling repos and were not changed in this pass.
- Whole-repo `git diff --check` fails on pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues. Touched files passed the targeted trailing-whitespace scan.

## Verification Results

- PASS: `npm test` (14 node-test checks)
- PASS: `npm run docs:check` (examples index plus recursive continuation prompt structure)
- PASS: `npm run docs:viewer:check`
- PASS: `npm run smoke:examples` (35 manifest entries)
- PASS: `npm run smoke:examples:summary`
- PASS: `npm run smoke:examples:startup` (3:45.83 after per-entry timeout)
- PASS: `npm run examples:list` (35 manifest entries)
- PASS: `npm run examples:scan`
- PASS: `npm run examples:scan:summary`
- PASS: `node --check scripts/example_smoke.js`
- PASS: `node --check tests/example_smoke.test.js`
- PASS: Targeted trailing-whitespace scan for touched files.
- PASS: `timeout 300 node tests/smoke.test.js` in `jsgui3-modern-examples`
- NOT RERUN: `npm run smoke:examples:startup` after the owner-readiness contract update because no startup command, timeout, or sibling startup behavior changed in this pass.
- FAIL: `npm run smoke` in `jsgui3-simple-example` due missing `tests/smoke.test.js`.
- FAIL: `git diff --check` due pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues.
- PASS on 2026-06-03: `node --check scripts/example_smoke.js`
- PASS on 2026-06-03: `node --check tests/example_smoke.test.js`
- PASS on 2026-06-03: `npm test` (18 node-test checks)
- PASS on 2026-06-03: `npm run docs:check`
- PASS on 2026-06-03: `npm run docs:viewer:check`
- PASS on 2026-06-03: `npm run smoke:examples` (35 manifest entries)
- PASS on 2026-06-03: `npm run smoke:examples:summary`
- PASS on 2026-06-03: `npm run examples:scan:summary`
- PASS on 2026-06-03: `npm run examples:list`
- PASS on 2026-06-03: Targeted trailing-whitespace scan for touched files returned no matches.
- NOT RERUN on 2026-06-03: `npm run smoke:examples:startup` because no startup command, timeout, or sibling startup behavior changed in this pass.
- FAIL on 2026-06-03: `git diff --check` due pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues; touched files passed targeted scan.
- PASS on 2026-06-03 owner-shell continuation: `node --check scripts/example_smoke.js`
- PASS on 2026-06-03 owner-shell continuation: `node --check tests/example_smoke.test.js`
- PASS on 2026-06-03 owner-shell continuation: `npm test` (19 node-test checks)
- PASS on 2026-06-03 owner-shell continuation: `npm run docs:check`
- PASS on 2026-06-03 owner-shell continuation: `npm run docs:viewer:check`
- PASS on 2026-06-03 owner-shell continuation: `npm run smoke:examples` (35 manifest entries)
- PASS on 2026-06-03 owner-shell continuation: `npm run smoke:examples:summary`
- PASS on 2026-06-03 owner-shell continuation: `npm run examples:scan:summary`
- PASS on 2026-06-03 owner-shell continuation: targeted trailing-whitespace scan for touched files returned no matches.
- PASS on 2026-06-03 owner-shell continuation: no lingering docs-viewer/example server processes found.
- NOT RERUN on 2026-06-03 owner-shell continuation: `npm run smoke:examples:startup` because no startup command, timeout, or sibling startup behavior changed.
- FAIL on 2026-06-03 owner-shell continuation: `git diff --check` due pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues; touched files passed targeted scan.
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `node --check scripts/example_smoke.js`
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `node --check tests/example_smoke.test.js`
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `npm test` (22 node-test checks)
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `npm run docs:check`
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `npm run docs:viewer:check`
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `npm run smoke:examples` (35 manifest entries)
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `npm run smoke:examples:summary` (all owners pass)
- PASS on 2026-06-04 awaiting-owner-shell-readiness: `npm run examples:scan:summary`
- PASS on 2026-06-04 awaiting-owner-shell-readiness: targeted trailing-whitespace scan for touched files returned no matches.
- FAIL on 2026-06-04 awaiting-owner-shell-readiness: `git diff --check` due pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues; touched files passed targeted scan.
- PASS on 2026-06-04 manifest-quality continuation: `node --check scripts/example_smoke.js`
- PASS on 2026-06-04 manifest-quality continuation: `node --check tests/example_smoke.test.js`
- PASS on 2026-06-04 manifest-quality continuation: `npm test` (25 node-test checks)
- PASS on 2026-06-04 manifest-quality continuation: `npm run docs:check` (manifest quality, examples index, and recursive continuation prompt structure)
- PASS on 2026-06-04 manifest-quality continuation: `npm run docs:viewer:check`
- PASS on 2026-06-04 manifest-quality continuation: `npm run smoke:examples` (35 manifest entries)
- PASS on 2026-06-04 manifest-quality continuation: `npm run smoke:examples:summary` (all owners pass)
- PASS on 2026-06-04 manifest-quality continuation: `npm run examples:scan:summary`
- PASS on 2026-06-04 manifest-quality continuation: targeted trailing-whitespace scan for touched files returned no matches.
- PASS on 2026-06-04 manifest-quality continuation: no lingering docs-viewer/example server processes found.
- FAIL on 2026-06-04 manifest-quality continuation: `git diff --check` due pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues; touched files passed targeted scan.
- PASS on 2026-06-04 owner-shell implementation: `node --check examples/docs-viewer/server.js` in `jsgui3-server`
- PASS on 2026-06-04 owner-shell implementation: `node --check examples/docs-viewer/docs-viewer-shell.js` in `jsgui3-server`
- PASS on 2026-06-04 owner-shell implementation: `node --check examples/docs-viewer/client.js` in `jsgui3-server`
- PASS on 2026-06-04 owner-shell implementation: `node --check examples/docs-viewer/controls/Docs_Viewer_App.js` in `jsgui3-server`
- PASS on 2026-06-04 owner-shell implementation: `node --check tests/docs-viewer-shell.test.js` in `jsgui3-server`
- PASS on 2026-06-04 owner-shell implementation: `node tests/test-runner.js --test=docs-viewer-shell.test.js` in `jsgui3-server` (1 suite, 1 passing; expected `jsgui3-html` deprecation warnings were printed)
- PASS on 2026-06-04 owner-shell implementation: targeted owner whitespace scan returned no matches.
- PASS on 2026-06-04 owner-shell implementation: `git diff --check` in `jsgui3-server` returned success with a line-ending warning for `tests/test-runner.js`.
- PASS on 2026-06-04 owner-shell implementation: `node --check scripts/example_smoke.js`
- PASS on 2026-06-04 owner-shell implementation: `node --check tests/example_smoke.test.js`
- PASS on 2026-06-04 owner-shell implementation: `npm test` (25 node-test checks)
- PASS on 2026-06-04 owner-shell implementation: `npm run docs:check`
- PASS on 2026-06-04 owner-shell implementation: `npm run docs:viewer:check`
- PASS on 2026-06-04 owner-shell implementation: `npm run smoke:examples` (35 manifest entries)
- PASS on 2026-06-04 owner-shell implementation: `npm run smoke:examples:summary` (all owners pass)
- PASS on 2026-06-04 owner-shell implementation: `npm run examples:scan:summary`
- PASS on 2026-06-04 owner-shell implementation: targeted coordinator trailing-whitespace scan returned no matches.
- PASS on 2026-06-04 owner-shell implementation: no lingering docs-viewer/example server processes found.
- FAIL on 2026-06-04 owner-shell implementation: `git diff --check` in `jsgui3-ecosystem` due pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues; touched files passed targeted scan.
- PASS on status-route refinement: owner `node --check` for docs-viewer shell files and test.
- PASS on status-route refinement: `node tests/test-runner.js --test=docs-viewer-shell.test.js` in `jsgui3-server` (1 suite, 1 passing; expected `jsgui3-html` deprecation warnings were printed).
- PASS on status-route refinement: `node --check scripts/example_smoke.js`
- PASS on status-route refinement: `node --check tests/example_smoke.test.js`
- PASS on status-route refinement: `npm test` (26 node-test checks)
- PASS on status-route refinement: `npm run docs:check`
- PASS on status-route refinement: `npm run docs:viewer:check`
- PASS on status-route refinement: `npm run smoke:examples` (35 manifest entries)
- PASS on status-route refinement: `npm run smoke:examples:summary` (all owners pass)
- PASS on status-route refinement: `npm run examples:scan:summary`
- PASS on status-route refinement: targeted owner trailing-whitespace scan returned no matches.
- PASS on status-route refinement: `git diff --check` in `jsgui3-server` returned success with a line-ending warning for `tests/test-runner.js`.
- PASS on status-route refinement: targeted coordinator trailing-whitespace scan returned no matches.
- PASS on status-route refinement: no lingering docs-viewer/example server processes found.
- FAIL on status-route refinement: `git diff --check` in `jsgui3-ecosystem` due pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues; touched files passed targeted scan.

## 2026-06-06 Windows Cross-Platform Portability Turn

### Commands Run

- `git status --short --branch` in `jsgui3-ecosystem` (untracked scaffolding atop the initial commit) and in `jsgui3-server` (` M tests/test-runner.js`, `?? examples/docs-viewer/`, `?? tests/docs-viewer-shell.test.js`).
- Baseline ladder on Windows PowerShell before edits: `npm test` (26 tests, 5 FAIL), `npm run smoke:examples` (32 PASS, 3 FAIL).
- `node --check scripts/example_smoke.js`, `node --check tests/example_smoke.test.js`.
- `npm test`, `npm run docs:check`, `npm run docs:viewer:check`, `npm run smoke:examples`, `npm run smoke:examples:summary`, `npm run examples:scan:summary`, `git diff --check` after edits.
- Targeted trailing-whitespace scan (`Select-String '[ \t]+$'`) for `scripts/example_smoke.js` and `tests/example_smoke.test.js`.
- Lingering-server check via `Get-CimInstance Win32_Process` for `docs-viewer|example_smoke|webpage-website`.

### Findings

- Root cause of both baseline failures was POSIX-only assumptions that were masked when prior turns ran under WSL (`/mnt/c/...`, forward slashes, plain `npm` binary):
  1. The `docs_viewer_shell_contract()` unit fixture set `inventory_source` via `path.join(...)`, which yields backslashes on Windows. The checker compared it against a forward-slash-normalized path, so all five docs-viewer shell-contract tests failed with `docs_viewer_contract_inventory_drift`. The real `docs/examples/docs_viewer_shell_contract.json` uses forward slashes, so `npm run docs:viewer:check` still passed; only the unit fixtures were affected.
  2. `command_available` used `spawnSync(executable, ['--version'], { shell: false })`. On Windows that throws `ENOENT` for `npm` (it is `npm.cmd`), so the three `npm`-based smoke entries (`simple.showcase`, `webpage.composition-tests`, `website.resolved-model-tests`) reported false `broken_command` failures.
- Fix 1: rewrote `command_available` to resolve the executable against `PATH` (with `PATHEXT` on Windows) without executing anything. This is cross-platform, locale-independent, faster, and safer; `node` is still short-circuited and genuinely missing tools still report `Executable not found`.
- Fix 2: made the docs-viewer shell contract `inventory_source` comparison path-separator tolerant by normalizing both sides before comparing.
- Fixed the unit fixture to use a forward-slash `inventory_source` (matching the real file convention) and added two regression tests: one asserting separator tolerance for `inventory_source`, one asserting `command_available` resolves `node`/`npm` and reports a clearly-missing tool.
- State note: all `jsgui3-ecosystem` coordinator content (AGENTS.md, README.md, docs/, package.json, scripts/, tests/) is still untracked on top of the single initial commit. Committing/pushing is deferred to explicit owner instruction.

### Verification Results

- PASS: `node --check scripts/example_smoke.js`
- PASS: `node --check tests/example_smoke.test.js`
- PASS: `npm test` (28 node-test checks; was 26 with 5 failing before the fix)
- PASS: `npm run docs:check`
- PASS: `npm run docs:viewer:check`
- PASS: `npm run smoke:examples` (35 manifest entries; was 32/35 before the fix)
- PASS: `npm run smoke:examples:summary` (all owners pass)
- PASS: `npm run examples:scan:summary`
- PASS: `git diff --check` (clean on Windows; coordinator scaffolding is still untracked)
- PASS: targeted trailing-whitespace scan for `scripts/example_smoke.js` and `tests/example_smoke.test.js` returned no matches.
- PASS: no lingering docs-viewer/example server processes found.
- NOT RERUN: `npm run smoke:examples:startup` because no startup command, timeout, or sibling startup behavior changed in this pass.

## 2026-06-06 Extensive Docs Viewer Track (jsgui3-own-website)

### Commands Run

- `git status --short --branch` and `git log --oneline -5` in `../jsgui3-own-website` (`## main...origin/main`, only ` M README.md`, single initial commit).
- Inspected real control patterns: `jsgui3-html` `Code_Editor.js`, `Markdown_Viewer.js`, `controls/controls.js` exports; `jsgui3-server` `examples/jsgui3-html/01) mvvm-counter/{server,client}.js`, `examples/docs-viewer/{controls/Docs_Viewer_App,client}.js`; `jsgui3-html/test/e2e/gallery_server.js`; `jsgui3-simple-example/{client.js,server.js,package.json}`.
- Confirmed downstream require pattern: controls `require('jsgui3-client')` for `Control`/`controls`/`Data_Object`; server entry requires `jsgui3-server/controls/Active_HTML_Document`.
- `node --check controls/Source_Code_Viewer.js` in `jsgui3-own-website`.
- `node --check scripts/example_smoke.js`, `node --check tests/example_smoke.test.js`, `npm run docs:viewer:check`, `npm test` in `jsgui3-ecosystem`.

### Findings And Decisions

- The existing `jsgui3-server/examples/docs-viewer` shell is a string-based, contract-only minimal shell with no real control activation. The user wants the extensive, impressive viewer built as a real jsgui3 website.
- Decision: the extensive user-facing docs viewer is owned by `jsgui3-own-website`. New presentation controls are built there; reusable framework controls (`Code_Editor`, `Markdown_Viewer`, `Tabbed_Panel`, `Tree_View`) are required from `jsgui3-html`; serving is from `jsgui3-server`; spec/contract/inventory/checks stay in `jsgui3-ecosystem`.
- `jsgui3-own-website` was a near-empty clean repo (`.git`, `.gitignore`, `README.md`) with only a pre-existing README edit, so additive scaffolding was safe. README.md was not touched.
- Seeded the canonical new control `controls/Source_Code_Viewer.js` following the `Code_Editor` lifecycle exactly: SSR `compose()` guarded by `if (!spec.el)`, client `activate()` guarded by `if (this.__active) return`, escaped source via `.add()`, guarded `navigator.clipboard`, static `.css`, `Camel_Case` class + `snake_case` methods.
- Added owner-side `AGENTS.md` (conventions + SSR/activation model, explicitly not hydration, with the canonical lifecycle and exact require paths) and `IMPLEMENTATION_PLAN.md` (5 phases with code skeletons for `client.js`, `server.js`, `Docs_Viewer_Shell`, source-reading helper, and acceptance per phase).
- Added coordinator spec `docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md` and machine-checked contract `docs/examples/own_website_docs_viewer_contract.json` (owner, rendering model, new/reused controls, files with phase status, routes, render panes, source kinds, phases, required tests, owner readiness, validation commands).
- Added `check_own_website_docs_viewer_contract` to `scripts/example_smoke.js`, wired into `npm run docs:viewer:check`. The checker enforces: activation-not-hydration wording, the four source kinds, the eleven render panes, the eight routes, presence of `Source_Code_Viewer`, required owner files, that any `seeded`/`implemented` file actually exists on disk, required-test assertions covering activation and a failure panel, owner readiness shape, and validation commands.
- Added 5 unit tests for the new checker (valid pass, missing route, hydration rejection, missing Source_Code_Viewer, missing seeded file).

### Verification Results

- PASS: `node --check controls/Source_Code_Viewer.js` in `jsgui3-own-website`.
- PASS: `node --check scripts/example_smoke.js`, `node --check tests/example_smoke.test.js`.
- PASS: `npm test` (33 node-test checks; was 28).
- PASS: `npm run docs:viewer:check` (now includes the extensive own-website contract).
- Remaining ladder (docs:check, smoke, scan, whitespace, git diff --check, lingering servers) run after doc updates.

## Files Added Or Updated

- `AGENTS.md`
- `README.md`
- `package.json`
- `scripts/example_smoke.js`
- `tests/example_smoke.test.js`
- `docs/README.md`
- `docs/ai/AGENT.md`
- `docs/examples/INDEX.md`
- `docs/examples/DOCS_VIEWER_SPEC.md`
- `docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md`
- `docs/examples/OWNERSHIP_STATUS.md`
- `docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md`
- `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md`
- `docs/examples/docs_viewer_inventory.json`
- `docs/examples/docs_viewer_shell_contract.json`
- `docs/examples/examples_manifest.json`
- `docs/examples/webpage_website_served_example_contract.json`
- `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md`
- `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md`
- `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/WORKING_NOTES.md`
- `../jsgui3-server/examples/docs-viewer/server.js`
- `../jsgui3-server/examples/docs-viewer/docs-viewer-shell.js`
- `../jsgui3-server/examples/docs-viewer/client.js`
- `../jsgui3-server/examples/docs-viewer/controls/Docs_Viewer_App.js`
- `../jsgui3-server/tests/docs-viewer-shell.test.js`
- `../jsgui3-server/tests/test-runner.js`
- `docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md`
- `docs/examples/own_website_docs_viewer_contract.json`
- `../jsgui3-own-website/AGENTS.md`
- `../jsgui3-own-website/IMPLEMENTATION_PLAN.md`
- `../jsgui3-own-website/package.json`
- `../jsgui3-own-website/controls/Source_Code_Viewer.js`

## 2026-07-11 Canonicalization, Status Reconciliation, And Viewer Phase 2

### Coordination Structure

- Designated `jsgui3-ecosystem` as the canonical coordination repository and
  documented `coordination-jsgui-ecosystem.code-workspace` as the local
  multi-root workspace shell.
- Added `docs/COORDINATION_STATUS.md`, refreshed `REPOS.md`,
  `DEPENDENCY_MAP.md`, and `ROADMAP.md`, added `oext` to the outer workspace,
  and classified tracked examples/support and the non-git modern incubator.
- Corrected the ownership drift: `jsgui3-website` owns the abstract site model;
  `jsgui3-own-website` owns the public documentation site.

### Parked Minimal Server Shell

- Confirmed current `jsgui3-server` master is clean and contains none of the
  declared `examples/docs-viewer` or focused test paths.
- Located the implementation in `stash@{0}` and test-runner registration in
  `stash@{1}`. No branch, tag, or remote ref contains the paths. Both stored
  patches pass `git apply --check` against current master.
- Recorded the exact state as `implemented_in_local_stash`, with working-tree,
  committed, and remote presence all false. Preserved both stashes.
- Added implementation-file statuses to the minimal shell contract and a
  regression check: files marked `implemented` must exist in the owner checkout;
  `parked` files remain honest without creating a false positive.

### Extensive Viewer Phase 2

- Added `jsgui3-own-website/controls/Source_Browser.js`, reusing the framework
  `Tree_View` instead of forking it.
- Registered the control in `client.js` and integrated it into
  `Docs_Viewer_Shell` with SSR-safe navigation and source display.
- Added constrained registry parsing for real `jsgui3-html` control source,
  `GET /controls/:control_name`, and
  `GET /api/docs/control-source?name=<Control_Name>`.
- Added explicit unknown-control/failure responses and rejected arbitrary
  filesystem-like names.
- Updated `Source_Code_Viewer` activation to reconstruct its value from the
  server-rendered code element, so copy uses the real SSR source.
- Fixed the owner `npm test` script to use the cross-platform
  `node --test tests/*.test.js` form.

### Verification

- PASS: all touched `jsgui3-own-website` JavaScript via `node --check`.
- PASS: `npm test` in `jsgui3-own-website` (3/3 tests).
- PASS: coordinator `npm test` after the contract regression addition (34/34).
- PASS: `npm run docs:viewer:check` after recording the parked minimal shell.
- PASS: no lingering viewer/test server processes.
- No install, git mutation, commit, or push was performed.

## 2026-07-11 Extensive Viewer Phase 3

- Added `Example_Preview_Frame` and registered it for client activation.
- Added `GET /examples`, `GET /examples/:manifest_id`, and the inventory,
  constrained source, and status APIs.
- Rendered docs, preview/readiness, framework/component/example source,
  ownership, run-command, smoke-status, related-test, and failure panes from the
  checked ecosystem inventory. Reused framework `Tabbed_Panel`,
  `Markdown_Viewer`, and `Tree_View` rather than forking them.
- Restricted inventory references to direct sibling repositories with lexical
  and realpath containment. Planned/blocked preview routes stay on
  `about:blank`; the viewer does not launch or proxy sibling examples.
- PASS: all touched owner JavaScript via `node --check`.
- PASS: `npm test` in `jsgui3-own-website` (5/5 real-server tests).
- PASS: full MVVM example SSR smoke, including preview, tabbed docs/source
  panes, and smoke metadata.
- PASS: coordinator `npm test` (35/35), `npm run docs:check`,
  `npm run docs:viewer:check`, `npm run smoke:examples:summary` (all owners),
  and `npm run examples:scan:summary` after recording Phase 3.
- No install, commit, push, stash mutation, or sibling example launch was
  performed.
