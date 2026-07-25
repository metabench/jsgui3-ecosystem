# jsgui3 Ecosystem — Cross-Repo Coordination Protocol

> **Last Updated:** 2026-05-28
> **Audience:** AI agents and developers making changes that span multiple repositories

---

## When Does Cross-Repo Coordination Apply?

You need this protocol when:

- A change in a **foundation package** (lang-mini, obext, lang-tools) affects consumers
- A **new feature** requires coordinated changes across repos (e.g., new control type needing server support)
- A **bug fix** in one package needs corresponding fixes elsewhere
- An **API change** in one package breaks dependents
- A **dependency version** needs to be bumped across the tree

---

## The Golden Rule

> **Always make changes bottom-up through the dependency tree.**

```
lang-mini  →  obext  →  lang-tools  →  jsgui3-gfx-core
                                    →  jsgui3-html  →  jsgui3-webpage
                                                    →  jsgui3-website
                                                    →  jsgui3-client  →  jsgui3-server
```

Never change a higher-level package to accommodate a lower-level change. Fix the foundation first.

---

## Coordination Workflow

### Phase 1: Research & Plan

1. **Identify the scope** — which repos are affected?
2. **Read each repo's AGENTS.md** — understand repo-specific conventions
3. **Check dependency versions** — see [DEPENDENCY_MAP.md](../DEPENDENCY_MAP.md)
4. **Plan the order** — list repos in bottom-up dependency order

### Phase 2: Implement (Bottom-Up)

For each repo, in dependency order:

1. **Make the change** in the lowest-level affected repo
2. **Run tests** in that repo (`npm test`)
3. **Note the new version** you'll need to publish
4. **Move up** to the next repo in the chain
5. **Update dependency version** in `package.json`
6. **Run tests** in this repo
7. **Repeat** until all repos are updated

### Phase 3: Local Testing

Use `npm link` for local cross-repo development:

```bash
# In the lower-level repo
cd lang-tools
npm link

# In the higher-level repo
cd ../jsgui3-html
npm link lang-tools

# Now jsgui3-html uses your local lang-tools
npm test
```

> **Important:** Remember to `npm unlink` and restore npm versions before publishing.

### Phase 4: Publish (Bottom-Up)

1. Increment version in `package.json`
2. Run full test suite
3. `npm publish`
4. Move to next dependent, update version, repeat

### Phase 5: Document

1. Update [DEPENDENCY_MAP.md](../DEPENDENCY_MAP.md) if versions changed
2. Add lessons to relevant `docs/agi/LESSONS.md` files
3. If architecture changed, update [ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Communication Between Repos

### File-Based Knowledge Sharing

| What | Where | Format |
|------|-------|--------|
| Cross-repo lessons | Each repo's `docs/agi/LESSONS.md` | Tag with `[CROSS-REPO]` |
| Architecture changes | `jsgui3-ecosystem/docs/ARCHITECTURE.md` | Update diagrams |
| API changes | Affected repo's `README.md` + `AGENTS.md` | Document new/changed API |
| Bug fixes | Each repo's `BUGS.md` | Reference `<BUG###>` IDs |

### Antigravity Knowledge Items

If using Antigravity IDE, cross-project knowledge is also stored at:
```
C:\Users\james\.gemini\antigravity\knowledge\
```

This is readable by all agents and spans all projects. Use it for patterns that apply beyond jsgui3.

---

## Common Cross-Repo Scenarios

### Scenario 1: New Control Type

```
1. lang-tools:    Add any new data types if needed
2. jsgui3-html:   Create the control in controls/organised/
3. jsgui3-html:   Export from controls/controls.js
4. jsgui3-html:   Write E2E tests
5. jsgui3-server:  Verify bundling handles the new control
6. jsgui3-client:  Verify activation works in browser
```

### Scenario 2: New Mixin

```
1. jsgui3-html:   Create mixin in control_mixins/
2. jsgui3-html:   Add to mixin registry
3. jsgui3-html:   Write tests
4. jsgui3-html:   Document in control_mixins/README.md
```

### Scenario 3: Data Model Enhancement

```
1. lang-mini:     If Evented_Class or field/prop change needed
2. obext:         If prop/field/read_only API change needed
3. lang-tools:    Make the Data_Model/Data_Object/Data_Value change
4. lang-tools:    Run full test suite
5. jsgui3-html:   Verify controls still work with updated data models
6. jsgui3-server: Run integration tests
```

### Scenario 4: Server API Change

```
1. jsgui3-server: Make the API change
2. jsgui3-server: Update docs
3. jsgui3-server: Run test suite
4. jsgui3-client: Update client-side code if needed
5. jsgui3-ecosystem: Update docs if architecture changed
```

### Scenario 5: Bug Fix in Foundation

```
1. lang-mini/obext/lang-tools: Fix the bug
2. Add <BUG###> tag to BUGS.md
3. Run tests in the fixed repo
4. Run tests in all direct dependents
5. Check if any dependent relied on the buggy behaviour
6. Document in LESSONS.md with [CROSS-REPO] tag
```

---

## Breaking Change Protocol

If you must make a breaking change:

1. **Document the break** — what changed, what old behaviour was, what new behaviour is
2. **Search for usage** — grep across all repos for the affected API
3. **Update all callers** — in dependency order
4. **Add migration notes** — in the affected repo's README/AGENTS.md
5. **Bump the minor version** — since we're pre-1.0, minor version bumps signal breaking changes
6. **Update DEPENDENCY_MAP.md** — note the new version requirements

---

## Version Synchronisation

Current versions are tracked in [DEPENDENCY_MAP.md](../DEPENDENCY_MAP.md). When you update any package:

1. Update the version in that package's `package.json`
2. Update the dependency range in all consumers' `package.json`
3. Update the version table in `DEPENDENCY_MAP.md`

All packages use semver ranges (`^0.0.x`), so patch updates are automatically picked up, but changes to the minor version require manual updates to consumers.
