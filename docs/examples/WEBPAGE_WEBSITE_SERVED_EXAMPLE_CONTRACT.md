# Webpage And Website Served Example Contract

Machine-readable source: `docs/examples/webpage_website_served_example_contract.json`.

## Decision

`webpage.composition-tests` and `website.resolved-model-tests` stay as test-backed manifest references and remain deferred from the live docs-viewer inventory until a small served example exists.

The first served example should be an additive `jsgui3-server` example because the missing behavior is HTTP serving, route publication, browser activation, and smokeable route tests. `jsgui3-webpage` and `jsgui3-website` remain the model owners.

The later 2026-06-04 docs-viewer-shell recheck found `jsgui3-server` clean before the additive docs-viewer shell was added. This served example still remains deferred because `jsgui3-webpage` and `jsgui3-website` have active model/test worktree changes.

## Owner Files

Add these files in `jsgui3-server` only after the Webpage/Website model owner readiness gate is clear or the owners explicitly accept a served example that depends on the current model state:

| File | Purpose |
|------|---------|
| `examples/webpage-website/server.js` | Starts the tiny served Website/Webpage example. |
| `examples/webpage-website/controls/Webpage_Website_Demo.js` | Small activated control on one served page. |
| `examples/webpage-website/client.js` | Browser activation entry. |
| `tests/webpage-website-example.test.js` | Bounded route and rendering tests. |

## Route Shape

| Method | Path | Result |
|--------|------|--------|
| `GET` | `/examples/webpage-website` | Home page from a `Website` with the first `Webpage`. |
| `GET` | `/examples/webpage-website/about` | About page from the second `Webpage`. |
| `GET` | `/examples/webpage-website/start` | Alias to the home page. |
| `GET` | `/examples/webpage-website/old-about` | Redirect to the about page. |
| `GET` | `/examples/webpage-website/api/status` | JSON status endpoint. |

## Required Features

- `Website` with two `Webpage` instances;
- alias route;
- redirect route;
- JSON status endpoint;
- one activated jsgui3 control and client bundle reference;
- docs-viewer-ready source metadata once the owner example exists.

## Viewer Gate

Do not promote `webpage.composition-tests` or `website.resolved-model-tests` into `docs/examples/docs_viewer_inventory.json` live entries until:

- the `jsgui3-webpage` and `jsgui3-website` model-owner worktrees are reconciled or explicitly accepted;
- the served owner example exists;
- owner route tests pass;
- docs, framework source, component source, example source, run command, expected result, related tests, and smoke/status metadata are available.

Coordinator validation:

```bash
npm run docs:viewer:check
```
