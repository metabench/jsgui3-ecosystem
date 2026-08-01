# Recursive Prompt Compiler

Status: Working doctrine
Audience: AI agents converting human intent into executable recursive prompts

A recursive prompt compiler turns a simple human request into a bounded,
self-continuing execution program. This is useful when the user states a large
goal in ordinary language but the work needs durable state, ownership routing,
and verification across turns.

## Compiler Pipeline

### 1. Normalize The Intent

Rewrite the request as one concrete objective.

Weak:

```text
Improve the examples.
```

Compiled objective:

```text
Harden jsgui3 ecosystem examples so they are discoverable, runnable, smoke
verified, and documented with clear owning repos.
```

### 2. Choose The Coordination Boundary

Identify the owning repo before creating tasks.

For jsgui3 ecosystem work:

- coordination workspace: cross-repo plans, ownership, docs, manifest, wrapper
  scripts, status visibility,
- sibling repos: implementation behavior, runtime bugs, repo-local examples,
  repo-local tests.

### 3. Select Source-Of-Truth Files

Name the minimum files the next agent must read. Prefer durable repo files over
memory.

Common choices:

- `AGENTS.md`
- relevant `README.md`
- ownership map
- API policy
- session `PLAN.md`
- session `WORKING_NOTES.md`
- manifests, indexes, tests, or smoke scripts touched by the task.

### 4. Build The Execution State

Create a JSON block with a stable track, phase, turn counters, active node,
pending nodes, decisions, and blockers.

```json
{
  "track": "jsgui3-ecosystem-examples",
  "phase": "startup-status-and-docs-viewer",
  "turn_index": 1,
  "estimated_remaining_turns": 3,
  "hard_limit_turns": 10,
  "active_node": "inventory_current_examples",
  "completed_nodes": [],
  "pending_nodes": [
    "expand_manifest",
    "add_status_summary",
    "document_docs_viewer_contract",
    "run_smokes",
    "update_handoff"
  ],
  "hard_decisions": [],
  "known_blockers": []
}
```

### 5. Write The Natural Language Algorithm

Add clear English instructions alongside the JSON state. The JSON tells the
agent where it is; the natural language tells the agent how to act.

Use simple conditional and sequencing language:

```text
If the docs-viewer manifest references component source, then verify that the
source path exists.
And then verify that the example source path exists.
If the referenced repo owns runtime behavior, keep the ecosystem repo to docs,
wrappers, manifests, and status visibility.
If the plan is contradicted by codebase evidence, update the execution state and
record the deviation as a hard decision.
```

### 6. Expand Into Bounded Nodes

Use 8-12 related items for a large continuation pass. Each item should be
executable and verifiable.

Prefer:

```text
Add manifest fields for live preview route, component source, example source,
run command, related tests, and last smoke status.
```

Avoid:

```text
Think about documentation viewer ideas.
```

### 7. Add Decision-Collapse Rules

Add rules that prevent terminal deferral.

```text
If a bug belongs in a sibling repo and the fix is narrow, implement it with
focused validation. If it cannot be fixed safely from this repo, document the
owner, failing command, evidence, and smallest safe next change.
```

### 8. Add Verification

Bind the task to concrete checks. Verification can include:

- syntax checks,
- unit tests,
- smoke commands,
- docs/index drift checks,
- targeted whitespace scans,
- `git diff --check`.

Never convert a real failure into vague success. A failed check is acceptable
when it is recorded with the exact command, output summary, owner, and next
action.

### 9. Require Durable Updates

The agent should update project memory before handing off:

- `PLAN.md`: Done / Next / Later,
- `WORKING_NOTES.md`: evidence, commands run, blockers,
- manifests or indexes,
- README or workflow docs,
- continuation prompt file if the repo uses one.

### 10. Require A Recursive Final Response

The final response should include a next prompt only if work remains. That next
prompt must contain the updated execution state and immediate next commands.

## Compilation Template

```text
[COPY BELOW THIS LINE]
Continue in <absolute path>.

Read first:
- <file>
- <file>

Use <durable files> as source of truth.

Execution state:
{
  "track": "<track>",
  "phase": "<phase>",
  "turn_index": <n>,
  "estimated_remaining_turns": <n>,
  "hard_limit_turns": <n>,
  "active_node": "<node>",
  "completed_nodes": [],
  "pending_nodes": [],
  "hard_decisions": [],
  "known_blockers": []
}

Operating rules:
- Identify the owning repo before editing.
- Preserve stable public APIs.
- Do not hide real failures.
- Do not end with vague future investigation when a bounded decision can be
  made now.
- Keep implementation in the owning repo.

Natural language algorithm:
- If <condition>, then <action>.
- And then <next action>.
- If the original plan is contradicted by local evidence, update the state and
  record the deviation as a hard decision.

Goal:
<single outcome>

Required workload:
1. <task>
2. <task>
3. <task>
4. <task>
5. <task>
6. <task>
7. <task>
8. <task>

Verification:
- <command>
- <command>

Final response must include:
1. Concise summary.
2. Verification results.
3. Next recursive continuation prompt if work remains.
4. Updated completed and pending nodes.
5. Hard decisions made.
6. Known blockers with exact next commands.
[COPY ABOVE THIS LINE]
```

## Example: Simple Request To Recursive Prompt

Input:

```text
Make the documentation viewer examples better.
```

Compiled prompt:

```text
[COPY BELOW THIS LINE]
Continue in /mnt/c/Users/james/Documents/repos/jsgui3-ecosystem.

Read first:
- AGENTS.md
- docs/examples/INDEX.md
- docs/examples/examples_manifest.json
- docs/sessions/2026-05-28-jsgui3-ecosystem-examples/PLAN.md
- docs/sessions/2026-05-28-jsgui3-ecosystem-examples/WORKING_NOTES.md

Use PLAN.md and WORKING_NOTES.md as source of truth. Keep jsgui3-ecosystem as
the coordinator and do not make broad sibling repo edits.

Execution state:
{
  "track": "jsgui3-ecosystem-docs-viewer",
  "phase": "inventory-and-first-runnable-shell",
  "turn_index": 1,
  "estimated_remaining_turns": 3,
  "hard_limit_turns": 10,
  "active_node": "define_docs_viewer_inventory_contract",
  "completed_nodes": [],
  "pending_nodes": [
    "inspect_existing_source_view_controls",
    "decide_implementation_owner",
    "add_docs_viewer_spec",
    "add_manifest_fields",
    "add_manifest_docs_check",
    "wire_status_visibility",
    "run_verification",
    "update_handoff"
  ],
  "hard_decisions": [],
  "known_blockers": []
}

Natural language algorithm:
- If an example manifest entry references a live preview route, then verify that
  the owning repo has a served example or document why it is pending.
- And then verify that component source and example source paths exist.
- If runtime behavior belongs in a sibling repo, keep ecosystem changes to docs,
  wrappers, manifest metadata, and status visibility.
- If the original plan is contradicted by repo evidence, update PLAN.md,
  WORKING_NOTES.md, and this execution state before handing off.

Goal:
Define and begin hardening the documentation viewer track so examples can show
live jsgui3 controls, component source code, example source code, run commands,
and smoke status from a user perspective.

Required workload:
1. Define docs-viewer inventory fields for live preview route, component source,
   example source, run command, related tests, and last smoke status.
2. Inspect existing DocAppControl, Code_Editor, Markdown_Viewer, source-view,
   and activation material only as needed.
3. Decide the first minimal implementation owner and document the repo boundary.
4. Add an ecosystem-side docs-viewer spec with user-facing quality criteria.
5. Add or update manifest metadata for docs-viewer readiness.
6. Add tests or docs checks for metadata drift.
7. Improve README/docs discoverability.
8. Update PLAN.md and WORKING_NOTES.md.
9. Run syntax, tests, docs, and smoke checks.
10. Return the next recursive continuation prompt with updated state.

Final response must include summary, verification, next recursive prompt,
completed nodes, pending nodes, hard decisions, blockers, and horizon estimate.
[COPY ABOVE THIS LINE]
```

## Prompt Review Checklist

Before handing a recursive prompt to another agent, check:

- It names the absolute working directory.
- It names the source-of-truth files.
- It contains a compact execution state block.
- It contains simple natural language execution rules.
- It identifies ownership and edit boundaries.
- It has one active node.
- It has a bounded pending queue.
- It has anti-deferral rules.
- It has concrete verification commands.
- It requires durable docs updates.
- It requires an updated recursive prompt only if work remains.
- It uses copy boundaries when the prompt may be manually or mechanically passed
  to another agent.

## When Not To Compile

Do not compile into a recursive prompt when:

- the task is a one-file fix,
- the command can be run and answered directly,
- the user is asking a conceptual question only,
- the next step requires human input that cannot be discovered from local
  context,
- adding a recursive structure would create more overhead than progress.
