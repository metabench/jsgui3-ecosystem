# jsgui3 Ecosystem — Repository Catalog

> **Last Updated:** 2026-07-19

This document provides a detailed description of every repository in the jsgui3 ecosystem, organised by architectural layer.

---

## Foundation Layer

These packages provide the core runtime primitives — events, types, reactive properties, and data models — that every higher-level package depends on.

---

### lang-mini

| Field | Value |
|-------|-------|
| **npm** | `lang-mini` |
| **Version** | 0.0.46 |
| **Entry** | `lib-lang-mini.js` |
| **Dependencies** | None (zero production deps) |
| **Node** | ≥ 15.0.0 |
| **Repo** | [github.com/metabench/lang-mini](https://github.com/metabench/lang-mini) |

**Purpose:** Lightweight, zero-dependency JavaScript toolkit providing the core utility, type system, and event infrastructure for the entire ecosystem.

**Key Exports:**
- `each`, `clone`, `arr_like_to_arr` — collection helpers
- `mfp`, `fp` — multi-function polymorphic dispatch
- `tof`, `tf`, `deep_sig` — type detection and signatures
- `Evented_Class`, `eventify` — event emitter mixin
- `field`, `prop` — reactive data binding primitives
- `Functional_Data_Type` — runtime type validation
- `Grammar` — grammar-driven type inference (WIP)
- `combinations` — Cartesian product helper
- `call_multi`, `Fns`, `Publisher` — async coordination

**Testing:** `npm test` runs Jest + legacy test suites (118+ assertions).

---

### obext (oext)

| Field | Value |
|-------|-------|
| **npm** | `obext` |
| **Version** | 0.0.34 |
| **Entry** | `oext.js` |
| **Dependencies** | `lang-mini` |
| **Node** | ≥ 12.0.0 |
| **Repo** | [github.com/metabench/oext](https://github.com/metabench/oext) |

> **Note:** The repo directory is `oext` but the npm package name is `obext`.

**Purpose:** ES6+ reactive property definitions using `Object.defineProperty`. Provides change events, value transformers, defaults, aliases, and read-only computed properties.

**Key Exports:**
- `prop(obj, name, default, callback)` — reactive property with closure storage
- `field(obj, name, default)` — reactive property stored on `obj._` (serialisable)
- `read_only(obj, name, getter)` / `ro` — getter-only property
- `get_set(obj, names, getter, setter)` / `gs` — raw getter/setter pair
- `opts` — module-level config (`raise_change_events`)

**Consumed by:** jsgui3-html, jsgui3-gfx-core, lang-tools

---

### lang-tools

| Field | Value |
|-------|-------|
| **npm** | `lang-tools` |
| **Version** | 0.0.45 |
| **Entry** | `lang.js` |
| **Dependencies** | `fnl`, `lang-mini` |
| **Node** | ≥ 12.0.0 |
| **Repo** | [github.com/metabench/lang-tools](https://github.com/metabench/lang-tools) |

**Purpose:** Higher-level data structures and reactive models that sit between `lang-mini` and the UI layer. Provides the MVVM foundation.

**Key Exports:**
- `Data_Model`, `Data_Object`, `Data_Value`, `Data_Integer`, `Data_String` — reactive data models
- `Collection` — reactive array-like with change events
- `collective` / `collect` — Proxy-based batch operations
- `B_Plus_Tree`, `Doubly_Linked_List`, `Ordered_KVS`, `Sorted_KVS` — data structures
- `Mini_Context` — lightweight ID management context
- `util` — vector math, pixel conversion, colour utilities

**Testing:** `npm test` runs Jest (`--runInBand --forceExit`). Also has a legacy test runner.

**Agent Guides:** See `AGENTS.md`, `docs/agent-on-ramp.md`, `BUGS.md` in the repo.

---

## Graphics Layer

---

### jsgui3-gfx-core

| Field | Value |
|-------|-------|
| **npm** | `jsgui3-gfx-core` |
| **Version** | 0.0.27 |
| **Entry** | `core/gfx-core.js` |
| **Dependencies** | `fnl`, `lang-mini`, `obext` |
| **Repo** | [github.com/metabench/jsgui3-gfx-core](https://github.com/metabench/jsgui3-gfx-core) |

**Purpose:** Pure-JavaScript pixel buffer library for creating, manipulating, and processing raster images as typed arrays. No Canvas, no DOM — runs identically in Node.js and browsers.

**Key Exports:**
- `Pixel_Buffer` — full-featured pixel buffer (1/8/24/32 bipp)
- `Pixel_Buffer_Painter` — fluent rectangle drawing API
- `convolution_kernels` — edge detection, Gaussian blur, Sobel
- `ta_math` — TypedArray math operations
- `Rectangle`, `Rect` — geometry classes

**Features:** Drawing (Bresenham lines, scanline fill), convolution, format conversion, resize, masking.

**Testing:** `npm test` runs `tests/run-tests.js`.

---

## Presentation Layer

These packages define the UI control system, page abstractions, and rendering engine.

---

### jsgui3-html

| Field | Value |
|-------|-------|
| **npm** | `jsgui3-html` |
| **Version** | 0.0.188 |
| **Entry** | `html.js` |
| **Dependencies** | `fnl`, `jsgui3-gfx-core`, `lang-tools`, `obext`, `url-parse` |
| **Node** | ≥ 18.0.0 |
| **Repo** | [github.com/metabench/jsgui3-html](https://github.com/metabench/jsgui3-html) |

**Purpose:** The core UI framework. Provides an isomorphic control system, MVVM data binding, 39 composable mixins, theming, and SSR-capable HTML rendering.

**Key Concepts:**
- **Controls** — Fundamental UI building blocks (`Control`, `Control_Core`, `Data_Model_View_Model_Control`)
- **Lifecycle** — Constructor → Composition → Rendering (server) → Activation (client)
- **Mixins** — 39 composable behaviours in 7 categories (interaction, input, layout, theme, lifecycle, infrastructure, accessibility)
- **Theming** — CSS variable tokens, size/variant parameters
- **Control Library** — Organised under `controls/organised/` by category

**Testing:** E2E tests with Puppeteer, Playwright test suites, lab experiments.

**Agent Guides:** Comprehensive `AGENTS.md` at repo root, `controls/organised/AGENT.md`, `docs/agi/` directory.

---

### jsgui3-webpage

| Field | Value |
|-------|-------|
| **npm** | `jsgui3-webpage` |
| **Version** | 0.0.10 |
| **Entry** | `index.js` |
| **Dependencies** | `jsgui3-html` |
| **Repo** | [github.com/metabench/jsgui3-webpage](https://github.com/metabench/jsgui3-webpage) |

**Purpose:** Abstract page definition class. A `Webpage` represents a single page with a path, title (multilingual), and a control that serves as the page renderer.

**Key Features:**
- Multilingual title/content support
- `ctrl` field for specifying the rendering control
- `finalize()` for publish-readiness validation
- Legacy compatibility (`content: Function` accepted as renderer alias)

**Testing:** Mocha tests under `test/`.

---

### jsgui3-website

| Field | Value |
|-------|-------|
| **npm** | `jsgui3-website` |
| **Version** | 0.0.10 |
| **Entry** | `index.js` |
| **Dependencies** | `jsgui3-html`, `jsgui3-webpage` |
| **Repo** | [github.com/metabench/jsgui3-website](https://github.com/metabench/jsgui3-website) |

**Purpose:** Abstract website definition built from `Webpage` primitives. Manages a collection of pages with routing, plus an API endpoint registry.

**Key Features:**
- Page storage via `Map` keyed by route path
- Duplicate detection for pages
- API endpoint registry with structured metadata
- `Website.api.publish(...)` backward-compatible alias

**Testing:** Mocha tests under `test/`.

**Current local work:** Additive Website helpers and resolved-model files are
under active local development. The public 0.0.10 surface remains the stable
compatibility baseline; consult the coordination phase audit before treating
the proposal as released behavior. See
[`WEBSITE_SPEC_STATUS.md`](WEBSITE_SPEC_STATUS.md).

---

## Client Layer

---

### jsgui3-client

| Field | Value |
|-------|-------|
| **npm** | `jsgui3-client` |
| **Version** | 0.0.130 |
| **Entry** | `client.js` |
| **Dependencies** | `fnl`, `jsgui3-html` |
| **Node** | ≥ 15.0.0 |
| **Repo** | [github.com/metabench/jsgui3-client](https://github.com/metabench/jsgui3-client) |

**Purpose:** Browser-side runtime for jsgui3 applications. Extends the base `jsgui3-html` framework with HTTP communication, client resource management, and browser-specific page context.

**Key Components:**
- `client.js` — global `jsgui` object setup with HTTP methods
- `page-context.js` — `Client_Page_Context` with modals, overlays, DOM management
- `resource.js` — client-side resources with HTTP endpoint connectivity
- `client-resource-pool.js` — resource pool management
- `data-get-post-delete-http-resource.js` — CRUD over HTTP

**Testing:** Node built-in test runner + Puppeteer E2E tests.

---

## Server Layer

---

### jsgui3-server

| Field | Value |
|-------|-------|
| **npm** | `jsgui3-server` |
| **Version** | 0.0.156 |
| **Entry** | `module.js` |
| **Dependencies** | `@babel/*`, `cookies`, `esbuild`, `fnl`, `fnlfs`, `jsgui3-client`, `jsgui3-html`, `jsgui3-webpage`, `jsgui3-website`, `lang-tools`, `mocha`, `multiparty`, `ncp`, `obext`, `rimraf`, `sass`, `stream-to-array`, `url-parse` |
| **Node** | ≥ 15.0.0 |
| **Repo** | [github.com/metabench/jsgui3-server](https://github.com/metabench/jsgui3-server) |

**Purpose:** Node.js application server that bundles and serves jsgui3 applications to browsers. The most feature-rich package in the ecosystem.

**Key Features:**
- **`Server.serve()`** — simplified API for serving controls
- **Bundling** — automatic JS/CSS bundling with esbuild, control elimination
- **Admin UI** — built-in dashboard at `/admin/v1`
- **SSE Publishing** — real-time event streaming
- **Resource Pool** — in-process, direct-process, and remote-process resources
- **Middleware** — Express-style pipeline with built-in compression
- **Multi-page** — serves multiple routes with `pages` config
- **API endpoints** — function-based API with auto JSON handling
- **CLI** — `node cli.js serve --port 8080`

**Testing:** Extensive test suite: unit, integration, E2E (Puppeteer/Playwright), performance.

**Agent Guides:** `AGENTS.md`, `docs/` directory with comprehensive documentation.

---

## Application Layer

---

### jsgui3-designer

| Field | Value |
|-------|-------|
| **npm** | — (not published) |
| **Version** | 0.0.1 |
| **Entry** | `index.js` |
| **Dependencies** | `jsgui3-html`, `jsgui3-client`, `jsgui3-server`, `lang-tools` |

**Purpose:** Visual UI designer tool for building jsgui3 interfaces. Early development stage.

**Components:**
- `client.js` — client-side designer application (51KB)
- `server.js` — designer server
- `controls/` — designer-specific controls
- `models/` — data models for the designer

---

### jsgui3-own-website

| Field | Value |
|-------|-------|
| **npm** | — (not published) |
| **Version** | 0.0.0 |
| **Entry** | `server.js` |
| **Dependencies** | `file:../jsgui3-client`, `file:../jsgui3-html`, `file:../jsgui3-server`, `file:../lang-tools` |
| **Node** | ≥ 18.0.0 |

**Purpose:** The website that markets, demonstrates, and documents jsgui3. Intended to showcase the framework's capabilities while providing interactive documentation.

**Status:** Early, actively developed, and deployed as a public demonstration.
Phases 1-6 of the extensive documentation viewer are implemented. Phase 6
delivers the full-screen documentation studio: an overview-first home,
source-backed conceptual guides, a faceted `jsgui3-html` control catalog,
responsive control/document workbenches, checked example records, guided
navigation, a deployed Data Grid preview, and honest preview/readiness states.
The public server explicitly disables its admin module. The viewer remains a
pre-1.0 demonstration built from the current local ecosystem source snapshot;
domain/TLS hardening remains before production status.

---

### jsgui3-ecosystem

| Field | Value |
|-------|-------|
| **npm** | — (not published) |
| **Version** | 0.0.0 |
| **Node** | ≥ 18.0.0 |

**Purpose:** Coordination headquarters for the entire jsgui3 platform. Contains:
- Cross-repo documentation
- AI agent coordination guides
- Architecture diagrams
- Development workflow documentation
- Roadmap and planning

---

## Examples And Coordination Support

### jsgui3-simple-example

Tracked, runnable showcase for server-side rendering, client activation,
advanced controls, CSS extraction, and workspace-local `file:` dependencies.
Its current package version is 0.0.4. The worktree contains existing local
changes, and its stale `npm run smoke` target remains an owner-side cleanup item.

### jsgui3-agents-flowcharts

Tracked isomorphic flowchart designer and workflow-visualization application.
It is coordination-adjacent rather than a core runtime dependency. Its current
`package.json` still identifies the package as `jsgui3-simple-example`; that
metadata mismatch should be corrected in the owning repo before publication.

### jsgui3-modern-examples

Local incubator for current `serve_site` and document/control examples. It is
included in the examples manifest but is not currently a git repository. Move
it into a tracked owner or initialize a deliberate repo before treating it as a
durable implementation source.

---

## Supporting Packages (External)

These packages are used across the ecosystem but are not jsgui3-specific:

| Package | Purpose | Used By |
|---------|---------|---------|
| `fnl` | Functional utilities, observables | Most packages |
| `fnlfs` | Filesystem utilities | jsgui3-server, jsgui3-gfx-core |
