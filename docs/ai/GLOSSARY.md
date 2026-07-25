# jsgui3 Ecosystem — Glossary

> **Last Updated:** 2026-05-28
> **Audience:** Developers and AI agents new to the jsgui3 codebase

This glossary defines terms specific to the jsgui3 ecosystem. Terms are grouped by domain.

---

## Controls & UI

| Term | Definition |
|------|-----------|
| **Control** | The fundamental UI building block in jsgui3. Analogous to a React component. Every visible element is a Control or extends Control. |
| **Control_Core** | The base class providing DOM manipulation, event handling, and HTML rendering. All controls inherit from this. |
| **Data_Model_View_Model_Control (DMVMC)** | A control with explicit separation of data model (business data) and view model (UI state). The recommended pattern for data-driven controls. |
| **Control_View** | Manages the visual representation and UI state of a control, separate from its data model. |
| **Control_DOM** | Handles DOM-specific functionality — tag name, attributes, element references — for a control. |
| **DOM_Attributes** | Manages DOM attributes reactively. Setting an attribute on this object automatically updates the real DOM when the control is activated. |
| **Mixin** | A composable function `(ctrl, options?) → void|cleanup` that adds reusable behaviour (drag, select, collapse, etc.) to any control. jsgui3-html ships 39 mixins in 7 categories. |
| **Mixin Cleanup** | A disposable handle returned by a mixin. Call `cleanup.dispose()` to remove all behaviour the mixin added (listeners, classes, properties). |
| **Active_HTML_Document** | The server-side base class for full-page applications. Provides the `<html>`, `<head>`, and `<body>` structure with activation lifecycle. |

---

## Lifecycle

| Term | Definition |
|------|-----------|
| **Construction** | First phase of a control's life. The `constructor(spec)` is called, `__type_name` is set, and `super(spec)` is invoked. Runs on both server and client. |
| **Composition** | Building the control's internal structure by creating child controls and adding them via `this.add()`. Also called "compose". Runs on both server and client. |
| **Rendering** | Generating an HTML string from the control tree via `all_html_render()`. Server-side only. Produces `data-jsgui-*` attributes for later activation on the client. |
| **Activation** | The `activate()` method that runs client-side only. Reconnects server-rendered HTML to live control instances, attaches event listeners, connects data bindings, and performs client-only initialisation. Guarded by `__active` flag to prevent double-activation. This is what other frameworks call "hydration" — but in jsgui3 it is always called **activation**. Seeing the word "hydration" in jsgui3 documentation is a reliable signal that the author doesn't deeply understand the framework; it serves as a useful quality measure for any jsgui3 docs. |
| **`__active`** | Boolean flag on every control. Set to `true` after `activate()` runs. Checked at the start of `activate()` to prevent double-activation. |
| **`__type_name`** | String property set in the constructor (e.g., `'my_control'`). Used for runtime type identification, CSS class generation, and serialisation. |
| **`spec`** | The configuration object passed to a control's constructor. Contains initial property values, context, and options. Always defaulted to `{}`. |

---

## Data & State

| Term | Definition |
|------|-----------|
| **Data_Object** | A reactive key–value store from `lang-tools`. Emits `change` events on every mutation. The standard model object for controls. |
| **Data_Value** | A reactive, type-safe value container. Wraps a single value with validation, change events, and bidirectional sync. |
| **Data_Model** | Base class for all reactive models in `lang-tools`. Provides event infrastructure and ID management. |
| **Data_Integer / Data_String** | Specialised `Data_Value` subclasses with strict type enforcement and automatic type coercion. |
| **Collection** | A reactive array-like data structure from `lang-tools`. Extends `Data_Object`. Emits change events on push, remove, clear, etc. |
| **`field(obj, name, default)`** | Function from `obext` that defines a reactive property stored on `obj._`. Changes raise events. Serialisable. |
| **`prop(obj, name, default, callback)`** | Function from `obext` that defines a reactive property with closure storage and change callbacks. |
| **`read_only(obj, name, getter)`** | Function from `obext` that defines a getter-only computed property. Alias: `ro`. |
| **Evented_Class** | The minimal event emitter from `lang-mini`. Provides `.on(event, handler)` and `.raise(event, data)`. Every control and model inherits from this. |
| **`eventify(obj)`** | Function from `lang-mini` that mixes event methods into a plain object so it can emit and listen to events. |

---

## Context & Infrastructure

| Term | Definition |
|------|-----------|
| **Context** / **Page_Context** | The runtime environment object central to jsgui3. Tracks all controls, manages ID generation, routes events, and handles cleanup. Created once per page. |
| **Client_Page_Context** | Browser-specific extension of Page_Context. Adds modal support, overlay management, and DOM element mapping. From `jsgui3-client`. |
| **Mini_Context** | Lightweight context from `lang-tools` for ID management only. Used when a full Page_Context isn't needed. |
| **`context.register_control(ctrl)`** | Registers a control or data model with the context for lifecycle management and cleanup. |

---

## Server & Bundling

| Term | Definition |
|------|-----------|
| **`Server.serve()`** | The simplified API for starting a jsgui3 server. Accepts a control class or a config object with pages, API endpoints, resources, etc. |
| **Bundling** | The process of transpiling and packaging client-side JavaScript via esbuild for delivery to the browser. |
| **Control Elimination** | Tree-shaking optimisation that removes unused control code from the client bundle via static analysis. |
| **CSS Extraction** | Collecting CSS from control classes' static `.css` properties and injecting them into the served page. |
| **Publisher** | A server-side component that handles HTTP responses for specific routes. Types include website publisher, webpage publisher, function publisher, and asset publisher. |
| **Resource** | A managed server-side component (database connection, worker process, etc.) tracked by the resource pool. Can be in-process, direct-process, or remote-process. |
| **Resource Pool** | Manages the lifecycle (start, stop, restart, health check) of all server resources. |
| **SSE (Server-Sent Events)** | Real-time one-way event streaming from server to client. Used for live updates, resource status, and admin UI heartbeats. |
| **Admin UI** | Built-in dashboard at `/admin/v1` with live stats, resource inspection, and route listing. Session-authenticated. |

---

## Patterns & Architecture

| Term | Definition |
|------|-----------|
| **Isomorphic** | Code that runs identically on both server (Node.js) and client (browser). The defining characteristic of jsgui3 controls. |
| **MVVM** | Model–View–ViewModel. The architectural pattern used by `Data_Model_View_Model_Control`. Data flows: Model ↔ ViewModel ↔ View. |
| **Compositional Model** | Building complex UIs by assembling simpler controls. Controls are composed via `this.add(child)`, not by template strings. |
| **SSR (Server-Side Rendering)** | Rendering controls to HTML strings on the server for initial page load, then activating them on the client. |
| **`snake_case`** | The naming convention for all variables, functions, methods, and file names in jsgui3. Non-negotiable. |
| **`Camel_Case`** | The naming convention for class names in jsgui3. Uses underscores between words with each word capitalised: `Data_Model_View_Model_Control`. |

---

## Foundation Libraries

| Term | Definition |
|------|-----------|
| **lang-mini** | Zero-dependency JavaScript toolkit. Provides events, type detection, polymorphic dispatch, and collection utilities. The bedrock of the ecosystem. |
| **obext** | Object extensions library. Provides `prop`, `field`, `read_only`, and `get_set` for reactive property definitions via `Object.defineProperty`. |
| **lang-tools** | Higher-level data structures and reactive models built on lang-mini. Provides `Data_Object`, `Collection`, `Data_Value`, vector math, and more. |
| **fnl** | Functional utilities library. Provides observables and functional helpers used across the ecosystem. External dependency. |
| **`mfp(config, handlers)`** | Multi-function polymorphism from lang-mini. Dispatches function calls based on runtime argument type signatures. |
| **`tof(value)`** | Enhanced `typeof` from lang-mini. Returns `'array'`, `'null'`, `'undefined'`, etc. instead of JavaScript's limited `typeof`. |
| **Functional_Data_Type** | Runtime type definition from lang-mini. Includes `validate`, optional `parse_string`, and metadata. Used for field validation. |
| **Grammar** | Experimental grammar-driven type inference from lang-mini. Maps runtime data structures to named types. Some methods still `NYI`. |
| **`collective(array)`** | Proxy-based batch operations utility from lang-tools. Lets you call methods or access properties on all array items at once. |

---

## Agent Workflow

| Term | Definition |
|------|-----------|
| **Continuation Prompt** | A structured text block written at the end of an agent's turn, designed to be pasted as the next user message. Carries forward completed work, remaining tasks, context, and a turn budget to prevent infinite recursion. See [CONTINUATION_PROMPTS.md](./CONTINUATION_PROMPTS.md). |
| **Turn Budget** | Two counters embedded in every continuation prompt: an **estimated remaining turns** count and an **absolute hard limit**. Both decrement each turn. When the absolute limit hits 0, the agent stops regardless of remaining work. |
| **Session Handoff** | A summary written when ending a session, describing what happened for whenever someone picks the work up later. Complementary to continuation prompts: handoffs are retrospective, continuation prompts are imperative. |
