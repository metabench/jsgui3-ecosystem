# jsgui3 Ecosystem Agent Guide

This repo coordinates the jsgui3 ecosystem. It owns cross-repo documentation, plans, and verification wrappers; implementation examples remain in the repo that owns the behavior.

This is the canonical coordination repository. The sibling
`coordination-jsgui-ecosystem.code-workspace` directory is a local multi-root
workspace shell, not a second source of truth. Start current-status work with
`docs/COORDINATION_STATUS.md`.

## Example Workflow

- Start with `docs/examples/INDEX.md` and `docs/examples/examples_manifest.json` before adding or changing ecosystem example documentation.
- Identify the owning repo for each example before proposing edits.
- Prefer ecosystem-level wrapper scripts, manifests, docs, and smoke checks over broad sibling-repo changes.
- When a sibling example is broken, document the failure here first unless the ownership boundary is clear and the fix is narrow.
- Keep browser/server smoke checks bounded. The default `npm run smoke:examples` should stay safe for CI and should not launch long-running servers.
- Treat the documentation viewer as a near-term examples priority. Start with `docs/examples/DOCS_VIEWER_SPEC.md` and `docs/examples/docs_viewer_inventory.json`; live activated controls, component source, example source, run command, and status should be visible from the user's perspective.
- Use `docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md` when the next step is owner-side implementation in `jsgui3-server`; this repo validates the route/test contract but does not own the runnable server shell.
- Use `docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md` and `docs/examples/own_website_docs_viewer_contract.json` for the extensive user-facing documentation viewer owned by `jsgui3-own-website` (live activated controls plus real source-code viewing). `npm run docs:viewer:check` validates that contract too; the owner buildbook is `../jsgui3-own-website/IMPLEMENTATION_PLAN.md`.
- Use `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md` for the deferred Webpage/Website served-example path; `npm run docs:viewer:check` validates that contract too.
- Use `npm run examples:scan:summary` and `npm run smoke:examples:summary` for compact operator status before reaching for raw output.
- Use `npm run docs:check` after changing manifest metadata; it validates manifest shape, index drift, and continuation prompt structure.
- Use `npm run docs:viewer:check` after changing docs-viewer metadata.
- After changing the manifest or examples index, run `npm run docs:check` and `npm run smoke:examples`.
- Record broad example-improvement sessions under `docs/sessions/<date>-jsgui3-ecosystem-examples/`.
- Keep `docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md` in the explicit recursive handoff format: operating model, planning turn, execution state, broad workload, verification, final response requirements, last turns, backlog, and horizon.

## Commands

```bash
npm run examples:list
npm run examples:scan
npm run examples:scan:summary
npm run smoke:examples
npm run smoke:examples:summary
npm run docs:check
npm run docs:viewer:check
npm test
```

## Boundaries

- Do not edit sibling repos from this coordination repo unless the bug clearly belongs there and the change is narrow, tested, and documented.
- Treat stable public APIs as contracts. Prefer additive examples, wrappers, docs, and compatibility notes.
- Preserve existing sibling commands where practical; normalize access from this repo through docs and smoke tooling.
