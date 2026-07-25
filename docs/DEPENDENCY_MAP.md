# jsgui3 Ecosystem — Dependency Map

> **Last Updated:** 2026-07-11

## Package Versions (Current)

| Package | Version | Node Requirement |
|---------|---------|-----------------|
| `lang-mini` | 0.0.46 | ≥ 15.0.0 |
| `obext` | 0.0.34 | ≥ 12.0.0 |
| `lang-tools` | 0.0.45 | ≥ 12.0.0 |
| `jsgui3-gfx-core` | 0.0.27 | — |
| `jsgui3-html` | 0.0.188 | ≥ 18.0.0 |
| `jsgui3-webpage` | 0.0.10 | — |
| `jsgui3-website` | 0.0.10 | — |
| `jsgui3-client` | 0.0.130 | ≥ 15.0.0 |
| `jsgui3-server` | 0.0.156 | ≥ 15.0.0 |
| `jsgui3-designer` | 0.0.1 | — |
| `jsgui3-own-website` | 0.0.0 | ≥ 18.0.0 |

---

## Production Dependency Matrix

Shows which packages depend on which (production `dependencies` only):

| Package | lang-mini | obext | fnl | lang-tools | jsgui3-gfx-core | jsgui3-html | jsgui3-webpage | jsgui3-website | jsgui3-client | jsgui3-server | url-parse |
|---------|-----------|-------|-----|------------|-----------------|-------------|----------------|----------------|---------------|---------------|-----------|
| **obext** | ^0.0.46 | — | — | — | — | — | — | — | — | — | — |
| **lang-tools** | ^0.0.46 | — | ^0.0.37 | — | — | — | — | — | — | — | — |
| **jsgui3-gfx-core** | ^0.0.46 | ^0.0.34 | ^0.0.37 | — | — | — | — | — | — | — | — |
| **jsgui3-html** | — | ^0.0.34 | ^0.0.37 | ^0.0.45 | ^0.0.26 | — | — | — | — | — | ^1.5.10 |
| **jsgui3-webpage** | — | — | — | — | — | ^0.0.180 | — | — | — | — | — |
| **jsgui3-website** | — | — | — | — | — | ^0.0.186 | ^0.0.10 | — | — | — | — |
| **jsgui3-client** | — | — | 0.0.37 | — | — | ^0.0.188 | — | — | — | — | — |
| **jsgui3-server** | — | ^0.0.34 | ^0.0.37 | ^0.0.45 | — | ^0.0.188 | ^0.0.8 | ^0.0.8 | ^0.0.130 | — | ^1.5.10 |
| **jsgui3-designer** | — | — | — | ^0.0.45 | — | ^0.0.187 | — | — | ^0.0.129 | ^0.0.152 | — |
| **jsgui3-own-website** | — | — | — | file:../lang-tools | — | file:../jsgui3-html | — | — | file:../jsgui3-client | file:../jsgui3-server | — |

The `file:` ranges in `jsgui3-own-website` intentionally link the local sibling repositories while the public documentation viewer is under active development.

Release reproducibility warning (verified 2026-07-11): `jsgui3-server` declares
`jsgui3-webpage` and `jsgui3-website` as `^0.0.8`, but its current local
`node_modules` entries are symlinks to dirty 0.0.10 worktrees. `npm ls` reports
both invalid because `^0.0.8` excludes 0.0.10. Current focused server tests
validate the workspace combination, not a clean install from declared metadata.
See [WEBSITE_SPEC_STATUS.md](WEBSITE_SPEC_STATUS.md).

---

## Dependency Flow (Bottom-Up)

```
Level 0 (No jsgui dependencies):
    lang-mini

Level 1 (Depends on lang-mini):
    obext → lang-mini

Level 2 (Depends on Level 0–1):
    lang-tools → lang-mini, fnl
    jsgui3-gfx-core → lang-mini, obext, fnl

Level 3 (Depends on Level 0–2):
    jsgui3-html → lang-tools, obext, jsgui3-gfx-core, fnl, url-parse

Level 4 (Depends on Level 3):
    jsgui3-webpage → jsgui3-html
    jsgui3-website → jsgui3-html, jsgui3-webpage
    jsgui3-client → jsgui3-html, fnl

Level 5 (Depends on Level 3–4):
    jsgui3-server → jsgui3-html, jsgui3-client, jsgui3-webpage, jsgui3-website,
                     lang-tools, obext, fnl, fnlfs, esbuild, sass, ...

Level 6 (Applications):
    jsgui3-designer → jsgui3-html, jsgui3-client, jsgui3-server, lang-tools
    jsgui3-own-website → jsgui3-html, jsgui3-client, jsgui3-server, lang-tools
```

---

## Update Cascade Guide

When updating a package, you need to also update and potentially re-publish its downstream dependents:

### lang-mini (most impactful)
1. Publish `lang-mini`
2. Update `obext` → re-publish
3. Update `lang-tools` → re-publish
4. Update `jsgui3-gfx-core` → re-publish
5. Update `jsgui3-html` → re-publish
6. Update `jsgui3-webpage`, `jsgui3-website`, `jsgui3-client` → re-publish
7. Update `jsgui3-server` → re-publish
8. Update `jsgui3-designer`

### obext
1. Publish `obext`
2. Update `jsgui3-gfx-core`, `jsgui3-html`, `jsgui3-server` → re-publish
3. Cascade through downstream

### lang-tools
1. Publish `lang-tools`
2. Update `jsgui3-html`, `jsgui3-server`, `jsgui3-designer` → re-publish; validate `jsgui3-own-website` against its local link
3. Cascade through downstream

### jsgui3-html (common)
1. Publish `jsgui3-html`
2. Update `jsgui3-webpage`, `jsgui3-website`, `jsgui3-client` → re-publish
3. Update `jsgui3-server` → re-publish
4. Update `jsgui3-designer`; validate `jsgui3-own-website` against its local link

### jsgui3-client
1. Publish `jsgui3-client`
2. Update `jsgui3-server` → re-publish
3. Update `jsgui3-designer`; validate `jsgui3-own-website` against its local link

### jsgui3-server
1. Publish `jsgui3-server`
2. Update `jsgui3-designer`
3. Validate `jsgui3-own-website` against its local link

---

## Shared External Dependencies

| Package | Purpose | Used By |
|---------|---------|---------|
| `fnl` | Functional utilities, observables | lang-tools, jsgui3-gfx-core, jsgui3-html, jsgui3-client, jsgui3-server |
| `fnlfs` | Filesystem utilities | jsgui3-server |
| `url-parse` | URL parsing | jsgui3-html, jsgui3-server |
| `esbuild` | JS bundling | jsgui3-html (dev), jsgui3-client (dev), jsgui3-server |
| `puppeteer` | E2E testing | jsgui3-html (dev), jsgui3-client (dev), jsgui3-server (dev) |
| `mocha` | Test runner | jsgui3-webpage (dev), jsgui3-website (dev), jsgui3-server |
| `jest` | Test runner | lang-mini (dev), lang-tools (dev) |
