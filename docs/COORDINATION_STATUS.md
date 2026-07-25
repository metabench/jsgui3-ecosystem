# jsgui3 Ecosystem Coordination Status

> **Last verified:** 2026-07-25
> **Status:** Active coordination baseline

This is the concise execution-status entry point for the jsgui3 ecosystem. The
canonical coordination repository is `jsgui3-ecosystem`. The sibling
`coordination-jsgui-ecosystem.code-workspace` directory is a local multi-root
workspace shell, not a second documentation authority.

The coordination scaffolding in this repository is currently uncommitted on top
of the initial repository commit. It must be intentionally reviewed and
committed before it becomes durable remote history.

## Repository Taxonomy

| Category | Repositories |
| --- | --- |
| Foundation | `lang-mini`, `oext` (`obext` on npm), `lang-tools` |
| Graphics | `jsgui3-gfx-core` |
| Presentation and models | `jsgui3-html`, `jsgui3-webpage`, `jsgui3-website` |
| Browser runtime | `jsgui3-client` |
| Server runtime | `jsgui3-server` |
| Applications | `jsgui3-designer`, `jsgui3-own-website` |
| Coordination | `jsgui3-ecosystem` |
| Tracked examples/support | `jsgui3-simple-example`, `jsgui3-agents-flowcharts` |
| Local incubator | `jsgui3-modern-examples` (not currently a git repository) |

Implementation belongs in the owning repository. Cross-repo architecture,
ownership, roadmap decisions, contracts, and verification metadata belong here.

## Active Work

### Framework Data Grid and binding contract

- Owner: `jsgui3-html`; status: implemented and locally verified on `master`,
  not yet committed or published.
- `Data_Filter` structured maps now work directly with local `Data_Grid` /
  `Data_Table` processing while scalar and predicate filters remain compatible.
- Grid/table/model paging, sort/page event forwarding, selection DOM/ARIA,
  repeated fresh reconstruction, stale async requests, and teardown are
  covered by focused regressions.
- Both filter and tabular activation persistence are explicit, bounded,
  JSON-safe opt-ins; persisted values are documented as HTML-visible.
- The canonical example now uses the exported controls, and a real Chromium
  gate activates those exports and verifies filter, pointer/keyboard sort,
  page, selection, event cardinality, and browser-console cleanliness.
- Verification: framework 863 passing / 2 pending; MVVM 77 passing; standalone
  checks 32/32, 66/66, and 31/31; reattachment lab and activated browser gate
  pass.
- Durable owner record:
  `jsgui3-html/docs/sessions/2026-07-25-data-grid-binding-hardening/`.

### Live Oracle data-grid example

- The `jsgui3-server` Team Directory example is live at
  <http://141.144.193.218:52000/>.
- Filtering, score sorting, pagination, and model-backed row selection pass a
  public Chromium interaction test.
- A missing optimizer dependency was corrected: reachable `jsgui3-client`
  imports now retain the `resource` and `resource_pool` roots needed during
  client activation.
- The deployment and rollback record is
  [deployments/ORACLE_DATA_GRID_DEMO.md](deployments/ORACLE_DATA_GRID_DEMO.md).
- The broader server-hosted examples browser file currently passes 8/10. The
  remaining timeouts belong to the MVVM counter and binding-debugger examples,
  not the deployed grid.

### Extensive documentation viewer

- Coordination owner: `jsgui3-ecosystem`.
- Implementation owner: `jsgui3-own-website`.
- Reusable control owner: `jsgui3-html`.
- Serving owner: `jsgui3-server`.
- Current state: Phases 1-10 are implemented, tested, and **publicly deployed
  at <http://141.144.193.218:52001/>**.
- Phase 4 added `Control_Catalog` (now 155 canonical controls parsed from the public
  `jsgui3-html` registry), the `GET /controls` index, and a live landing page
  (hero, section navigation, live activated `Source_Code_Viewer`, catalog,
  example summaries) fed by startup statics because the root route is
  pre-rendered at bundle time.
- Phase 5 added an honest `data-activation` indicator that flips only in the
  browser, favicon/robots routes, an iframe load-race fix in
  `Example_Preview_Frame`, the deployed data-grid demo embedded live from the
  checked inventory, and real-browser puppeteer tests (resolved from sibling
  repos, skipping cleanly when unavailable).
- Phase 6 added a full-screen overview-first home,
  accurate ecosystem/component content, responsive semantic Markdown tables,
  framework-themed previews, bounded catalog expansion, repaired example tabs
  and source trees, honest planned-preview states, document metadata, active
  navigation, keyboard/accessibility improvements, responsive workbenches, and
  an explicitly disabled public admin module.
- The subsequent navigation release makes the hosted Data Grid and advanced
  workbenches visible from the first screen, adds sticky home/index contents,
  connects guides to examples through a three-pass learning path, adds compact
  responsive contents navigation, and places the live result beside an inline
  quick guide before each example's numbered docs/source/verification panes.
- Phases 7-9 add progressive metadata-only search, shareable catalog facets,
  synchronized mobile example navigation, the first-viewport live Control
  Atlas, one public-title source, bounded match-aware snippets, reduced-motion
  behavior, atlas focus visibility, and corrected search-selector contrast.
- Phase 10 gives the opening atlas an eight-row SSR page backed by the real
  activated `Data_Grid`/`Data_Table` state lifecycle. The controls now own
  filter, sort, paging, selection, and keyboard behavior; nine reviewed
  previews come from one registry; and deprecated aliases remain compatible
  without entering the canonical inventory.
- Final visual inspection caught a production-only `u25B2` sort label.
  Bundle-safe CSS triangles and a direct extraction regression are now live in
  `20260725-bounded-atlas-sort-fix`.
- Owner tests: 19/19 (11 server + 8 real-browser). Private and public
  182-route gates cover all 155 controls, six documents, six examples, top
  pages, assets, and bounded APIs. Public Chromium reports no errors or
  warnings at desktop and mobile widths.
- The viewer is recorded as `ownsite.docs-viewer` in the examples manifest and
  the docs-viewer inventory. Deployment/rollback record:
  [deployments/ORACLE_DOCS_VIEWER_DEMO.md](deployments/ORACLE_DOCS_VIEWER_DEMO.md).
- Failure analysis, framework contract, performance measurements, and proof:
  [DOCS_VIEWER_RELIABILITY_RESEARCH_2026-07-25.md](DOCS_VIEWER_RELIABILITY_RESEARCH_2026-07-25.md).
- Remaining: deduplicate the old `jsgui3-html@0.0.180` nested dependency that
  still reports server-startup alias warnings; profile cold-start bundle memory;
  evaluate additional deterministic advanced previews and enhanced touch
  targets without displacing the first-viewport atlas; and add domain/TLS
  before production status.

### Website specification API

The target Website/Section/Page model and cross-repo class ownership are
documented in the workspace-local `docs/WEBSITE_SPEC_API_PLAN.md`. The current
evidence-backed matrix is [WEBSITE_SPEC_STATUS.md](WEBSITE_SPEC_STATUS.md):
Phases 1-7 are partial, Phase 8 is not started, and Phase 1 validation is the
earliest defensible implementation gap.

### Webpage/Website served example

The example contract is ready, but implementation remains deferred while
`jsgui3-webpage` and `jsgui3-website` contain active local model/test changes.

### Minimal server documentation-viewer shell

The shell was implemented and tested locally, then parked in `stash@{0}` and
`stash@{1}` before the v0.0.156 release. The stored patches apply cleanly, but
the current checkout and branch/remote history do not contain the owner files.
Recover it on a dedicated owner branch only if the superseded minimal reference
is still worth publishing.

## Immediate Order Of Work

1. Keep this repository as the single coordination authority and remove status
   drift from workspace-local mirrors.
2. Reconcile catalog, dependency, roadmap, and implementation-status records
   against current owner repositories.
3. Documentation-viewer Phases 1-10 are complete and publicly deployed; use the
   recursive improvement prompt for the measured next viewer release.
4. Make contract validation verify files declared seeded or implemented in
   owner repositories.
5. Complete the Website proposal's Phase 1 validation contract, then Phase 2
   shorthand/immutability, using `WEBSITE_SPEC_STATUS.md` as the baseline.
6. Revisit the deferred served example after model-owner worktrees are safe.

## Verification

On 2026-07-25 the following checks passed after the bounded framework-owned
atlas release (with the earlier presentation checks retained below):

- coordinator `npm test` (35/35 tests);
- `npm run docs:check`;
- `npm run docs:viewer:check`;
- `npm run smoke:examples:summary` (all manifest owners passed, including the
  new `ownsite.docs-viewer` entry);
- `npm run examples:scan:summary`;
- `jsgui3-own-website` `npm test` (19/19: 11 real-server tests plus 8
  real Chromium tests);
- `jsgui3-html` reattachment lab, 35 focused tests, and full suite (657/657);
- `jsgui3-html` Markdown viewer tests (6/6) and the focused `jsgui3-server`
  data-grid browser interaction test (1/1);
- 182 HTTP checks and public Chromium verification of
  <http://141.144.193.218:52001/>, including activation, catalog filtering and
  expansion, integrated controls, tabs, source-tree collapse, source copy,
  responsive Markdown tables, live data-grid embedding, bounded missing
  states, APIs, restart persistence, public example titles, manifest
  provenance, match-aware search context, reduced-motion behavior, bounded
  eight-row Data Grid paging, logical ARIA counts/indexes, zero duplicate
  control IDs, one visible guide H1, and zero horizontal or nested-grid
  overflow;
- `jsgui3-server` control-optimizer root-feature tests (11/11) and the public
  Oracle interaction story.

These checks prove internal metadata consistency. Until owner-file existence is
enforced for every implemented contract, they do not by themselves prove that
all recorded implementations are present in the current sibling checkouts.
