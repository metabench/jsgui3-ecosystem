# AGI Coordination Documents

Status: Working doctrine
Audience: AI agents, agent authors, and humans supervising multi-turn ecosystem work

This folder contains operating guidance for high-leverage agent work in the
jsgui3 ecosystem. These docs are not framework API docs. They describe how
agents should structure long-running, cross-repo work so that progress survives
context limits, handoffs, and multiple execution turns.

## Documents

- [Recursive Prompt Framework](RECURSIVE_PROMPT_FRAMEWORK.md): the recommended
  recursive continuation protocol, including state serialization, turn budgets,
  anti-deferral rules, and handoff quality gates.
- [Recursive Prompt Compiler](RECURSIVE_PROMPT_COMPILER.md): a practical method
  for converting simply phrased human instructions into explicit recursive
  prompts with deterministic state and verification.

## When To Use

Use these docs when work has any of these properties:

- the task spans multiple repos or ownership boundaries,
- the task is too large for one reliable turn,
- the task needs durable planning state,
- the task risks ending in vague future options,
- the task requires repeated verification across examples, docs, tests, or
  startup commands.

Do not use recursive prompts for small local fixes where one direct edit and one
validation command will finish the work.

## Relationship To jsgui3 Coordination

Recursive prompting does not replace the normal coordination rules in
[AGENTS.md](../../AGENTS.md). It makes them harder to lose. Each recursive prompt
must still identify the owning repo, protect stable APIs, keep implementation in
the owning repo, and record cross-repo decisions in this coordination workspace.
