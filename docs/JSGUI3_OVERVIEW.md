# What is jsgui3?

jsgui3 is a modular JavaScript UI framework for applications that render on the server and become interactive in the browser. Its basic unit is a **control**: a stateful JavaScript object that composes smaller controls into an HTML tree. `jsgui3-server` renders that tree for the first response; `jsgui3-client` then reattaches the same controls to the existing DOM and runs `activate()` to bind interaction.

This is **activation**, not virtual-DOM hydration. The browser does not rebuild the page or diff it against a second tree. Server rendering is the page; activation adds browser behaviour to that existing structure.

## The three-stage model

### 1. Compose controls

A control declares its structure by creating child controls. Composition is explicit, inspectable, and recursive: a button can sit inside a toolbar, the toolbar inside a panel, and the panel inside an application document.

```javascript
const { Control, controls } = require('jsgui3-html');

class Welcome_Card extends Control {
    constructor(spec = {}) {
        spec.__type_name = spec.__type_name || 'welcome_card';
        super(spec);
        if (!spec.el) this.compose();
    }

    compose() {
        const heading = new controls.h2({ context: this.context });
        heading.add('Hello from jsgui3');
        this.add(heading);
    }
}
```

The `if (!spec.el)` guard matters. On the server there is no existing element, so the control composes its children. In the browser `spec.el` points to the server-rendered element, so the control reattaches without duplicating the DOM.

### 2. Render on the server

`jsgui3-server` creates a page context, instantiates the document control, renders its control tree to HTML, and serves the client bundle and extracted control styles. The first response is useful HTML rather than an empty application mount point.

Server rendering gives applications fast first content, linkable pages, and a structure that remains meaningful before JavaScript finishes loading.

### 3. Activate in the browser

`jsgui3-client` reconstructs control relationships around the existing DOM. Each active control can then run `activate()` to attach event handlers, observe state, and coordinate with other controls.

Activation is progressive: anchors, forms, headings, and content should retain their native meaning before activation. Client behaviour enhances that foundation.

## The software components

The ecosystem is deliberately layered. Packages near the bottom supply language and data primitives; packages above them add HTML, browser, server, page, and application concerns.

### Language and data foundations

- `lang-mini` provides compact type and iteration utilities used throughout the ecosystem.
- `obext` provides observable object properties.
- `lang-tools` adds evented classes, data models, collections, and higher-level language tools.

These packages do not know about the browser. They are the shared substrate for reactive state and events.

### The control and rendering layer

- `jsgui3-html` owns the control model, HTML rendering, DOM representation, binding helpers, mixins, themes, and the reusable control library.
- Its controls range from native wrappers such as `Button` and `Text_Input`, through composed inputs and layout, to data views, editors, charts, windows, and application UI.

This is where composition and activation meet: the same control class participates in server output and browser behaviour.

### Browser and server runtimes

- `jsgui3-client` is the browser runtime. It reattaches controls to server-rendered elements and activates them.
- `jsgui3-server` serves control documents, bundles browser code, gathers control CSS, and provides HTTP and resource infrastructure.

Together they implement the server-render → browser-activate path.

### Pages, graphics, and applications

- `jsgui3-webpage` and website-oriented packages organise controls into pages and sites.
- `jsgui3-gfx-core` and related graphics packages provide colour, geometry, pixels, and image-oriented foundations.
- Application repositories combine these layers for concrete tools, services, and user experiences.
- `jsgui3-ecosystem` holds the cross-repository map, contracts, examples inventory, and durable coordination documentation.

## Controls are the centre of the framework

A control is more than a visual widget. It is the unit used for page structure, state, events, rendering, activation, accessibility, and reuse. Some controls wrap one native element; others coordinate substantial subtrees and application behaviour.

Every public control has a registry entry and source implementation. Many also have dedicated Markdown documentation and checked examples. The documentation viewer presents those materials together so the relationship between prose, live behaviour, and source stays visible.

## What to learn next

1. Read **Architecture** for contexts, rendering, activation, and dependency direction.
2. Follow **Getting started** to build and serve a small control.
3. Open the **Controls guide** to understand control tiers and import paths.
4. Browse the **Control catalog** to compare documentation, live previews, and real source.
5. Use **Examples** for checked, repository-owned integrations and their smoke status.

## Current maturity and trade-offs

jsgui3 is in active pre-1.0 development. Its central composition, server-rendering, and activation model is established, but coverage is not uniform across the large public control registry: some controls have dedicated guides and deterministic examples, while others currently expose source-level reference material only. Deprecated compatibility aliases also remain while APIs converge.

The model rewards explicit control structure and useful server HTML, but it requires lifecycle discipline. Browser behaviour must be registered for activation, server-only work must stay outside client bundles, and complex binding APIs are still an active design area. Evaluate the specific controls and deployment path you need, and use the checked examples and tests as evidence rather than treating the registry count as a blanket production-readiness claim.

## Design values

- **One control model across server and browser.** Rendering and interaction belong to the same conceptual object.
- **Progressive behaviour.** Useful server HTML comes first; browser activation enhances it.
- **Composition over hidden machinery.** Application structure is made from explicit control relationships.
- **Stable public contracts.** Compatibility and additive evolution matter across the package graph.
- **Source-visible documentation.** Examples and docs should point back to the code and repository that own the behaviour.

The result is a framework aimed at rich, server-first JavaScript interfaces where application structure, rendering, and interaction remain directly inspectable.
