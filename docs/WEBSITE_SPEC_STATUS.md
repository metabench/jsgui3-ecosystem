# Website Specification API Status

> **Last verified:** 2026-07-11
> **Proposal:** `../coordination-jsgui-ecosystem.code-workspace/docs/WEBSITE_SPEC_API_PLAN.md`
> **Overall status:** Active proposal with partial local implementation

This matrix compares the eight proposed delivery phases with the current local
working trees. It records implementation evidence, not released behavior. The
`jsgui3-website` and `jsgui3-webpage` model changes are still dirty/untracked.

| Phase | Status | Implemented evidence | Remaining gap |
| --- | --- | --- | --- |
| 1 — Additive spec parsing | **Partial** | `jsgui3-website/Website.js` captures the additive keys; `model/normalizer.js` performs basic normalization. | The planned validator module is absent. Named `routes` can be accepted then ignored, unknown sections and disabled dynamic routes do not diagnose, and grouped `strict` is treated as global truthy strict. |
| 2 — Normalized model | **Partial** | Basic slots, page IDs, aliases, redirects, queries, and resolved records exist in `model/`; focused tests cover the basic path. | Declared routes are not reconciled, `['Title', Ctrl]` shorthand fails, alias/redirect chains are absent, and the model is not immutable (`Map.set()` succeeds after finalization). |
| 3 — Layout rendering | **Partial** | Slot precedence is normalized and `jsgui3-server/controls/site-page-composer.js` renders resolved slots. | `layout.shell` is ignored; the planned isomorphic `jsgui3-html/controls/site/*` primitives do not exist. Current rendering is server-specific. |
| 4 — Navigation | **Partial** | `auto:section=` expansion and navigation bindings work and have focused coverage. | Active-item hints and the planned navigation provider are absent; render context exposes raw groups. |
| 5 — Theme and head | **Partial** | Basic deterministic head merging and rendering work. | Theme tokens, modes, and profiles are only stored; they are not applied to rendered HTML. |
| 6 — Sections, i18n, strict | **Partial** | Section inference plus layout/slot/meta/head inheritance work. | Locale variants and request-locale field resolution are absent; the renderer selects the default locale directly. Fine-grained strict validation is absent. |
| 7 — Server integration | **Partial** | Resolver methods, static pages, aliases, redirects, APIs, middleware, assets, `prepare_only`, startup, and `Server.serve()` dispatch exist. | Planned `Site_*` adapter classes, publisher subclass, shared site bundle/admin diagnostics, dynamic routes, locale negotiation, and render-error wiring are absent. |
| 8 — Docs and example | **Not started** | — | The Website README still demonstrates the legacy `pages` + `api` surface; no runnable example exercises every new key end to end. |

## Earliest Defensible Next Phase

Finish Phase 1 before adding more surface area:

1. Implement one authoritative validation pass for named routes, section/layout/
   region references, reserved dynamic routes, and grouped strict settings.
2. Add focused failure tests for every rule above.
3. Decide whether named `routes` create pages, enrich pages, or form a separate
   route table; reject unsupported forms rather than silently ignoring them.
4. Then complete Phase 2 shorthand and immutability guarantees.

Later phases contain valuable working code, especially server integration, but
the delivery sequence should not be described as complete while Phase 1 accepts
unsupported input silently.

## Verification Evidence

- `jsgui3-website`: 35 tests passing.
- `jsgui3-webpage`: 12 tests passing.
- `jsgui3-server` focused `serve_site`: 20 tests passing.
- Browser activation suite: **inconclusive**; it exited after deprecation output
  without a Mocha result and is not counted as passing.

## Integration And Release Blocker

`jsgui3-server/package.json` still declares `jsgui3-webpage` and
`jsgui3-website` as `^0.0.8`, while the tested workspace uses local symlinks to
dirty 0.0.10 working trees. `npm ls` reports both dependencies invalid because
`^0.0.8` is constrained below 0.0.9. The passing server tests therefore validate
the local workspace combination, not a reproducible clean install.

Before release:

1. reconcile and intentionally commit the model-owner changes;
2. choose/publish compatible model package versions;
3. update the server dependency ranges;
4. reinstall from declared metadata and rerun the model, serve-site, and browser
   activation suites.
