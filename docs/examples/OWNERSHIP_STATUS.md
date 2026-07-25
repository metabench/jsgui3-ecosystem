# Example Ownership Status

This file records hard boundaries for examples that are useful to the ecosystem but not safe for broad coordinator-side edits.

## jsgui3-modern-examples

Status: local incubator, not a git repo.

Decision:

- Keep it in the curated manifest because it demonstrates modern `serve_site`, `Website`, `Webpage`, and the safe document/widget split.
- Do not treat it as the first implementation owner for the documentation viewer because it has no git ownership boundary.
- Keep default ecosystem smoke syntax-only for these examples.
- Allow optional startup smoke with an explicit long timeout because `tests/smoke.test.js` passes locally under `timeout 300 node tests/smoke.test.js` but took about four minutes.

Evidence:

- `git rev-parse --show-toplevel` fails inside `../jsgui3-modern-examples`.
- `timeout 300 node tests/smoke.test.js` passed on 2026-05-28.
- Earlier `npm run smoke:examples:startup` failed because the ecosystem wrapper had a 150s process timeout while the shared modern smoke was still in `plain-control-document`.

Smallest safe next change in the owner:

- Move the examples into a tracked repo or initialize `jsgui3-modern-examples` as a real repo.
- Split `tests/smoke.test.js` into per-example commands or add per-example CLI selectors so the coordinator can smoke only the changed example.

## jsgui3-simple-example

Status: tracked sibling repo with a dirty worktree.

Decision:

- Do not edit it from this pass because the repo already has unrelated modified files and generated assets.
- Keep `simple.showcase` in the curated manifest as syntax/default-smoke coverage.
- Do not wire `npm run smoke` into ecosystem startup checks until the owning repo supplies `tests/smoke.test.js` or removes the stale script.

Evidence:

- `npm run smoke` fails with `MODULE_NOT_FOUND` for `tests/smoke.test.js`.
- `git status --short` in `../jsgui3-simple-example` shows existing modifications in `.github/copilot-instructions.md`, `.gitignore`, `LICENSE`, `client.js`, `package.json`, `public/js/app-bundle.js`, `screenshot.js`, and `server.js`, plus untracked docs/cache files.

Smallest safe next change in the owner:

- Add `tests/smoke.test.js` that starts `node server.js` with `AUTO_PORT=1`, waits for `ready on http://localhost:<port>/`, fetches `/`, and asserts the showcase heading plus one activation marker.
- Or remove/rename the stale `smoke` script if the repo intentionally has no smoke test.

## Webpage And Website

Status: test-backed model references, not live examples. A served-example contract is recorded in the coordinator.

Decision:

- Keep `webpage.composition-tests` and `website.resolved-model-tests` in the manifest as model-layer references.
- Do not add them to the docs-viewer live inventory until a served `Website`/`Webpage` example exists.
- Use `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md` and `docs/examples/webpage_website_served_example_contract.json` as the owner-side implementation contract.
- Keep the first served example in `jsgui3-server` because the missing behavior is HTTP serving, aliases, redirects, API routing, and browser activation; `jsgui3-webpage` and `jsgui3-website` remain model owners.
- Keep the served example deferred until the model owner worktrees are reconciled.

Evidence:

- `git status --short --branch` in `../jsgui3-server` on the later 2026-06-04 owner-shell recheck showed a clean owner repo before the docs-viewer shell was added.
- `git status --short --branch` in `../jsgui3-webpage` on 2026-06-04 showed active model/test changes and an untracked `test/webpage_composition.test.js`.
- `git status --short --branch` in `../jsgui3-website` on 2026-06-04 showed active model/API/test changes and untracked model/resolved-model test paths.

Smallest safe next change:

- Add a tiny served example using `jsgui3-server` that exposes two `Webpage` instances, one alias, one redirect, one JSON status route, and one activated control.
- Run `node --check examples/webpage-website/server.js`, `node --check examples/webpage-website/client.js`, and `node tests/test-runner.js --test=webpage-website-example.test.js` in `jsgui3-server`.

## Documentation Viewer Shell

Status: implemented and tested locally, then parked in git stashes before the
v0.0.156 release; absent from the current checkout and branch/remote history.

Decision:

- Keep `jsgui3-ecosystem` as the owner of the docs-viewer inventory, shell contract, and validation checks.
- Keep `jsgui3-server` as the owner of the first runnable shell.
- Treat `docs/examples/docs_viewer_shell_contract.json` as the machine-readable record of the owner-side implementation and validation commands.
- Retain `examples/docs-viewer/server.js` as the recorded first runnable owner
  path, but do not describe it as currently runnable from the checkout.
- The active public viewer is now `jsgui3-own-website`; recover the minimal
  server reference only if it remains useful.

Evidence:

- `git status --short --branch` in `../jsgui3-server` on 2026-06-03 still showed active changes in `server.js`, `serve-factory.js`, `module.js`, `tests/test-runner.js`, website models, bundler internals, serve/bundling tests, and untracked serve-site/client-activation files.
- The repeated 2026-06-03 status snapshot still included staged `.gitattributes`, modified `.gitignore`, `README.md`, `module.js`, `serve-factory.js`, `server.js`, bundler/test/helper files, website models, and untracked `serve-site`/client-activation fixtures.
- The earlier 2026-06-04 status snapshot was materially unchanged: staged `.gitattributes`, modified core serving/test files, website models, and untracked `serve-site`/client-activation fixtures remained present.
- The later 2026-06-04 owner-shell recheck showed `## master...origin/master` before the additive docs-viewer files were added.
- Owner validation passed with syntax checks and `node tests/test-runner.js --test=docs-viewer-shell.test.js`.
- A later focused refinement added `/api/docs-viewer/status` so the shell reports inventory counts, smoke status counts, registered routes, source kinds, and missing declared refs without launching examples.
- On 2026-07-11 the missing implementation was located in `stash@{0}` (all five
  owner implementation/test files) and `stash@{1}` (test-runner registration).
  Neither local/remote branches nor tags contain the paths. Both stored patches
  pass `git apply --check` against current `master`.

Smallest safe next change in the owner, if the reference is retained:

- Create a dedicated recovery branch from current `master`, apply (do not pop)
  `stash@{0}` and `stash@{1}`, inspect the scoped diff, and rerun the recorded
  syntax/focused tests.
- Preserve both stashes until a verified owner commit exists.

## Extensive Documentation Viewer (jsgui3-own-website)

Status: Phases 1-3 implemented locally; Phase 4 next.

Decision:

- The extensive, user-facing documentation viewer is owned by `jsgui3-own-website`. It is the impressive public showcase: live activated controls first, with real `jsgui3-html` control source, example source, prose docs, run command, owner, status, and a failure panel adjacent.
- It supersedes the minimal `jsgui3-server/examples/docs-viewer` shell as the user-facing surface. The server shell remains a bounded contract-only reference and is not deleted.
- New presentation controls (source-code viewing, source browser, viewer app shell, example preview frame, control catalog) are built in `jsgui3-own-website`. Reusable framework controls (`Code_Editor`, `Markdown_Viewer`, `Tabbed_Panel`, `Tree_View`) are required from `jsgui3-html`, not forked.
- `jsgui3-ecosystem` owns the spec `docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md`, the machine-checked contract `docs/examples/own_website_docs_viewer_contract.json`, and the cross-repo inventory. `npm run docs:viewer:check` validates the contract.
- The viewer must use SSR + client activation (not hydration), following the canonical jsgui3 control lifecycle.

Evidence:

- `git status --short --branch` in `../jsgui3-own-website` on 2026-06-06 showed `## main...origin/main` with only a pre-existing ` M README.md`; additive scaffolding was safe.
- Seeded this turn in `jsgui3-own-website`: `package.json`, `AGENTS.md`, `IMPLEMENTATION_PLAN.md`, and `controls/Source_Code_Viewer.js` (syntax-checked with `node --check`).
- `npm run docs:viewer:check` and `npm test` pass in `jsgui3-ecosystem` with the new contract and checker.

Phase 3 evidence:

- `controls/Example_Preview_Frame.js` and the example index/detail routes are
  implemented. Planned previews stay on `about:blank`, preserving the declared
  route as metadata without launching sibling processes.
- Inventory, status, and constrained source APIs expose all four source kinds.
  Server-side realpath checks keep inventory refs inside direct sibling repos.
- `npm test` passes 5/5 real-server tests, including missing, unknown,
  out-of-range, and traversal-like failures.

Smallest safe next change in the owner:

- Implement Phase 4: add `controls/Control_Catalog.js`, `GET /controls`, and a
  live landing page while continuing to reuse `jsgui3-html` controls.
