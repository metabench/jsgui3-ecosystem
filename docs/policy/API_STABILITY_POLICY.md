# API Stability Policy

Many jsgui3 APIs are stable and should be treated as contracts.

## Default Stance

- Preserve public constructors, method names, export names, lifecycle hooks, and control activation behavior.
- Prefer additive improvements over replacements.
- Avoid broad renames or behavior shifts without a migration plan.

## Preferred Improvements

- Syntactic sugar on top of stable primitives.
- Compatibility wrappers and aliases.
- Better examples and docs.
- Focused tests/checks for existing behavior.
- Optional parameters that do not change old call behavior.

## Breaking Change Gate

A breaking change needs:

1. Written rationale.
2. Affected repos and call sites listed.
3. Migration path or compatibility shim.
4. Focused tests in each owning repo.
5. Release notes.

## Data Binding Exception

Data binding is not final. It may evolve more actively, but changes still need research, examples, compatibility notes, and tests before promotion.
