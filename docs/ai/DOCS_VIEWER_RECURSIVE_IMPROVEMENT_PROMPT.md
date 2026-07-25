# Recursive jsgui3 Docs Viewer Improvement Prompt

Act as the research, implementation, test, release, and re-audit agent for the
public jsgui3 documentation viewer at
<http://141.144.193.218:52001/>.

Begin with read-only inspection. Reproduce every observation below instead of
assuming it remains true, and use primary standards/framework sources for any
new architectural or accessibility claim. Preserve the opening live Control
Atlas, useful SSR, and the stable public APIs.

## Verified release baseline

- Current release root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas-sort-fix`
- Immediate rollback root:
  `/home/ubuntu/apps/jsgui3-docs-viewer-release-20260725-bounded-atlas`
- Canonical PM2 process: `jsgui3-docs-viewer`, id 244, PID 967225, port
  52001, zero restarts at release time, build
  `20260725-bounded-atlas-sort-fix`.
- Separate services that must remain untouched:
  `jsgui3-data-grid` PID 801978 on port 52000 and
  `crawl-server-v4` PID 929760 on port 3200. Six crawler workers remain
  stopped.
- PM2 state has been saved with the sort-fix release cwd, port, and build.
  No OCI ingress, firewall, DNS, TLS, crawler, worker, or Data Grid state was
  changed.
- Validation passed:
  - deterministic grid-reattachment lab;
  - 35 focused and 657 complete `jsgui3-html` tests;
  - 19/19 owner tests, including eight real Chromium tests;
  - 35/35 coordinator tests plus `docs:check` and `docs:viewer:check`;
  - Oracle owner HTTP suite 11/11;
  - private and public 182/182 generated-route gates, plus four admin 404s,
    invalid search 400, traversal 404, and robots 200;
  - private and public desktop/mobile Playwright with zero browser warnings
    or errors.
- Already implemented and protected:
  - an eight-row opening SSR page over 155 canonical controls;
  - opt-in, bounded, JSON-safe `Data_Grid`/`Data_Table` activation state;
  - exact initial SSR-node retention;
  - control-owned filtering, sorting, 20-page navigation, single selection,
    arrow/Home/End keyboard behavior, and logical ARIA counts/indexes;
  - table-context dynamic DOM parsing;
  - bundle-safe CSS sort triangles with extraction and real-browser
    regression proof;
  - one nine-control preview registry shared by the atlas, search/catalog
    metadata, and detail pages;
  - lazy backward-compatible deprecated aliases;
  - progressive search, shareable catalog facets, public example titles,
    reduced motion, focus visibility, full-screen workbenches, mobile
    navigation, and the embedded Team Directory.

## Measured public state

- Opening geometry remains atlas/header y=167/299 at 1440×900 and y=189/397
  at 390×844.
- Main document: 1,002 DOM nodes, eight current rows, 155 logical controls,
  `aria-rowcount=156`, zero duplicate HTML IDs, and zero duplicate jsgui
  control IDs.
- Home response: 269,620 bytes raw, 32,561 bytes gzip, and 25,822 bytes
  Brotli. Direct public Chromium transferred 32,861 bytes because the raw HTTP
  endpoint negotiated gzip.
- Five external requests returned 200 with 54–136 ms TTFB. Hot Oracle
  loopback requests were roughly 0.5–0.6 ms.
- Production startup briefly peaked near 2 GiB, then settled in the
  170–177 MiB range after the complete public gate. The 11 GiB host retained
  roughly 10 GiB available and 55 GiB free disk.
- Mobile displays Control + Guide columns, eight rows, and no page,
  horizontal-grid, or nested vertical-grid overflow. Its pager controls are
  36px high: above WCAG 2.2's 24px minimum, below the enhanced 44px target.

## Reproduced remaining work and research questions

1. One `jsgui3-html@0.0.180` copy nested under a `jsgui3-webpage` dependency
   still prints the historical `FormField` and `PropertyEditor` deprecation
   warnings during server startup. The canonical registry and public browser
   are clean. Trace the dependency owner, version constraints, package-lock
   resolution, and bundle reachability. Fix this through an intentional
   package/dependency path only if compatible; never patch `node_modules`,
   remove aliases, or hide genuine direct-use warnings.

2. Profile the roughly 2 GiB cold-start peak and the effect of running a
   port-52101 candidate beside public port 52001. Distinguish bundling,
   compression, source-map/module graph, page construction, route sweeps, V8
   heap reservation, and actual retained objects. Sample RSS through startup,
   one home request, the route sweep, browser activation, and an idle period.
   Prove a stable plateau and check repeated sweeps for growth before claiming
   a leak or optimization. Do not resize the OCI instance in this task.

3. Test whether 44px mobile pager targets improve touch ergonomics without
   pushing the grid header or several complete records out of the first
   viewport. Treat 36px as conforming baseline, not a defect. Promote a CSS
   change only with 390×844 geometry, overflow, focus, and browser-interaction
   evidence.

4. Only nine of 155 controls have reviewed inline previews. Research
   high-value candidates such as `Virtual_Grid`, `Tree_Table`, `Window`, and
   `Date_Range_Picker`, but do not use preview count as a goal. Add a candidate
   only if its server composition, fresh activation, interaction, responsive
   layout, and deterministic test data all pass. Keep availability,
   catalog/search badges, atlas rendering, and detail rendering derived from
   the one preview registry.

5. Re-audit the grid as an accessibility composite after every lifecycle
   change: focus entry, row selection announcement, sort state, filtered
   logical row count, page-offset row index, Home/End behavior, focus after
   rerender, no hidden focusable content, reduced motion, landmarks/headings,
   contrast, target size, and 320/390px reflow. Use the WAI-ARIA Grid pattern
   and WCAG 2.2 as primary references.

6. Server route-not-found diagnostics for the deliberate admin/security sweep
   are written to the PM2 error log even though the responses are correct.
   Determine whether this is harmless router logging or an actionable
   observability classification issue. Change the serving owner only if a
   narrow test proves real operator value.

7. The endpoint remains HTTP on a raw IP. A domain, reverse proxy, Brotli over
   public Chromium, and TLS are infrastructure work requiring explicit
   authority. Research and document a rollout/rollback plan if useful, but do
   not change ingress, firewall rules, DNS, certificates, or ports in this
   task.

8. The local owner and coordination worktrees contain substantial uncommitted
   and untracked work. Preserve it. Do not clean, reset, commit, push, publish,
   or open a PR unless separately authorized.

## Ownership and release safety

Read every applicable `AGENTS.md` and owner instruction before editing.
`jsgui3-own-website` owns viewer composition and routes; `jsgui3-html` owns
reusable grid lifecycle behavior; `jsgui3-webpage` owns its dependency
declaration; `jsgui3-server` owns router/logging behavior; example repositories
own focused guides; and `jsgui3-ecosystem` owns contracts, cross-repo decisions,
research, deployment history, and this prompt.

Use small, reversible owner-repo changes. Stable public constructors and
exports are contracts. For any framework change, build a fresh-context
reproducer before promotion and reject function/adaptor/async serialization.

For Oracle, create a unique release by copying the complete current seven-repo
release and overlay only a reviewed explicit-file manifest. Do not copy a whole
mixed local worktree. Clear only the candidate's server cache and stage on
private port 52101. Preserve
`jsgui3-docs-viewer-release-20260725-bounded-atlas-sort-fix` as rollback.
Change only
the docs PM2 processes, automatically restore rollback if readiness fails, and
run `pm2 save` only after the complete public gate.

## Required implementation and proof

Choose the smallest coherent high-value release supported by the research. It
is valid to leave a risky item documented and implement a safer measured item.
Keep SSR useful before activation, use real jsgui3 controls to manage and frame
content, guard `activate()`, use `textContent` for dynamic UI, and keep
filesystem/source resolution server-only and allow-listed.

Add direct tests for every changed contract. At minimum, rerun:

- the reattachment lab, focused framework tests, and the complete framework
  suite for any `jsgui3-html` change;
- all 19 owner tests;
- all 35 coordinator tests, `docs:check`, and `docs:viewer:check`;
- the 182-route/API sweep and bounded admin/search/traversal checks;
- fresh desktop 1440×900 and mobile 390×844 Playwright on the private
  candidate and public release.

Verify filter, sort, both pager directions, keyboard selection, every changed
preview, exact SSR row retention, logical ARIA metadata, zero duplicate IDs or
events, responsive geometry, no page/grid overflow, global search, catalog
state, one visible/focusable example panel, embedded Team Directory URL,
public titles/provenance, console/network output, PM2 cwd/port/build/restarts,
memory plateau, disk headroom, companion invariants, and repeated public
requests. Record exact pass/skip counts and distinguish gzip, Brotli, encoded
body, transfer size, and decoded body measurements.

Update the research record, owner plan, coordination status, and Oracle
deployment/rollback record with the final URL, release roots, PM2 evidence,
measurements, warnings, deferred risks, and explicit changed-file manifest.

## Required recursive ending

After deployment, audit the new public release from a fresh browser and process
snapshot. Replace this file with another standalone prompt containing the new
verified release and rollback roots, only reproduced remaining defects and
measured opportunities, the same ownership and release safeguards,
implementation and full verification requirements, and an instruction to
produce yet another recursive prompt at the end of the next turn.
