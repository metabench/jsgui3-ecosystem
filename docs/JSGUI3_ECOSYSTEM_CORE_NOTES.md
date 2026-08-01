# jsgui3 Ecosystem Core Notes

This coordination project contains promoted operating principles for the jsgui3 ecosystem. It distills mature AI/AGI workflow practices into a self-contained framework stewardship layer.

## Scope

Included: jsgui3 framework modules, UI controls, server/client rendering, examples, docs, data binding research, and release coordination.

Excluded: news downloader work, crawlers, news databases, and application-specific crawling doctrine.

## Core Principles

- The ecosystem is multi-repo. Always locate ownership before editing.
- Stable APIs are valuable. Protect them unless a breaking change has a written migration plan.
- Syntactic sugar is welcome when it is additive and testable.
- Data binding remains open. Investigate, prototype, document, and validate before promotion.
- Docs are working memory. Record cross-repo decisions here when they affect more than one implementation repo.
- Agent files are high-leverage operating instructions. Improve them carefully and deliberately.

## How Agents Should Think

1. Determine whether the task is coordination, framework API work, UI/control work, data binding research, or release management.
2. Choose the owning repo and the right custom agent.
3. Read only enough local context to act safely.
4. Make the smallest useful change.
5. Validate and record evidence.
6. If release/push is in scope, follow the release and remote policy.
