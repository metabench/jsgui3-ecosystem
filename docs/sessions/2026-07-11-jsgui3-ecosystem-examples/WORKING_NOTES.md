# Session 2026-07-11 — Docs Viewer Phases 4-5 + Public Deployment

## Scope

Completed the extensive documentation viewer (`jsgui3-own-website`) through
Phases 4 and 5 and deployed it publicly on the existing Oracle host.

## What Changed

### jsgui3-own-website (implementation owner)

- `controls/Control_Catalog.js` (new): catalog of the public `jsgui3-html`
  registry (157 controls, parsed server-side in `server.js`); anchor cards to
  `/controls/:name`; client-activated name filter; `data-catalog-active`
  activation marker.
- `controls/Docs_Viewer_Shell.js`: page-kind dispatch (`home`,
  `controls_index`, `control`, existing `examples_index`/`example`); live
  landing page (hero, `dvs-nav`, live `Source_Code_Viewer`, catalog, example
  summaries); honest `dvs-activation-status` line flipped only by
  `activate()`; favicon head link.
- `controls/Example_Preview_Frame.js`: renavigate-once fix so a cross-origin
  iframe load that completes before activation still produces the
  `data-preview-readiness="loaded"` signal.
- `server.js`: `configure_home()` startup statics (root route is pre-rendered
  at bundle time), `GET /controls` handler, favicon/robots routes,
  `page_kind: 'control'` on control pages.
- `client.js`: registers `Control_Catalog`.
- `tests/docs-viewer.test.js`: +3 tests (home/catalog/deployed preview,
  favicon/robots).
- `tests/docs-viewer.browser.test.js` (new): 4 puppeteer tests (activation
  indicator, catalog filter, navigation + copy button, tab switching,
  deployed preview + failure panels). Puppeteer is resolved from sibling
  repos and the tests skip cleanly when unavailable.
- Owner `npm test`: 12/12 on Windows.

### jsgui3-ecosystem (coordination owner)

- `docs/examples/docs_viewer_inventory.json`: data-grid `live_preview` now
  points at the deployed public demo (`ready`); new `ownsite.docs-viewer`
  entry (status `ready` after public verification).
- `docs/examples/examples_manifest.json` + `INDEX.md`: new
  `ownsite.docs-viewer` entry (syntax smoke).
- `docs/examples/own_website_docs_viewer_contract.json`: Control_Catalog and
  phases 4-5 `implemented`; browser test recorded; owner readiness updated.
- `docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md`, `docs/COORDINATION_STATUS.md`
  updated; `docs/deployments/ORACLE_DOCS_VIEWER_DEMO.md` (new) documents the
  deployment topology, ingress, verification, and rollback.

## Deployment

- Host: Oracle `oracle-worker` (141.144.193.218), directory
  `/home/ubuntu/apps/jsgui3-docs-viewer/` with sibling working trees.
- PM2 process `jsgui3-docs-viewer`, `PORT=52001`, saved; crawler (3200) and
  data-grid demo (52000) untouched.
- Ingress: persisted iptables rule + OCI security-list rule for TCP 52001.
- Deployment-local `file:` rewrites in the shipped `jsgui3-client` and
  `jsgui3-server` package.json (local versions are ahead of the registry).

## Verification

- Owner tests 12/12; coordinator `npm test` 35/35; `docs:check`,
  `docs:viewer:check`, `smoke:examples:summary` all pass.
- Public Chromium run against http://141.144.193.218:52001/: 24/24 checks.

## Gotchas Recorded

- The root route is pre-rendered by `HTTP_Webpage_Publisher` at bundle time;
  landing-page data must be injected as statics before `create_server()`.
- Registry-ahead local versions (`jsgui3-html@0.0.188`,
  `jsgui3-client@0.0.130`) break plain `npm install` on the host; the
  deployment uses host-side `file:` rewrites.
- Startup bundling peaks near 1.5 GB RSS before settling.
