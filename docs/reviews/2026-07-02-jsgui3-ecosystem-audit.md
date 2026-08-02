> **Date:** 2026-07-02 (rescued into version control 2026-08-01)
> **Versions reviewed:** the working tree as of 2026-07-02. Environment recorded by the original audit: Node v25.2.1, npm 11.6.2.
> **Re-verified against:** jsgui3-html 0.0.189 (`6dabe6c`) · jsgui3-client 0.0.131 (`874b14e`) · jsgui3-server 0.0.157 (`9e46d97`)
> **Scope:** server + custom control recipe, data model / view model system, calendar and date controls. NOT covered: security, performance, routing, Resource, SSE, ~129 of 155 controls.
> **Evidence grade:** mixed — real browser runs, a purpose-built scratch server, tracked suite counts and computed-rgb contrast measurement, alongside some source-read assertions.
> **Spot-check:** 22 claims re-verified 2026-08-01 — 14 CONFIRMED, 8 PARTIAL, 0 REFUTED. See Corrections below.
> **Status:** current

## Provenance

This document existed only in `coordination-news-jsgui-ecosystem.code-workspace`, which is not a
git repository and has no remote. It was the sole copy — MD5-checked against 4,893 files with no
duplicate anywhere. It was promoted here on 2026-08-01 so that it versions and survives disk
loss. The original remains in place for now; this copy is canonical.

Its former location was also unreachable by navigation: `coordination/docs/INDEX.md` listed all
twelve `inventory/copilot-dl-news/` files and made no mention of `inventory/jsgui3/` at all.

## Corrections (added 2026-08-01)

Re-verification confirmed the substance throughout and found no claim outright false. Eight
needed correction in detail. They are recorded here rather than edited into the body, so the
original reasoning stays readable:

1. The reattachment spec literal is at `html-core/html-core.js:141-146`, not 141-151. Line 151
   is the `new Cstr(ctrl_spec)` call; **147-150 are a dead no-op `if` block**.
2. "ANY spec-gated behaviour disables after SSR" is too strong. Four controls rebuild spec from
   `spec.el.getAttribute` inside their own constructor and are immune: `Data_Table`,
   `Date_Picker`, `Text_Input`, `Textarea`. For the other ~170 files the claim holds exactly —
   129 unguarded `if (spec.X)` branches across 57 files sit outside any `!spec.el` guard.
3. The view-model lookup is `Data_Model_View_Model_Control.js:265`, not `:264`.
4. `control-enh.js:643` does **not** use `map_data_models` "correctly" — `register_data_model`
   (`page-context.js:164`) has zero call sites, so that branch is dead too.
5. `jsgui3-html`'s `jsgui3-server ^0.0.143` devDependency is stale-and-invalid, not
   "unsatisfiable" — 0.0.143 is published and installable.
6. `themeable()` is called by **26** of 155 registered controls, not 28.
7. `controls/controls.js` exports **155** controls; the 157 figure counts two empty namespace
   buckets.
8. `docs/lang_tools_compat_patches.md` is **stale, not falsified** — it version-scopes its claims
   to lang-tools 0.0.43. On the installed 0.0.45 five of six patches are inert, and only
   `patch_data_object_set` still fires.

Also superseded by events: the section 3 inventory table was never revised after later sections
rewrote Calendar and proved Date_Range_Picker inert, and the test count it quotes (645) is now
863.

---

# jsgui3 Ecosystem Audit — 2026-07-02

Scope: (1) creating/running a server with custom controls, (2) data model / view model system, (3) calendar & date controls state and improvement plan.
Produced by a 3-agent parallel audit (Claude Code). Environment verified: Node v25.2.1, npm 11.6.2, node_modules present in jsgui3-server and jsgui3-html.

---

## 1. Server + Custom Controls — Canonical Recipe

### Minimal server (pattern from `jsgui3-modern-examples/plain-control-document/server.js`)

```javascript
const jsgui_server = require('jsgui3-server');
const { Server, get_free_port } = jsgui_server;
const { My_Document } = require('./client').controls;

async function main() {
    const port = process.env.PORT ? Number(process.env.PORT) : await get_free_port();
    const server = new Server({
        Ctrl: My_Document,                              // root control class
        src_path_client_js: require.resolve('./client.js')  // esbuild client entry
    });
    server.on('ready', () => server.start(port, err => {
        if (err) throw err;
        console.log(`Ready on http://localhost:${port}/`);
    }));
}
main().catch(e => { console.error(e); process.exit(1); });
```

Key `new Server({...})` options (`jsgui3-server/server.js` ~lines 38-70): `Ctrl`, `src_path_client_js`, `port` (number | 'auto'), `https_options`, `admin` (default on; `false` to disable), `bundler`, `name`.

### Custom control lifecycle (non-negotiable rules from `jsgui3-server/AGENTS.md`)

```javascript
const jsgui = require('jsgui3-html');
const { Control, controls } = jsgui;

class My_Widget extends Control {
    constructor(spec = {}) {
        spec.__type_name = spec.__type_name || 'my_widget';
        super(spec);
        if (!spec.el) {                 // CRITICAL: compose only on server render;
            this.compose();             // spec.el present => client reattachment
        }
    }
    compose() {
        this.add_class('my-widget');
        const h = new controls.h1({ context: this.context });
        h.add('Hello');                 // text via .add(), NOT {text:...} for HTML elements
        this.add(h);
    }
    activate() {
        if (!this.__active) {           // CRITICAL: guard against double activation
            super.activate();
            this.add_dom_event_listener('click', e => { /* ... */ });
        }
    }
}
My_Widget.css = `.my-widget { padding: 20px; }`;  // static css property — server extracts to /css/css.css
```

- Naming: `snake_case` vars/functions, `Pascal_Case` classes, `kebab-case` CSS.
- Composite controls (Button, Checkbox) DO accept `{text}`; raw HTML elements (h1, p, div) do NOT — use `.add()`.
- Never `server.start()` immediately — wait for `'ready'`.

### Isomorphic model: activation, not hydration

1. Server: `new Ctrl({context})` → compose → `all_html_render()` emits HTML with `data-jsgui-id` markers (`jsgui3-html/html-core/control-core.js:627-657`).
2. Client: esbuild bundle (served at `/js/js.js`, built by `jsgui3-server/resources/processors/bundlers/js-bundler.js`, cache at `.jsgui3-server-cache/`) reattaches controls to existing DOM by `data-jsgui-id` and calls `activate()` (`jsgui3-html/html-core/control-enh.js:655-672`). No re-render, no diffing.

### Entry points

- `jsgui3-server/module.js` → exports `Server`, `Website`, `Webpage`, `serve`, `serve_site`, `get_free_port`, SSE publisher, middleware.
- `jsgui3-html/html.js` → `Control`, `controls.*`, `Page_Context`, mixins, Router, Resource; pulls in `jsgui3-gfx-core`.
- `jsgui3-client/client.js` → extends jsgui3-html with `Client_Page_Context`, SSE/WebSocket resources, `bindRemote()`.

### Runnable examples (node_modules present, Windows-OK)

- `jsgui3-modern-examples/plain-control-document/` — minimal doc + control
- `jsgui3-simple-example/` — file: deps against local siblings
- `jsgui3-own-website/server.js` — docs viewer
- Guides: `jsgui3-server/docs/controls-development.md`, `docs/comprehensive-documentation.md`, `docs/agent-development-guide.md` (broken-functionality tracker — check first)

---

## 2. Data Model / View Model System

### Core classes (lang-tools `Data_Model/new/`)

| Class | Purpose | Maturity |
|---|---|---|
| `Data_Value` | Reactive scalar; `.value` get/set, `attempt_set_value()`, typed conversion, `toImmutable()`, `Data_Value.sync(a,b)` loop-safe | Production |
| `Data_Object` | Reactive KV map; per-field `change` events | Production |
| `Collection` | Reactive array; `push/remove/insert/each`, `insert`/`remove` events, Sorted_KVS index | Production |
| `Immutable_Data_Value` | Read-only snapshot | Production |

Convention: `.value` property access (NOT `.value()` call). Events: `{name, value, old}` + newer `{data_value, raw_value}` (prefer the latter in new code — stable-node principle).

### MVVM in jsgui3-html (`html-core/`)

- Three layers: `ctrl.data.model` (domain) / `ctrl.view.data.model` (UI representation) / `ctrl.view.ui.data.model` (low-level UI flags).
- `Data_Model_View_Model_Control` auto-creates models; `_binding_manager.bind_value(src, 'value', dst, 'value', {bidirectional:true})`.
- `ModelBinder` (`html-core/ModelBinder.js`): declarative two-way binding with `transform`/`reverse`/`condition`, `_locks` loop prevention. Production quality.
- `ComputedProperty` (same file): derived values from dependency lists. **WIP** but usable.
- Best reference controls: `Text_Field.js` (simple MVVM), `Text_Input.js` (masking + view-model→DOM), `Chart_Base.js` (bidirectional sync), `examples/binding_data_grid.js` (computed filtered collection), `examples/binding_date_picker.js` (date + watcher).

### Rules (from lang-tools AGENTS.md / mvvm-patterns-research.md)

- Bind to stable `Data_Value` nodes; never swap a bound node for a primitive (no shape-flipping).
- `null` = explicitly empty; `undefined` = unset.
- Use ModelBinder rather than hand-rolled listeners (loop risk).
- lang-tools BUGS.md: BUG001–BUG007 all fixed, no open bugs as of 2026-05-28.

### Gaps

- No dirty/touched tracking, no batch/transaction events, no object-graph validation, no selection model on Collection, no undo/redo.
- `Control_View_Data` / `Control_View_UI` are thin/underdocumented; `event.value` vs `event.data_value` inconsistency across older controls.

---

## 3. Calendar & Date Controls (jsgui3-html)

### Inventory

| Control | Path (under `jsgui3-html/controls/organised/`) | Status |
|---|---|---|
| `Date_Picker` | `0-core/0-basic/0-native-compositional/Date_Picker.js` | Working — native `<input type=date>` wrapper, ISO value, min/max, arrow/page keyboard, `enhance_only` SSR mode, Control_Data/View binding |
| `Month_View` | `0-core/0-basic/1-compositional/Month_View.js` | Working — THE core grid primitive; 4 selection modes (single/range/multi/week), first-day-of-week, ISO week numbers, min/max, today/weekend classes, SSR cell→date recovery |
| `Time_Picker` | `.../1-compositional/Time_Picker.js` | Working — canvas analog clock (3 styles), spinners, presets, 12/24h, seconds, step-minutes |
| `DateTime_Picker` | `.../1-compositional/Datetime_Picker.js` | Working — Month_View + Time_Picker; stacked/side-by-side/tabbed layouts; ISO datetime value |
| `Date_Range_Picker` | `0-core/0-basic/_complex_date-range-picker.js` | Working — dual-calendar popup, optional time inputs |
| `Date_Value_Editor` | `1-standard/1-editor/value_editors/Date_Value_Editor.js` | Working — property-grid editor, popup Month_View |
| `Calendar` | `.../1-compositional/Calendar.js` | **STUB** — intended event-layer calendar |
| `Timespan_Selector` | `.../1-compositional/Timespan_Selector.js` | Partial stub — deprecate in favor of Date_Range_Picker |

Tests: `test/core/month-view.test.js`, `test/controls/datetime_picker.test.js`, `date_picker`, `date_range_picker`, value-editors (chai + jsdom).
Demos: `lab/date_controls_demo_server.js` (port 3601), `lab/date_range_demo_server.js`, `test/e2e/date_controls_e2e.test.js`.

### Gap matrix (condensed)

| Capability | State |
|---|---|
| Month grid, prev/next, range/multi/week select, min/max, ISO binding, time+seconds, presets | ✅ exists |
| Year/month quick selectors in Month_View | Partial (only in `_complex_date-picker` via Left_Right_Arrows_Selector) |
| Keyboard navigation | ❌ Month_View & Time_Picker have none (only native Date_Picker) |
| Reusable popup/overlay primitive | ❌ ad-hoc per control (no viewport-aware positioning, no escape-close mixin) |
| Localization | ❌ month/day names hardcoded English |
| ARIA / accessibility | ❌ major gap (no role=grid, spinbutton, focus management) |
| Touch on clock | ❌ click only |
| Event-layer Calendar | ❌ stub |

### Improvement plan (priority order)

1. **P1a — keyboard nav**: new `control_mixins/keyboard_nav.js`; arrow/Enter/Escape focus movement in Month_View; spinner keys in Time_Picker. (~6h)
2. **P1b — `Popup` primitive**: new `controls/organised/0-core/1-advanced/Popup.js` (anchor, position, auto-reposition, escape/outside-click close); refactor Date_Value_Editor + Date_Range_Picker onto it. (~8h)
3. **P1c — localization**: `locale` option in Month_View via `Intl.DateTimeFormat` with fallback. (~4h)
4. **P1d — ARIA**: expand `control_mixins/a11y.js` with grid/spinbutton helpers; wire into all date controls. (~10h)
5. **P2 — Calendar event layer** on Month_View; deprecate Timespan_Selector; SSR e2e test; `docs/date-controls-guide.md`. (~25h)
6. **P3 — touch for clock; theme variants.**

---

## Visual review (2026-07-02, browser verification of lab demos)

Both lab servers were run in a real browser (preview tooling, Chrome-based) and screenshotted. **Neither lab server was runnable as found** — corrections applied to the working tree:

1. **`lab/date_controls_demo_server.js` — stale require paths.** Required `.../1-compositional/month-view` (kebab-case) but the file is `Month_View.js`; `grid` only resolved via Windows case-insensitivity. Fixed to exact-case `Grid` / `Month_View`. These labs would fail on Linux/macOS regardless.
2. **`lab/date_range_demo_server.js` — syntax error since authoring.** The inline `<script>` comment block contained backticks inside the outer template literal, terminating it early (`SyntaxError: Unexpected identifier 'Date_Range_Picker'`). The audit's "Working" label for this demo was wrong — it had never run. Replaced the comment block with a short note.
3. **`lab/date_range_demo_server.js` — missing `Grid.css`.** Only Month_View + Date_Range_Picker CSS was inlined; Month_View's grid layout lives in `Grid.css` (it extends Grid). Without it the popup calendars rendered garbled (day names stacked vertically, numbers overlapping). Adding Grid.css fully fixed the layout. Fragility to note: control CSS is not self-contained — consumers must know the inheritance chain to collect CSS. The real jsgui3-server pipeline automates this; hand-rolled SSR pages break silently.

### What renders correctly (port 3601, static SSR)

- Month_View single/range/multi: correct July 2026 grid, today (02) outlined, weekends dimmed.
- Complex Date_Picker: year "2026" / month "July" arrow selectors + Today button render properly.
- Week numbers mode: ISO weeks 27–31 correct in left gutter.
- Sunday-first mode: correct column shift, weekend styling follows.
- Min/max bounds: 1–4 and 26–31 struck through, 5–25 selectable — logic correct.

### Defects found (beyond the audit)

| # | Defect | Where | Severity |
|---|---|---|---|
| V1 | Calendar SVG icon renders as escaped literal text (`<svg width="16"...` visible on page) — raw SVG markup passed through text-escaping `.add()` | `_complex_date-range-picker.js` compose | High (visual) |
| V2 | SSR inputs missing `type`/`value`/`readonly` attributes — configured start/end dates (`2026-02-10` etc.) never appear in rendered HTML; inputs render empty | Date_Range_Picker inputs-row; likely value set on model only, never serialized to `dom.attributes` | High |
| V3 | Dual-mode popup shows two identical current-month calendars; `start`/`end` spec dates (March/April 2026) do not initialize displayed month/year; right calendar should be month+1 | Date_Range_Picker → Month_View month/year wiring | High |
| V4 | Month_View renders a trailing empty gray row (6-row grid for a 5-row month) and has no month/year caption of its own | Month_View | Low (cosmetic/UX) |
| V5 | Demo-authoring footgun: `section.add(new Control({tag_name:'h2'}).add('text'))` collapses headings into inline text — `Control.add()` returns the added content, not `this`, so the chained form adds a text node instead of the h2 | jsgui3-html `Control.add()` API contract | Medium (API ergonomics) |
| V6 | Static-SSR labs have no client bundle: `activate()` never runs, so range/multi click, popup open/close are inert. Verified empirically (synthetic clicks change nothing). Interactive verification requires a full jsgui3-server app | lab servers by design | Documented limitation |

- Console: no errors on either page.
- No Time_Picker or DateTime_Picker demo exists in lab/ — they were never visually verified before; covered by the Phase B interactive app instead.

### Phase B findings (full jsgui3-server app, real activation — scratch app at scratchpad/jsgui3-scratch-app)

The recipe (§1) and model binding (§2) are **proven working end-to-end**: `Server({Ctrl, src_path_client_js})` served the page, esbuild bundled the client, and a custom Counter_Widget's click → `Data_Object.set` → ModelBinder transform → view-model change → DOM chain updated "Count: 0" → "Count: 3" in the browser. Month_View range mode is fully interactive after activation (mousedown on 6 then 17 → correct `range-start`/`range-between`/`range-end` classes and blue highlight).

Additional defects found only visible under real activation:

| # | Defect | Where | Severity |
|---|---|---|---|
| V7 | **Constructor spec/config does not survive to the client.** Reconstruction passes `{el, context}` only; any behavior gated on spec options silently disables client-side. Datetime_Picker `layout:'tabbed'` → `_cfg.layout` defaults to 'stacked' on client → tab-switch wiring skipped (tabs render but do nothing). Month_View shows the CORRECT pattern: it persists `data-selection-mode` to the DOM at compose (Month_View.js:41) and reads it back in activate (line 325) — that is why range mode works. | Framework contract; per-control fixes | **Critical** |
| V8 | Date_Range_Picker is fully inert client-side: compose() sets NO `data-jsgui-ctrl` tags, so `_wire_jsgui_ctrls()` cannot restore `this.input_start/popup/mv_start/...`; activate() dereferences them (throw swallowed silently — no console error surfaces). Popup never opens; inputs stay empty (V2 confirmed at runtime, not just SSR). | `_complex_date-range-picker.js` | **Critical** |
| V9 | jsgui3-html `exports` map blocked `./html-core/*` and `./controls/*` deep requires — ModelBinder and every non-registry control (incl. Date_Range_Picker) were unreachable by consumers. **Fixed in working tree** (added subpath exports mirroring `./control_mixins/*`). | `jsgui3-html/package.json` | High (fixed) |
| V10 | Dozens of esbuild `different-path-case` warnings (requires like `../panel` vs `Panel.js`) across controls — Windows-masked; would fail on case-sensitive filesystems. Same root cause as the lab-server require breakage: Pascal_Case file renames without updating requires. | jsgui3-html controls tree | High |
| V11 | Date_Range_Picker not in `controls/controls.js` registry (unlike Month_View/Time_Picker/Datetime_Picker/Date_Picker). | registry | Medium |
| V12 | Month_View single-click leaves `_range_click_state=1` (mousedown-anchored state machine); synthetic/extra click events from other-mode listeners can corrupt selection. Needs listener wiring to be mode-scoped. | Month_View.js:355-467 | Medium |

**Isomorphic control contract (distilled):** a composite control is only activation-safe if it (a) tags composed child refs with `dom.attributes['data-jsgui-ctrl'] = '<propName>'` and calls `_wire_jsgui_ctrls()` in activate, AND (b) persists behavior-affecting spec options as `data-*` attributes at compose and recovers them in activate. Unit tests miss this class of bug because they construct+activate the same instance; only an SSR→reattach flow catches it (audit P2 "SSR e2e tests" is therefore high-value).

## P1 implementation record (2026-07-02, same session — all in jsgui3-html working tree, uncommitted)

All P1 items plus the V-defect fixes were implemented, unit-tested (**618 passing, 0 failing**, up from 605 baseline) and verified in a live browser via the scratch app (SSR + esbuild bundle + activation).

| Change | Files |
|---|---|
| **P1a keyboard nav**: focus ring (`.kb-focus`), Arrow=±1d/±7d, Home/End (bounds-aware), Enter/Space per selection mode, Escape cancels half-picked range; wired via existing `control_mixins/keyboard_navigation.js` (audit plan wrongly proposed a new mixin — one already existed). `tabindex=0` on root. Time_Picker: Arrows=minutes/hours, PageUp/Down=±15m, a/p in 12h mode | `Month_View.js`, `Time_Picker.js`, new `test/core/keyboard_nav.test.js` (20 tests) |
| **P1b Popup primitive**: fixed-position anchored overlay, viewport flip (verified live: `data-placed="top"` when input near bottom), Escape/outside-click close, scroll/resize reposition, config persisted to `data-position`; registered in controls registry | new `controls/organised/0-core/1-advanced/Popup.js`, new `test/core/popup.test.js` (8 tests) |
| **P1b DRP refactor** (fixes V1, V2, V3, V7, V8, V11): conditional compose, `data-jsgui-ctrl` tags on all children, config persisted (`data-mode/use-time/start/end`) + recovered in activate, SVG icon composed from jsgui svg/rect/line controls (added `rect circle path g` to `core_extension` tag list), SSR input values, months derived from start/end (dual = start-month + next or end-month), popup via Popup primitive. Fully interactive after activation — verified: popup opens, July+August calendars, range 06→17 highlighted (12 cells) | `_complex_date-range-picker.js`, `html-core/html-core.js`, `controls/controls.js` |
| **P1b Date_Value_Editor refactor**: conditional compose (was unconditional — same V7-class bug), Popup primitive, ctrl tags, min/max persisted, listens to new `date-select` event | `Date_Value_Editor.js` |
| **Month_View `date-select` event**: was listened for by Datetime_Picker but never raised — now raised on single-mode selection (mouse + keyboard) | `Month_View.js` |
| **Isomorphic `update_range_highlight`**: now applies classes to VDOM cells server-side (SSR HTML shows configured range) + `aria-selected` on both paths | `Month_View.js` |
| **P1c locale**: `locale` spec option; day headers + `month_name()` via `Intl.DateTimeFormat` (Monday-anchored, invalid-locale fallback to English), persisted as `data-locale`; static helpers `Month_View.get_locale_day_names/get_locale_month_names` for composites. Verified live: `lun. mar. mer. jeu. ven. sam. dim.` | `Month_View.js`, new `test/core/month_view_locale.test.js` (9 tests) |
| **P1d ARIA**: a11y mixin extended with `apply_grid_aria`, `apply_spinbutton_aria`, `update_aria_now`, `apply_dialog_aria`. Month_View: `role=grid` + localized label, row/columnheader/gridcell roles, `aria-selected` sync. Time_Picker: `role=group` + label, `aria-live` display, labelled clock (`role=img`) and spinner buttons (spinbutton + valuemin/max). DTP tabs: tablist/tab + `aria-selected` toggle. DRP inputs: labels + `aria-haspopup`. Popup: `role=dialog aria-modal=false` | `control_mixins/a11y.js`, all five date controls, new `test/core/date_controls_aria.test.js` (13 tests) |
| **V7 fix for Datetime_Picker**: `layout` persisted as `data-layout` + recovered in activate — tabbed pane switching now works client-side (verified live: Time tab click hides calendar, shows clock, flips aria-selected) | `Datetime_Picker.js` |
| Lab server repairs (require paths, template-literal syntax error, Grid.css) | `lab/date_controls_demo_server.js`, `lab/date_range_demo_server.js` |
| Exports map: `./html-core/*` + `./controls/*` subpaths (V9 fix) | `package.json` |
| Test snapshot baselines regenerated (intentional new attrs: tabindex, roles, aria-*, data-layout) | `test/__snapshots__/` |

**Still open (P2+):** ~~DTP dark-theme contrast~~; ~~Calendar event-layer stub~~; ~~Timespan_Selector deprecation~~; ~~case-sensitivity require cleanup (V10)~~; ~~`date-controls-guide.md`~~; ~~SSR e2e test~~ — all completed in the P2 session below. Remaining: Month_View month-paging via PageUp/Down; touch events for the clock; framework attribute-value HTML escaping (spawned as a separate task).

## P2 implementation record (2026-07-02, later session — jsgui3-html working tree, uncommitted)

Suite: **630 passing, 0 failing** (up from 618). A logically-grouped 6-commit plan for the P1 work was proposed (lab repairs → html-core plumbing → Popup → Month_View/Time_Picker → DRP/DVE → DTP+ARIA tests); nothing committed per instructions.

| # | Item | Outcome |
|---|---|---|
| P2.1 | **SSR e2e reattachment test** — `test/core/ssr_reattach.test.js` mirrors the real client bootstrap (fresh Page_Context + `jsgui.pre_activate`/`activate` over mounted SSR HTML; registry lowercased into `map_Controls`). 5 cases: Month_View range wiring + config, single-mode click, SSR range markup, DTP tabbed, DRP dual. | **Immediately caught 2 real bugs**: (a) Month_View `month`/`year` not persisted — reattached instances mapped cells to *today's* month (all prior browser checks passed by coincidence of displaying July); fixed via `data-month`/`data-year` persist/recover + refresh sync. (b) Single-mode mouse selection dead after reattach (selectable-mixin chain doesn't survive); fixed with canonical `_select_single` + direct DOM click wiring, shared with the keyboard path. |
| P2.2 | **DTP dark-theme contrast** — day numbers measured `rgb(30,30,30)` on `rgb(30,41,59)` (~1.1:1). | `bgc_disabled` now `var(--mv-cell-disabled)` (inline style uses the CSS variable) + dark variable overrides scoped under `.datetime-picker .month-view`. After: `rgb(229,231,235)` ≈ 11:1 (AAA). Before/after screenshots. |
| P2.3 | **Calendar event layer** — replaced the 2016 comment-stub. `events: [{date,label,color}]`, per-day dot badges (max 3 + `+N` overflow), localized caption, selected-day event list, `add_event`/`remove_event`/`set_events`/`events_on`, `date-select`/`events-change` events. Built to the isomorphic contract (URI-encoded `data-events` persistence, ctrl tags, conditional compose). 7 unit tests + its own SSR-reattach case; browser-verified (badges, overflow, click → event list). | Also exposed a **framework bug**: attribute values are not HTML-escaped (raw JSON quotes corrupt markup — injection-adjacent). Worked around via encodeURIComponent; renderer fix spawned as a separate background task. |
| P2.4 | **Timespan_Selector deprecated** — one-time `console.warn` + `@deprecated` JSDoc pointing to Date_Range_Picker; registry comment. | Kept registered for backwards compat. |
| P2.5 | **`docs/date-controls-guide.md`** — all 8 controls + Popup, quick-start code, events reference table, keyboard map, locale, ARIA, theming (incl. the dark-panel retheme pattern), and the 6-point isomorphic contract with the ssr_reattach test harness documented as the required guard for new composites. | New file. |
| P2.6 | **Case-sensitivity sweep** — scripted exact-case verification of every relative require under `controls/`, `control_mixins/`, `html-core/` (not just the esbuild warning sample). | **45 mismatched requires fixed across 24 files** (e.g. `./object`→`./Object`, `../6-layout/panel`→`Panel`, `tooltip`→`Tooltip`). esbuild `different-path-case` warnings: zero on a clean rebuild. Linux/macOS builds no longer at risk from these. |

Cumulative working-tree state: **40 files changed (+1233/−494)** plus 7 new files (Popup.js, Calendar rewrite counts as modified, docs/date-controls-guide.md, and test files ssr_reattach/calendar/keyboard_nav/month_view_locale/popup/date_controls_aria).

## P3 implementation record (2026-07-02, third session — ALL COMMITTED locally, not pushed)

Suite: **645 passing, 0 failing** (was 630). Playwright e2e: 13/16 (was 12/16 as found; the 3 remaining failures are pre-existing, see below). **19 commits** on `master` (359d7f7..HEAD), working tree clean.

**Commits (oldest→newest):** the 12-commit P1/P2 landing (lab repairs → html-core plumbing → Popup → Month_View/Time_Picker → DRP/DVE → DTP+ARIA tests → ssr_reattach harness → DTP contrast → Calendar → Timespan deprecation → guide → case sweep; overlapping files were surgically split so each commit is thematically clean), then 7 P3 commits:

| Commit | Content |
|---|---|
| `14d155a` | **html-core: HTML-escape attribute values at render time** (& " < > via escape_attr in renderDomAttributes; removed parse-mount's pre-escape workaround which would have double-escaped — caught by the template_binding suite; legacy quote→apostrophe shape for object attrs retained; 6-test attribute_escaping suite) |
| `aca3933` | **Time_Picker & DTP: data-cfg persistence** (step_minutes/use_24h/show_seconds/min-max/clock opts survive reattachment; e2e asserts ArrowUp steps by configured 5) |
| `bde2180` | **Month_View: PageUp/PageDown month paging, Shift=year** (`page_month`/`page_year` + `_refresh_dom_month` DOM twin of refresh_month_view; focus ring lands on same day clamped; `month-change` event; Calendar caption+badges follow). Two more latent bugs fixed: selection STATE now recovered from SSR classes (was classes-only, so any rerender dropped it), and **activate() double-wiring guard** — every listener wired twice in real pages (one PageDown paged two months; also the root cause of the P2-session "phantom range" corruption) |
| `c9f9852` | **Time_Picker clock touch** (touchstart/move share click math; passive:false; verified in 375×812 viewport: tap 3 o'clock → :15, drag 6 o'clock → :30) |
| `9bd09b7` | **Popup focus management** (focus popup on open w/ tabindex=-1; restore to anchor on close/Escape unless user focused elsewhere; 4 tests) |
| `0dc9fc1` | **hyphen/underscore require fixes** (tabbed-panel → Radio_Button_Group/Radio_Button; unloadable on ALL platforms, unlike case-only debt; found via Playwright, tabbed_panel spec now passes) |

**Downstream proof:** jsgui3-simple-example (symlinked file: dep onto the modified tree) serves page 200/19KB, esbuild bundle 200/1.16MB, CSS 200/135KB, zero errors (its own `npm run smoke` references a nonexistent tests/smoke.test.js — repo gap, noted not fixed). Scratch app full functional sweep green: counter binding, range select (12 cells), DRP popup+values, Calendar events+paging.

**Honest caveats:** (1) The preview screenshot tool degraded mid-session (fresh-tab captures that worked earlier began timing out consistently); all P3 verification is DOM-measured (computed styles, textContent, class/attr assertions) — earlier sessions' screenshots cover the visuals. (2) 3 Playwright failures remain, all pre-dating this work: Group_Box lacks role=group in the control itself, admin_controls visual baseline stale since Feb 19 (styling changed in base commit 359d7f7), accordion undiagnosed — spawned as a follow-up task chip. (3) Nothing pushed; publishing (npm version bumps, changelog, push) remains deliberate future work.

