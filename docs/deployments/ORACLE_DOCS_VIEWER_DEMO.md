# Oracle Docs Viewer Deployment

> **Last verified:** 2026-07-25
> **Status:** Bounded framework-owned Control Atlas plus production sort-indicator hotfix online, full-route audited, responsive-Chromium tested, and admin surface disabled

## Live Site

- URL: <http://141.144.193.218:52001/>
- Application: the extensive jsgui3 documentation viewer
- Owner: `jsgui3-own-website`
- Companion demo: the Team Directory data grid remains at
  <http://141.144.193.218:52000/> and is embedded live inside the viewer's
  data-grid example page.

The site is real jsgui3 SSR plus client activation served through
`jsgui3-server`. The redesigned landing page now explains the framework and its
software layers beside an opening Control Atlas built from the real jsgui3
`Panel` and `Data_Grid`. The first response contains a useful eight-row page
while activated filtering, sorting, paging, keyboard selection, and inline
previews keep all 155 canonical registry controls discoverable. The hosted
application, embedded controls, self-source view, source-backed documentation
paths, curated catalog, and checked examples follow. The complete 155-control
catalog has composable text, category, and coverage facets, while every page
exposes progressive global search. Control and document pages use wide
workbenches with related navigation, page-specific contents rails, Markdown
documentation, reviewed live-preview states, and real source.

The public server is constructed with `admin: false`. `/admin`, `/admin/v1`,
`/admin/v1/login`, and `/api/admin/v1/status` return HTTP 404; the development
`admin/admin` login that was exposed by the previous release is no longer
published.

## 2026-07-25 Production Sort-Indicator Hotfix

- Current release root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas-sort-fix`
- Immediate rollback root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas`
- Final visual inspection found the production bundle displaying `u25B2`
  beside a sorted column. The original Unicode triangle in a JavaScript CSS
  template had been serialized as `\u25B2`; that is a JavaScript escape, not a
  valid CSS escape.
- `Data_Table` now draws ascending, descending, and available-sort indicators
  with ASCII-only CSS borders. The hotfix adds a regression assertion over the
  extracted sort-indicator CSS. The explicit two-file overlay hashes matched:
  - `Data_Table.js`:
    `73bbfc68e2979a2ab76b38268ac0d2bbdfa0dffbd65951bcb2c0fcba188c809b`
  - `data_grid_activation_state.test.js`:
    `01bdf343e29994c68e1735a1ad0a7ed03de8bc1ae96a13f3dc38639f51b9b8b8`
- The focused hotfix suite passed 10/10, the broader focused framework suite
  passed 35/35, the complete framework suite passed 657/657, and the owner
  suite remained 19/19.
- The private candidate and final public release each passed 182/182 generated
  routes and all bounded admin/search/traversal checks. Desktop and mobile
  Chromium computed an empty generated-content string with a 6px CSS triangle,
  showed `aria-sort=ascending` and Accordion first, found no `u25B2` text,
  retained eight rows and zero overflow, and emitted no warnings/errors.
- Final home responses are 269,620 bytes raw, 32,561 bytes gzip, and 25,822
  bytes Brotli. Direct public Chromium transferred 32,861 bytes and measured
  1,002 nodes. Five fresh external requests returned 200 with 54–136 ms TTFB.
- Canonical docs process: PM2 id 244, PID 967225, port 52001, zero restarts,
  build `20260725-bounded-atlas-sort-fix`. It settled in the 170–177 MiB
  range after the public gate. `jsgui3-data-grid` remained PID 801978 on port
  52000,
  `crawl-server-v4` remained PID 929760 on port 3200, and all six crawler
  workers remained stopped. The final PM2 state was saved.

## 2026-07-25 Bounded Framework-Owned Control Atlas Release

- Base release root (historical):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas`
- Immediate rollback root at release time:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-public-search`
- The opening atlas now renders one eight-row SSR page out of 155 canonical
  controls. The real activated `Data_Grid`/`Data_Table` owns filtering,
  sorting, 20-page navigation, single-row selection, and arrow/Home/End
  keyboard behavior; the viewer no longer simulates these operations by
  hiding and moving DOM rows.
- `jsgui3-html` gained an additive
  `persist_activation_state: true` contract for bounded, JSON-safe static
  tables. Fresh activation restores model state while retaining the exact SSR
  page, binds the grid/table bridge once, and maintains logical ARIA row counts
  and page-offset row indexes. Functions, adapters, class instances, cycles,
  and oversized data are rejected.
- Dynamic table rows now use a table-aware contextual fragment. Deprecated
  top-level `FormField` and `PropertyEditor` aliases are lazy and
  non-enumerable, while direct compatibility access still warns and returns
  the canonical constructor.
- The shared preview registry contains nine deterministic controls.
  `Tabbed_Panel`, `Markdown_Viewer`, and `Panel` now have equivalent detail-page
  demos as well as opening-atlas previews.
- The deterministic framework lab, 34 focused tests, and all 656 framework
  tests passed. The owner suite passed 19/19 (11 HTTP and eight real Chromium);
  the private Oracle owner HTTP suite passed 11/11. Coordinator tests passed
  35/35, followed by `docs:check` and `docs:viewer:check`.
- Private port 52101 and public port 52001 each passed all 182 generated
  routes: 155 controls, six guides, six examples, five top/search pages, three
  assets, and seven APIs. Four admin routes remained 404, invalid search 400,
  traversal 404, and robots 200.
- Public desktop Chromium measured 1,002 document nodes, eight rendered rows,
  155 logical controls, `aria-rowcount=156`, zero duplicate HTML or jsgui
  control IDs, and atlas/header y=167/299 at 1440×900. Filtering selected the
  Toggle Switch preview, the Button preview activated, name sorting began with
  Accordion, page 2 retained eight rows and began at `aria-rowindex=10`, and
  End moved selection while focus remained on the table.
- Public mobile Chromium measured atlas/header y=189/397 at 390×844, two
  deliberate columns, eight rendered rows, working Markdown Viewer filtering
  and page navigation, and no page, horizontal-grid, or nested vertical-grid
  overflow. Desktop and mobile emitted no browser warnings or errors.
- Fresh home responses are 269,611 bytes raw, 32,556 bytes gzip, and 25,814
  bytes Brotli. Direct public Chromium transferred 32,856 bytes versus the
  previous 45,782. Five fresh external requests returned 200 with 55–127 ms
  TTFB; hot Oracle loopback responses were roughly 0.5–0.6 ms.
- Production bundle startup briefly peaked near 2 GiB, then the public process
  settled near 315 MiB after route/browser verification. The host retained
  roughly 10 GiB available memory and 55 GiB free disk.
- Canonical docs process: PM2 id 242, PID 966661, port 52001, zero restarts,
  build `20260725-bounded-atlas`. `jsgui3-data-grid` remained PID 801978 on
  port 52000 and `crawl-server-v4` remained PID 929760 on port 3200. All six
  crawler workers remained stopped. PM2 state was saved only after the public
  gate.
- One old `jsgui3-html@0.0.180` dependency nested under
  `jsgui3-webpage` still prints the historical alias deprecations during
  server startup. It was not patched in `node_modules`; the public browser is
  clean, and dependency deduplication remains separate owner work.
- No OCI ingress, firewall, DNS, TLS, crawler, worker, or standalone Data Grid
  state was changed.

## 2026-07-25 Public Naming and Match-Aware Search Release

- Current release root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-public-search`
- Immediate rollback root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-control-atlas`
- `example_public_title.js` is now the one isomorphic naming source for HTML
  titles, page headings, cards, preview labels, and search results. The Data
  Grid page is titled “Data grid team directory · jsgui3”; its stable
  `server.jsgui3-html-data-grid` manifest ID remains visible provenance.
- Search keeps its deterministic ranking and existing request bounds while
  returning a public `match` object limited to 180 characters. Match context
  is derived only from public titles, guide headings, summaries, and control
  categories; source bodies, inventory paths, and host paths are excluded.
  Progressive suggestions and SSR result cards now show this matched context.
- The shell honors `prefers-reduced-motion: reduce`, the keyboard-operated
  opening Data Grid has an explicit focus ring, and the result-type selector
  has deliberate dark-on-white contrast on the search page.
- The explicit first overlay contained nine reviewed owner/contract files;
  their SHA-256 hashes matched local sources. The final documentation overlay
  records this release without changing runtime code or dependencies.
- Local validation passed 19/19 tests, including all eight real Chromium
  tests. The Oracle owner suite passed 11 HTTP tests with eight browser tests
  explicitly skipped because Puppeteer is not installed on the host. Both
  ecosystem checks passed.
- Private port 52101 and public port 52001 each passed the 184/184 route gate:
  157 controls, six guides, six examples, five top/search pages, three assets,
  and seven APIs. All four admin routes remained 404, invalid search 400,
  traversal 404, and robots 200.
- Private and public Playwright verified the exact protected atlas geometry:
  desktop atlas/header y=167/299 at 1440×900 and mobile y=189/397 at 390×844.
  Filtering selected the activated Toggle Switch preview; the 390px document
  had no horizontal overflow; the live Team Directory remained embedded.
  Public Data Grid and search HTML titles were correct, and the tested pages
  emitted no browser warnings or errors.
- Fresh responses measured 436,743 bytes raw / 33,580 bytes Brotli for `/`.
  The checked `activation` search response was 926 bytes. The atlas still
  exposes all 157 SSR rows and an accessibility-tree row extent of roughly
  6,308px; bounded windowing remains a measured follow-up.
- Canonical docs process: PM2 id 240, PID 964624, port 52001, zero restarts,
  build `20260725-public-search`. `jsgui3-data-grid` remained PID 801978 on
  port 52000. The crawler already present before this release remained
  `crawl-server-v4` PID 929760 on port 3200, and all six crawler workers
  remained stopped. No ingress, firewall, crawler, worker, or Data Grid state
  was changed.

## 2026-07-19 Opening Control Atlas Release

- Current release root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-control-atlas`
- Immediate rollback root (untouched search/navigation release):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-search-navigation`
- The first desktop viewport now pairs a concise jsgui3 explanation with a
  `Panel`-framed `Data_Grid` over the complete 157-control registry. Its rows,
  direct coverage state, live count, category/text filtering, header sorting,
  row selection, and arrow/Home/End keyboard navigation activate against the
  server-rendered tree.
- The linked preview pane runs real Button, Badge, Toggle Switch, Progress Bar,
  Stat Card, Markdown Viewer, Tabbed Panel, Panel, and Data Grid compositions.
  Other entries retain honest registry metadata plus their docs/source route.
- At 1440×900 the atlas begins at y=167 and the grid header at y=299. At
  390×844 the atlas begins at y=189 and the compact Control + Guide header at
  y=397, with several complete records in the first viewport and no horizontal
  page or grid overflow. A missing mobile viewport declaration discovered by
  real device emulation was fixed and covered by SSR/browser assertions.
- Final local Chromium passed 8/8. The Oracle owner suite passed all 11 HTTP
  tests with eight browser tests explicitly skipped because Puppeteer is not
  installed there; private and public Playwright supplied the browser proof.
  Both ecosystem checks passed on the candidate.
- Private and public gates each passed 184/184 generated routes: 157 controls,
  six documents, six examples, five top-level/search pages, three assets, and
  seven bounded APIs. Four admin routes remained 404, invalid search remained
  400, traversal remained 404, and robots remained 200.
- Public Playwright proved atlas activation/filtering, Button and Toggle state,
  mobile geometry, no unexpected console warnings/errors, and the embedded
  Team Directory advancing to page 2 of 3. PM2 was saved only after this gate.
- Canonical docs process: PM2 id 226, PID 904938, port 52001, zero restarts,
  build `20260719-control-atlas`. `jsgui3-data-grid` (PID 801978, port 52000)
  and `crawl-server-v4` (PID 750430, port 3200) retained their PIDs, working
  directories, and zero-restart state.
- Fresh public measurements: home 436,740 bytes uncompressed / 33,578 bytes
  Brotli with roughly 136 ms TTFB; `/controls` 283,036 bytes uncompressed; the
  “data grid” search response 1,316 bytes with roughly 122 ms TTFB. The larger
  home DOM and framework alias deprecation warnings remain explicit follow-up
  opportunities.

## 2026-07-19 Search, Catalog, and Workbench Navigation Release

- Current release root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-search-navigation`
- Immediate rollback root (untouched discovery release):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-discovery`
- Search metadata is built once at server startup and reused. Public results
  have stable guide/control/example kinds, human-readable example titles,
  deterministic ranking, optional kind filtering, and bounded 80-character,
  eight-term, 30-result limits. Suggestions cancel stale requests, announce
  loading/empty/error states, maintain correct listbox selection semantics,
  and never expose source bodies or host paths.
- The full control catalog now has progressive `q`, `category`, and `coverage`
  GET state. Shared URLs server-render the selected fields, result count, and
  matching cards, then activation keeps the URL current with `replaceState`.
  The smaller landing-page catalog deliberately keeps `/` unchanged.
- Example workbenches render one `Source_Browser` and one Tree View. It is
  visible on desktop and a closed native disclosure at mobile width. A
  six-step, horizontally scrollable mobile navigator provides 44px targets,
  complete accessible names, one current step, one visible/focusable panel,
  and synchronized desktop arrow-key navigation.
- Local owner validation passed 18/18, including seven real Chromium tests.
  The Oracle HTTP owner suite passed 11/11, and ecosystem `docs:check` plus
  `docs:viewer:check` passed locally and on the candidate.
- Private 52101 and public 52001 gates each passed 184/184 generated routes:
  157 controls, six documents, six examples, five index/search pages, three
  assets, and seven bounded APIs. Admin routes remained 404 and invalid search
  or traversal requests remained bounded.
- Playwright at 1920×1080 and 390×844 confirmed activation, the embedded Team
  Directory, persisted catalog filters, a single source tree, the mobile
  stepper, one visible panel, closed native source disclosure, zero page
  overflow, and zero console errors. PM2 was saved only after the public gate.
- `jsgui3-data-grid` (PID 801978, port 52000) and `crawl-server-v4` (PID
  750430, port 3200) retained their PIDs, working directories, and zero-restart
  state throughout the release.

## 2026-07-19 Discovery, Coverage, and Focused Guides Release

- Release root (historical):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-discovery`
- Rollback root at release time (navigation-polish release):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-navigation-polish`
- Every header now contains a native GET search form. `GET /search` renders
  ranked SSR links, while `GET /api/docs/search` supplies at most 12
  metadata-only suggestions for Ctrl/Cmd+K, arrow-key, Enter, and Escape
  interaction. Exact and punctuation-normalised control titles rank first and
  no absolute source paths are returned.
- Preview availability now comes from one client-safe registry. Catalog cards
  advertise Live demo coverage and combine text, category, and coverage
  filters; the current reviewed set contains six inline or hosted previews.
- MVVM Counter, Data Grid, and Binding Debugger now have focused task-oriented
  guides in their owning example directories. The checked inventory references
  those guides instead of the generic suite plan.
- Mobile document contents and example source navigation are closed native
  disclosures by default. Primary explanation/live content follows directly,
  touch targets are roughly 44px, and the tested 390px layout has no document
  overflow.
- The compact footer reports package versions, inventory verification date,
  and build `20260719-discovery` without host paths or secrets.
- Local owner tests passed 18/18, including seven Chromium tests. The Oracle
  owner HTTP suite passed 11 tests with seven browser tests explicitly skipped
  because Puppeteer is not installed there; private and public Playwright gates
  supplied the real-browser proof instead. Ecosystem `docs:check` and
  `docs:viewer:check` passed locally and on the candidate.
- The private 52101 candidate and public 52001 release each passed a generated
  184/184 sweep: 157 control pages, six documents, six examples, five
  top-level/search pages, three assets, and seven bounded APIs. Public
  Playwright confirmed activation, search ranking/navigation, six-result Live
  demo filtering, the hosted Team Directory, closed mobile disclosures, zero
  390px overflow, and zero console errors. The known client bundle emits two
  existing deprecation warnings for legacy `FormField` and `PropertyEditor`
  aliases.
- PM2 was saved only after the public gate. `jsgui3-data-grid` (port 52000) and
  `crawl-server-v4` (port 3200) retained their original PIDs, working
  directories, and zero-restart state throughout the release.

## 2026-07-19 Navigation and Inline Examples Release

- Release root (historical):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-navigation-polish`
- Rollback root at release time (navigation release):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-navigation`
- The first screen now gives three explicit routes into jsgui3: run the hosted
  Data Grid, learn the server-render/activate model, or inspect the 157-control
  reference. A sticky page contents bar keeps live examples, the learning path,
  architecture, controls, and source sections directly reachable.
- The deployed Data Grid is embedded near the start of the home page beside a
  task-oriented guide. Binding diagnostics, theme composition, and the
  self-documenting studio are promoted as advanced workbenches before the
  architecture/reference material.
- `/docs` now provides a three-pass guide-and-example learning path before the
  source-backed library. Document and control pages add responsive compact
  contents navigation while retaining their wide desktop rails.
- `/examples` separates advanced workbenches from focused foundations. Each
  example opens with the live result and quick guide together, followed by a
  numbered sequence for the full guide, framework source, control source,
  server source, and run/verification evidence.
- The owner suite passed 16/16 and `npm run docs:viewer:check` passed. The
  private port-52101 candidate and the public port-52001 release each passed
  182 HTTP checks (157 controls, six documents, six examples, indexes, assets,
  and bounded APIs). Chromium verified the embedded application, tab actions,
  one visible guide title, compact mobile contents, zero horizontal overflow,
  and zero console errors before and after cutover.
- A separately staged final polish increased the route-label column and added
  a measured 10px gap before route titles, removing the desktop collision on
  `REFERENCE`. The polish candidate repeated all 182 route checks and public
  Chromium confirmed the corrected geometry, embedded Data Grid, zero
  overflow, and zero console errors before PM2 state was saved.

## 2026-07-19 Redesign Release

- Release root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-084601`
- Rollback root (untouched previous deployment):
  `/home/ubuntu/apps/jsgui3-docs-viewer`
- Base release archive SHA-256:
  `538611dc98af212dff7be7eb72d172a99dfefa50f11ab5303bdf38012dbe06cf`
- The release was created by copying the complete known-good deployment, then
  overlaying only the intended owner viewer files and explicit ecosystem docs.
  This preserved the seven-sibling layout, relative `node_modules` links, and
  deployment-local package rewrites without shipping unrelated local worktree
  changes.
- Two explicit follow-up overlays added the integrated-control activation
  checks/handlers and the final deployment/inventory records. Neither changed
  dependencies or sibling framework code; the candidate was restarted and the
  complete browser/security gate was repeated before cutover.
- The candidate ran privately as `jsgui3-docs-viewer-candidate` on port 52101.
  Loopback route/security checks and real Chromium at 1920×1080 and 390×844
  passed before the port-52001 cutover.
- PM2 state was saved only after the public deployment passed HTTP, activation,
  interaction, responsive overflow, API, and security checks.

## 2026-07-19 Markdown Parser Hotfix

- Release root (historical):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-markdown-fix`
- Rollback root at release time (redesign release):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-084601`
- A blank blockquote separator (`> `) or a CRLF heading could leave
  `Markdown_Viewer.md_to_controls()` on a special-looking line without
  advancing its input index. Because rendering is synchronous, one affected
  page then blocked the Node event loop and made every route on port 52001
  appear unavailable while PM2 still reported the process as online.
- The reusable parser now normalises line endings, consumes empty blockquote
  lines, and has a defensive progress invariant. Unit coverage records both
  triggering forms, while the owner HTTP suite now renders all six conceptual
  documents plus the self-documenting viewer example.
- The fix was staged under a separate hard-linked release on private port
  52101. All 169 generated detail links passed there: 157 controls, six
  documents, and six examples. The known affected routes and the live public
  tutorial were also verified in Chromium with no console errors before and
  after cutover. PM2 state was saved after the public checks passed.

## 2026-07-19 Presentation and Reliability Release

- Release root (historical):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-presentation`
- Rollback root at release time (parser-hotfix release):
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-markdown-fix`
- The landing page was rebuilt as a full-screen framework introduction: a
  precise server-render/activate explanation, package-layer map, model
  characteristics, embedded controls, self-source view, documentation routes,
  control catalog, and checked examples now form one deliberate narrative.
- The control catalog initially exposes 48 useful entries for scanability and
  expands to all 157 without losing full-registry search. Control pages add
  related navigation, documented/curated preview states, and a live hosted
  Data_Grid application preview where the inventory supports it.
- Example workbenches now use the registered framework `Tabbed_Panel` and
  `Tree_View` controls. One panel is visible at a time, inactive content is
  removed from the focus order, source groups collapse, planned previews do
  not create blank frames, and deployed previews use a restricted iframe
  sandbox.
- Framework CSS is served from a bounded vendor route, plain-HTTP source copy
  has a compatible fallback, Markdown tables render semantically in responsive
  scroll containers, global navigation identifies the active section, and
  every page has a meaningful title, language declaration, skip link, and
  footer.
- The release ran privately as `jsgui3-docs-viewer-candidate` on port 52101.
  The owner suite passed 16/16 (including six browser tests), the reusable
  Markdown suite passed 6/6, and the focused data-grid interaction test passed.
  After cutover, 182 public HTTP checks passed: all 157 control pages, six
  document pages, six example pages, indexes, assets, and bounded metadata
  APIs. Public Chromium reported no errors or warnings at desktop and mobile
  widths.

## Runtime Layout

| Item | Value |
| --- | --- |
| Oracle host OS | Ubuntu |
| Remote application directory | `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas-sort-fix/jsgui3-own-website` |
| Sibling repo working trees | `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas-sort-fix/{jsgui3-client,jsgui3-html,jsgui3-server,lang-tools,jsgui3-ecosystem,jsgui3-modern-examples}` |
| PM2 process | `jsgui3-docs-viewer` |
| Entrypoint | `server.js` (`PORT=52001`) |
| TCP port | `52001` |
| Bindings | loopback and the Oracle private interface |
| Public protocol | HTTP |

The deployment ships the local working trees of the sibling repositories
(including the uncommitted `jsgui3-server` control-optimizer correction), so
the server reads real control/example source from the same sibling layout the
viewer uses locally. Local Windows checkouts remain the source of truth; the
host copies are deploy artifacts.

Because the local `jsgui3-html@0.0.188` and `jsgui3-client@0.0.130` versions
are ahead of the npm registry, the deployed copies of
`jsgui3-client/package.json` and `jsgui3-server/package.json` carry
**deployment-local `file:` rewrites** pointing at the shipped sibling trees.
These rewrites exist only on the host and must be reapplied if those
`package.json` files are re-shipped.

## Ingress

- Host `iptables` INPUT rule for TCP 52001 (comment: `jsgui3 docs viewer
  HTTP`), persisted via `netfilter-persistent save`.
- OCI security-list ingress rule for TCP 52001 (description: `jsgui3 docs
  viewer HTTP`) added to the subnet security list with the local `oci` CLI
  using the machine's standard `~/.oci` configuration. No key material is
  stored in any repository.
- PM2 startup was already systemd-enabled; the process list including
  `jsgui3-docs-viewer` has been saved (`pm2 save`).

## Verification Performed

Current local owner tests: 19/19 (`npm test` in `jsgui3-own-website`,
including eight real-browser tests). The `jsgui3-html` reattachment lab,
35 focused tests, and complete 657-test suite pass. Coordinator tests pass
35/35, followed by `npm run docs:viewer:check` and `npm run docs:check` in
`jsgui3-ecosystem`. The staged candidate and deployed public site were then
tested in real Chromium:

1. home HTTP 200; activation indicator flips from `pending` to `complete`;
2. the overview-first home, layered component map, embedded control stage,
   self-source viewer, document cards, catalog, and examples all render;
3. catalog reports 155 canonical registry controls; text/category filtering works after
   activation, including metadata fields rather than name alone;
4. the opening atlas retains eight SSR rows, reports all 155 logical controls,
   preserves `aria-rowcount=156`, and delegates filter, sort, paging,
   selection, and keyboard behavior to the activated Data Grid;
5. the integrated Button and Toggle Switch demonstrations change state after
   activation;
6. `/docs/overview` renders the canonical ecosystem Markdown with navigable
   heading fragments and a page-specific contents rail;
7. `/controls/Data_Grid` renders dedicated `jsgui3-html` docs, an honest
   curated-preview state, related controls, contents rail, and real source;
8. layouts at 1440×900 and 390×844 have no horizontal document or nested-grid
   overflow;
9. nav reaches `/controls`; the Button card navigates to `/controls/Button`
   showing a live reviewed preview plus the real `jsgui3-html` Button source;
   the source copy button responds after activation;
10. `/examples` lists all six inventory entries; the MVVM counter page switches
   tabs after activation and keeps its planned preview on `about:blank`;
11. the data-grid example page embeds <http://141.144.193.218:52000/> live in
   its preview frame; the frame renders the Team Directory content and
   readiness reaches `loaded`;
12. unknown document/control/example paths return bounded 404 states;
13. the previous APIs plus `/api/docs/control` and `/api/docs/document` return
    real bounded metadata; source traversal-like input remains rejected;
14. all four admin routes above return 404 and no current startup log reports
    active default credentials;
15. the public Chromium console has no errors or warnings, and activation,
    catalog filtering, live-control interaction, contents navigation, source
    copy, and responsive geometry pass.

Hotfix verification additionally rendered every generated detail link on the
private candidate (169/169 HTTP 200), reran the focused owner document suite,
and loaded both previously fatal Markdown forms. Public checks then confirmed
the correct host and port with HTTP 200 responses for the tutorial, the
self-documenting example, dedicated CRLF-backed control docs, and status API.

Presentation-release verification additionally checked all 182 public routes
and assets, activation, integrated Button and Toggle interactions, catalog
filtering and expansion, source copy over HTTP, tab switching, tree collapse,
planned-preview suppression, the deployed Data_Grid embed, semantic tables,
one-title document metadata, and zero horizontal overflow at 1440×1000 and
390×844.

## Operations and Rollback

SSH access uses the machine's standard SSH configuration (`oracle-worker`
host entry); no key material lives in any repository.

Useful on-host checks:

```bash
pm2 status
pm2 logs jsgui3-docs-viewer --lines 100
curl -f http://127.0.0.1:52001/
sudo ss -ltnp | grep 52001
```

Future releases should repeat the staged process: copy the complete current
release to a timestamped candidate, overlay an explicit intended-file manifest,
clear only the candidate cache, validate on an unexposed temporary port, then
cut over the canonical PM2 name. Do not tar the dirty local multi-repo workspace
or replace sibling repositories wholesale.

Rollback for the current sort-fix release: delete the current
`jsgui3-docs-viewer` PM2 entry,
start `server.js` from
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas/jsgui3-own-website`
with `PORT=52001`, build `20260725-bounded-atlas`, and the canonical process
name, validate loopback/public HTTP, then `pm2 save`. Older rollback roots
remain at
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-public-search`,
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-control-atlas`,
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-presentation`,
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-markdown-fix`,
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260719-084601` and
`/home/ubuntu/apps/jsgui3-docs-viewer`.
This does not touch the data-grid demo (port 52000), crawler (port 3200), or
unrelated legacy `~/apps/docs-viewer` directory.

## Known Limits

- HTTP only; a domain, TLS, and reverse proxy are required before treating
  this as a production endpoint.
- The Node process peaked near 2 GiB RSS during startup bundling and settled
  in the 170–177 MiB range after the final public gate. Profile this cold-start
  path before reducing host memory or increasing candidate concurrency.
- The landing page's catalog/example summaries are read once at startup
  (the root route is pre-rendered at bundle time); restart the process after
  changing the inventory. API and example routes read the inventory per
  request.
- One historical `jsgui3-html@0.0.180` dependency nested under
  `jsgui3-webpage` still emits server-startup alias warnings. Resolve it
  through the dependency owner; do not patch installed packages.
- The opening atlas uses a bounded eight-row page over 155 canonical controls.
  Its mobile pager is 36px high, above WCAG 2.2's minimum; a future pass can
  test the enhanced 44px target without displacing the first-viewport rows.
- The public endpoint is an IP address. Links and embedded preview routes are
  intentionally recorded with `141.144.193.218`; replace them together when a
  stable domain and TLS terminator are introduced.
