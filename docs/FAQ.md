# jsgui3 Ecosystem — Frequently Asked Questions (FAQ)

This FAQ compiles solutions to the most common conceptual, architectural, and development challenges encountered by developers and AI agents working across the **jsgui3** platform.

---

## 1. Core Concepts & Architecture

### What is isomorphic UI rendering?
Isomorphic code runs identically on both the server (Node.js) and the client (browser). in jsgui3, UI components are written as **isomorphic controls**.
1.  **On the server:** The control tree is evaluated and rendered into static HTML (complete with styling) to deliver a near-instant initial page load and perfect SEO visibility.
2.  **In the browser:** The control code is loaded and executed again to attach event listeners and state management to the existing HTML structures.

### Why is it called "activation" instead of "hydration"?
The process of connecting a static, server-rendered DOM to active, event-driven JavaScript controls is called **activation** in jsgui3.

While modern frameworks like React or Vue call this "hydration", the creator of jsgui3 designed the **activation** lifecycle before those frameworks popularized the term "hydration". In this ecosystem, using "hydration" indicates a lack of deep familiarity with the framework's native architecture. The term "activation" is used exclusively throughout the 12 repositories and serves as a primary quality indicator for code and documentation.

### Why does jsgui3 avoid using a Virtual DOM?
Unlike React, which diffs a Virtual DOM tree in memory on every update, jsgui3 uses **direct DOM manipulation backed by reactive data binding**.
When a property in a reactive model (`Data_Object` or `Data_Value`) changes, it fires fine-grained events. Bound controls listen to these events and update the exact DOM elements affected. This avoids the CPU overhead of diffing large virtual trees, making jsgui3 exceptionally fast and memory-efficient in resource-constrained environments.

---

## 2. Coding & Style Conventions

### Why is naming so strict in jsgui3?
jsgui3 enforces a rigid naming system to maintain readability and structural predictability across 12 distinct repositories:
*   **Variables, functions, helper utilities, and methods:** Always use `snake_case` (e.g., `set_value`, `get_free_port`, `current_count`).
*   **Class names and constructors:** Always use `Camel_Case` (PascalCase with underscores separating logical words) (e.g., `Active_HTML_Document`, `Data_Model_View_Model_Control`).
*   **File names:** Always use `snake_case` (e.g., `form_field.js`, `property_editor.js`).
*   **CSS Class names:** Always use `kebab-case` (e.g., `form-field`, `count-display`).

### Can I mix CamelCase (camelCase) into client scripts?
**Strictly no.** Standard camelCase (without underscores) is forbidden in agent-contributed and core codebase files. Adhering to the project's native `snake_case` is a non-negotiable requirement.

---

## 3. Multi-Repo Change Propagation

### How do I propagate a change in a foundation library (like `lang-mini`) all the way down to `jsgui3-server`?

Propagating changes across a multi-repository, multi-layered ecosystem requires a systematic pipeline of local linking, dependency verification, and coordinated version releases.

```
┌─────────────┐     ┌─────────┐     ┌────────────┐     ┌─────────────┐     ┌───────────────┐
│  lang-mini  │ ──> │  oext   │ ──> │ lang-tools │ ──> │ jsgui3-html │ ──> │ jsgui3-server │
└─────────────┘     └─────────┘     └────────────┘     └─────────────┘     └───────────────┘
```

#### Step 1: Release & Tagging (Source of Truth)
Before a change is permanently integrated, the source package must be bumped and released:
1.  Navigate to the source repository (e.g., `lang-mini`).
2.  Bump the version in `package.json` (e.g., `v0.0.45` to `v0.0.46`).
3.  Commit the changes and push to GitHub.
4.  Create a matching Git tag and release on GitHub (`v0.0.46`). This establishes a hard version checkpoint for dependency resolution.

#### Step 2: Coordinated Downstream Version Bumps
Because the layers depend on each other, you must cascade the version bumps down the chain. For example, if you change `lang-mini`:
1.  Bump and release `lang-mini` (`v0.0.46`).
2.  In `oext` (published as npm package `obext`), update its dependency range for `lang-mini` in `package.json`, then bump `obext` to a new version and release it.
3.  In `lang-tools`, update dependencies for both `lang-mini` and `obext`, then release `lang-tools`.
4.  Repeat this process down through `jsgui3-html`, `jsgui3-client`, and finally `jsgui3-server`.

#### Step 3: Local Development with `npm link`
To develop and test changes in real-time across repositories without constantly publishing alpha packages to the npm registry, use `npm link`.

In your global repositories folder, link the source package:
```bash
# In the source package
cd lang-mini
npm link

# In the consuming package
cd ../oext
npm link lang-mini
```

---

### What are the complexities of `npm link` and how do I resolve them?

While highly effective, local symlinking with npm introduces several known complexities. Follow these strategies to resolve them:

#### Gotcha A: The "Duplicate Instances" Bug (instanceof checks fail)
*   **The Problem:** When you use `npm link`, the consuming repository contains its own nested `node_modules` folders, but the linked package also resolves dependencies. This often results in the exact same library (like `lang-mini` or `lang-tools`) being loaded in memory twice: once from the linked folder, and once from the consumer's local `node_modules`.
    Because JavaScript loads two separate copies of the file, `instanceof` checks (e.g., `x instanceof Data_Object` or `ctx instanceof Page_Context`) will fail, even if the objects are structurally identical!
*   **The Strategy:** Force npm to resolve a single global instance. In the consuming package, delete the duplicate dependency from its local `node_modules` folder:
    ```bash
    # Inside the consuming repo (e.g., lang-tools)
    rm -rf node_modules/lang-mini
    ```
    This forces Node.js to traverse up the symlink and resolve `lang-mini` from the single globally-linked instance.

#### Gotcha B: Windows Junction/Symlink Permissions
*   **The Problem:** On Windows, creation of symbolic links requires elevated permissions. Running `npm link` in a standard PowerShell or Command Prompt window can fail silently or create invalid directory shortcuts.
*   **The Strategy:** Always open your shell (PowerShell or Windows Terminal) as **Administrator** before executing `npm link` or `npm link <package-name>`.

#### Gotcha C: Stale Server-Side Bundler Cache
*   **The Problem:** `jsgui3-server` caches transpiled client-side scripts inside a local `.jsgui3-server-cache` directory. If you update a linked dependency, the server's cache may serve the stale version of the script, leading to activation mismatches.
*   **The Strategy:** When making changes to linked components during active development, delete the server cache directory before starting the server:
    ```bash
    # Inside the server directory or example project
    rm -rf .jsgui3-server-cache
    ```

---

## 4. Development & Troubleshooting

### Why is my control's click handler not firing in the browser?
This is almost always caused by one of three issues:
1.  **Missing `activate()` call:** In `client.js`, ensure you have defined the `activate()` method and called `super.activate()` inside it.
2.  **No Server-Side Activation Hook:** In the served webpage, the server must output the client-side activation script (e.g., `/js/client.js`) and run a loader to initialize the body.
3.  **Missing `__active` guard:** If your event listeners are attached in the control constructor rather than in `activate()`, they will try to run on the server (where the DOM doesn't exist) and crash. Move all listener attachments to `activate()`.

### My server crashed with `ReferenceError: document is not defined`. How do I fix it?
Because `client.js` is isomorphic and runs on the server first, any direct references to browser-only globals (like `document`, `window`, or `navigator`) will cause Node.js to throw a reference error during Server-Side Rendering (SSR).

*   **The Fix:** Wrap all browser-only APIs in an isomorphic guard or move them into the client-only `activate()` lifecycle hook.
    ```javascript
    // ✅ CORRECT: Guarded DOM access
    if (typeof document !== 'undefined') {
        const body_el = document.body;
    }

    // ✅ CORRECT: Using control DOM reference guards
    if (this.input.dom.el) {
        this.input.dom.el.value = 'default';
    }
    ```

### How do I write safe, fast E2E Puppeteer tests for interactive controls?
In jsgui3, you cannot test interactive click behavior, CSS state changes, or keyboard navigation inside standard Node.js unit tests because the DOM behaves statically. You **must** write Puppeteer E2E tests.

*   **Rule 1: Self-Contained Tests.** Each test script must start its own HTTP server on a unique port, launch Puppeteer, navigate, run assertions, take verification screenshots, close the browser, and terminate the server.
*   **Rule 2: Avoid `page.waitForTimeout()`.** This is deprecated in Puppeteer 24+. Instead, define a manual delay utility:
    ```javascript
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    ```
*   **Rule 3: Use array indexing.** Avoid complex `:nth-of-type` CSS selectors for dynamic elements. Prefer mapping elements and evaluating them via `$$eval`:
    ```javascript
    const is_visible = await page.$$eval('.tab-panel', panels => getComputedStyle(panels[1]).display !== 'none');
    ```
