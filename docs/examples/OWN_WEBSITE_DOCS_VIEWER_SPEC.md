# Extensive Documentation Viewer Spec (jsgui3-own-website)

Status: owner-implementation contract, Phases 1-6 implemented and publicly deployed on Oracle
Coordination owner: `jsgui3-ecosystem`
Implementation owner: `jsgui3-own-website`
Machine-checked contract: `docs/examples/own_website_docs_viewer_contract.json`
Validation: `npm run docs:viewer:check`

This spec defines the **extensive**, user-facing documentation viewer. It is the
impressive public surface that teaches jsgui3: live activated controls first,
with their real source code (from `jsgui3-html`), example source, prose docs,
run commands, owning repo, and honest status adjacent.

It supersedes the minimal `jsgui3-server/examples/docs-viewer` shell as the
user-facing showcase. That server shell remains a bounded, parked contract
reference (string HTML, no activation); it is recoverable from local stashes but
absent from the current owner checkout. The extensive viewer is a real jsgui3
website built on SSR + client activation.

## Ownership Boundary

- `jsgui3-own-website` owns the runnable website and the **new presentation
  controls** it needs (source-code viewing, source browser, viewer app shell,
  example preview frame, control catalog).
- `jsgui3-html` owns the reusable framework controls reused inside the viewer:
  `Code_Editor`, `Markdown_Viewer`, `Tabbed_Panel`, `Tree_View`, `Panel`,
  `Window`, `Active_HTML_Document`. Require them; do not fork them.
- `jsgui3-server` owns HTTP serving, bundling, and route publication.
- `jsgui3-ecosystem` owns this spec, the contract, the cross-repo inventory
  (`docs/examples/docs_viewer_inventory.json`), and the validation checks.

New controls are built in `jsgui3-own-website` per the explicit product
decision. A control that proves broadly reusable may later be promoted to
`jsgui3-html` through a coordinated change.

## Rendering Model: SSR + Client Activation (not hydration)

jsgui3 is isomorphic. The same control code renders HTML on the server and then
**activates** that exact HTML on the client. The framework reattaches each
control to its existing DOM element (`this.dom.el`) and runs `activate()` to bind
behavior. The client does not re-render or diff a virtual tree.

Canonical lifecycle (see `jsgui3-own-website/AGENTS.md` for the full template):

- Constructor calls `super(spec)`, then composes via `if (!spec.el) this.compose()`.
- `compose()` builds the control tree (runs on server and fresh client).
- `activate()` is guarded by `if (this.__active) return;` and binds DOM events.
- DOM/browser access is always guarded; source text is rendered via `.add()`
  (escaped), never as raw HTML.
- A single `client.js` registers the controls and is passed to `jsgui3-server`
  as `src_path_client_js`.

## User-Facing Page Contract

Each example/control page presents these panes (the contract enforces them):

1. `docs` — prose via `Markdown_Viewer`.
2. `live_preview` — the activated control/example; the first visible signal.
3. `activation_status` — readiness/activation indicator.
4. `framework_source` — runtime/framework source via `Source_Code_Viewer`.
5. `component_source` — control source (from `jsgui3-html`) via `Source_Code_Viewer`.
6. `example_source` — example entrypoint source via `Source_Code_Viewer`.
7. `run_command`, `owner_repo`, `smoke_status`, `related_tests`.
8. `failure_panel` — shows missing repo, missing source, failed command, startup
   timeout, or activation failure without masking it.

## Phase 6 Documentation Studio

The July 2026 redesign makes the viewer a full-screen documentation
application rather than a narrow source browser:

- The landing page begins with the jsgui3 mental model: compose controls,
  render once on the server, then activate the existing DOM in the browser.
- A layered component map explains the language/data, HTML/control, runtime,
  page, and application repositories before visitors reach reference material.
- A curated live gallery embeds real `Button`, `Badge`, `Toggle_Switch`,
  `Progress_Bar`, and `Stat_Card` controls inside the documentation itself.
- The home page shows a curated catalog subset; the complete registry belongs
  on `/controls`, avoiding a multi-thousand-pixel undifferentiated landing page.
- Catalog cards expose category, summary, implementation path, and honest
  dedicated-docs/source-only coverage. Search spans those fields and a category
  facet is available after SSR.
- Control detail pages use a three-column workbench: related-control navigation,
  a wide reading/preview/source canvas, and a sticky page-specific table of
  contents. Only reviewed deterministic preview specs are instantiated.
- Conceptual documentation uses the same workbench and renders Markdown from
  its owning repository. `docs/JSGUI3_OVERVIEW.md` is the canonical start page.
- The presentation expands to large browser windows and collapses to a
  horizontal rail/single-column canvas on phones without horizontal overflow.
- The first viewport exposes direct routes to the hosted advanced Data Grid,
  the framework learning path, and the complete control reference. A sticky
  contents bar keeps the page's major destinations logically navigable.
- Guides pair prose with relevant example workbenches. The documentation index
  recommends a three-pass sequence before presenting the reference library.
- Example workbenches place the live result beside a task-oriented quick guide,
  then keep full documentation and each source/evidence layer in one numbered
  tab sequence.
- Public deployment must construct `jsgui3-server` with `admin: false`; no
  development admin login or default credentials may be exposed.
- Progressive global search is available from every header. Its GET form
  remains useful without activation; Ctrl/Cmd+K, ranked suggestions, arrow
  keys, Enter, Escape, and focus restoration enhance the same bounded index.
- Preview availability is registry-backed. Catalog text, category, and
  coverage facets compose, and previewable controls carry a Live demo badge.
- Compact page contents and source navigation start closed on mobile so the
  primary explanation or live result precedes secondary navigation.

## New Controls

- `Source_Code_Viewer` (implemented) — read-only source pane: filename, language
  label, line numbers, copy-on-activate. The canonical reference control.
- `Source_Browser` (implemented) — `Tree_View` navigator selecting source kind/file.
- `Docs_Viewer_Shell` (implemented) — `Active_HTML_Document` app control composing the page
  via `Tabbed_Panel`, with a live home page, section navigation, and an honest
  `data-activation` indicator that flips only in the browser.
- `Example_Preview_Frame` (implemented) — live example preview via an iframe to the example's
  served route, with an activation/readiness status line. Ready inventory routes
  (such as the deployed public data-grid demo) load live; planned routes stay
  `about:blank`.
- `Control_Catalog` (implemented) — browse/select `jsgui3-html` controls parsed from the
  public registry; anchor cards to each control page plus a client-activated
  name filter and `data-catalog-active` activation marker.
- `Global_Search` (implemented) — progressive GET search with activated,
  keyboard-accessible suggestions from bounded guide/control/example metadata.

## Routes

- `GET /` — landing with a live activated control + catalog links.
- `GET /docs` and `GET /docs/:doc_slug` — source-backed conceptual docs.
- `GET /search?q=<query>` — ranked SSR guide, control, and example results.
- `GET /controls` and `GET /controls/:control_name` — control catalog + page.
- `GET /examples` and `GET /examples/:manifest_id` — examples index + page.
- `GET /api/docs/inventory` — inventory JSON.
- `GET /api/docs/source?manifest_id&kind&index` — source text by kind
  (`docs|framework|component|example`).
- `GET /api/docs/control-source?name=<Control_Name>` — `jsgui3-html` control
  source by name.
- `GET /api/docs/control?name=<Control_Name>` — control category, summary,
  implementation path, and documentation coverage.
- `GET /api/docs/document?slug=<doc_slug>` — bounded document metadata,
  headings, and Markdown source.
- `GET /api/docs/status` — inventory/status JSON without launching examples.
- `GET /api/docs/search?q=<query>` — bounded metadata-only suggestions.

## Source Reading

All filesystem reads happen on the server, inside route/API handlers. Inventory
source refs (`{ repo_path, path }`) resolve against the shared repos root (the
common parent of the sibling repos). Missing files render a visible failure
panel; they never crash and are never hidden.

## Phases

See `jsgui3-own-website/IMPLEMENTATION_PLAN.md` for the detailed phased buildbook
with code skeletons:

1. Scaffold + first runnable page (implemented and tested locally).
2. Source viewing of `jsgui3-html` controls (implemented and tested locally).
3. Example viewing with live preview (implemented and tested locally).
4. Control catalog + home (implemented and tested).
5. Polish, tests, and optional control promotion (implemented).
6. Full-screen Documentation Studio redesign (implemented and deployed).
7. Global discovery, preview coverage, focused guides, and compact mobile
   navigation (implemented; staged deployment gate pending).

## Validation

- Owner side: `node --check controls/Source_Code_Viewer.js`, then once deps are
  installed, `npm install`, `npm start`, `npm test`.
- Coordinator side: `npm run docs:viewer:check` validates this contract together
  with the inventory, the minimal shell contract, and the Webpage/Website
  served-example contract.
