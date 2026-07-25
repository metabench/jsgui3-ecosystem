# Agent Continuation Prompt

Generated: 2026-07-11 (phase-2-implemented)
Track: `jsgui3-ecosystem-examples`

Use this prompt to continue the current recursive examples-reliability work.

```text
Continue in /mnt/c/Users/james/Documents/repos/jsgui3-ecosystem.

RECURSIVE OPERATING MODEL
You are one node in a multi-turn recursive improvement loop. Treat this prompt plus PLAN.md, WORKING_NOTES.md, AGENTS.md, examples docs, manifests, and validation results as the serialized state of the program. Do not rely on unstated memory.

Every turn must:
1. Read source-of-truth files first.
2. Reconstruct state from PLAN.md, WORKING_NOTES.md, and CONTINUATION_PROMPT.md.
3. Execute a large but bounded bundle of related work.
4. Run real verification where possible.
5. Update session docs after material changes.
6. Emit the next recursive continuation prompt only if work remains.

PLANNING TURN REQUIREMENT
If no active session plan exists, create:
- docs/sessions/YYYY-MM-DD-jsgui3-ecosystem-examples/PLAN.md
- docs/sessions/YYYY-MM-DD-jsgui3-ecosystem-examples/WORKING_NOTES.md
- docs/sessions/YYYY-MM-DD-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md

Record current repo state, sibling repo state, ownership boundaries, validation ladder, backlog, blockers, horizon estimate, and first executable work bundle before broad edits. If this plan exists, continue it rather than creating a parallel session.

READ FIRST
In jsgui3-ecosystem:
- AGENTS.md
- README.md
- package.json
- docs/examples/INDEX.md
- docs/examples/DOCS_VIEWER_SPEC.md
- docs/examples/DOCS_VIEWER_SHELL_CONTRACT.md
- docs/examples/OWNERSHIP_STATUS.md
- docs/examples/WEBPAGE_WEBSITE_GUIDANCE.md
- docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md
- docs/examples/docs_viewer_inventory.json
- docs/examples/docs_viewer_shell_contract.json
- docs/examples/webpage_website_served_example_contract.json
- docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md
- docs/examples/own_website_docs_viewer_contract.json
- docs/examples/examples_manifest.json
- docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md
- docs/sessions/2026-05-28-jsgui3-ecosystem-examples/WORKING_NOTES.md
- docs/sessions/2026-05-28-jsgui3-ecosystem-examples/CONTINUATION_PROMPT.md
- scripts/example_smoke.js
- tests/example_smoke.test.js

In jsgui3-own-website (the extensive docs viewer owner):
- AGENTS.md
- IMPLEMENTATION_PLAN.md
- controls/Source_Code_Viewer.js

Inspect sibling repos only where directly referenced by manifest entries, docs, package links, or smoke commands. Some listed repos may be absent locally (for example jsgui3 and jsgui3-controls were not present in recent passes); treat an absent repo as missing and skip it rather than investigating:
- /mnt/c/Users/james/Documents/repos/jsgui3
- /mnt/c/Users/james/Documents/repos/jsgui3-html
- /mnt/c/Users/james/Documents/repos/jsgui3-client
- /mnt/c/Users/james/Documents/repos/jsgui3-server
- /mnt/c/Users/james/Documents/repos/jsgui3-controls
- /mnt/c/Users/james/Documents/repos/jsgui3-gfx-core
- /mnt/c/Users/james/Documents/repos/jsgui3-webpage
- /mnt/c/Users/james/Documents/repos/jsgui3-website
- /mnt/c/Users/james/Documents/repos/jsgui3-modern-examples
- /mnt/c/Users/james/Documents/repos/jsgui3-simple-example
- any other directly referenced jsgui3-* repo

SOURCE OF TRUTH
Use active PLAN.md, WORKING_NOTES.md, CONTINUATION_PROMPT.md, AGENTS.md, docs/examples/INDEX.md, docs/examples/examples_manifest.json, docs/examples/OWNERSHIP_STATUS.md, smoke docs/tests, and docs-viewer contract files as source of truth. Keep jsgui3-ecosystem as coordinator. Do not make broad sibling repo edits.

EXECUTION STATE
{
  "track": "jsgui3-ecosystem-examples",
  "phase": "extensive-own-website-docs-viewer-phase-3-implemented",
  "turn_index": 14,
  "estimated_remaining_turns": 2,
  "hard_limit_turns": 16,
  "active_node": "build_own_website_control_catalog_and_home",
  "completed_nodes": [
    "create_examples_session_plan",
    "audit_recent_example_related_work",
    "build_cross_repo_examples_manifest",
    "write_examples_index_and_learning_path",
    "add_ecosystem_smoke_runner",
    "add_smoke_runner_tests",
    "add_operator_scan_and_smoke_summaries",
    "expand_jsgui3_html_manifest_coverage",
    "investigate_modern_plain_control_timeout",
    "decide_modern_examples_ownership",
    "resolve_simple_example_smoke_path",
    "decide_webpage_website_manifest_status",
    "write_docs_viewer_spec",
    "write_docs_viewer_inventory",
    "decide_docs_viewer_owner_boundary",
    "write_docs_viewer_shell_contract",
    "add_docs_viewer_contract_tests",
    "record_jsgui3_server_owner_readiness_gate",
    "upgrade_continuation_prompt_to_recursive_state_model",
    "add_continuation_prompt_structure_check",
    "tighten_docs_viewer_inventory_contract",
    "record_first_docs_viewer_runnable_owner_path",
    "add_docs_framework_source_kind_checks",
    "recheck_docs_viewer_owner_dirty_worktrees_2026_06_03",
    "confirm_owner_shell_still_blocked_without_acceptance",
    "require_docs_and_framework_render_slots",
    "require_all_source_kind_owner_tests",
    "recheck_jsgui3_server_owner_readiness_2026_06_04",
    "add_webpage_website_served_example_contract",
    "validate_webpage_website_deferred_viewer_gate",
    "verify_webpage_website_contract_2026_06_04",
    "recheck_owner_repos_still_blocked_2026_06_04",
    "add_manifest_quality_docs_check",
    "document_docs_check_manifest_gate",
    "recheck_jsgui3_server_clean_2026_06_04",
    "implement_jsgui3_server_docs_viewer_shell",
    "verify_owner_docs_viewer_routes_and_source_kinds",
    "update_contracts_after_owner_shell_implementation",
    "add_docs_viewer_status_route",
    "validate_docs_viewer_status_route_contract",
    "fix_windows_cross_platform_command_availability",
    "make_docs_viewer_inventory_source_separator_tolerant",
    "add_cross_platform_regression_tests",
    "decide_extensive_docs_viewer_owned_by_jsgui3_own_website",
    "seed_source_code_viewer_control_in_own_website",
    "write_own_website_agents_and_implementation_plan",
    "add_own_website_docs_viewer_contract_and_checker",
    "add_own_website_contract_tests",
    "implement_own_website_docs_viewer_phase_1_client_server_test",
    "flip_own_website_phase_1_contract_statuses_to_implemented",
    "canonicalize_jsgui3_ecosystem_coordination_source",
    "reconcile_parked_jsgui3_server_docs_viewer_shell",
    "require_minimal_shell_implemented_files_to_exist",
    "build_own_website_source_browser_and_control_source_route",
    "flip_own_website_phase_2_contract_statuses_to_implemented",
    "build_own_website_example_live_preview_and_shell",
    "flip_own_website_phase_3_contract_statuses_to_implemented"
  ],
  "pending_nodes": [
    "build_own_website_control_catalog_and_home",
    "flip_own_website_contract_statuses_as_files_land",
    "add_ownsite_docs_viewer_manifest_and_inventory_entry_when_runnable",
    "audit_remaining_cross_platform_portability_assumptions",
    "verify_owner_docs_viewer_shell_regression",
    "recheck_webpage_website_served_example_owner_readiness_if_status_changes",
    "run_system_checks",
    "update_session_docs",
    "emit_next_recursive_prompt"
  ]
}

CURRENT DECISIONS
- jsgui3-ecosystem owns cross-repo docs, examples index, examples manifest, docs-viewer inventory, docs-viewer shell contract, smoke wrappers, and validation tooling.
- Sibling repos own runnable implementation behavior. Touch siblings only when the bug clearly belongs there, the worktree is safe, the change is narrow, and focused tests/docs are included.
- jsgui3-server owns the first runnable docs-viewer shell because it owns HTTP serving, bundling, route publication, and app-level controls.
- jsgui3-html owns reusable source/prose controls such as Code_Editor and Markdown_Viewer.
- Docs-viewer inventory entries must now include checked docs, owner repo, expected result, live route/activation, framework source, component source, example source, related tests, and smoke/status metadata.
- `npm run docs:check` now validates examples manifest quality, docs/examples index drift, and continuation prompt structure.
- The recorded minimal owner path is `jsgui3-server/examples/docs-viewer/server.js`, but the implementation is parked in local `stash@{0}`/`stash@{1}` and is absent from the current checkout and branch/remote history.
- The source API contract must support `kind=docs`, `kind=framework`, `kind=component`, and `kind=example`.
- The page render contract must include docs and framework source slots, not only component and example source.
- Owner-side source API tests must explicitly cover `kind=docs`, `kind=framework`, `kind=component`, and `kind=example`.
- Earlier 2026-06-03 and 2026-06-04 owner readiness rechecks found `jsgui3-server` dirty in core serving/test paths, so those passes stayed coordinator-side.
- The minimal server shell was implemented and tested in June, then parked
  before the v0.0.156 release. Both stored patches apply cleanly. Recover it on
  a dedicated owner branch only if the superseded reference remains useful.
- The minimal-shell contract now records per-file `parked` status; files marked
  `implemented` must exist in the owner checkout.
- Webpage/Website remain deferred from live docs-viewer inventory until a served example exists.
- `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md` and `docs/examples/webpage_website_served_example_contract.json` now define the deferred Webpage/Website served-example path.
- The Webpage/Website served example is still deferred because `jsgui3-webpage` and `jsgui3-website` have dirty model/test worktrees as of 2026-07-11.
- jsgui3-modern-examples startup remains optional, explicit, and bounded; do not make it default CI.
- Do not edit jsgui3-simple-example until its dirty worktree and stale smoke script are reconciled, unless explicitly requested.
- The verification ladder must pass on the current OS. Earlier turns ran under WSL and masked Windows-only failures. Keep the tooling cross-platform: resolve executables via PATH/PATHEXT (npm resolves as npm.cmd on Windows), treat path strings as separator-insensitive, and avoid POSIX-only shell assumptions.
- Whole-repo git diff --check is currently clean on Windows because the coordinator scaffolding (AGENTS.md, README.md, docs/, package.json, scripts/, tests/) is still untracked atop the single initial commit. Pre-existing .gitignore and LICENSE CRLF/LF state may resurface once those files are committed; do not hide it.
- All coordinator scaffolding is uncommitted. Committing or pushing is deferred to explicit owner instruction; do not commit or push without being asked.
- The extensive, user-facing docs viewer is owned by jsgui3-own-website. It uses real jsgui3 controls with SSR + client activation (this is activation, not hydration) and supersedes the parked minimal server shell as the public showcase.
- `Source_Code_Viewer`, `Source_Browser`, `Docs_Viewer_Shell`, and `Example_Preview_Frame` are implemented locally. `Control_Catalog` remains planned. Reusable controls (Code_Editor, Markdown_Viewer, Tabbed_Panel, Tree_View) are required from jsgui3-html, not forked. Preserve the pre-existing jsgui3-own-website README.md and .gitignore edits.
- The extensive viewer spec is docs/examples/OWN_WEBSITE_DOCS_VIEWER_SPEC.md; the machine-checked contract is docs/examples/own_website_docs_viewer_contract.json, validated by npm run docs:viewer:check. The owner buildbook is ../jsgui3-own-website/IMPLEMENTATION_PLAN.md.
- The contract requires existence of any file marked seeded or implemented, so flip a status field only when the real file lands. Follow the canonical lifecycle: super(spec) then if (!spec.el) compose(); activate() guarded by if (this.__active) return; guard all DOM/browser access; render source via .add() (escaped); a single client.js is passed to jsgui3-server as src_path_client_js.

GOAL
Improve jsgui3-ecosystem examples into a reliable cross-repo showcase: easy to discover, run, verify, compare, extend, and maintain, while preserving ownership boundaries across the jsgui3 repos. The current headline objective is to implement the extensive user-facing documentation viewer in jsgui3-own-website (live activated controls plus real jsgui3-html source-code viewing) phase by phase from ../jsgui3-own-website/IMPLEMENTATION_PLAN.md.

REQUIRED WORKLOAD
1. Reconstruct state: read the source-of-truth files (including OWN_WEBSITE_DOCS_VIEWER_SPEC.md, own_website_docs_viewer_contract.json, and ../jsgui3-own-website/{AGENTS.md, IMPLEMENTATION_PLAN.md, controls/Source_Code_Viewer.js}); inspect git status in jsgui3-ecosystem and jsgui3-own-website; record blockers and last validation.
2. Advance the extensive docs viewer in jsgui3-own-website by one phase from IMPLEMENTATION_PLAN.md. Phases 1-3 are implemented and runnable (`npm test` 5/5). Next is Phase 4: add `controls/Control_Catalog.js`, `GET /controls`, and a live landing page; add focused tests, then run `npm test` in that repo.
3. Keep every control isomorphic and safe: super(spec) then if (!spec.el) compose(); activate() guarded by if (this.__active) return; guard DOM/browser access; render source via .add() (escaped); read source files only on the server.
4. As real owner files land, flip their status in own_website_docs_viewer_contract.json from planned to implemented and re-run npm run docs:viewer:check; never mark a file seeded or implemented unless it exists.
5. Confirm ownership: new presentation controls live in jsgui3-own-website; reuse Code_Editor/Markdown_Viewer/Tabbed_Panel/Tree_View from jsgui3-html; serving from jsgui3-server. Do not fork jsgui3-html controls. Do not touch jsgui3-own-website README.md.
6. Audit manifest/contract quality and docs/index drift; keep INDEX.md aligned with the manifest, inventory, ownership notes, and deferred Webpage/Website status.
7. Add focused tests for any new metadata or contract behavior; keep the contract checker honest (activation-not-hydration, source kinds, render panes, routes, seeded-file existence, and activation/failure-panel assertions).
8. Leave the parked jsgui3-server shell stashes intact unless recovery is explicitly in scope. If recovered, apply (do not pop) both stashes on a dedicated owner branch and verify the full recorded contract before committing.
9. Recheck jsgui3-simple-example and jsgui3-modern-examples only for status/owner-smoke planning; keep startup smoke optional and bounded; do not edit dirty siblings by default.
10. Recheck the Webpage/Website served-example contract only if model-owner readiness changes; otherwise keep it as the promotion gate.
11. When the viewer is runnable, add an ownsite.docs-viewer manifest entry and a docs-viewer inventory entry, then keep npm run docs:check and npm run docs:viewer:check green.
12. Refresh docs: PLAN.md, WORKING_NOTES.md, CONTINUATION_PROMPT.md, OWNERSHIP_STATUS.md, and the owner buildbook; then run verification.

VERIFICATION
Run the ladder on the current OS; it must pass on both Windows and WSL. Use the existing tooling first:
- node --check scripts/example_smoke.js
- node --check tests/example_smoke.test.js
- npm test
- npm run docs:check
- npm run docs:viewer:check
- npm run smoke:examples
- npm run smoke:examples:summary
- npm run examples:scan:summary
- targeted whitespace scan for touched docs/scripts/tests
- git diff --check

If the parked owner-side docs-viewer implementation is recovered in jsgui3-server, also run:
- node --check examples/docs-viewer/server.js
- node --check examples/docs-viewer/docs-viewer-shell.js
- node --check examples/docs-viewer/client.js
- node --check examples/docs-viewer/controls/Docs_Viewer_App.js
- node tests/test-runner.js --test=docs-viewer-shell.test.js

If the extensive viewer is touched in jsgui3-own-website, also run there:
- node --check controls/Source_Code_Viewer.js (and any new control/server/client file)
- npm install (first time; requires sibling jsgui3-* repos present)
- npm start (verify a route in a browser)
- npm test

CONSTRAINTS
- Keep jsgui3-ecosystem as coordinating repo.
- Do not make broad sibling repo edits.
- Prefer ecosystem wrapper/docs/smoke improvements.
- Keep examples small, runnable, low-storage, and low-flake.
- Avoid network-dependent checks.
- Preserve sibling commands where practical.
- Use existing repo tooling and patterns.
- Never revert unrelated local changes.
- Record blockers concretely.

FINAL RESPONSE REQUIRED
Return:
1. Concise summary.
2. Verification results.
3. Next recursive continuation prompt inline with active_node, completed_nodes, pending_nodes, and another broad 8-12+ item workload.
4. Last 5 turns: up to 5 dense single-line state items.
5. Predetermined next items: up to 10 backlog items from PLAN.md.
6. Horizon estimate: current horizon, scope, delta, discovery risk, and whether this is a rolling ecosystem-improvement horizon.
```
