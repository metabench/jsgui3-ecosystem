# Continuation Prompt System

> **Last Updated:** 2026-05-28
> **Audience:** AI coding agents performing large or multi-turn tasks across the jsgui3 ecosystem

---

## The Problem

AI agents operate within a single context window — a conversation turn. Many tasks in the jsgui3 ecosystem are too large for a single turn:

- Documenting an entire subsystem
- Refactoring a pattern across multiple repos
- Building a new control with full tests, documentation, and cross-linking
- Auditing and fixing terminology or conventions across 12 repositories

When an agent runs out of turn budget, context is lost. The next agent starts cold.

## The Solution: Continuation Prompts

A **continuation prompt** is a structured text block that an agent writes at the end of its turn, designed to be pasted directly as the next user message. It carries forward:

1. **What was completed** — so the next agent doesn't repeat work
2. **What remains** — so the next agent knows exactly what to do
3. **Turn budget** — so the chain has a hard termination guarantee
4. **Key context** — conventions, decisions, discoveries that the next agent needs

This creates a **recursive planning/doing loop** where each turn is autonomous but coordinated:

```
Turn 1: Agent reads prompt → does max work → writes continuation prompt
Turn 2: User pastes continuation prompt → Agent reads it → does max work → writes continuation prompt
Turn 3: ...
Turn N: Agent completes remaining work → no continuation prompt needed
```

---

## Protocol Rules

### 1. Do Maximum Work Per Turn

Every agent should accomplish as much high-quality work as possible before writing a continuation prompt. Don't stop early "to be safe" — use the full turn.

### 2. Continuation Prompts Go in Normal Text Output

> [!IMPORTANT]
> **Never put continuation prompts in artifacts.** They must appear in the agent's normal text response so the user can copy-paste them directly as the next message.

Provide the prompt in a clearly marked section at the end of your response, typically under a `## Continuation Prompt` heading, formatted as a blockquote for easy copy-paste.

### 3. Turn Budget Prevents Infinite Recursion

Every continuation prompt must include two numbers:

| Counter | Purpose |
|---------|---------|
| **Estimated remaining turns** | Best guess at how many more turns the work needs |
| **Absolute hard limit** | Maximum turns allowed, regardless of estimate. Typically 5× the estimate, capped at 10 |

Both counters **decrement with each turn**. If the absolute limit reaches 0, the agent **must stop** and summarise what's left, without providing another continuation prompt.

If the estimated count reaches 0 but work remains, the agent may continue only if the absolute limit still allows — but must re-estimate conservatively.

### 4. Completed Turns Don't Need Continuation Prompts

If all work is done, just say so. Don't write a continuation prompt for zero remaining work.

### 5. Conventions and Context Travel With the Prompt

The prompt must include any project conventions or discoveries that the next agent needs. Don't assume the next agent has read any previous context. For jsgui3, this always includes:

- `snake_case` for variables/methods, `Camel_Case` for classes
- "Activation" not "hydration"
- Verify against source — don't fabricate APIs

---

## Template

Here is the standard template for a continuation prompt:

````markdown
## Continuation Prompt

> **Continue [task description].** Here's the current state:
>
> **✅ Completed ([N] files):**
> - `path/file.md` — brief description of what was done
> - `path/file2.md` — brief description
>
> **📋 Remaining tasks:**
> 1. [Specific, actionable task]
> 2. [Specific, actionable task]
> 3. [Specific, actionable task]
>
> **Key context:**
> - [Any conventions, discoveries, or decisions the next agent needs]
> - [Any gotchas encountered]
>
> **Recursive continuation protocol:** This prompt is part of a multi-turn
> task. Do as much high-quality work as possible this turn. If work remains,
> provide a continuation prompt in your **normal text response** (never
> artifacts) with: (a) what you completed, (b) what remains, (c) the updated
> turn budget below. Each turn decrements both counters. If the absolute
> limit hits 0, stop and summarise what's left without another prompt.
>
> **Turn budget:** This is turn [M] of an estimated [E] remaining turns.
> Absolute hard limit: [L] turns.
````

---

## Worked Example

A documentation task spanning ~15 files across 12 repos. The first agent estimates 3 turns:

### Turn 1 output (by first agent):

> **Continue enhancing the jsgui3 ecosystem documentation.**
>
> **✅ Completed (13 files):**
> - `README.md` — root entry point
> - `docs/ARCHITECTURE.md` — 5-layer architecture, Mermaid graph
> - `docs/ai/AGENT.md` — 7-step agent orientation
> - *(10 more files)*
>
> **📋 Remaining tasks:**
> 1. Create `docs/GETTING_STARTED_TUTORIAL.md` — step-by-step Counter App
> 2. Create `docs/FAQ.md` — common questions
> 3. Cross-link all 11 adjacent repos back to ecosystem HQ
>
> **Turn budget:** Turn 1 of estimated 3. Absolute limit: 8 turns.

### Turn 2 output (by second agent):

> **Continue enhancing the jsgui3 ecosystem documentation.**
>
> **✅ Completed this turn (3 files + 10 repo READMEs):**
> - `docs/GETTING_STARTED_TUTORIAL.md` — Counter App walkthrough
> - `docs/FAQ.md` — conceptual and troubleshooting FAQ
> - Cross-linked 10 of 11 repos
>
> **📋 Remaining tasks:**
> 1. Cross-link `jsgui3-own-website` (missed this turn)
> 2. Fix "hydration" → "activation" in `jsgui3-html/README.md`
> 3. Verify tutorial code against actual API
>
> **Turn budget:** Turn 2 of estimated 3 (1 remaining). Absolute limit: 7 turns.

### Turn 3 output (by third agent):

All tasks complete. No continuation prompt needed.

---

## When to Use This System

| Scenario | Use continuation prompts? |
|----------|--------------------------|
| Simple bug fix | No |
| Single-file documentation update | No |
| Creating a new control with tests | Maybe — depends on control complexity |
| Cross-repo refactor or convention fix | Yes |
| Large documentation effort (5+ files) | Yes |
| Multi-repo dependency cascade | Yes |
| Audit/sweep across all repos | Yes |

### When NOT to Use

- **Trivial tasks** — If it fits in one turn, just do it.
- **Investigatory questions** — "How does X work?" doesn't need continuation.
- **Tasks with no clear end state** — The system works best when the total scope is enumerable.

---

## Anti-Patterns

### ❌ The Infinite Loop

An agent writes a continuation prompt that creates more work than it completed. Each subsequent agent does the same. The absolute limit is the safety net — but avoid this by scoping tasks tightly.

### ❌ The Vague Handoff

> "Continue improving the docs."

This gives the next agent no direction. Always list **specific, actionable tasks** with file paths.

### ❌ The Artifact Prompt

Putting the continuation prompt inside an artifact file. The user then has to open the artifact, copy the text, and paste it. Friction kills the workflow. Always use normal text output.

### ❌ The Missing Budget

Omitting the turn budget. Without it, there's no recursion limit and no way for the next agent to know how close to the end it is.

### ❌ The Overestimate

Setting estimated turns to 10 when the work could be done in 2. This creates unnecessary continuation overhead. Estimate honestly, err on the side of fewer turns with more work per turn.

---

## Integration With Other Protocols

### Session Handoff (AGI AGENT.md)

The [Session Handoff Template](./agi/AGENT.md) in the AGI guide is for **ending a session** — summarising what happened for future context. Continuation prompts are for **continuing a session** across turn boundaries. They're complementary:

- **Continuation prompt** → "Here's what to do next, right now"
- **Session handoff** → "Here's what happened, for whenever someone picks this up"

### Cross-Repo Coordination

When a continuation prompt involves work across multiple repos, follow the [Cross-Repo Coordination](./CROSS_REPO_COORDINATION.md) protocol within each turn. The continuation prompt should note which repos have been touched and which still need changes.

---

## Quality Signal

The continuation prompt system is itself a quality signal for agent work. A well-constructed prompt demonstrates:

- The agent understood the full scope of the task
- The agent did maximum work before handing off
- The agent thought about what the next agent needs to succeed
- The agent imposed discipline on the recursion

A poorly constructed prompt — vague tasks, missing budget, excessive remaining work — signals the agent didn't fully engage with the task.
