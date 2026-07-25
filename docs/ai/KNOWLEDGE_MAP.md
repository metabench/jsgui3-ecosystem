# jsgui3 Ecosystem — Knowledge Map

> **Last Updated:** 2026-05-28
> **Audience:** AI agents needing to find information across the ecosystem

This document maps **what kind of knowledge** you might need to **where it lives**. Use it as a lookup table when starting any task.

---

## Knowledge by Topic

### Architecture & Design

| What | Where | File |
|------|-------|------|
| Overall system architecture | `jsgui3-ecosystem` | `docs/ARCHITECTURE.md` |
| Dependency graph | `jsgui3-ecosystem` | `docs/DEPENDENCY_MAP.md` |
| Repo catalog | `jsgui3-ecosystem` | `docs/REPOS.md` |
| Server architecture | `jsgui3-server` | `README.md`, `docs/system-architecture.md` |
| Server core book | `jsgui3-server` | `docs/core/jsgui3-server-core-book/` |
| Bundling deep dive | `jsgui3-server` | `docs/books/jsgui3-bundling-research-book/` |
| HTML control architecture | `jsgui3-html` | `README.md` |
| MVVM architecture | `jsgui3-html` | `MVVM.md`, `docs/MVC_MVVM_Developer_Guide.md` |
| Mixin system design | `jsgui3-html` | `docs/mixins-book.md`, `control_mixins/README.md` |
| Theme system | `jsgui3-html` | `docs/THEME_SYSTEM_EXTENSION_ROADMAP.md` |
| GFX class hierarchy | `jsgui3-gfx-core` | `docs/03-architecture.md` |

### Conventions & Style

| What | Where | File |
|------|-------|------|
| Universal conventions | `jsgui3-ecosystem` | `docs/CONVENTIONS.md` |
| HTML-specific conventions | `jsgui3-html` | `AGENTS.md` |
| Server-specific conventions | `jsgui3-server` | `AGENTS.md` |
| Lang-tools conventions | `lang-tools` | `AGENTS.md` |
| Control naming & testing | `jsgui3-html` | `controls/organised/AGENT.md` |

### Agent Orientation

| What | Where | File |
|------|-------|------|
| Top-level agent guide | `jsgui3-ecosystem` | `docs/ai/AGENT.md` |
| Cross-repo coordination | `jsgui3-ecosystem` | `docs/ai/CROSS_REPO_COORDINATION.md` |
| HTML agent hub | `jsgui3-html` | `docs/agi/INDEX.md` |
| HTML self-model | `jsgui3-html` | `docs/agi/SELF_MODEL.md` |
| HTML agent skills | `jsgui3-html` | `docs/agi/SKILLS.md` |
| Server agent guide | `jsgui3-server` | `AGENTS.md` |
| Lang-tools agent on-ramp | `lang-tools` | `docs/agent-on-ramp.md` |

### Lessons & Patterns

| What | Where | File |
|------|-------|------|
| HTML lessons | `jsgui3-html` | `docs/agi/LESSONS.md` |
| HTML patterns | `jsgui3-html` | `docs/agi/PATTERNS.md` |
| Lang-tools lessons | `lang-tools` | `docs/agi/LESSONS.md` (if present) |
| Cross-project knowledge | Antigravity | `C:\Users\james\.gemini\antigravity\knowledge\` |

### API Reference

| What | Where | File |
|------|-------|------|
| HTML control API | `jsgui3-html` | `README.md` |
| Server API | `jsgui3-server` | `README.md`, `docs/api-reference.md` |
| Server simple API design | `jsgui3-server` | `docs/simple-server-api-design.md` |
| Server admin extension | `jsgui3-server` | `docs/admin-extension-guide.md` |
| Server middleware | `jsgui3-server` | `docs/middleware-guide.md` |
| Client API | `jsgui3-client` | `README.md`, `docs/README.md` |
| lang-tools API | `lang-tools` | `README.md` |
| lang-mini API | `lang-mini` | `README.md` |
| obext API | `oext` | `readme.md`, `docs/` |
| GFX pixel buffer API | `jsgui3-gfx-core` | `docs/04-pixel-buffer-api.md` |
| Webpage API | `jsgui3-webpage` | `README.md` |
| Website API | `jsgui3-website` | `README.md` |

### Testing

| What | Where | File |
|------|-------|------|
| HTML E2E test patterns | `jsgui3-html` | `AGENTS.md` (Testing section) |
| Server test suite | `jsgui3-server` | Various `test:*` npm scripts |
| Lang-tools test guide | `lang-tools` | `AGENTS.md`, `TEST_ANALYSIS.md` |
| Lang-mini test summary | `lang-mini` | `TEST-SUMMARY.md` |
| GFX test reference | `jsgui3-gfx-core` | `docs/10-agent-reference.md` |

### Bug Tracking

| What | Where | File |
|------|-------|------|
| Lang-tools bugs | `lang-tools` | `BUGS.md`, `BUGS_AND_ISSUES.md` |
| Lang-mini notes | `lang-mini` | `AI-NOTES.md` |
| HTML bugs | `jsgui3-html` | `docs/bugs/` directory |
| Server issues | `jsgui3-server` | `TODO.md` |

### Roadmaps

| What | Where | File |
|------|-------|------|
| Ecosystem roadmap | `jsgui3-ecosystem` | `docs/ROADMAP.md` |
| HTML roadmap | `jsgui3-html` | `roadmap.md` |
| HTML improvement plan | `jsgui3-html` | `docs/jsgui3_html_improvement_plan.md` |
| HTML controls expansion | `jsgui3-html` | `docs/controls_expansion_ideas.md` |
| Server roadmap | `jsgui3-server` | `roadmap.md` |
| Lang-tools roadmap | `lang-tools` | `roadmap.md` |
| Lang-mini roadmap | `lang-mini` | `roadmap.md` |
| Oext roadmap | `oext` | `roadmap.md` |

---

## Knowledge by Repo

### jsgui3-ecosystem (this repo)
```
docs/
├── README.md           # Documentation hub
├── ARCHITECTURE.md     # System architecture
├── REPOS.md            # Repo catalog
├── DEPENDENCY_MAP.md   # Dependency graph
├── CONVENTIONS.md      # Coding conventions
├── DEVELOPMENT_WORKFLOW.md  # Development workflow
├── ROADMAP.md          # Strategic roadmap
└── ai/
    ├── AGENT.md        # Agent orientation
    ├── CROSS_REPO_COORDINATION.md  # Multi-repo protocol
    └── KNOWLEDGE_MAP.md  # This file
```

### jsgui3-html (most documentation-rich)
```
AGENTS.md               # Comprehensive agent guide
README.md               # Full API reference
MVVM.md                 # MVVM guide
INDEX.md                # Quick index
docs/
├── agi/
│   ├── INDEX.md        # Agent knowledge hub
│   ├── LESSONS.md      # Accumulated lessons
│   ├── PATTERNS.md     # Discovered patterns
│   ├── SELF_MODEL.md   # AI self-model
│   ├── SKILLS.md       # Agent skills
│   ├── skills/         # Skill definitions
│   └── workflows/      # Agent workflows
├── books/              # Deep-dive documentation books
├── controls/           # Per-control documentation
├── mixins-book.md      # Complete mixin reference
└── ...                 # Many more docs
```

### jsgui3-server (well-documented)
```
AGENTS.md               # Server agent guide
README.md               # Full API + architecture
docs/
├── comprehensive-documentation.md
├── simple-server-api-design.md
├── system-architecture.md
├── admin-extension-guide.md
├── middleware-guide.md
├── controls-development.md
├── publishers-guide.md
├── resources-guide.md
├── core/               # Core internals book
└── books/              # Deep-dive books
```

### lang-tools
```
AGENTS.md               # Agent guide
README.md               # Full API reference
BUGS.md                 # Bug tracker
docs/
├── agent-on-ramp.md    # Agent first steps
├── workflows/          # Development workflows
└── templates/          # Doc templates
```

---

## When You Can't Find Something

1. **Search the repo** — `grep -r "keyword" .` across the relevant repo
2. **Check README.md** — most repos have comprehensive READMEs
3. **Check AGENTS.md** — agent-specific guides at repo root
4. **Check docs/ folder** — deeper documentation
5. **Check test files** — tests often serve as living documentation
6. **Check examples/ or dev-examples/** — working code examples
7. **Ask** — if you truly can't find it, note it as a gap in LESSONS.md
