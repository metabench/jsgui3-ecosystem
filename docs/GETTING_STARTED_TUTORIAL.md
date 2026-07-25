# Getting Started with jsgui3 — Building Your First App

This step-by-step tutorial will guide you through setting up a project and building your first isomorphic web application using the **jsgui3** platform. We will build a beautiful, reactive, interactive **Counter App** from scratch using `jsgui3-html` and `jsgui3-server`.

---

## Conceptual Overview

Before coding, it is essential to understand the primary architectural principle of jsgui3:

> [!IMPORTANT]
> **Isomorphic Controls & Activation**
> in jsgui3, UI controls are isomorphic. They are defined in a single file (usually `client.js`) and run on both the **server** (for fast, search-engine-friendly initial page load via Server-Side Rendering) and the **client browser** (for rich interaction).
>
> The process of taking server-rendered HTML and binding event listeners and active state in the browser is called **activation**.
>
> *Note for developers coming from other frameworks:* What React or Vue call "hydration" is called **activation** in jsgui3. In the jsgui3 ecosystem, using the word "hydration" is considered a quality signal indicating the author does not fully understand the framework's native architecture. Always use **activation**.

---

## 1. Project Setup

Create a new directory for your project and initialize a standard Node.js workspace.

```bash
mkdir jsgui3-counter-app && cd jsgui3-counter-app
npm init -y
```

### Install Dependencies

Install the core foundation, presentation, and server packages from the jsgui3 registry:

```bash
npm install jsgui3-client jsgui3-html jsgui3-server
```

> [!NOTE]
> Under the hood, these packages will pull in the foundation libraries: `lang-mini` (for the event and type systems) and `obext` (for reactive properties).

---

## 2. Defining the Isomorphic App (`client.js`)

Create a file named `client.js`. This file will contain our UI controls. Because jsgui3 is isomorphic, this file will be executed by Node.js on the server to render the initial HTML, and then bundled by the server to run in the user's browser.

### Rules of the Road
*   **snake_case** for variables, functions, and method names (e.g., `set_count`, `btn_increment`).
*   **Camel_Case** for class names (e.g., `Counter_App`).

```javascript
// client.js
const jsgui = require('jsgui3-client');
const { controls } = jsgui;

// Active_HTML_Document is the server-client hybrid document base class.
// Deep require — works because jsgui3-server has no "exports" field blocking it:
const Active_HTML_Document = require('jsgui3-server/controls/Active_HTML_Document');
// Alternative: const { controls: { Active_HTML_Document } } = require('jsgui3-server');

class Counter_App extends Active_HTML_Document {
    constructor(spec = {}) {
        // 1. Establish the runtime type name (crucial for CSS and serialization)
        spec.__type_name = spec.__type_name || 'counter_app';
        super(spec);

        const { context } = this;

        // 2. Set body CSS class on startup (if method exists)
        if (typeof this.body.add_class === 'function') {
            this.body.add_class('counter-app');
        }

        // 3. Define composition logic. Controls are built programmatically, not via templates.
        const compose = () => {
            // Container Panel
            const container = new controls.Control({
                context,
                class: 'counter-container'
            });
            this.body.add(container);

            // Title Header
            const header = new controls.h1({
                context,
                text: 'jsgui3 Counter Demo'
            });
            container.add(header);

            // Count Display Control
            const display = new controls.div({
                context,
                class: 'count-display',
                text: '0'
            });
            container.add(display);

            // Button Container (for flex layout)
            const button_bar = new controls.div({
                context,
                class: 'button-bar'
            });
            container.add(button_bar);

            // Increment Button
            const btn_increment = new controls.button({
                context,
                class: 'btn btn-primary',
                text: 'Increment'
            });
            button_bar.add(btn_increment);

            // Decrement Button
            const btn_decrement = new controls.button({
                context,
                class: 'btn btn-secondary',
                text: 'Decrement'
            });
            button_bar.add(btn_decrement);

            // 4. Store references in an internal dictionary so they can be accessed easily
            //    in both constructor composition and client-side activation.
            this._ctrl_fields = {
                display,
                btn_increment,
                btn_decrement
            };
        };

        // 5. Isomorphic Guard: Only compose if we are not binding to an existing DOM element.
        //    During client-side activation, spec.el will be populated with the server-rendered DOM.
        if (!spec.el) {
            compose();
        }
    }

    /**
     * CLIENT-SIDE ONLY Lifecycle Hook.
     * Reconnects the server-rendered HTML markup with active browser event listeners.
     */
    activate() {
        // Prevent double activation
        if (!this.__active) {
            super.activate();

            const { display, btn_increment, btn_decrement } = this._ctrl_fields;
            let current_count = 0;

            const update_display = () => {
                if (display.dom.el) {
                    display.dom.el.textContent = current_count;
                }
            };

            // Register active browser click handlers
            if (btn_increment) {
                btn_increment.on('click', () => {
                    current_count++;
                    update_display();
                });
            }

            if (btn_decrement) {
                btn_decrement.on('click', () => {
                    current_count--;
                    update_display();
                });
            }

            console.log('Counter App successfully activated in the browser!');
        }
    }
}

// Register the control with the client-side registry
controls.Counter_App = Counter_App;

// Export the augmented jsgui object containing our new controls
module.exports = jsgui;
```

---

## 3. Creating the Server Startup (`server.js`)

Create a file named `server.js`. This is a pure server-side script. It starts the Node.js server, loads our isomorphic App component, compiles and bundles `client.js` dynamically using the built-in esbuild system, compiles the extracted CSS, and starts hosting.

```javascript
// server.js
const { Server } = require('jsgui3-server');
const jsgui = require('./client');
const { Counter_App } = jsgui.controls;

// We ensure server code only executes when run directly
if (require.main === module) {

    // Create the server instance
    const server = new Server({
        // The root component to render and serve
        Ctrl: Counter_App,

        // The entrypoint script for client bundling
        src_path_client_js: require.resolve('./client.js'),

        // Enable built-in response compression (gzip/deflate/brotli)
        compression: true,

        // Keep administration surfaces disabled in this public beginner app.
        admin: false
    });

    console.log('Starting client compilation and bundling...');

    // Wait for the dynamic bundler to complete preparation
    server.on('ready', () => {
        console.log('Client bundle prepared. Starting HTTP listener...');

        const port = 8080;
        server.start(port, (err) => {
            if (err) {
                console.error('Server failed to start:', err);
                throw err;
            }

            console.log('\n=============================================');
            console.log(`🚀 jsgui3 Application Running!`);
            console.log(`👉 View app:   http://localhost:${port}`);
            console.log('=============================================\n');

            server.print_endpoints({ prefix: '  [Endpoint]' });
        }, {
            // If port 8080 is taken, retry with a free loopback port automatically
            on_port_conflict: 'auto-loopback'
        });
    });
}
```

---

## 4. Designing Premium Aesthetics (`styles.css` / Static CSS)

To make our application stand out visually and adhere to the **Rich Aesthetics** guideline, we will write a curated, modern layout and theme. We do this by declaring a static `.css` property on our `Counter_App` class in `client.js`.

The `jsgui3-server` compiler automatically reads static `.css` properties from all imported UI classes, gathers them, compiles them, and sends them to the browser as a single stylesheet file on page load.

Open `client.js` and add this style block to the bottom of the file (before the `module.exports` statement):

```javascript
Counter_App.css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    color: #f8fafc;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
}

.counter-container {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px 48px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 100%;
    max-width: 440px;
    transform: translateY(0);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.counter-container:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
}

h1 {
    font-weight: 800;
    font-size: 2rem;
    letter-spacing: -0.5px;
    margin-bottom: 24px;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.count-display {
    font-size: 5rem;
    font-weight: 800;
    margin: 24px 0;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 4px 12px rgba(129, 140, 248, 0.2);
    color: #ffffff;
    transition: color 0.15s ease;
}

.button-bar {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 16px;
}

.btn {
    border: none;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    padding: 14px 28px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
    background: #6366f1;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
    background: #4f46e5;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-primary:active {
    transform: scale(0.98);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.06);
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    transform: scale(1.05);
}

.btn-secondary:active {
    transform: scale(0.98);
}
`;
```

---

## 5. Running the Application

In your project directory, launch the Node.js application:

```bash
node server.js
```

You should see output similar to this:
```text
Starting client compilation and bundling...
Client bundle prepared. Starting HTTP listener...

=============================================
🚀 jsgui3 Application Running!
👉 View app:   http://localhost:8080
=============================================

  [Endpoint] GET  /
  [Endpoint] GET  /js/js.js
  [Endpoint] GET  /css/css.css
```

1.  **Open your browser** and navigate to `http://localhost:8080`.
2.  You will be presented with a dark, beautifully styled application containing your Title, Count display, and interactive buttons.
3.  Click the buttons to increment and decrement the counter. Notice the immediate responsive clicks and clean transitions.
4.  **Inspect the HTML Source** (right-click → View Page Source). The count and buttons are already present in the server response. The client bundle then activates that existing DOM. This gives users and crawlers useful initial HTML, but real performance and accessibility still depend on the application, content, network, and deployment.

---

## 6. Next steps and security

The beginner server deliberately uses `admin: false`. Do not publish an administration surface or default credentials as part of a public example. If a later application needs operational tooling, configure authentication, network access controls, TLS, and secrets for that deployment rather than copying development defaults.

From here:

- Move counter state into an observable `Data_Object` and bind the display to it.
- Extract the buttons into reusable controls with focused tests.
- Add error handling, accessibility checks, and a production deployment configuration.
- Explore the [architecture](/docs/architecture), [control library](/controls), and [checked examples](/examples).
