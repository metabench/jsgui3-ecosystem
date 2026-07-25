# jsgui3 Ecosystem — AI Agent Orientation Guide

> **Last Updated:** 2026-05-28
> **Audience:** AI coding agents (GitHub Copilot, Claude, ChatGPT, Antigravity, etc.)

---

## Welcome, Agent

You are working on the **jsgui3 ecosystem** — a modular, isomorphic JavaScript UI platform. This document is your starting point for understanding the project, finding knowledge, and coordinating work across repositories.

---

## Step 1: Understand the Ecosystem

The jsgui3 platform consists of **12 repositories** across 5 layers:

```
Applications:   jsgui3-designer, jsgui3-own-website
Server:         jsgui3-server
Client:         jsgui3-client
Presentation:   jsgui3-html, jsgui3-webpage, jsgui3-website, jsgui3-gfx-core
Foundation:     lang-tools, obext (oext), lang-mini
Meta:           jsgui3-ecosystem (this repo)
```

→ Read [../ARCHITECTURE.md](../ARCHITECTURE.md) for the full architecture.
→ Read [../REPOS.md](../REPOS.md) for detailed repo descriptions.

---

## Step 2: Know the Conventions

**These are non-negotiable. Breaking them is unacceptable.**

| Rule | Convention |
|------|-----------|
| Variables, functions | `snake_case` |
| Classes | `Camel_Case` (with underscores) |
| File names | `snake_case` |
| CSS classes | `kebab-case` |
| Constants | `SCREAMING_SNAKE_CASE` |
| DOM access | Always guard with `if (el)` or `if (typeof document !== 'undefined')` |
| Event listeners | Only in `activate()`, never in constructor |
| Data models | Always use `Data_Object`, never plain objects |
| Constructor | Always set `spec.__type_name`, always call `super(spec)` |

→ Read [../CONVENTIONS.md](../CONVENTIONS.md) for the complete reference.

---

## Step 3: Find Where Knowledge Lives

### Per-Repo Agent Guides

Most repos have their own agent-facing documentation. Check these first:

| Repo | Agent Guide Location | Notes |
|------|---------------------|-------|
| `jsgui3-html` | `AGENTS.md` (root) | **Most comprehensive** — read this for control development |
| `jsgui3-html` | `controls/organised/AGENT.md` | Control creation, naming, testing, theming |
| `jsgui3-html` | `docs/agi/INDEX.md` | Knowledge hub, self-model, skills, lessons |
| `jsgui3-html` | `docs/agi/LESSONS.md` | Accumulated project-specific lessons |
| `jsgui3-server` | `AGENTS.md` (root) | Server development guide |
| `lang-tools` | `AGENTS.md` (root) | Data model development |
| `lang-tools` | `docs/agent-on-ramp.md` | First-time agent steps |
| `lang-tools` | `BUGS.md` | Known bugs with `<BUG###>` IDs |
| `jsgui3-ecosystem` | `docs/ai/AGENT.md` (this file) | Cross-repo coordination |

### Cross-Repo Knowledge

| Location | Purpose |
|----------|---------|
| `jsgui3-ecosystem/docs/` | Architecture, dependencies, conventions, roadmap |
| `jsgui3-ecosystem/docs/examples/INDEX.md` | Cross-repo example inventory, learning path, and smoke commands |
| `jsgui3-ecosystem/docs/examples/DOCS_VIEWER_SPEC.md` | Documentation viewer prototype contract and ownership boundary |
| `jsgui3-ecosystem/docs/examples/docs_viewer_inventory.json` | Checked docs-viewer metadata seed |
| `jsgui3-ecosystem/docs/examples/OWNERSHIP_STATUS.md` | Ownership decisions for standalone/local example repos |
| `jsgui3-ecosystem/docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md` | Current model-layer guidance for Webpage/Website examples |
| `jsgui3-ecosystem/docs/ai/` | Agent coordination, knowledge map, glossary |
| `jsgui3-ecosystem/docs/ai/CONTINUATION_PROMPTS.md` | Multi-turn task protocol with recursion limits |
| `C:\Users\james\.gemini\antigravity\knowledge\` | Antigravity cross-project knowledge items |

→ Read [KNOWLEDGE_MAP.md](./KNOWLEDGE_MAP.md) for the complete knowledge location guide.

---

## Step 4: Before You Code

### Research Checklist

1. **Read the relevant repo's AGENTS.md** (if it exists)
2. **Read the relevant repo's LESSONS.md** or `docs/agi/LESSONS.md`
3. **Check for existing patterns** — look at similar controls/modules before creating new ones
4. **Check for known bugs** — search for `<BUG` tags in the codebase
5. **Understand dependencies** — check [../DEPENDENCY_MAP.md](../DEPENDENCY_MAP.md)

### Which Repo Am I Working In?

| Task | Primary Repo | May Also Touch |
|------|-------------|---------------|
| Creating/editing UI controls | `jsgui3-html` | — |
| Control mixins | `jsgui3-html` | — |
| Data models / reactive objects | `lang-tools` | `lang-mini` |
| Server features | `jsgui3-server` | `jsgui3-html`, `jsgui3-client` |
| Browser-side features | `jsgui3-client` | `jsgui3-html` |
| Pixel/image processing | `jsgui3-gfx-core` | — |
| Reactive properties (prop/field) | `oext` (obext) | `lang-mini` |
| Events, type system, utilities | `lang-mini` | — |
| Page definitions | `jsgui3-webpage` | `jsgui3-html` |
| Site definitions | `jsgui3-website` | `jsgui3-webpage` |
| Visual designer | `jsgui3-designer` | `jsgui3-html`, `jsgui3-server` |
| Cross-repo docs | `jsgui3-ecosystem` | — |
| Cross-repo example inventory/smoke wrappers | `jsgui3-ecosystem` | Owning example repos, read-only unless a narrow bug is proven |
| Documentation viewer for examples | `jsgui3-ecosystem` | `jsgui3-server`, `jsgui3-html`, `jsgui3-client` for implementation details |

---

## Step 5: When You Learn Something

Document your discoveries so the next agent doesn't repeat your work:

1. **Project-specific lesson** → Write to the repo's `docs/agi/LESSONS.md` (or equivalent)
2. **Cross-repo useful pattern** → Also note it in `docs/agi/LESSONS.md` with `[CROSS-REPO]` tag
3. **Subsystem-specific context** → Update the relevant path-local `AGENT.md`
4. **Bug discovered** → Add to the repo's `BUGS.md` with `<BUG###>` tag
5. **Pattern discovered** → Add to `docs/agi/PATTERNS.md`

---

## Step 6: Testing

### Every Change Needs Verification

| Package | Test Command | Framework |
|---------|-------------|-----------|
| `lang-mini` | `npm test` | Jest + legacy |
| `lang-tools` | `npm test` | Jest |
| `jsgui3-html` | E2E scripts in `tmp/` | Puppeteer |
| `jsgui3-client` | `npm test` + `npm run test:e2e` | Node test runner + Puppeteer |
| `jsgui3-server` | `npm test` | Custom runner + Mocha |
| `jsgui3-webpage` | `npm test` | Mocha |
| `jsgui3-website` | `npm test` | Mocha |
| `jsgui3-gfx-core` | `npm test` | Custom runner |

### Write Self-Contained E2E Tests

```javascript
// Build test page → start HTTP server → run Puppeteer tests → capture screenshots → shut down
async function run_tests() {
    const html = build_page();
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    });
    await new Promise(r => server.listen(PORT, r));

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}`);

    // ... assertions ...

    await browser.close();
    server.close();
}
```

---

## Step 7: Cross-Repo Changes

If your change spans multiple repos, follow this protocol:

1. **Foundation first** — Make changes in lower-level packages first
2. **Test locally** — Use `npm link` for local development
3. **Publish bottom-up** — Follow the update cascade in [../DEPENDENCY_MAP.md](../DEPENDENCY_MAP.md)
4. **Document** — Update this ecosystem repo if architecture/deps change

→ Read [CROSS_REPO_COORDINATION.md](./CROSS_REPO_COORDINATION.md) for the full protocol.

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Using `camelCase` for variables | Use `snake_case` everywhere |
| Accessing DOM in constructor | Move to `activate()` |
| Using plain objects for data models | Use `Data_Object` |
| Forgetting `super(spec)` in constructor | Always call it first |
| Forgetting SSR guards | Wrap DOM access in `if (el)` |
| Dumping temp files in repo root | Use `$env:TEMP` or `tmp/` |
| Leaving `console.log` in code | Remove before finishing |
| Not testing interactive behaviour | Write Puppeteer E2E tests |

---

## Quick Reference: Key Files per Repo

### jsgui3-html (most active)
- `html.js` — main entry point
- `html-core/` — core control classes
- `controls/controls.js` — control registry/exports
- `controls/organised/` — organised control library
- `control_mixins/` — 39 composable mixins
- `themes/` — theme definitions
- `docs/agi/` — agent knowledge hub

### jsgui3-server
- `module.js` — main entry point
- `server.js` — Server class
- `serve-factory.js` — `Server.serve()` implementation
- `publishers/` — HTTP publishers
- `resources/` — resource implementations
- `admin-ui/` — built-in admin dashboard
- `middleware/` — middleware pipeline

### lang-tools
- `lang.js` — main entry point / exports
- `Data_Model/` — reactive data model implementations
- `util.js` — vector math and utilities
- `collective.js` — batch operations

### lang-mini
- `lang-mini.js` — single-file implementation (~2800 lines)
- `lib-lang-mini.js` — CommonJS re-export
