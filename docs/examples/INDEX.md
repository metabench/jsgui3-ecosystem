# jsgui3 Ecosystem Examples Index

This index coordinates examples owned by the sibling jsgui3 repos. Implementation stays in the owning repo; this repo records how to discover, run, compare, and smoke-check representative examples.

## Commands

Run from `jsgui3-ecosystem`:

```bash
npm run examples:list
npm run examples:scan
npm run examples:scan:summary
npm run smoke:examples
npm run smoke:examples:summary
npm run docs:check
npm run docs:viewer:check
```

`npm run smoke:examples` checks that owner repos exist, declared entrypoints exist, declared commands use available executables, and representative JavaScript entrypoints pass `node --check`. It does not launch long-running browser servers by default. Use `npm run smoke:examples:startup` only when you want bounded startup checks declared in the manifest.

`npm run examples:scan:summary` gives a compact operator view by repo: manifest coverage, discovered server/client/docs/script files, missing repo status, and category mix. Use raw `npm run examples:scan` only when you need the full discovered file list.

`npm run smoke:examples:summary` gives a compact pass/fail view by owning repo. Use raw `npm run smoke:examples` when you need every example line.

`npm run docs:check` validates curated manifest shape, docs/index drift, and the active recursive continuation prompt. Use it after changing manifest metadata, this index, or session handoff state.

`npm run docs:viewer:check` validates the prototype docs-viewer inventory at `docs/examples/docs_viewer_inventory.json`, the owner-side shell contract at `docs/examples/docs_viewer_shell_contract.json`, and the deferred Webpage/Website served-example contract.

## Recent Example Audit

- `jsgui3-ecosystem` has only an initial commit in git history. The current example-related ecosystem work is in the uncommitted docs, especially `docs/GETTING_STARTED_TUTORIAL.md` and `docs/DEVELOPMENT_WORKFLOW.md`.
- `jsgui3-html` recently moved through 0.0.183-0.0.187 with controls, themes, visual checks, and example health work. It has a broad `examples/` API surface plus server-backed `dev-examples/`.
- `jsgui3-server` recently moved through 0.0.148-0.0.155 with observable publishing, bundling, admin UI, middleware, and server-hosted jsgui3-html examples. It has explicit tests for controls, windows, and jsgui3-html example flows.
- `jsgui3-client` has browser/runtime examples for basic windows, binding counters, and SSE-backed binding.
- `jsgui3-gfx-core` has command-line graphics examples and `docs/EXAMPLES.md` for pixel buffer workflows.
- `jsgui3-webpage` and `jsgui3-website` currently expose test-backed composition references rather than example directories.
- `jsgui3-modern-examples` is a local standalone example collection with two modern server examples and a smoke test. It was present locally but was not a git repo in the bounded scan.
- `jsgui3-modern-examples/tests/smoke.test.js` passes locally under a 300s bound, but the shared command is long because the `plain-control-document` section performs a slow first-run bundle. Treat it as optional startup smoke, not default CI, until ownership is settled.
- `jsgui3-simple-example` is a standalone showcase repo wired to local `file:` dependencies. Its `package.json` declares `npm run smoke`, but `tests/smoke.test.js` was not present in the bounded scan.
- `/mnt/c/Users/james/Documents/repos/jsgui3` and `/mnt/c/Users/james/Documents/repos/jsgui3-controls` were not present locally during this pass.

## Learning Path

1. Start with `gfx.1bipp` or `gfx.24bipp` to see foundation-style Node examples with no browser/server layer.
2. Move to `html.controls-rendering` and `html.binding-simple-counter` for core control rendering and binding basics.
3. Use `html.binding-user-form` and `html.binding-data-grid` to compare validation, transforms, collection binding, sorting, and pagination.
4. Use `html.dev-binding-counter` and `html.dev-progressive` to see server-side rendering plus client activation.
5. Use `client.window-basic`, `client.window-binding-counter`, and `client.window-binding-sse` when the focus is browser runtime and remote observable integration.
6. Use `server.html-rendering`, `server.html-server`, and `server.json-simple-api` for server APIs and non-control serving patterns.
7. Use the `server.jsgui3-html-*` sequence for cross-repo examples hosted by `jsgui3-server` and backed by Puppeteer fixtures: counter, date transform, form validation, data grid, master-detail, theming, mixins, router, resource transform, and binding debugger.
8. Use `modern.plain-control-document` to learn the safe document/widget split before building new browser-bundled controls.
9. Use `modern.serve-site-multipage` for the current multi-page `serve_site` + `Website` + `Webpage` workflow.
10. Use `docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md` for the current `jsgui3-webpage` and `jsgui3-website` model-layer examples.
11. Use `simple.showcase` as the compact standalone showcase pattern after the core and server examples are understood.

## Documentation Viewer Priority

The near-term ecosystem plan must include a high-quality documentation viewer where examples are shown from a user's perspective. The viewer should make each example page useful without requiring repo archaeology: live activated `jsgui3-html` control, component source, example source, run command, owning repo, smoke/status result, and links to related tests should be visible together.

Existing sibling docs already point in this direction: `jsgui3-server/docs/guides/JSGUI3_UI_ARCHITECTURE_GUIDE.md` names a `DocAppControl` docs-viewer shape, `jsgui3-html/docs/control-design-book/09-platform-advancement.md` describes a component gallery as documentation/regression/demo surface, and `jsgui3-designer/docs/books/design/ch03-the-jsgui3-control-system.md` explains why activated controls matter. Keep this as a near-term track in `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md`.

Quality bar for the viewer:

- live preview is the first signal and clearly reports activation/readiness;
- docs, framework source, component source, and example source are adjacent to the preview, not hidden in a different repo;
- examples keep explicit commands and expected results;
- failure states show the real missing repo, command, source, startup, or activation problem;
- controls are navigable, responsive, and usable as learning material for humans and agents.

Prototype source-of-truth files:

- `docs/examples/DOCS_VIEWER_SPEC.md`
- `docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md`
- `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md`
- `docs/examples/docs_viewer_inventory.json`
- `docs/examples/docs_viewer_shell_contract.json`
- `docs/examples/webpage_website_served_example_contract.json`
- `docs/examples/OWNERSHIP_STATUS.md`

Current inventory contract: each viewer-ready entry must carry docs, owner repo, live route, example source, framework/component source, exact command, expected result, related tests, and smoke/status metadata. `npm run docs:viewer:check` now validates those fields against the manifest and local source paths.

Current shell decision: this repo records the bounded route/control/test
contract, while `jsgui3-server` remains the implementation owner. The original
minimal shell was implemented and tested, then parked in local stashes before
the v0.0.156 release. It is recoverable but is not present in the current owner
checkout or branch/remote history; the extensive public viewer in
`jsgui3-own-website` is the active implementation track.

## Curated Inventory

The source of truth for this table is `docs/examples/examples_manifest.json`.

| ID | Owner | Category | Complexity | Purpose | Run | Expected result | Related source |
|----|-------|----------|------------|---------|-----|-----------------|----------------|
| `ecosystem.getting-started-counter` | `jsgui3-ecosystem` | integration | intro | Step-by-step server/client counter app tutorial that introduces isomorphic controls, activation, static CSS extraction, and a public-safe admin-disabled server configuration. | `Follow the tutorial, then run node server.js in the generated app directory.` | A counter page is served, buttons update the count after activation, and the admin module remains disabled. | `docs/GETTING_STARTED_TUTORIAL.md` |
| `html.binding-simple-counter` | `jsgui3-html` | core API | intro | Minimal standalone MVVM binding example without a browser server. | `node examples/binding_simple_counter.js` | Prints or renders the counter binding flow without launching a browser. | `examples/binding_simple_counter.js` |
| `html.binding-user-form` | `jsgui3-html` | core API | intermediate | Registration form binding, validation, transformation, touch tracking, and submit state. | `node examples/binding_user_form.js` | Demonstrates model/view-model validation and transformed field values. | `examples/binding_user_form.js` |
| `html.binding-data-grid` | `jsgui3-html` | controls | intermediate | Collection binding, sorting, filtering, pagination, and row selection. | `node examples/binding_data_grid.js` | Demonstrates data-grid state updates over a local data set. | `examples/binding_data_grid.js` |
| `html.controls-rendering` | `jsgui3-html` | HTML/rendering | intro | Basic control creation and HTML rendering without MVVM. | `node examples/controls_rendering.js` | Renders basic controls to HTML. | `examples/controls_rendering.js` |
| `html.dev-binding-counter` | `jsgui3-html` | integration | intermediate | Server-side rendering plus client activation for a binding counter. | `node dev-examples/binding/counter/server.js` | Starts a local server, prints a URL, and serves an activated counter. | `dev-examples/binding/counter/client.js`, `dev-examples/binding/counter/server.js` |
| `html.dev-progressive` | `jsgui3-html` | client/browser | intermediate | Shows native, styled, activated, and mixed activation markers. | `node dev-examples/progressive/server.js` | Starts a local server with progressive enhancement examples. | `dev-examples/progressive/client.js`, `dev-examples/progressive/server.js` |
| `html.dev-showcase-app` | `jsgui3-html` | controls | advanced | Polished control showcase with a live Theme Studio and token editor. | `node dev-examples/binding/showcase_app/server.js` | Starts a browser showcase for controls and theme tokens. | `dev-examples/binding/showcase_app/client.js`, `dev-examples/binding/showcase_app/server.js` |
| `html.dev-rich-text-editor` | `jsgui3-html` | controls | advanced | Rich text editor control composition with dedicated styles. | `node dev-examples/rich-text-editor/server.js` | Starts a local rich text editor demo. | `dev-examples/rich-text-editor/client.js`, `dev-examples/rich-text-editor/server.js` |
| `client.window-basic` | `jsgui3-client` | client/browser | intro | Browser runtime example for a basic window control. | `Use as the client entry for a jsgui3-server window example.` | A basic window control can be activated in the browser. | `examples/controls/window-basic/client.js` |
| `client.window-binding-counter` | `jsgui3-client` | client/browser | intermediate | Client-side binding counter within a window control. | `Use as the client entry for a jsgui3-server window binding example.` | A window-hosted counter activates and updates in the browser. | `examples/controls/window-binding-counter/client.js` |
| `client.window-binding-sse` | `jsgui3-client` | client/browser | advanced | Client-side window binding with server-sent event data. | `Use as the client entry for an SSE-backed server example.` | A browser control receives and displays remote observable updates. | `examples/controls/window-binding-sse/client.js` |
| `server.html-rendering` | `jsgui3-server` | HTML/rendering | intro | Server-side HTML rendering entrypoint. | `node examples/html-rendering.js` | Renders HTML from jsgui controls without a browser workflow. | `examples/html-rendering.js` |
| `server.html-server` | `jsgui3-server` | server | intro | Basic jsgui3-server HTML serving example. | `node examples/html-server.js` | Starts a local HTML server. | `examples/html-server.js` |
| `server.jsgui3-html-mvvm-counter` | `jsgui3-server` | integration | intermediate | Implemented example 01 from the server repo jsgui3-html example plan. | `node "examples/jsgui3-html/01) mvvm-counter/server.js"` | Starts a server and serves an MVVM counter page. | `examples/jsgui3-html/01) mvvm-counter/client.js`, `examples/jsgui3-html/01) mvvm-counter/server.js` |
| `server.jsgui3-html-date-transform` | `jsgui3-server` | integration | intermediate | Date parsing, range validation, transformation, and locale formatting in the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/02) date-transform/server.js"` | Starts a server and serves a date transform form with validation and formatted output. | `examples/jsgui3-html/02) date-transform/client.js`, `examples/jsgui3-html/02) date-transform/server.js` |
| `server.jsgui3-html-form-validation` | `jsgui3-server` | integration | intermediate | Multi-field validation example from the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/03) form-validation/server.js"` | Starts a server and serves a validating registration form. | `examples/jsgui3-html/03) form-validation/client.js`, `examples/jsgui3-html/03) form-validation/server.js` |
| `server.jsgui3-html-data-grid` | `jsgui3-server` | controls | intermediate | Collection binding, sorting, filtering, pagination, and row selection in the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/04) data-grid/server.js"` | Starts a server and serves a data-grid page with filter, sort, pagination, and selection behavior. | `examples/jsgui3-html/04) data-grid/client.js`, `examples/jsgui3-html/04) data-grid/server.js` |
| `server.jsgui3-html-master-detail` | `jsgui3-server` | integration | intermediate | Selection syncing, computed detail rendering, and navigation in the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/05) master-detail/server.js"` | Starts a server and serves a master-detail interface with synchronized selection state. | `examples/jsgui3-html/05) master-detail/client.js`, `examples/jsgui3-html/05) master-detail/server.js` |
| `server.jsgui3-html-theming` | `jsgui3-server` | controls | intermediate | Theme tokens, theme overrides, and CSS variable application in the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/06) theming/server.js"` | Starts a server and serves a themed controls page with token-driven style updates. | `examples/jsgui3-html/06) theming/client.js`, `examples/jsgui3-html/06) theming/server.js` |
| `server.jsgui3-html-mixins` | `jsgui3-server` | controls | advanced | Dragable, resizable, and selectable mixin behavior hosted through jsgui3-server. | `node "examples/jsgui3-html/07) mixins/server.js"` | Starts a server and serves cards with mixin-driven interactions. | `examples/jsgui3-html/07) mixins/client.js`, `examples/jsgui3-html/07) mixins/server.js` |
| `server.jsgui3-html-router` | `jsgui3-server` | client/browser | intermediate | Router contract and route switching in the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/08) router/server.js"` | Starts a server and serves a routed page with client-side route switching. | `examples/jsgui3-html/08) router/client.js`, `examples/jsgui3-html/08) router/server.js` |
| `server.jsgui3-html-resource-transform` | `jsgui3-server` | server | advanced | Resource plus Data_Transform pipeline in the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/09) resource-transform/server.js"` | Starts a server and serves a resource transform workflow with observable output. | `examples/jsgui3-html/09) resource-transform/client.js`, `examples/jsgui3-html/09) resource-transform/server.js` |
| `server.jsgui3-html-binding-debugger` | `jsgui3-server` | integration | advanced | BindingDebugger usage for inspecting bindings, state changes, and diagnostics in the server-hosted jsgui3-html suite. | `node "examples/jsgui3-html/10) binding-debugger/server.js"` | Starts a server and serves binding diagnostics alongside an interactive example. | `examples/jsgui3-html/10) binding-debugger/client.js`, `examples/jsgui3-html/10) binding-debugger/server.js` |
| `server.observable-sse` | `jsgui3-server` | server | advanced | Server-sent events and observable publishing with a window control. | `node "examples/controls/15) window, observable SSE/server.js"` | Starts a server and streams observable data to the browser. | `examples/controls/15) window, observable SSE/client.js`, `examples/controls/15) window, observable SSE/server.js` |
| `server.json-simple-api` | `jsgui3-server` | server | intro | Small JSON API server example with diagnostic material. | `node examples/json/simple-api/server.js` | Starts a JSON API server and exposes documented endpoints. | `examples/json/simple-api/server.js`, `examples/json/simple-api/test.js` |
| `server.query-endpoint` | `jsgui3-server` | server | intermediate | Data-view example for query endpoint publishing. | `node "examples/data-views/01) query-endpoint/server.js"` | Starts a query endpoint example server. | `examples/data-views/01) query-endpoint/server.js` |
| `gfx.1bipp` | `jsgui3-gfx-core` | core API | intro | Monochrome pixel buffer operations. | `node examples/1bipp.js` | Creates or manipulates 1-bit-per-pixel buffers. | `examples/1bipp.js` |
| `gfx.24bipp` | `jsgui3-gfx-core` | core API | intro | RGB pixel buffer operations and output examples. | `node examples/24bipp.js` | Creates or manipulates 24-bit RGB buffers. | `examples/24bipp.js` |
| `gfx.fractals` | `jsgui3-gfx-core` | experimental | advanced | Generates image output from pixel buffer operations. | `node examples/fractals.js` | Writes generated image output under the examples output area. | `examples/fractals.js` |
| `modern.serve-site-multipage` | `jsgui3-modern-examples` | integration | advanced | Modern serve_site, Website, Webpage, aliases, redirects, and API endpoint example. | `node serve-site-multipage/server.js` | Prints an auto-port URL and serves home, about, alias, redirect, and /api/status. | `serve-site-multipage/controls.js`, `serve-site-multipage/server.js` |
| `modern.plain-control-document` | `jsgui3-modern-examples` | integration | intermediate | Documents the safe document/widget split: Active_HTML_Document wrapper with a plain Control widget. | `node plain-control-document/server.js` | Prints an auto-port URL and serves a plain-control widget in a document wrapper. | `plain-control-document/controls.js`, `plain-control-document/server.js` |
| `simple.showcase` | `jsgui3-simple-example` | integration | intermediate | Small standalone showcase for Accordion, Alert_Banner, Color_Picker, Button, CSS custom property themes, and server/client split. | `npm start` | Serves a control showcase at http://localhost:52000/. | `client.js`, `server.js` |
| `webpage.composition-tests` | `jsgui3-webpage` | core API | intro | Test-backed reference for Webpage model composition; no example directory was found. | `npm test` | Mocha validates Webpage creation and composition. | `test/webpage.test.js`, `test/webpage_composition.test.js` |
| `website.resolved-model-tests` | `jsgui3-website` | core API | intro | Test-backed reference for Website model behavior; no example directory was found. | `npm test` | Mocha validates Website and resolved model behavior. | `test/website.test.js`, `test/resolved_model.test.js` |
| `ownsite.docs-viewer` | `jsgui3-own-website` | integration | advanced | Full-screen documentation studio: framework overview, live controls, source-backed docs, faceted catalog, control workbenches, examples, and honest status. | `npm start` | Serves the overview-first docs studio; `/docs`, `/controls`, `/examples`, and bounded `/api/docs/*` routes expose real owning-repository content without launching sibling examples. | `server.js`, `client.js`, `controls/Docs_Viewer_Shell.js`, `controls/Control_Catalog.js` |

## Category Map

- Core API: low-level data, model, rendering, or pixel-buffer behavior that does not require a browser.
- HTML/rendering: examples focused on control-to-HTML output and server rendering.
- Client/browser: browser runtime, activation, window behavior, and remote-observable client concerns.
- Server: HTTP serving, JSON APIs, query endpoints, SSE, resources, and server mechanics.
- Controls: reusable UI controls and mixins.
- Integration: examples that compose multiple jsgui3 repos or show a realistic app/server split.
- Experimental: useful demonstrations with heavier output, non-minimal assets, or research flavor.

## Known Gaps

- The manifest is curated, not exhaustive. Use `npm run examples:scan` to list more raw example and tutorial files discovered in sibling repos.
- Server/browser examples are syntax-checked by default; browser interaction checks remain in the owning repo test suites unless `smoke:examples:startup` is explicitly run.
- `jsgui3-server` owns the minimal shell contract, but its implementation is
  currently parked in local stashes rather than present on a branch.
- `jsgui3-webpage` and `jsgui3-website` need first-class runnable examples beyond test-backed references; current ecosystem guidance is in `docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md`.
- The served Webpage/Website example path is contract-only until owner worktrees are clear; see `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md`.
- `jsgui3-modern-examples` is a local non-git sibling. Its shared startup smoke passes locally under a 300s bound but is long; ownership details are in `docs/examples/OWNERSHIP_STATUS.md`.
- `jsgui3-simple-example` declares `npm run smoke`, but the target `tests/smoke.test.js` was missing locally. The owner-side resolution path is in `docs/examples/OWNERSHIP_STATUS.md`.
- `jsgui3-designer` and `jsgui3-own-website` were not included in the curated manifest because no bounded runnable example directory was found.
