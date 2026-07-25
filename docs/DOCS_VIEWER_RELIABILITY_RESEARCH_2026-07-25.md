# Docs Viewer Reliability Research — 2026-07-25

## Outcome

The publicly deployed opening Control Atlas now has a defensible application
contract rather than a page-specific DOM simulation:

- `Data_Grid` and `Data_Table` remain the controls that own filtering, sorting,
  paging, keyboard selection, and row data.
- The first response contains one useful eight-row page while ARIA exposes all
  155 canonical registry controls.
- Fresh browser activation retains the exact server-rendered rows, restores a
  bounded static model, and enables later targeted table updates.
- Preview availability has one registry shared by the opening atlas, catalog,
  search metadata, and control detail pages.
- Deprecated compatibility aliases remain callable, but canonical registry
  load no longer reports that they were used or lists them as canonical
  controls.

This is an opt-in additive framework change. Existing tables do not serialize
their model unless `persist_activation_state: true` is specified.

## Scope and ownership

| Concern | Owning repository | Change |
| --- | --- | --- |
| Viewer composition and navigation | `jsgui3-own-website` | Bounded atlas, explicit pager, unified previews |
| Reusable tabular lifecycle | `jsgui3-html` | Static activation state, reattachment bridge, table-context DOM updates |
| Cross-repository decision and release evidence | `jsgui3-ecosystem` | This record and Oracle deployment record |

No stable constructor default was changed. Function-backed, adapter-backed,
cyclic, non-plain, oversized, and otherwise non-JSON-safe data is rejected by
the persistence bridge and retains the previous behavior.

The verified public release is
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas-sort-fix` at
<http://141.144.193.218:52001/>. Its immediate rollback is
`/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas`; the full
process and cutover evidence is in
[the Oracle deployment record](deployments/ORACLE_DOCS_VIEWER_DEMO.md).

## Baseline evidence

The public release at `http://141.144.193.218:52001/` was inspected before
implementation:

| Measure | Public baseline | Public bounded release | Change |
| --- | ---: | ---: | ---: |
| Opening table DOM rows | 157 | 8 | bounded page |
| Main-document DOM nodes | 1,898 | 1,002 | -47.2% |
| Raw home HTML | 436,743 bytes | 269,620 bytes | -38.3% |
| Brotli home HTML | 33,580 bytes | 25,822 bytes | -23.1% |
| Direct-public Chromium transfer | 45,782 bytes | 32,861 bytes | -28.2% |
| Horizontal overflow, 1440×900 / 390×844 | none / none | none / none | retained |

The new values are measured from the final public release after client
activation. Direct Chromium over the current insecure HTTP endpoint negotiated
gzip (32,561-byte encoded body plus transfer overhead); a Brotli-enabled curl
download was 25,822 bytes. Navigation byte fields use the browser's
standardized Performance Navigation Timing entry, not a hand-timed
approximation; see
[Navigation Timing Level 2](https://www.w3.org/TR/navigation-timing-2/).

## Failure analysis

### 1. The opening grid was visually a Data Grid but behaviorally app-owned

Server rendering produced a real `Data_Grid`, but a fresh client constructor
received only its DOM element. Rows, columns, selection mode, and composition
listeners were absent. The viewer therefore filtered hidden `<tr>` elements,
manually reordered rows, and implemented its own keyboard state.

The reproducer at
[`lab/experiments/001-data-grid-reattach`](../../jsgui3-html/lab/experiments/001-data-grid-reattach/README.md)
proved the distinction between same-instance activation and a real fresh
browser context.

### 2. Dynamic table rendering used an invalid parsing context

The generic live-content path parsed a newly rendered `<tr>` inside a `<div>`.
HTML parsing correctly discarded the table structure and retained only text.
This was invisible while the viewer manually moved existing rows. The
framework now creates contextual fragments against the live `table`, `thead`,
`tbody`, `tfoot`, or `tr` parent.

### 3. Full SSR and `content-visibility` solve different problems

Rendering all rows produced useful no-JavaScript content but also duplicated
the complete registry across HTML, DOM controls, accessibility nodes, and
client work. CSS `content-visibility: auto` may skip off-screen rendering, but
it does not remove the HTML or DOM model, and containment has accessibility
behavior that needs care; see
[CSS Containment Level 2](https://www.w3.org/TR/css-contain-2/).

For 155 records, ordinary paging is simpler, testable, and more robust than
virtual scrolling. Virtual mode remains available for genuinely large data
sets.

### 4. Preview truth had drifted

The opening atlas instantiated nine reviewed controls while catalog/search
metadata reported only six. `Tabbed_Panel`, `Markdown_Viewer`, and `Panel`
therefore appeared live on the home page but unavailable on their detail
pages. `PREVIEW_CONTROL_NAMES` is now the single ordered source used by all
surfaces, and every declared preview has a deterministic detail-page
implementation.

### 5. Deprecated aliases warned during registry bootstrap

`FormField` and `PropertyEditor` called the deprecation helper at module load.
This made a normal application bootstrap look like deprecated API usage and
also allowed compatibility aliases to enter the canonical inventory.
Compatibility access is now lazy and non-enumerable at the top level. Actual
access still returns the canonical constructor and warns once.

One installed `jsgui3-webpage` dependency tree still contains
`jsgui3-html@0.0.180`, so local server startup can print the old warnings until
that package dependency is deduplicated. It does not alter the new canonical
bundle contract and is deliberately not patched inside `node_modules`.

## Implemented contract

`persist_activation_state: true` is accepted by static `Data_Table` and
`Data_Grid` composition.

The serialized state is:

- versioned;
- limited to 500 rows, 64 columns, 131,072 characters, and nesting depth 20;
- restricted to finite JSON primitives, arrays, and plain objects;
- rejected if it contains functions, symbols, bigints, cycles, class
  instances, or oversized data;
- restored before the client-side computed pipeline is created;
- used for later interaction only, so initial activation does not replace the
  SSR row nodes.

The browser reattachment path also:

- restores private head/body lookups used for subsequent targeted renders;
- restores the `Data_Grid` → `Data_Table` event bridge exactly once;
- preserves a full logical `aria-rowcount`;
- offsets `aria-rowindex` correctly on later pages;
- supports Home/End in addition to ArrowUp/ArrowDown;
- keeps the rendered page bounded after sort, filter, page, and selection
  changes.

The composite grid behavior follows the focus and keyboard expectations in the
[WAI-ARIA Authoring Practices Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).
The DOM reduction also directly addresses the browser costs summarized in
[Chrome's large DOM guidance](https://developer.chrome.com/docs/lighthouse/performance/dom-size).

## Verification outcome

The release passed all of the following before and after public cutover:

1. Framework experiment and focused unit tests:
   - legacy non-opt-in behavior;
   - opt-in rejection bounds;
   - exact SSR-node retention;
   - model restoration;
   - sort, page, filter, keyboard, and selection behavior;
   - one selection event per click;
   - no duplicate control IDs;
   - logical ARIA counts and indexes.
2. Owner HTTP tests for routes, sources, catalog metadata, and every newly
   unified preview.
3. Owner Chromium tests at desktop and mobile widths.
4. Visual inspection of the opening viewport, filtered state, sorted state,
   second page, and inline previews.
5. Full route sweep and private Oracle candidate on port 52101.
6. Public cutover with rollback preserved, repeated public requests, process
   inventory, resource checks, and public Chromium verification.

Exact evidence:

- deterministic reattachment lab passed;
- 35 focused framework tests passed;
- the complete `jsgui3-html` suite passed 657/657;
- the owner suite passed 19/19, including eight real Chromium tests;
- the coordinator suite passed 35/35, followed by `docs:check` and
  `docs:viewer:check`;
- private and public gates each passed 182/182 generated routes, with four
  admin routes returning 404, invalid search returning 400, traversal
  returning 404, and robots returning 200;
- public desktop Chromium proved filter, preview interaction, sort, page,
  Home/End keyboard selection, zero duplicate HTML or jsgui IDs, logical ARIA
  row counts/indexes, and no page/grid overflow;
- visual inspection caught a production-only `u25B2` sort label caused by a
  JavaScript Unicode escape leaking into CSS `content`; the final hotfix uses
  ASCII-only CSS border triangles, has a direct regression test, and passed
  local, candidate, and public computed-style/screenshot checks;
- public mobile Chromium proved an eight-row, two-column layout at 390×844,
  filter and preview selection, paging, no horizontal or nested vertical
  overflow, and no browser warnings/errors;
- five fresh external requests returned 200 with 54–136 ms TTFB; five Oracle
  loopback requests returned 200, with hot responses at roughly 0.5–0.6 ms;
- the public process peaked near 2 GiB while starting the production bundle,
  then settled in the 170–177 MiB range after the complete public
  route/browser gate, with
  roughly 10 GiB host memory still available.

## Deferred work

- Deduplicate the old `jsgui3-html` dependency nested under
  `jsgui3-webpage`; do not edit installed packages in place.
- Treat virtual scrolling as a separate lifecycle project with its own focus,
  reattachment, resize, and accessibility tests.
- Add more opening previews only when both construction and activated
  interaction are deterministic; preview count is not itself a quality goal.
- The mobile atlas pager is 36px high. It exceeds
  [WCAG 2.2's 24px minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum),
  but a future touch-polish pass can test the enhanced 44px target without
  pushing the grid out of the first viewport.
- Profile the production bundler's cold-start memory peak before reducing host
  memory or overlapping more candidate processes.
- Add a stable domain, TLS, and a reverse proxy only as an explicitly
  authorized infrastructure release.
