# Documentation Viewer Shell Contract

This contract records the first bounded docs-viewer shell. The implementation
owner is `jsgui3-server`; the coordinator owns the inventory and route/test
contract. The implementation is currently parked in local git stashes and is
not present in the owner checkout or branch/remote history.

Machine-readable source: `docs/examples/docs_viewer_shell_contract.json`.

## Decision

The owner repo was rechecked on 2026-06-04 and was clean enough for the additive
shell implementation. That implementation and its focused test passed locally,
but they remained uncommitted. Before the v0.0.156 release they were parked in
`stash@{0}` (the five implementation/test files) and `stash@{1}` (test-runner
registration). Both stored patches still apply cleanly to current `master`.

The first runnable shell still belongs there because the inspected owner patterns already provide the needed surface:

- `Server.serve({ pages, api })` and explicit route publication live in `serve-factory.js` and `server.js`.
- `server.publish(..., { raw: true, method: 'GET' })` is the narrow API route shape for inventory and source endpoints.
- `tests/serve.test.js` and `tests/serve-site.test.js` already use bounded local HTTP route assertions.
- The architecture guide already names `DocAppControl` as an app-level docs-viewer control shape.

The shell uses explicit routes and reads `docs/examples/docs_viewer_inventory.json`; it does not launch, fork, or mutate sibling examples.

## Owner Readiness Gate

The current parked/recoverable state is recorded in
`docs/examples/docs_viewer_shell_contract.json` under `owner_readiness`.

If the minimal reference is retained, recover it on a dedicated owner branch by
applying (not popping) both stashes, then rerun the recorded syntax and focused
tests before committing it. Preserve the stashes until that commit is verified.

## First Runnable Path

The first minimal runnable path remains owner-side:

| Field | Decision |
|-------|----------|
| Owner repo | `jsgui3-server` |
| Owner path | `examples/docs-viewer/server.js` |
| Start command | `node examples/docs-viewer/server.js` |
| First URL | `/docs/examples` |
| First entry | `server.jsgui3-html-mvvm-counter` |
| Current status | `parked` — recoverable from `stash@{0}` and `stash@{1}`, absent from checkout/history |

This is the smallest useful route because it can render the checked inventory without launching sibling examples, then expose source and status through bounded routes.

## Owner Files

The parked owner implementation contains these files inside `jsgui3-server`:

| File | Purpose |
|------|---------|
| `examples/docs-viewer/server.js` | Starts the bounded docs-viewer shell. |
| `examples/docs-viewer/docs-viewer-shell.js` | Loads inventory data and registers page/API routes. |
| `examples/docs-viewer/controls/Docs_Viewer_App.js` | Renders the shell slots for index and entry pages. |
| `examples/docs-viewer/client.js` | Client bundle entry for later activation. |
| `tests/docs-viewer-shell.test.js` | Owner-side route and rendering tests. |

## Route Shape

The first shell should register explicit routes, not a broad catch-all:

| Method | Path | Result |
|--------|------|--------|
| `GET` | `/docs/examples` | HTML index page over checked inventory entries. |
| `GET` | `/docs/examples/` | Same index page. |
| `GET` | `/docs/examples/:manifest_id` | HTML entry page for one manifest-backed example. |
| `GET` | `/api/docs-viewer/inventory` | JSON inventory with no generated smoke output. |
| `GET` | `/api/docs-viewer/source?manifest_id=<id>&kind=<docs|framework|component|example>&index=<n>` | Plain-text docs or source for one declared inventory slot. |
| `GET` | `/api/docs-viewer/status` | JSON status summary with entry counts, smoke status counts, registered routes, source kinds, and missing declared source or test refs. |

The `:manifest_id` route may be implemented by registering one explicit route per inventory entry if the router parameter syntax is not the smallest safe path.

## Rendering Contract

Every entry page must render these slots:

- docs;
- live preview;
- activation status;
- framework source;
- component source;
- example source;
- run command;
- owner repo;
- smoke status;
- related tests;
- failure panel.

The first shell may link or frame existing examples but must not start, mutate, fork, or rewrite example behavior.

## Runtime Data

Load `docs/examples/docs_viewer_inventory.json` from `JSGUI3_DOCS_VIEWER_INVENTORY` when set. Otherwise, load `../jsgui3-ecosystem/docs/examples/docs_viewer_inventory.json` relative to the `jsgui3-server` repo root.

Resolve source slots from each inventory ref's `repo_path` and `path`. Missing repos, source files, tests, routes, or manifest ids must render explicit failures rather than disappearing from the UI.

## Required Owner Tests

`tests/docs-viewer-shell.test.js` must cover:

- inventory API returns the checked inventory fields used by the shell;
- index page includes the required slot labels;
- entry page renders the selected manifest id and does not launch an owning example;
- source API returns docs, framework, component, and example source for existing slots;
- source API tests explicitly cover `kind=docs`, `kind=framework`, `kind=component`, and `kind=example`;
- status API returns entry counts, smoke status counts, routes, source kinds, and missing declared refs without launching examples;
- unknown manifest ids and missing source files produce explicit 404 or failure-slot output.

Owner validation commands:

```bash
node --check examples/docs-viewer/server.js
node --check examples/docs-viewer/docs-viewer-shell.js
node --check examples/docs-viewer/controls/Docs_Viewer_App.js
node --check examples/docs-viewer/client.js
node tests/test-runner.js --test=docs-viewer-shell.test.js
```

Coordinator validation command:

```bash
npm run docs:viewer:check
```
