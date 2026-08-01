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
