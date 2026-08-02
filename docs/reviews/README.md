# jsgui3 technical reviews

The index of every technical review of jsgui3, wherever it lives. If a review is not listed
here, it is not discoverable — add it when you write it.

A **technical review** evaluates the system: architecture, implementation quality, defects,
limitations, fitness. Tutorials, API reference, roadmaps and session notes are not reviews and
do not belong here.

## Where reviews live

| Scope | Location |
|---|---|
| Spans more than one repo | `jsgui3-ecosystem/docs/reviews/` |
| Confined to one repo | `<repo>/docs/reviews/` |

Cross-repo reviews go in this repository because it is neutral to `jsgui3-html`,
`jsgui3-client` and `jsgui3-server`. A review spanning all three cannot live inside any one of
them without being invisible from the other two.

Never place a review in a `*.code-workspace` directory. Those are not version controlled, and
the most valuable review in the project sat in one, unbacked-up and unlinked, until 2026-08-01.

## Naming

`YYYY-MM-DD-<kebab-slug>.md` — date first, no spaces.

Never `CURRENT_*.md`. `jsgui3-server/docs/documentation-review/CURRENT_REVIEW.md` has been
"current" since November 2025.

## Required header

```markdown
> **Date:** 2026-08-01
> **Versions reviewed:** jsgui3-html 0.0.189 (`6dabe6c`) · jsgui3-server 0.0.157 (`9e46d97`)
> **Scope:** what it covers. And explicitly, what it does NOT.
> **Evidence grade:** measured | mixed | asserted
> **Spot-check:** N claims re-verified YYYY-MM-DD — X confirmed, Y partial, Z refuted
> **Status:** current | superseded by <path>
```

**Commit SHAs are not optional.** `jsgui3-html/docs/bugs/control-rendering-bugs.md` became
useless because `Text_Field.js:374` moved and nobody could tell what it had meant. With a SHA,
every line reference stays resolvable forever via `git show <sha>:path`.

**Evidence grade** is the field that decides how much to trust a document:

- `measured` — claims were executed, reproduced or observed running
- `mixed` — some measured, some read from source
- `asserted` — read from source only

This distinction is not pedantic. Of ten claims in the most recent consumer findings report,
three were retracted as false; all three were `asserted`. The one item that survived least well
was the only one its own author had not marked as measured.

Per-finding, add `**Test:**` naming the test that would fail if the finding regressed. A finding
with no test is `unpinned` and should be expected to rot.

## The reviews

| Date | Review | Scope | Evidence | Status |
|---|---|---|---|---|
| 2026-07-02 | [jsgui3 ecosystem audit](2026-07-02-jsgui3-ecosystem-audit.md) | server recipe, MVVM layer, 8 date/calendar controls; reaches framework-wide contracts | mixed | current — 22 claims re-verified 2026-08-01, 14 confirmed / 8 partial / 0 refuted |
| 2026-07-25 | [Docs viewer reliability research](../DOCS_VIEWER_RELIABILITY_RESEARCH_2026-07-25.md) | tabular/activation lifecycle, live-DOM insertion, registry export hygiene | mixed | current — implementer self-report; every defect named was fixed in the same commit, so it does not assess what was left alone |
| 2026-07-11 | [Website spec status](../WEBSITE_SPEC_STATUS.md) | site-spec conformance only | measured | current — 9 of 10 claims reproduced three weeks later |

### Elsewhere, not yet promoted

| Review | Location | Note |
|---|---|---|
| Library findings from a consumer | `copilot-dl-news/docs/agi/JSGUI3_FINDINGS_FOR_LIBRARY_SESSION.md` | The only document that tags each claim measured-or-not and retracts its own filed defects. Its item B5 ("no control catalogue") is **false** — `jsgui3-html/docs/controls/INDEX.md` has existed since 2025-12-21 with 65 per-control docs. |
| MVVM engine review | `jsgui3-html/docs/mvvm_engine_review.md` | Review value is the first ~50 lines; the rest is roadmap. Every line citation has drifted, but 4 of 4 core claims survived verification. |
| Visual state audit | `jsgui3-html/docs/control-design-book/visual-advancement/01-current-state-audit.md` | §1.1 still exact. §§1.4–1.5 refuted: "~5 of ~100 controls use `themeable()`" is now 26 of 155, and its recommendation to unify on one token prefix went the other way — three now coexist. |

## Corrections to claims in circulation

Findings that were repeated across several documents and turned out to be wrong or
overstated. Verified by execution on the date shown.

| Claim | Reality | Verified |
|---|---|---|
| "jsgui3 multi-page/multi-route support is broken — `server.js:346-348` throws NYI." | Overstated. The documented form, `Server({ pages: { '/': …, '/about': … } })`, **constructs fine**. The NYI throw is on `spec.routes`, a different key that no doc prescribes. Originates in `copilot-dl-news/docs/agi/JSGUI3_MIGRATION_REPORT.md`. | 2026-08-01, jsgui3-server 0.0.157 |
| "jsgui3-html uses native Node.js bindings (V8/C++)." | False. Zero `.node` files, zero `binding.gyp` in its closure; `require()` loads 348 modules, none native. Corrected in `news-crawler-db/TROUBLESHOOTING.md`. | 2026-08-01, jsgui3-html 0.0.189 |
| "155 controls, 48 mixins, no index." | `jsgui3-html/docs/controls/INDEX.md` has existed since 2025-12-21 with 65 per-control docs. All 64 were probed by execution; 63 were already correct. | 2026-08-01 |
| `require('lang-tools')` for `Data_Object` in agent guidance. | Resolves inside jsgui3-html only. Throws `MODULE_NOT_FOUND` from jsgui3-client, which does not declare it. jsgui3-html re-exports `Data_Object`, `Data_Value` and `Collection`. Corrected in `jsgui3-html/AGENTS.md`. | 2026-08-01 |

## Confirmed defects, pinned as tests

Established by execution between 2026-07-30 and 2026-08-01 and pinned in
`jsgui3-html/test/core/known_defects.test.js` (`653964c`). Each has a PIN test asserting current
behaviour and a skipped test asserting the fix, ready to un-skip.

| Defect | Evidence | Fixed? |
|---|---|---|
| **`spec.text` renders nothing.** `new Control({ tag_name: 'button', text: 'x' })` produces `<button></button>` with no warning. `spec.content` and `.add(string)` both work. | The main README's flagship construction example used it. Corrected in `4480471`. | Doc fixed; behaviour pinned |
| **`_persisted_fields` hydration has no reserved-key guard.** `control-enh.js:636-640` assigns every `data-jsgui-fields` key straight onto the control. `exempt_prop_names` at `:151` is an empty object literal. The sibling `_ctrl_fields` path at `:893-898` guards 22 reserved names and warns on collision. | `{'selection_scope':3}` leaves `ctrl.selection_scope === 3`. Worse, `{'content':99}` **replaces the content collection with the number 99**, destroying the control tree silently. | No — fix staged as skipped test |
| **`view_environment` is read but never assigned.** 12 controls read `this.context.view_environment.layout_mode`; a grep for any assignment across all three packages returns nothing. | Layout mode cannot resolve under SSR. | No — fix staged |
| **`Control.add()` returns the added child, not `this`.** And `add(array)` returns `undefined`, because `let res = []` at `control-core.js:797` shadows the outer `res`. | Children are still added correctly; only the return value is lost. Chaining silently does the wrong thing. | No — fix staged |
| **Minify levels collapse.** `apply_minify_options()` sets `minify: true` then assigns granular `false` flags that esbuild discards, so conservative and normal produce identical output. | Measured with the suite's own fixture: conservative 531 B, normal 531 B, aggressive 490 B. The guarding assertion was `new Set([a,b,c]).size >= 2`, which passes whenever any one differs. Repaired in `f29cf32`. | Test repaired; bundler defect pinned |

**The reattachment contract** is demonstrated runnably at
`jsgui3-html/lab/experiments/002-spec-survival/` (`4480471`): the client rebuilds every control
from exactly `{ context, __type_name, id, el }`, so any constructor branch on another spec field
silently does not happen. 129 unguarded `if (spec.X)` branches across 57 files are exposed to
this; four controls (`Data_Table`, `Date_Picker`, `Text_Input`, `Textarea`) are immune because
they rebuild spec from `spec.el`.

## Docs verified by execution

Rather than read for plausibility, these were checked by running them:

| What | Result |
|---|---|
| All 64 files in `jsgui3-html/docs/controls/` | **63 already correct.** Constructor resolves, constructs, renders, methods exist, test files exist. One defect: `datetime_picker.md` named `DateTime_Picker`; the export is `Datetime_Picker`. Pinned by `test/core/control_docs_contract.test.js` (`03fdf21`). |
| Nine `docs/agi/skills/*/SKILL.md` | Two dead command references fixed; the lab checker crashed on Node 25 and was repaired. Pinned by `test/core/docs_command_contract.test.js` (`acd3032`). |
| `jsgui3-server` README + CLI | Recipe verified end to end — server started on a free port, `GET /` returned 200 with SSR content and `data-jsgui-id` present. `--root` documented as working but never read by `server.js`; corrected in `dbd382b`. |
| `jsgui3-client` README | **Correct.** `jsgui.http` appears undefined in plain Node because the helpers wire only under browser globals. A plain-Node check nearly caused accurate docs to be "fixed"; clarifying note added in `36e6d02`. |

### Open hazard, recorded not fixed

Twenty test files and two tooling files in jsgui3-html assign `global.navigator = {...}` in
sloppy mode. Node 22+ makes `globalThis.navigator` a getter with no setter, so the assignment
**silently no-ops** rather than throwing — verified: after `global.navigator = { userAgent:
'MOCK' }`, `navigator.userAgent` is still `Node.js/25`. Those files believe they are mocking the
user agent and are not. The suite passes regardless, so making the mock actually work could
change test outcomes; it belongs in its own change. The strict-mode instance of the same line
did throw, and was fixed in `lab/experiments/001-data-grid-reattach/check.js`.

## What has never been reviewed

Kept deliberately, because the gaps matter as much as the coverage:

- **`jsgui3-client` — the entire package.** Its docs are how-to only. Zero reviews.
- **`jsgui3-designer` — the entire repo.**
- Routing, `Resource`, SSE, server HTTP internals, caching, authentication
- **Security** — no review of any kind
- Framework performance and memory — the only dataset anywhere is a consumer guide
- Accessibility beyond the 8 date/time controls
- **~129 of 155 controls** — charting, the editor family, tree controls, `Window`/dialog, admin UI, most of `0-core`
- The SSR renderer as a whole (reviewed at two pinpoints only)
- The theming *engine* (only its CSS surface, in Feb 2026, since superseded)
- **What the test suites actually cover.** Counts get quoted constantly — 605, 645, 863, 657/657, 170/170 — and nobody has assessed what they exercise.

## An honest note on external review

There is none, and there never has been. As of 2026-08-01 all three GitHub repos have 0 stars,
0 forks and 1 watcher. A code search for `jsgui3-html` in package.json returns 18 hits across 14
repositories, every one owned by the author. Nothing on Hacker News, Reddit, dev.to, lobste.rs or
StackOverflow.

Every review listed above was written by the author or his agents, about code they also wrote
and usually fixed in the same commit. There is no outside baseline. Weight the findings
accordingly.
