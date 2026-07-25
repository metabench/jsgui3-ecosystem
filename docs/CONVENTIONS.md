# jsgui3 Ecosystem — Coding Conventions

> **Last Updated:** 2026-05-28

These conventions apply to **all** repositories in the jsgui3 ecosystem. Every developer and AI agent must follow them without exception.

---

## Naming Conventions

### The #1 Rule

> **Use `snake_case` for everything except class names (use `Camel_Case`).**

This is the defining convention of the jsgui3 codebase. It is non-negotiable.

### Complete Reference

| Scope | Convention | Examples |
|-------|-----------|---------|
| Variables | `snake_case` | `form_field`, `current_value`, `is_active` |
| Functions/Methods | `snake_case` | `get_value()`, `set_position()`, `add_class()` |
| Private methods | `_snake_case` | `_create_ui()`, `_attach_events()` |
| Class names | `Camel_Case` | `Control`, `Data_Object`, `Form_Field` |
| File names | `snake_case` | `form_field.js`, `property_editor.js` |
| CSS classes | `kebab-case` | `form-field`, `property-editor`, `counter-display` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_HISTORY_SIZE`, `DEFAULT_PORT` |
| Event names | `snake_case` or `kebab-case` | `data_changed`, `window-resize` |

### ❌ Never Use

```javascript
// WRONG
class FormField extends Control { }          // No pure PascalCase
const formField = new Form_Field();          // No camelCase variables
function getValue() { }                       // No camelCase functions
```

### ✅ Always Use

```javascript
// CORRECT
class Form_Field extends Control { }
const form_field = new Form_Field();
function get_value() { }
```

---

## File Organisation

### Control Files

```
controls/
├── organised/
│   ├── 0-core/
│   │   ├── 0-basic/
│   │   │   ├── 0-native-compositional/  # Native HTML element wrappers
│   │   │   └── 1-compositional/         # Composed controls
│   │   └── 1-advanced/                  # Advanced core features
│   └── 1-standard/
│       ├── 1-editor/                    # Form/editing controls
│       ├── 5-ui/                        # UI components
│       └── 6-layout/                    # Layout controls
```

### File Naming

- All source files: `snake_case.js`
- All test files: `snake_case.test.js` or `snake_case.e2e.test.js`
- All documentation: `kebab-case.md` or `SCREAMING_SNAKE_CASE.md` for top-level
- Screenshots: `descriptive-name.png`

---

## Architectural Patterns

### Isomorphic Control Pattern

Every control must work on both server and client:

```javascript
class My_Control extends Control {
    constructor(spec = {}) {
        spec.__type_name = spec.__type_name || 'my_control';
        super(spec);

        const { context } = this;

        // Runs on BOTH server and client
        this._create_ui(context);
    }

    activate() {
        // Runs ONLY on client
        if (!this.__active) {
            super.activate();
            this._attach_events();
        }
    }

    _create_ui(context) {
        // Build structure here
        this.display = new Control({ context });
        this.add(this.display);
    }

    _attach_events() {
        // Client-only event handling
        this.display.on('click', () => { /* ... */ });
    }
}
```

### SSR Safety Guards

Always guard DOM element access:

```javascript
// ✅ CORRECT
if (this.input.dom.el) {
    this.input.dom.el.value = initial_value;
}

if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handler);
}

// ❌ INCORRECT — crashes on server
this.input.dom.el.value = initial_value;
```

### Constructor Pattern

```javascript
class My_Control extends Control {
    constructor(spec = {}) {
        spec.__type_name = spec.__type_name || 'my_control';  // Type ID
        super(spec);                                           // Always call super
        const { context } = this;                              // Extract context

        // Guard-wrapped composition
        if (!spec.el) { this._compose(); }
    }
}
```

### MVVM Pattern

```javascript
class My_Data_Control extends Data_Model_View_Model_Control {
    constructor(spec = {}) {
        spec.__type_name = spec.__type_name || 'my_data_control';
        super(spec);
        const { context } = this;

        // Create model with Data_Object
        this.model = new Data_Object({ property_name: initial_value });

        // Bind model to view
        this.bind('property_name', this.model, {
            toView: (value) => `Display: ${value}`
        }, display_control);

        // Computed properties
        this.computed(this.model, ['property_name'],
            (value) => value * 2,
            { propertyName: 'computed_property' }
        );
    }
}
```

### Server Startup Pattern

```javascript
const jsgui = require('./client');
const { My_Control } = jsgui.controls;
const { Server } = require('jsgui3-server');

if (require.main === module) {
    Server.serve(My_Control, { port: 8080 });
}
```

---

## Testing Requirements

### E2E Tests Are Mandatory

Every interactive control **must** have E2E tests using Puppeteer that cover:

| Category | What to Test |
|----------|-------------|
| Static rendering | Elements exist, correct count, correct text |
| Click interactions | Click triggers state change |
| Keyboard navigation | Arrow keys, Enter, Escape, Tab |
| ARIA attributes | `aria-selected`, `aria-hidden`, `role` |
| CSS visual state | Active indicators, transitions |
| Content isolation | Switching shows correct content |
| Edge cases | Wrap-around, rapid clicks |

### Puppeteer 24+ Compatibility

- **No** `page.waitForTimeout()` — use `const delay = ms => new Promise(r => setTimeout(r, ms))`
- Use `$$eval` with array indexing instead of `:nth-of-type()` for mixed DOM siblings
- Use `page.$eval` / `page.$$eval` for computed styles

### Test File Pattern

Tests should be self-contained: build page → start server → run tests → capture screenshots → shut down.

---

## CSS Conventions

### Static CSS on Class

```javascript
My_Control.css = `
    .my-control {
        display: flex;
        align-items: center;
    }
    .my-control .label {
        font-weight: bold;
    }
`;
```

### CSS Variables for Theming

```css
.my-control {
    color: var(--ctrl-text-color, #333);
    background: var(--ctrl-bg-color, #fff);
    border-radius: var(--ctrl-border-radius, 4px);
}
```

---

## Documentation

### JSDoc on Public Methods

```javascript
/**
 * Set the field value
 * @param {*} value - The value to set
 * @returns {void}
 */
set_value(value) {
    this.current_value = value;
}
```

### README for Examples

Each example directory must include:
- Feature list
- Quick start guide
- Code examples
- Architecture explanation

---

## Code Review Checklist

Before submitting code:

- [ ] All variables/methods use `snake_case`
- [ ] All class names use `Camel_Case`
- [ ] All file names use `snake_case`
- [ ] DOM access is guarded for server compatibility
- [ ] Event listeners only in `activate()`
- [ ] Data models use `Data_Object`
- [ ] JSDoc comments on public methods
- [ ] E2E tests written and passing
- [ ] No `console.log` left in production code
- [ ] Proper error handling
- [ ] No temporary files committed
