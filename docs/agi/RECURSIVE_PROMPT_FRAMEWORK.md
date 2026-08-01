# Recursive Prompt Framework

Status: Working doctrine
Audience: AI agents and autonomous coding systems

Recursive prompts are structured continuation prompts for large work that cannot
be safely completed in one turn. The prompt is both the current agent's
instruction set and the next agent's serialized state package.

The practical goal is not mystical autonomy. The goal is durable execution:
every turn should read the same source of truth, reconstruct the same state,
execute a bounded bundle of work, verify it, update durable notes, and emit the
next prompt only when work remains.

## Review Of The Draft Model

The draft "fractal seed" model captures the right core idea: the prompt must
carry the algorithm forward, not merely say "continue." The best version keeps
these ideas:

- the prompt serializes state because LLM turns do not share reliable memory,
- the work is modeled as a queue with an active node and pending nodes,
- the turn budget creates a halt boundary,
- deferral is treated as a failure mode,
- foundational decisions must be preserved across context boundaries.

The implementation should tighten three points:

- "Deterministic" should mean deterministic enough for engineering: explicit
  state, explicit commands, explicit ownership, and explicit verification. It
  should not claim that an LLM will produce identical behavior every turn.
- "Verbatim continuity" should apply to the compact kernel, hard decisions,
  uncompleted workload, and constraints. Passing too much prose verbatim causes
  prompt bloat and can bury the executable state.
- Phase 0 should not forbid all implementation. If a trustworthy plan already
  exists, the first agent should execute useful work after reconstructing state.
- Domain-specific examples from another project should be rewritten for the
  current workspace. The recursive-prompt method is portable; unrelated product
  details are not.

## Core Loop

Every recursive turn follows this loop:

1. Read the named source-of-truth files.
2. Reconstruct the execution state.
3. Confirm the owning repo and edit boundary.
4. Execute the active node and as many related pending nodes as safely possible.
5. Collapse ambiguity into a hard decision, narrow fix, documented blocker, or
   exact next command.
6. Run the requested verification.
7. Update durable docs such as `PLAN.md`, `WORKING_NOTES.md`, manifests, or
   indexes.
8. Emit a next recursive prompt only if work remains.

## Phase Protocols

Recursive prompts work best when the phase is explicit in the state block and
the agent adapts its behavior to that phase.

### Phase 0: Discovery And Synthesis

Use this phase when no trustworthy execution plan exists yet.

1. Locate the source-of-truth files and ownership boundaries.
2. Analyze the task domain and likely repo responsibilities.
3. Synthesize the meta-algorithm as a bounded node queue.
4. Estimate remaining turns and lock the hard limit.
5. Write durable planning notes.
6. Execute only low-risk setup work if it clearly improves the next turn.

### Phase 1: Bounded Setup

Use this phase when the plan exists but the repo still needs scaffolding,
inventory, or baseline checks.

1. Confirm the active node.
2. Establish missing session docs, manifests, indexes, or smoke wrappers.
3. Run baseline verification.
4. Record hard decisions and known blockers.
5. Emit the next prompt with a sharper execution queue.

### Phase N: Detail-Oriented Execution

Use this phase when bounds are locked and the task queue is clear.

1. Locate the current coordinate: active node, completed nodes, pending nodes,
   blockers, and hard decisions.
2. Execute the active node with high detail.
3. Continue through nearby pending nodes when they are tightly related and safe.
4. Adapt the meta-algorithm when codebase evidence contradicts the original
   plan.
5. Document every deviation as a hard decision or blocker, then update the next
   prompt so the changed trajectory becomes the new source of truth.

## Axioms For Agent Use

### 1. Serialized State Is Memory

An agent should assume that anything not written into the prompt or durable docs
will be lost. State belongs in a compact machine-readable block and in durable
project files where appropriate.

### 2. Anti-Deferral Is A Halt Condition

Ending with vague options is not a valid continuation. If a problem cannot be
fixed safely in the current repo, the agent must record:

- the owning repo,
- the failing command,
- the evidence,
- the smallest safe next change,
- whether the current repo should wrap, document, or wait.

### 3. Turn Budgets Bound Recursion

Recursive work needs two numbers:

- `estimated_remaining_turns`: the realistic number of turns left,
- `hard_limit_turns`: the maximum allowed turns before forced closeout.

For uncertain work, set the hard limit to 5x the estimate, capped at 10 turns
unless a human explicitly authorizes more. Decrement both numbers in every
handoff. When near the hard limit, stop expanding scope and force closure:
finish the most valuable executable work, document exact blockers, and produce a
final state.

### 4. Preserve The Kernel, Not The Noise

Pass these items forward consistently:

- source-of-truth files,
- execution state,
- hard decisions,
- active and pending nodes,
- known blockers,
- constraints,
- verification requirements,
- final response contract.

Do not pass large analysis dumps, raw logs, speculative branches, or redundant
theory unless they are needed to execute the next turn.

## Recommended State Shape

```json
{
  "track": "short-stable-track-id",
  "phase": "current-phase",
  "turn_index": 1,
  "estimated_remaining_turns": 3,
  "hard_limit_turns": 10,
  "active_node": "current_executable_node",
  "completed_nodes": [],
  "pending_nodes": [
    "next_node",
    "next_node"
  ],
  "hard_decisions": [],
  "known_blockers": []
}
```

Use stable snake_case identifiers for nodes. Human-readable workload text can
follow the JSON block.

`track` and `phase` are preferred for jsgui3 prompts because they read naturally
in planning docs. Other systems may use aliases such as `MetaAlgorithm_ID` and
`Execution_Phase`; if aliases appear in an imported prompt, normalize them into
the jsgui3 state shape before continuing.

## Prompt Structure

A strong recursive prompt has this shape:

```text
[COPY BELOW THIS LINE]
Continue in <absolute repo path>.

Read first:
- <source file>
- <source file>

Use <durable docs> as source of truth.

Execution state:
{ ... }

Hard decisions:
- <decision>

Operating rules:
- <ownership rule>
- <anti-deferral rule>
- <verification rule>

Goal:
<single outcome statement>

Required workload:
1. <bounded task>
2. <bounded task>

Verification:
- <command>
- <command>

Final response must include:
1. Summary.
2. Verification.
3. Next recursive prompt if work remains.
4. Updated state.
[COPY ABOVE THIS LINE]
```

The copy boundaries are optional for ordinary chat use but recommended when a
human or script will mechanically pass the prompt to another agent. Keep the
boundary labels simple and ASCII in jsgui3 docs.

## Natural Language Algorithm Layer

The JSON block tracks state, but it should not carry the whole algorithm alone.
Every recursive prompt should also contain simple, precise natural language
instructions. This creates a dual-layer prompt:

- JSON for state and queue coordinates,
- structured English for execution logic, object descriptions, ownership
  boundaries, and safety choices.

Good natural language instructions use plain connectors and explicit conditions:

```text
If the manifest references an example file, then verify the file exists.
And then verify that the documented run command matches package scripts.
If ambiguity remains, work out how to best continue by prioritizing API safety
and recording the owning repo, failing command, evidence, and smallest next
change.
```

Avoid clever phrasing. Prefer short, direct instructions that weaker or
different-model agents can still parse.

## Quality Gates

A recursive prompt is good when the next agent can start immediately without
asking what happened last turn. It should answer:

- Where am I working?
- What files must I read?
- What is the current state?
- What has already been decided?
- What is the active node?
- What is out of scope?
- What exact checks prove progress?
- What must be updated before handoff?
- What does done look like?

## Anti-Patterns

- `Continue working on this.` with no state.
- A long narrative summary with no active node.
- A growing backlog that adds more work than the agent completed.
- A prompt that hides real failures behind passing wrappers.
- A prompt that tells the next agent to "investigate later" without an owner,
  command, evidence, and smallest next step.
- Passing entire previous transcripts when a compact state block would do.
- Copying another project's domain-specific workflow into jsgui3 prompts instead
  of translating it into jsgui3 ownership, docs, examples, and verification.

## jsgui3-Specific Rules

- Keep the coordination workspace responsible for cross-repo plans, ownership
  decisions, docs, indexes, manifests, wrappers, and status visibility.
- Keep implementation behavior in the owning jsgui3 repo.
- Do not change stable public APIs without a compatibility plan.
- Treat data binding as research until examples and tests justify promotion.
- Prefer examples, docs, wrappers, and additive helpers before behavioral
  changes.
- Record cross-repo decisions in coordination docs when they affect more than
  one repo.
- Translate external recursive-prompt examples into jsgui3 terms. For example,
  a game QA chain becomes an examples/docs smoke chain, a framework-source
  documentation-viewer chain, or a release-readiness chain.
