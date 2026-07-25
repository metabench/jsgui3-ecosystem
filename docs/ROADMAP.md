# jsgui3 Ecosystem — Roadmap

> **Last Updated:** 2026-07-19
>
> **Status:** Living document — updated as priorities evolve

---

## Vision

Make jsgui3 a **production-ready, isomorphic UI framework** that developers choose for building rich, data-driven web applications with minimal ceremony. The ecosystem should be:

- **Complete** — every common UI pattern has a well-tested control
- **Documented** — any developer or agent can be productive within an hour
- **Performant** — server-side rendering, smart bundling, efficient updates
- **Extensible** — mixins, themes, plugins, custom controls
- **Accessible** — ARIA support, keyboard navigation, screen reader compatibility

---

## Current Status

### Maturity by Package

| Package | Maturity | Notes |
|---------|----------|-------|
| `lang-mini` | **Stable** | v0.0.46, well-tested, used across all packages |
| `obext` | **Stable** | v0.0.34, small API surface, well-tested |
| `lang-tools` | **Maturing** | v0.0.45, active bug fixes, Data_Model modernisation in progress |
| `jsgui3-gfx-core` | **Stable** | v0.0.27, comprehensive pixel buffer API |
| `jsgui3-html` | **Actively Developed** | v0.0.188, large control library, active mixin development |
| `jsgui3-webpage` | **Stable** | v0.0.10, small focused API |
| `jsgui3-website` | **Stable Surface / Active Local Evolution** | v0.0.10; additive resolved-model work is present locally and awaiting a phase audit |
| `jsgui3-client` | **Maturing** | v0.0.130, good test coverage |
| `jsgui3-server` | **Actively Developed** | v0.0.156, rich feature set, active admin UI work |
| `jsgui3-designer` | **Early** | v0.0.1, functional prototype |
| `jsgui3-own-website` | **Early / Active** | v0.0.0; extensive docs-viewer Phases 1-6 implemented and publicly demonstrated; presentation and coverage continue to evolve |
| `jsgui3-ecosystem` | **New** | v0.0.0; coordination docs and validation tooling being established |

---

## Now — Active Delivery Track

The active ecosystem delivery track is the extensive, user-facing documentation viewer in `jsgui3-own-website`. Its source of truth is [OWN_WEBSITE_DOCS_VIEWER_SPEC.md](./examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md), the [machine-checked contract](./examples/own_website_docs_viewer_contract.json), and the owner buildbook at `../jsgui3-own-website/IMPLEMENTATION_PLAN.md`.

- [x] Phase 1: implement the runnable server/client scaffold, viewer shell, source-code viewer, and focused tests.
- [x] Phase 2: add `Source_Browser`, `GET /controls/:control_name`, and `GET /api/docs/control-source` backed by real `jsgui3-html` source.
- [x] Phase 3: add example pages, honest preview readiness, inventory/source/status APIs, and the complete viewer shell.
- [x] Phase 4: add the control catalog and a live overview-first home page.
- [x] Phase 5: complete route/source/failure tests, publish the runnable viewer in the ecosystem inventory, and deploy its first hosted application preview.
- [x] Phase 6: redesign the public viewer as a full-screen documentation studio with source-backed guides, responsive control/document workbenches, guided navigation, and the public admin module disabled.
- [ ] **Next:** optionally promote reusable viewer controls, add domain/TLS hardening, deepen deterministic previews, and continue accessibility/performance validation without overstating pre-1.0 maturity.

The separate Website specification initiative has been audited in
[WEBSITE_SPEC_STATUS.md](./WEBSITE_SPEC_STATUS.md). Phases 1-7 are partial and
Phase 8 is not started; its earliest coherent next step is Phase 1 validation,
after the dirty model-owner changes are reconciled.

---

## Later — Strategic Priorities

### Priority 1: Consolidate & Stabilise

- [ ] Complete Data_Model modernisation in `lang-tools`
- [ ] Resolve all `<BUG###>` tagged issues in `lang-tools`
- [ ] Achieve full E2E test coverage for all interactive controls in `jsgui3-html`
- [ ] Stabilise server bundling pipeline — resolve control elimination edge cases
- [ ] Ensure all packages work with Node.js 22 LTS

### Priority 2: Documentation Excellence

- [x] Create ecosystem-level documentation (this repo)
- [ ] Complete API documentation for every public method in `jsgui3-html`
- [ ] Write getting-started tutorial series
- [ ] Document all 39 mixins with working examples

### Priority 3: Control Library Expansion

- [ ] Complete form controls suite (date picker, time picker, colour picker, file upload)
- [ ] Data grid with sorting, filtering, pagination
- [ ] Chart/graph components
- [ ] Navigation components (breadcrumbs, sidebar, navbar)
- [ ] Modal/dialog system
- [ ] Toast/notification system
- [ ] Complete theming system with multiple built-in themes

### Priority 4: Developer Experience

- [ ] Mature the existing `jsgui3-designer` functional prototype
- [ ] Live preview / hot reload in development
- [ ] CLI scaffolding for new projects
- [ ] TypeScript definitions for all packages
- [ ] VS Code extension for jsgui3 development

### Priority 5: Production Readiness

- [ ] Performance benchmarks and optimisation
- [ ] Security audit and hardening
- [ ] Production deployment guide
- [ ] CDN-ready builds
- [ ] Browser compatibility matrix with automated testing

---

## Per-Package Roadmaps

Each package maintains its own roadmap file:

| Package | Roadmap Location |
|---------|-----------------|
| `jsgui3-html` | `roadmap.md` |
| `jsgui3-server` | `roadmap.md` |
| `lang-tools` | `roadmap.md` |
| `lang-mini` | `roadmap.md` |
| `oext` | `roadmap.md` |

Per-package roadmaps vary substantially in age and detail. Treat them as input,
verify them against the current repo, and record the selected active node here.

---

## Milestones

### Milestone 1: Documentation Complete *(In Progress)*
- [x] Ecosystem docs
- [x] Agent guides
- [x] Architecture diagrams
- [ ] Per-repo documentation audit
- [x] Interactive docs website public demonstration (pre-1.0; domain/TLS hardening remains)

### Milestone 2: Test Coverage Complete
- E2E tests for all interactive controls
- Integration tests for server bundling
- Cross-package integration tests
- CI pipeline setup

### Milestone 3: Control Library v1
- Full form controls suite
- Layout system controls
- Navigation controls
- Data display controls
- All controls themed and accessible

### Milestone 4: Production Release Candidate
- Performance optimised
- Security audited
- Deployment guide complete
- Semver 1.0.0 for stable packages

---

## Contributing

Contributions are welcome! To contribute:

1. Read [CONVENTIONS.md](./CONVENTIONS.md) for coding standards
2. Read [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for the workflow
3. Check the per-package roadmap for planned work
4. Open an issue or PR on the relevant repo
