---
description: "Core jsgui3 ecosystem rules for cross-repo framework work, API stability, UI controls, data binding, and release safety."
applyTo: "**"
---

# jsgui3 Core Instructions

- This workspace is for jsgui3 ecosystem coordination only. Do not apply news, crawler, downloader, or database-product assumptions.
- Before editing, identify the owning repo and read that repo's local instructions, README, package scripts, and relevant tests.
- Stable jsgui3 APIs are contracts. Prefer additive syntax, wrappers, examples, tests, and docs over breaking changes.
- Data binding is not final. Treat binding changes as research/design work until examples and compatibility tests make the behavior clear.
- Keep cross-repo changes split by repo and concern. Avoid sweeping edits across repos without a written plan.
- Validate in the owning repo. Use the smallest check first, then focused tests, then broader checks when release risk justifies them.
- Remote pushes are allowed when the user has asked for release/remote management and the repo is clean, validated, on the intended branch, and pointed at the intended remote.
- Never force push, rewrite history, or include unrelated user changes unless explicitly requested.
