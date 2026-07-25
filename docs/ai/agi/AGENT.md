# jsgui3 Ecosystem — AGI Agent Deep Knowledge Base

> **Last Updated:** 2026-05-28
> **Audience:** Advanced AI agents performing autonomous, multi-step work across the jsgui3 ecosystem

---

## Purpose

This document goes beyond the orientation guide ([../AGENT.md](../AGENT.md)) to provide deep context for agents performing complex, multi-step, or multi-repo tasks. It captures the nuanced understanding that accumulates over many sessions of working with the codebase.

---

## Deep Architecture Understanding

### The Control Lifecycle in Detail

The control lifecycle is the single most important concept to understand. Here's the complete flow:

```
1. CONSTRUCTION (both environments)
   ├── spec.__type_name set (runtime type ID)
   ├── super(spec) called (Control_Core → Control → DMVMC)
   ├── context extracted from this
   ├── DOM object created (Control_DOM)
   ├── Attributes object created (DOM_Attributes)
   └── _compose() called IF no spec.el

2. COMPOSITION (both environments)
   ├── Child controls created via new Control({ context })
   ├── Children added via this.add(child)
   ├── Control tree built recursively
   └── data.model / view.data.model initialised

3. RENDERING (server only)
   ├── all_html_render() called
   ├── Begin tag: <div data-jsgui-id="ctrl_123" ...>
   ├── Children rendered recursively
   ├── State serialised into data-jsgui-* attributes
   └── End tag: </div>

4. ACTIVATION — RECONNECTION (client only)
   ├── HTML parsed by browser into DOM
   ├── Client script loads and executes
   ├── Control instances re-created from data-jsgui-* attributes
   └── el references mapped to existing DOM nodes

5. ACTIVATION — EVENT BINDING (client only)
   ├── __active flag checked (prevent double-activation)
   ├── super.activate() called
   ├── Event listeners attached to DOM elements
   ├── Data model change handlers connected
   └── Client-only initialization completed
```

### The Data Flow Pattern

```
User Action → DOM Event → Control Event Handler
    → Data Model (Data_Object) mutation
    → Change event emitted
    → View Model updated (if DMVMC)
    → DOM updated (via control methods)
```

Key insight: **Data flows through observable models, not through direct DOM manipulation.** Controls bind to models, and models emit change events that trigger view updates.

### The Bundling Pipeline

The server's bundling pipeline is critical for performance:

```
1. Client entry point identified (src_path_client_js)
2. esbuild transpiles ES6+ to browser-compatible JS
3. Control elimination runs:
   - Static analysis identifies unused controls
   - Unused control code stripped from bundle
4. CSS extracted from control class static properties
5. Bundle cached (keyed by control set + config)
6. On request:
   - HTML page generated with SSR content
   - Activation script injected
   - CSS injected in <style> tags
   - JS bundle linked via <script>
```

---

## Cross-Package Integration Points

### Where Packages Touch Each Other

| Integration Point | Packages | What Happens |
|-------------------|----------|-------------|
| Evented_Class inheritance | lang-mini → all | Every control, model, and resource extends Evented_Class |
| prop/field definitions | obext → jsgui3-html, jsgui3-gfx-core | Reactive properties on controls and pixel buffers |
| Data_Object binding | lang-tools → jsgui3-html | Controls bind to Data_Object instances for state |
| Page_Context creation | jsgui3-html ← jsgui3-client | Client extends server-created page context |
| Control registration | jsgui3-html → jsgui3-server | Server discovers and bundles controls |
| CSS extraction | jsgui3-html → jsgui3-server | Static .css properties collected by bundler |
| Webpage → Website | jsgui3-webpage → jsgui3-website → jsgui3-server | Page definitions compose into sites |
| Resource pool | jsgui3-client ← jsgui3-server | Server exposes resources, client consumes them |
| SSE publishing | jsgui3-server → jsgui3-client | Real-time event streaming |

### Common Gotchas at Boundaries

1. **Version mismatch** — When jsgui3-html changes the control API, jsgui3-server's bundler may need updates
2. **Context differences** — Server Page_Context vs Client_Page_Context have different capabilities
3. **Module resolution** — `require.resolve()` behaviour differs between local dev and npm-installed packages
4. **CSS ordering** — Control CSS extraction order can affect specificity
5. **Activation timing** — Controls must be fully rendered before activation scripts run

---

## Decision Framework for Agents

### Where Should This Code Go?

| If you're creating... | Put it in... | Because... |
|----------------------|-------------|-----------|
| A new UI widget | `jsgui3-html/controls/organised/` | Controls belong in the presentation layer |
| A new data structure | `lang-tools/` | Data structures belong in the foundation |
| A new server feature | `jsgui3-server/` | Server features stay server-side |
| A new HTTP helper | `jsgui3-client/` | Client-side HTTP code goes here |
| A new mixin | `jsgui3-html/control_mixins/` | Mixins extend control behaviour |
| A new event type | `lang-mini/` | Events are a foundation concern |
| A new reactive property pattern | `oext/` | Property definitions live here |
| Pixel/image processing | `jsgui3-gfx-core/` | Graphics code stays in gfx layer |
| Page/route definition | `jsgui3-webpage/` or `jsgui3-website/` | Abstract page models |

### How Should I Structure This Control?

```
Does it bind to data?
├── YES → Extend Data_Model_View_Model_Control
│   ├── Create Data_Object for data model
│   ├── Create Data_Object for view model
│   └── Set up data→view bindings
└── NO → Extend Control
    ├── Use spec properties for configuration
    └── Keep state in instance properties

Does it need client-side behaviour?
├── YES → Put it in activate()
│   ├── Event listeners
│   ├── DOM measurements
│   └── Timers/animations
└── NO → Keep everything in constructor

Does it compose other controls?
├── YES → Build in _compose() method
│   ├── Create children with { context }
│   ├── Add via this.add()
│   └── Store references in this._ctrl_fields
└── NO → Set tagName and attributes directly
```

---

## Historical Context

### Project Evolution

- **jsgui3** is the third generation of the JSGUI framework
- The project emphasises **isomorphic operation** — same code on server and client
- **snake_case** convention was a deliberate choice to distinguish from standard JavaScript and create a recognisable code style
- The **Data_Model** system in lang-tools has legacy and modern implementations — the modern version is preferred
- The **mixin system** evolved from ad-hoc behaviour attachment to a formal, disposable, dependency-aware system

### Known Technical Debt

- Some lang-tools Data_Model methods are still marked `NYI` (not yet implemented)
- Grammar system in lang-mini has experimental APIs
- Server bundling has edge cases with complex control hierarchies
- Some controls in jsgui3-html pre-date the organised directory structure

---

## Agent Memory Protocol

### What to Remember Across Sessions

When working on jsgui3, accumulate knowledge in these locations:

1. **Within the session:** Keep notes on what you've discovered
2. **Within the repo:** Write to `docs/agi/LESSONS.md` (jsgui3-html) or equivalent
3. **Cross-repo:** Tag lessons with `[CROSS-REPO]` for universal applicability
4. **Patterns:** Document reusable patterns in `docs/agi/PATTERNS.md`
5. **Anti-patterns:** Document what NOT to do alongside patterns

### Session Handoff Template

When ending a session and expecting a future agent to continue:

> [!TIP]
> This template is for **ending a session** — summarising what happened for future context. If the task is actively being continued across turns right now, use the **[Continuation Prompt System](../CONTINUATION_PROMPTS.md)** instead — it's designed for structured, budgeted multi-turn handoffs with recursion limits.

```markdown
## Session Summary
- **What was done:** [brief description]
- **What remains:** [next steps]
- **Key discoveries:** [anything the next agent needs to know]
- **Files modified:** [list of changed files]
- **Tests run:** [test results]
- **Known issues:** [anything that didn't work as expected]
```
