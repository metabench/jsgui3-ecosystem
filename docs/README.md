# jsgui3 Ecosystem — Documentation Hub

> **Last Updated:** 2026-07-25
> **Maintainer:** James Vickers (james@metabench.com)

The **jsgui3 ecosystem** is a modular, isomorphic JavaScript UI platform for building component-driven web applications. This repository (`jsgui3-ecosystem`) is the coordination headquarters — the single place where the full picture of the platform lives.

---

## Quick Navigation

| Document | Audience | Purpose |
|----------|----------|---------|
| [GETTING_STARTED_TUTORIAL.md](./GETTING_STARTED_TUTORIAL.md) | Developers | Step-by-step Counter App tutorial |
| [COORDINATION_STATUS.md](./COORDINATION_STATUS.md) | All | Canonical structure, active work, and immediate execution order |
| [deployments/ORACLE_DATA_GRID_DEMO.md](./deployments/ORACLE_DATA_GRID_DEMO.md) | Developers / Operators | Live Oracle data-grid deployment, verification, and rollback record |
| [deployments/ORACLE_DOCS_VIEWER_DEMO.md](./deployments/ORACLE_DOCS_VIEWER_DEMO.md) | Developers / Operators | Live Oracle docs-viewer deployment, verification, and rollback record |
| [DOCS_VIEWER_RELIABILITY_RESEARCH_2026-07-25.md](./DOCS_VIEWER_RELIABILITY_RESEARCH_2026-07-25.md) | Developers / Agents | Measured atlas lifecycle research, implementation contract, and proof |
| [WEBSITE_SPEC_STATUS.md](./WEBSITE_SPEC_STATUS.md) | Developers / Agents | Evidence-backed phase matrix for the Website specification proposal |
| [examples/INDEX.md](./examples/INDEX.md) | Developers / Agents | Cross-repo examples index, learning path, and smoke verification |
| [examples/DOCS_VIEWER_SPEC.md](./examples/DOCS_VIEWER_SPEC.md) | Developers / Agents | Documentation viewer prototype model and ownership boundary |
| [examples/OWNERSHIP_STATUS.md](./examples/OWNERSHIP_STATUS.md) | Developers / Agents | Hard ownership/status decisions for standalone example repos |
| [examples/WEBPAGE_WEBSITE_GUIDANCE.md](./examples/WEBPAGE_WEBSITE_GUIDANCE.md) | Developers / Agents | Current Webpage/Website model-layer example guidance |
| [FAQ.md](./FAQ.md) | All | Conceptual, styling, and troubleshooting FAQ |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | All | System architecture & dependency graph |
| [REPOS.md](./REPOS.md) | All | Catalog of every repo with purpose, status & links |
| [DEPENDENCY_MAP.md](./DEPENDENCY_MAP.md) | All | Package dependency graph with versions |
| [CONVENTIONS.md](./CONVENTIONS.md) | Developers / Agents | Naming, coding, testing conventions |
| [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) | Developers / Agents | How to develop, test, and publish across repos |
| [ROADMAP.md](./ROADMAP.md) | All | Strategic roadmap & priorities |
| [ai/AGENT.md](./ai/AGENT.md) | AI Agents | Top-level agent orientation guide |
| [ai/CROSS_REPO_COORDINATION.md](./ai/CROSS_REPO_COORDINATION.md) | AI Agents | Multi-repo coordination protocols |
| [ai/KNOWLEDGE_MAP.md](./ai/KNOWLEDGE_MAP.md) | AI Agents | Where knowledge lives across repos |
| [ai/GLOSSARY.md](./ai/GLOSSARY.md) | All | jsgui3-specific terminology |
| [ai/CONTINUATION_PROMPTS.md](./ai/CONTINUATION_PROMPTS.md) | AI Agents | Multi-turn task protocol with recursion limits |

---

## What Is jsgui3?

jsgui3 is a **component-based, isomorphic JavaScript UI framework** that renders HTML on both server and client. It emphasises:

- **Isomorphic rendering** — Same control code runs server-side (SSR) and client-side
- **Reactive data binding** — MVVM pattern with observable `Data_Object` models
- **Compositional architecture** — Complex UIs built from simple, reusable controls
- **Direct DOM manipulation** — No virtual DOM; efficient, targeted updates
- **Convention-driven development** — snake_case everywhere, Camel_Case for classes

### The Stack at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    Applications                         │
│  jsgui3-own-website  ·  jsgui3-designer  ·  user apps  │
├─────────────────────────────────────────────────────────┤
│                 Server Layer                            │
│              jsgui3-server                              │
│  (HTTP serving, bundling, SSE, admin UI, publishers)    │
├─────────────────────────────────────────────────────────┤
│                 Client Layer                            │
│              jsgui3-client                              │
│  (HTTP helpers, client resources, page context)         │
├─────────────────────────────────────────────────────────┤
│              Presentation Layer                         │
│  jsgui3-html  ·  jsgui3-webpage  ·  jsgui3-website     │
│  (Controls, MVVM, mixins, rendering, page/site models) │
├─────────────────────────────────────────────────────────┤
│               Graphics Layer                            │
│              jsgui3-gfx-core                            │
│  (Pixel buffers, drawing, convolution, shapes)          │
├─────────────────────────────────────────────────────────┤
│               Foundation Layer                          │
│  lang-tools  ·  obext (oext)  ·  lang-mini              │
│  (Data models, reactive props, events, type system)     │
└─────────────────────────────────────────────────────────┘
```

---

## Repository Overview

| Repo | npm Package | Layer | Purpose |
|------|-------------|-------|---------|
| `lang-mini` | `lang-mini` | Foundation | Type system, events, polymorphism, utilities |
| `oext` | `obext` | Foundation | Reactive property definitions (`prop`, `field`, `read_only`) |
| `lang-tools` | `lang-tools` | Foundation | Data models, collections, vector math |
| `jsgui3-gfx-core` | `jsgui3-gfx-core` | Graphics | Pixel buffers, image processing |
| `jsgui3-html` | `jsgui3-html` | Presentation | Controls, MVVM, mixins, rendering engine |
| `jsgui3-webpage` | `jsgui3-webpage` | Presentation | Abstract page definitions |
| `jsgui3-website` | `jsgui3-website` | Presentation | Abstract website definitions |
| `jsgui3-client` | `jsgui3-client` | Client | Browser runtime, HTTP helpers, resources |
| `jsgui3-server` | `jsgui3-server` | Server | HTTP server, bundling, SSE, admin UI |
| `jsgui3-designer` | — | Application | Visual UI designer tool |
| `jsgui3-own-website` | — | Application | Marketing/docs website for jsgui3 |
| `jsgui3-ecosystem` | — | Meta | This repo — coordination & documentation |

→ See [REPOS.md](./REPOS.md) for detailed descriptions of each repository.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0 (some packages accept ≥ 15 but 18+ is recommended)
- **npm** (ships with Node.js)
- **Git** for cloning repositories

### Cloning the Ecosystem

```bash
# Clone all repos into a common directory
mkdir jsgui3 && cd jsgui3

git clone https://github.com/metabench/lang-mini.git
git clone https://github.com/metabench/oext.git
git clone https://github.com/metabench/lang-tools.git
git clone https://github.com/metabench/jsgui3-gfx-core.git
git clone https://github.com/metabench/jsgui3-html.git
git clone https://github.com/metabench/jsgui3-webpage.git
git clone https://github.com/metabench/jsgui3-website.git
git clone https://github.com/metabench/jsgui3-client.git
git clone https://github.com/metabench/jsgui3-server.git
git clone https://github.com/metabench/jsgui3-designer.git
git clone https://github.com/metabench/jsgui3-own-website.git
git clone https://github.com/metabench/jsgui3-ecosystem.git
```

### Install Dependencies

```bash
# Install in dependency order (foundation first)
cd lang-mini && npm install && cd ..
cd oext && npm install && cd ..
cd lang-tools && npm install && cd ..
cd jsgui3-gfx-core && npm install && cd ..
cd jsgui3-html && npm install && cd ..
cd jsgui3-webpage && npm install && cd ..
cd jsgui3-website && npm install && cd ..
cd jsgui3-client && npm install && cd ..
cd jsgui3-server && npm install && cd ..
```

### Running Tests

Each repo has its own test suite. Run from the repo root:

```bash
npm test
```

→ See [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for cross-repo development patterns.

### Finding Examples

The ecosystem examples index records owner repos, run commands, expected results, related files, and smoke coverage:

```bash
npm run examples:list
npm run examples:scan:summary
npm run smoke:examples
npm run smoke:examples:summary
npm run docs:viewer:check
```

→ See [examples/INDEX.md](./examples/INDEX.md).

---

## For AI Agents

If you are an AI agent working on jsgui3, start here:

1. **Read** [ai/AGENT.md](./ai/AGENT.md) — your orientation guide
2. **Check** [ai/KNOWLEDGE_MAP.md](./ai/KNOWLEDGE_MAP.md) — find where knowledge lives
3. **Follow** [CONVENTIONS.md](./CONVENTIONS.md) — mandatory coding standards
4. **Coordinate** via [ai/CROSS_REPO_COORDINATION.md](./ai/CROSS_REPO_COORDINATION.md)
5. **Large tasks?** Use [ai/CONTINUATION_PROMPTS.md](./ai/CONTINUATION_PROMPTS.md) for multi-turn work

---

## License

All jsgui3 packages are released under the **MIT License**.

## Author

James Vickers — [james@metabench.com](mailto:james@metabench.com) — [Metabench](https://github.com/metabench)
