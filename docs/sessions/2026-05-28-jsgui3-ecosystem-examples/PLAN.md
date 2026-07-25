# jsgui3 Ecosystem Examples Plan

Date: 2026-05-28
Track: jsgui3-ecosystem-examples

## Goal

Make `jsgui3-ecosystem` the coordination point for discovering, launching, and verifying representative examples across the sibling jsgui3 repositories without moving implementation ownership out of those repos.

## Done

- Created this dated session folder because the ecosystem repo had no active examples plan.
- Audited recent example-related work in `jsgui3-ecosystem` and referenced sibling repos.
- Built a curated cross-repo example manifest at `docs/examples/examples_manifest.json`.
- Added `docs/examples/INDEX.md` with owner repo, category, complexity, purpose, run command, expected result, related source, and a learning path.
- Added `package.json` scripts for listing, scanning, smoke checks, startup smoke, docs checks, and tests.
- Added `scripts/example_smoke.js` for manifest-driven checks and bounded raw discovery.
- Added `tests/example_smoke.test.js` covering missing repo, missing example file, broken command, and docs/index drift.
- Added root `AGENTS.md` with ecosystem example workflow guidance.
- Linked the examples index from `README.md`, `docs/README.md`, and `docs/ai/AGENT.md`.
- Ran verification and recorded the optional startup smoke blocker.
- Added compact `npm run examples:scan:summary` and `npm run smoke:examples:summary` operator output with unit coverage.
- Expanded the curated manifest with server-hosted `jsgui3-html` examples 02, 04, 05, 06, 08, 09, and 10.
- Added `docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md` for current `jsgui3-webpage` and `jsgui3-website` model-layer examples.
- Investigated the `jsgui3-modern-examples` startup timeout and documented its local non-git ownership/status.
- Integrated the documentation viewer as a near-term examples priority: live activated controls, component source, example source, run commands, and smoke/status visibility.
- Added `docs/examples/DOCS_VIEWER_SPEC.md` and checked `docs/examples/docs_viewer_inventory.json` as the documentation-viewer metadata seed.
- Added `npm run docs:viewer:check` and unit tests for docs-viewer inventory drift.
- Reclassified the modern example startup failure as a coordinator timeout configuration issue for a long but passing shared smoke command; the manifest now carries a bounded per-entry startup timeout.
- Added `docs/examples/OWNERSHIP_STATUS.md` with hard decisions for `jsgui3-modern-examples`, `jsgui3-simple-example`, and Webpage/Website live-example status.
- Inspected the minimal `jsgui3-server` route/control patterns needed for the docs-viewer shell: `Server.serve({ pages, api })`, raw `server.publish()` routes, app-level control guidance, and bounded HTTP route tests.
- Decided this pass must not edit `jsgui3-server` because its worktree has active changes in core serving and test files.
- Added `docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md` and `docs/examples/docs_viewer_shell_contract.json` with the owner file list, route shape, render slots, runtime data-loading rules, and required owner tests.
- Extended `npm run docs:viewer:check` and unit coverage so the docs-viewer shell contract is validated with the inventory.
- Added `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md` as the first agent-generated continuation prompt for this track.
- Rechecked `jsgui3-server` on 2026-05-29, confirmed it is still dirty in core serving/test paths, and added an `owner_readiness` gate to `docs/examples/docs_viewer_shell_contract.json`.
- Upgraded `CONTINUATION_PROMPT.md` from a narrow docs-viewer handoff to an explicit recursive examples-reliability state prompt with active/completed/pending nodes, broad workload, final response state bundle, and horizon requirements.
- Extended `npm run docs:check` so it also validates the active continuation prompt contains the required recursive handoff structure.
- Continued the docs-examples-viewer contract pass on 2026-06-03 by re-reading source-of-truth docs, rechecking `jsgui3-server` and `jsgui3-html` dirty worktrees, and inspecting only the needed `DocAppControl`, `Code_Editor`, `Markdown_Viewer`, gallery, and activation material.
- Tightened `docs/examples/docs_viewer_inventory.json` so viewer-ready entries now carry checked docs, owner repo, expected result, framework source, component source, example source, live route/activation, related tests, and smoke/status metadata.
- Extended `npm run docs:viewer:check` and unit coverage for owner drift, expected-result drift, required docs/source refs, allowed smoke statuses, first runnable path metadata, and docs/framework/component/example source kinds.
- Recorded the first minimal runnable docs-viewer owner path as `jsgui3-server/examples/docs-viewer/server.js`, started by `node examples/docs-viewer/server.js` and serving `/docs/examples`, with `server.jsgui3-html-mvvm-counter` as the first entry.
- Updated README, examples index, docs-viewer spec, shell contract, and ownership status to reflect the stricter metadata contract and 2026-06-03 owner-readiness recheck.
- Rechecked `jsgui3-server` again during the owner-shell-or-deferred-wrapper continuation turn on 2026-06-03; the core serving/test worktree blocker is unchanged, so no sibling shell files were added.
- Tightened the docs-viewer shell contract so rendered pages must include docs and framework source slots, and owner-side tests must explicitly cover source API `kind=docs`, `kind=framework`, `kind=component`, and `kind=example`.
- Rechecked `jsgui3-server` earlier on 2026-06-04; the core serving/test worktree blocker was still unchanged at that time, so that pass kept the docs-viewer owner shell blocked without explicit owner acceptance.
- Added `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md` and `docs/examples/webpage_website_served_example_contract.json` for the deferred Webpage/Website served-example path.
- Extended `npm run docs:viewer:check` and unit coverage so the Webpage/Website contract validates deferred manifest ids, owner readiness evidence, model owner readiness, owner files, routes, required features, tests, and validation commands.
- Ran the 2026-06-04 coordinator verification set after the Webpage/Website contract addition; syntax, unit, docs, docs-viewer, smoke, smoke summary, scan summary, and touched-file whitespace checks pass, while whole-repo `git diff --check` remains blocked by pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues.
- Rechecked `jsgui3-server`, `jsgui3-webpage`, and `jsgui3-website` again on 2026-06-04 during the manifest-quality pass; all were dirty in owner implementation/model paths at that time, so that pass kept sibling repos untouched.
- Added manifest quality validation to `npm run docs:check` for schema version, generated flag, unique ids, required fields, documented categories/complexities, boolean server/browser flags, owner-relative paths, package/test arrays, and smoke metadata shape.
- Added unit coverage for manifest quality pass/fail cases and updated operator docs so `docs:check` is now the manifest/index/continuation gate.
- Rechecked `jsgui3-server` again later on 2026-06-04 and found it clean before owner-side work.
- Added the first owner-side docs-viewer shell in `jsgui3-server/examples/docs-viewer` with checked index, entry, inventory API, and docs/framework/component/example source routes.
- Added `jsgui3-server/tests/docs-viewer-shell.test.js` and registered it with the owner test runner.
- Updated docs-viewer contracts and ownership docs so the first runnable shell is implemented while Webpage/Website promotion remains deferred by model-owner worktrees.
- Added a bounded owner-side `/api/docs-viewer/status` route that reports inventory counts, smoke status counts, registered routes, source kinds, and missing declared refs without launching examples.
- Extended the docs-viewer shell contract checker and unit coverage so the status route and owner test coverage are validated.
- Fixed Windows cross-platform portability in the coordinator tooling on 2026-06-06. `command_available` now resolves executables against `PATH`/`PATHEXT` (so `npm`/`npx` smokes resolve via `npm.cmd`) instead of spawning `--version`, and the docs-viewer shell contract `inventory_source` check is now path-separator tolerant. Added regression tests for both. This turned the previously WSL-only-green verification ladder green on Windows (`npm test` 28/28, `npm run smoke:examples` 35/35, `git diff --check` clean).
- Established the extensive user-facing documentation viewer track in `jsgui3-own-website` on 2026-06-06. Recorded the ownership decision (extensive viewer owned by `jsgui3-own-website`; reusable controls required from `jsgui3-html`; serving from `jsgui3-server`; spec/contract/inventory owned by `jsgui3-ecosystem`). Added the coordinator spec `docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md` and the machine-checked contract `docs/examples/own_website_docs_viewer_contract.json`, wired a new `check_own_website_docs_viewer_contract` into `npm run docs:viewer:check`, and added 5 unit tests. Seeded `jsgui3-own-website` with `AGENTS.md`, `IMPLEMENTATION_PLAN.md`, `package.json`, and the canonical new control `controls/Source_Code_Viewer.js` (read-only source pane with SSR compose + client activation, `node --check` clean).
- Implemented extensive docs viewer Phase 1 in `jsgui3-own-website` on 2026-06-06. Added `controls/Docs_Viewer_Shell.js` (extends `Active_HTML_Document`; composes a header, a server-read featured source pane via `Source_Code_Viewer`, and a visible failure panel when the source is unreadable), `client.js` (registers `Source_Code_Viewer` and `Docs_Viewer_Shell` on the shared `controls` registry; no Node built-ins at module scope), `server.js` (classic `Server({ Ctrl, src_path_client_js })`; injects a server-only `read_source_file` reader + `featured_source` descriptor as static properties so all filesystem reads stay on the server and out of the browser bundle; exports `start_server`/`configure_featured_source` for tests), and `tests/docs-viewer.test.js` (boots the real server on an auto port; asserts SSR `source-code-viewer` region, real server-read source, `/js/js.js` bundle wiring + shipped activation code, and a visible `docs-viewer-failure` panel for a missing source path). Fixed the Node 25 test glob (`node --test "tests/**/*.test.js"`) and a missing `controls.strong` (used `Control` with `tag_name`). `npm install` clean, `npm test` 2/2 passing on Windows. Flipped `own_website_docs_viewer_contract.json` Phase 1 file/control statuses (`package.json`, `controls/Source_Code_Viewer.js`, `controls/Docs_Viewer_Shell.js`, `client.js`, `server.js`, `tests/docs-viewer.test.js`, `Source_Code_Viewer`, `Docs_Viewer_Shell`, `phase-1-scaffold`) to `implemented` and re-ran `npm run docs:viewer:check` green. Coordinator ladder green: `npm test` 33/33, `npm run docs:check`, `npm run smoke:examples:summary` 35/35, `npm run examples:scan:summary` all present.
- Canonicalized coordination on 2026-07-11: `jsgui3-ecosystem` is the single
  coordination authority, while `coordination-jsgui-ecosystem.code-workspace`
  is the local workspace shell. Added `docs/COORDINATION_STATUS.md`, refreshed
  catalog/dependency/roadmap facts, and classified core, application, example,
  support, and incubator repos.
- Reconciled the minimal `jsgui3-server` docs-viewer shell on 2026-07-11. The
  implementation is recoverable from `stash@{0}` and `stash@{1}`, but absent
  from current checkout/branch/remote history. Updated the contract to `parked`
  and made the checker reject files falsely marked `implemented` when absent.
- Implemented extensive docs viewer Phase 2 in `jsgui3-own-website` on
  2026-07-11: added `Source_Browser` using framework `Tree_View`, constrained
  real-control lookup, `GET /controls/:control_name`,
  `GET /api/docs/control-source`, visible 404/failure states, traversal
  rejection, client registration/reattachment support, and focused tests.
  `npm test` passes 3/3 on WSL.
- Implemented extensive docs viewer Phase 3 in `jsgui3-own-website` on
  2026-07-11: added `Example_Preview_Frame`, inventory-backed example
  index/detail pages, inventory/source/status APIs, all four source kinds,
  reused `Tabbed_Panel` and `Markdown_Viewer` panes, honest preview readiness,
  lexical/realpath containment, and focused failure tests. `npm test` passes
  5/5 on WSL; no sibling examples are launched.

## In Progress

- The minimal `jsgui3-server` documentation-viewer shell is parked in local
  stashes and is not currently runnable from the checkout. Recover it only on a
  dedicated owner branch if the superseded reference remains useful.
- Extensive viewer Phases 1-3 are implemented locally; Phase 4 is the active
  delivery coordinate.
- The Webpage/Website served-example path remains contract-only because `jsgui3-webpage` and `jsgui3-website` still have active model/test worktree changes.
- Keep startup readiness of standalone/local examples explicit and bounded rather than default-CI.
- Keep the continuation prompt current after material state changes, and keep it broad enough to carry examples/docs/smoke reliability work rather than collapsing to a single narrow subtask.

## Next

- Implement extensive docs viewer Phase 4 in `jsgui3-own-website`: add the
  control catalog, `GET /controls`, and a live landing page.
- Continue the extensive viewer through phases 4-5 from
  `../jsgui3-own-website/IMPLEMENTATION_PLAN.md`: control catalog/home and full
  tests.
- When the viewer is runnable, add an `ownsite.docs-viewer` manifest entry and a docs-viewer inventory entry, then keep `npm run docs:check` and `npm run docs:viewer:check` green.
- If the parked minimal server shell is restored, recover it with `git stash
  apply` on a dedicated branch, preserve both stashes until verified/committed,
  and keep source API support for all four source kinds.
- Keep owner-side route tests aligned with the checked render slots: docs, live preview, activation status, framework source, component source, example source, command, owner, smoke status, tests, and failure panel.
- Decide whether an ecosystem command should smoke the owner docs-viewer shell status route, or keep that coverage owner-side only.
- Add a tiny served `Website`/`Webpage` example in the clear owning repo, or keep it as an ecosystem wrapper if that is the intended ownership.
- When owner worktrees are safe, implement the Webpage/Website served example from `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md`.
- Add a narrow sibling fix for `jsgui3-simple-example` only after its dirty worktree is reconciled, or update its package script in the owner.
- Split `jsgui3-modern-examples/tests/smoke.test.js` into per-example selectors after the local non-git ownership boundary is resolved.
- Add CI-friendly docs/index drift checks for Webpage/Website guidance if it becomes manifest-backed.
- Resolve or isolate pre-existing `.gitignore` and `LICENSE` whitespace/line-ending issues so whole-repo `git diff --check` stays clean once the scaffolding is committed. As of 2026-06-06 `git diff --check` is clean on Windows because the coordinator scaffolding is still untracked atop the initial commit; CRLF/LF normalization could resurface after commit.
- Audit the remaining coordinator tooling for POSIX-only assumptions (path separators, executable resolution, shell-dependent commands) so the full ladder stays green on both Windows and WSL.
- Extend manifest quality checks only when the next pass finds documented fields that are still not machine-validated.

## Later

- Expand browser smoke coverage for selected server examples when Playwright/Puppeteer setup is stable.
- Add a lightweight operator dashboard only if the ecosystem repo grows an existing dev-server/gallery pattern; the documentation viewer should be the preferred user-facing surface.
- Normalize more sibling example READMEs where the owning repo is clean enough for narrow edits.
- Reconcile tutorial code with live server/client APIs in a dedicated validation pass.
- Turn repeated startup smoke results into a small status report without committing large generated artifacts.

## Constraints

- Keep edits in `jsgui3-ecosystem` unless a narrow, proven bug belongs in a sibling repo.
- Treat dirty sibling repos as read-only unless explicit owner acceptance is given; clean owner repos may receive only narrow, route-scoped changes with focused validation.
- Preserve existing sibling example commands where practical.
- Avoid network-dependent checks.
- Keep smoke checks bounded and explicit; do not hide real failures behind vague wrapper output.
