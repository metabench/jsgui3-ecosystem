# jsgui3-ecosystem

The coordination headquarters for the **jsgui3** software platform — a modular, isomorphic JavaScript UI framework.

## What Is This Repo?

This repository doesn't contain application code. Instead, it serves as the **central hub** for:

- 📚 **Cross-repo documentation** — architecture, conventions, dependency maps
- 🤖 **AI agent coordination** — orientation guides, knowledge maps, protocols
- 🗺️ **Roadmap & planning** — strategic priorities and milestones
- 🔗 **Repository catalog** — descriptions and status of core repos and supporting projects

This repository is the canonical home for durable ecosystem coordination. The
sibling `coordination-jsgui-ecosystem.code-workspace` directory is only a local
multi-root workspace shell.

## Quick Links

| Document | Purpose |
|----------|---------|
| [docs/README.md](docs/README.md) | **Start here** — documentation hub |
| [docs/COORDINATION_STATUS.md](docs/COORDINATION_STATUS.md) | Current structure, active work, and immediate execution order |
| [docs/examples/INDEX.md](docs/examples/INDEX.md) | Cross-repo examples index, learning path, and smoke commands |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture & dependency graph |
| [docs/REPOS.md](docs/REPOS.md) | Catalog of every repo |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Coding conventions (mandatory) |
| [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) | How to develop across repos |
| [docs/DEPENDENCY_MAP.md](docs/DEPENDENCY_MAP.md) | Package dependency graph |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Strategic roadmap |

### For AI Agents

| Document | Purpose |
|----------|---------|
| [docs/ai/AGENT.md](docs/ai/AGENT.md) | **Agent orientation** — read this first |
| [docs/ai/CROSS_REPO_COORDINATION.md](docs/ai/CROSS_REPO_COORDINATION.md) | Multi-repo change protocol |
| [docs/ai/KNOWLEDGE_MAP.md](docs/ai/KNOWLEDGE_MAP.md) | Where knowledge lives |
| [docs/ai/agi/AGENT.md](docs/ai/agi/AGENT.md) | Deep knowledge for advanced agents |

## The Ecosystem

```
┌─────────────────────────────────────────────────────┐
│  Applications: jsgui3-designer · jsgui3-own-website │
├─────────────────────────────────────────────────────┤
│  Server:       jsgui3-server                        │
├─────────────────────────────────────────────────────┤
│  Client:       jsgui3-client                        │
├─────────────────────────────────────────────────────┤
│  Presentation: jsgui3-html · jsgui3-webpage/website │
│                jsgui3-gfx-core                      │
├─────────────────────────────────────────────────────┤
│  Foundation:   lang-tools · obext · lang-mini       │
└─────────────────────────────────────────────────────┘
```

Published core packages live under the [metabench](https://github.com/metabench)
organisation; application, example, and coordination repos are not all npm
packages. The ecosystem is MIT licensed.

## Example Coordination

This repo now maintains a manifest-driven examples index for representative demos across sibling jsgui3 repos.

```bash
npm run examples:list
npm run examples:scan:summary
npm run smoke:examples
npm run smoke:examples:summary
npm run docs:check
npm run docs:viewer:check
```

See [docs/examples/INDEX.md](docs/examples/INDEX.md) for owner repos, run commands, expected results, related files, and a practical learning path.

`npm run docs:check` validates the curated manifest shape, examples index drift, and active continuation prompt. `npm run docs:viewer:check` validates the docs-viewer inventory and owner-side contracts.

Near-term example work also tracks a documentation viewer: docs, live activated
jsgui3-html controls, framework/component source, example source, run commands,
expected results, and smoke/status visibility in one user-facing surface. The
minimal `jsgui3-server` shell is currently parked in local stashes; the active
public implementation is the extensive viewer owned by `jsgui3-own-website`.
See [docs/examples/DOCS_VIEWER_SPEC.md](docs/examples/DOCS_VIEWER_SPEC.md),
[docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md](docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md),
and [docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md](docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md).

## License

MIT © James Vickers — [james@metabench.com](mailto:james@metabench.com)
