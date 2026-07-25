# Documentation Viewer Prototype Spec

This spec defines the near-term documentation viewer track for ecosystem examples. The first implementation should teach jsgui3 from a user's perspective: live activated controls first, source and commands adjacent, and real failures visible.

> Note: the **extensive** user-facing documentation viewer is now owned by `jsgui3-own-website`. See `docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md` and `docs/examples/own_website_docs_viewer_contract.json`. This document describes the original minimal `jsgui3-server` shell, which remains a bounded contract-only reference and is superseded by the extensive viewer as the public showcase.

## Ownership Boundary

- `jsgui3-ecosystem` owns this spec, the cross-repo inventory, status policy, and validation checks.
- `jsgui3-server` should own the first runnable viewer shell because it already owns HTTP serving, bundling, route publication, and app-level controls. The existing architecture guide names the `DocAppControl` shape beside other app-level controls.
- `jsgui3-html` owns the reusable controls used inside the viewer. The first source-display controls to reuse are `Code_Editor` for source and `Markdown_Viewer` for prose; the existing gallery server is the closest isolated-control rendering reference.
- Example behavior stays in the owning example repo. The viewer should launch, link, embed, or proxy examples; it should not fork or rewrite sibling examples in `jsgui3-ecosystem`.

Current implementation decision: the first owner-side docs-viewer shell was
implemented and tested after a clean 2026-06-04 owner recheck, but remained
uncommitted and was parked before the v0.0.156 release. It is recoverable from
two local stashes and is not present in the current `jsgui3-server` checkout.
The exact state is recorded in `docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md` and
checked by `npm run docs:viewer:check`.

## Inventory Model

The checked inventory lives at `docs/examples/docs_viewer_inventory.json`. It is intentionally small and human-maintained. It should not become a large generated status artifact.

Each entry must record:

- `manifest_id`: existing entry in `docs/examples/examples_manifest.json`;
- `owner_repo`: owning repo from the manifest;
- `viewer_path`: the intended docs-viewer page path;
- `run_command`: exact command from the manifest;
- `expected_result`: expected result from the manifest;
- `live_preview`: mode, route, status, and whether activation is required;
- `docs`: docs/README paths to show through `Markdown_Viewer`;
- `source.framework`: framework/runtime source paths that explain the route, document, or control infrastructure;
- `source.component`: component/control source paths to show;
- `source.example`: example entrypoint/source paths to show;
- `related_tests`: tests or fixtures that define expected behavior;
- `last_smoke`: small status tuple with command, status, and optional date/duration.

The validation command checks that inventory entries refer to real manifest IDs, keep owner/run/expected metadata in sync, require docs/framework/component/example source refs, and point at existing files.

```bash
npm run docs:viewer:check
```

The same command also validates `docs/examples/docs_viewer_shell_contract.json`, which records the required owner files, routes, render slots, runtime data-loading rules, readiness gate, and tests for the first `jsgui3-server` shell.

It also validates `docs/examples/webpage_website_served_example_contract.json`, which keeps the Webpage/Website viewer deferral tied to a concrete future served example contract.

## User-Facing Page Contract

Each viewer page should contain:

1. Docs/prose pane using `Markdown_Viewer`.
2. Live preview pane with activation/readiness status.
3. Framework source pane using `Code_Editor` in read-only mode.
4. Component source pane using `Code_Editor` in read-only mode.
5. Example source pane using `Code_Editor` in read-only mode.
6. Run command, owning repo, expected result, and related tests.
7. Failure panel that shows missing repo, missing source, failed command, startup timeout, or activation failure without masking it.

The preview must be the first visible signal. Source is learning material, not a hidden secondary page.

## First MVP Scope

Start with these manifest-backed examples:

- `server.jsgui3-html-mvvm-counter`
- `server.jsgui3-html-data-grid`
- `server.jsgui3-html-binding-debugger`
- `html.dev-showcase-app`
- `modern.plain-control-document` as a blocked/long-startup status example until ownership is settled.

Do not add `webpage.composition-tests` or `website.resolved-model-tests` to the live viewer yet. They remain test-backed model references until a tiny served `Website`/`Webpage` example exists.

The served example contract is `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md`; it requires a future `jsgui3-server` example with two `Webpage` instances, an alias, a redirect, a JSON status endpoint, and one activated control before these entries can become live viewer pages.

## First Shell Contract

The first owner-side shell should add a bounded `jsgui3-server` example, not a broad framework rewrite:

- `examples/docs-viewer/server.js`
- `examples/docs-viewer/docs-viewer-shell.js`
- `examples/docs-viewer/controls/Docs_Viewer_App.js`
- `examples/docs-viewer/client.js`
- `tests/docs-viewer-shell.test.js`

First runnable path decision:

- owner repo: `jsgui3-server`;
- owner path: `examples/docs-viewer/server.js`;
- command: `node examples/docs-viewer/server.js`;
- first URL: `/docs/examples`;
- first entry: `server.jsgui3-html-mvvm-counter`;
- current status: parked/recoverable; not currently runnable from the owner checkout.

Required routes:

- `GET /docs/examples`
- `GET /docs/examples/`
- `GET /docs/examples/:manifest_id`
- `GET /api/docs-viewer/inventory`
- `GET /api/docs-viewer/source?manifest_id=<id>&kind=<docs|framework|component|example>&index=<n>`
- `GET /api/docs-viewer/status`

The shell may register one explicit page route per inventory entry if that is safer than adding router parameter handling.

## Operator Status

Use bounded commands:

```bash
npm run docs:viewer:check
npm run smoke:examples:summary
npm run smoke:examples:startup
```

`smoke:examples:startup` is intentionally optional. The local `jsgui3-modern-examples` smoke passed with `timeout 300 node tests/smoke.test.js`, but took about four minutes on this workspace because `plain-control-document` performs a long bundle. The manifest sets a per-entry startup timeout so this is explicit and bounded.
