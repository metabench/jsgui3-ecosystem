# jsgui3 Ecosystem — Development Workflow

> **Last Updated:** 2026-05-28

This document covers how to develop, test, and publish across jsgui3 repositories.

---

## Local Development Setup

### Prerequisite Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 18.0.0 | Runtime (18+ recommended for full compatibility) |
| npm | Ships with Node | Package management |
| Git | Latest | Version control |
| Puppeteer | Bundled as dev dep | E2E testing |
| esbuild | Bundled as dep/dev dep | JS bundling |

### Workspace Layout

Recommended directory structure for active development:

```
C:\Users\james\Documents\repos\
├── lang-mini/
├── oext/
├── lang-tools/
├── jsgui3-gfx-core/
├── jsgui3-html/
├── jsgui3-webpage/
├── jsgui3-website/
├── jsgui3-client/
├── jsgui3-server/
├── jsgui3-designer/
├── jsgui3-own-website/
└── jsgui3-ecosystem/
```

### Installing Dependencies

Install in dependency order:

```bash
# Foundation
cd lang-mini && npm install && cd ..
cd oext && npm install && cd ..
cd lang-tools && npm install && cd ..

# Graphics
cd jsgui3-gfx-core && npm install && cd ..

# Presentation
cd jsgui3-html && npm install && cd ..
cd jsgui3-webpage && npm install && cd ..
cd jsgui3-website && npm install && cd ..

# Client & Server
cd jsgui3-client && npm install && cd ..
cd jsgui3-server && npm install && cd ..

# Applications
cd jsgui3-designer && npm install && cd ..
```

---

## Development Patterns

### Working on a Single Repo

For changes isolated to one repo:

1. **Make your change**
2. **Run tests:** `npm test`
3. **Write new tests** if needed
4. **Update documentation** if behaviour changed
5. **Commit** with descriptive message

### Working Across Repos (npm link)

For changes that span multiple repos, use `npm link`:

```bash
# Step 1: Link the source repo
cd lang-tools
npm link

# Step 2: Use it in the consumer
cd ../jsgui3-html
npm link lang-tools

# Step 3: Develop and test
npm test

# Step 4: When done, unlink
npm unlink lang-tools
npm install  # Restore published version
```

> **Warning:** Always unlink before committing or publishing. `npm link` modifies `node_modules` symlinks that shouldn't be committed.

### Creating a New Control (jsgui3-html)

1. Create file: `controls/organised/<category>/<subcategory>/my_control.js`
2. Follow the constructor pattern:
   ```javascript
   class My_Control extends Control {
       constructor(spec = {}) {
           spec.__type_name = spec.__type_name || 'my_control';
           super(spec);
           const { context } = this;
           if (!spec.el) { this._compose(); }
       }

       activate() {
           if (!this.__active) {
               super.activate();
               this._attach_events();
           }
       }
   }
   ```
3. Add to `controls/controls.js`:
   ```javascript
   My_Control: require('./organised/<category>/<subcategory>/my_control'),
   ```
4. Write E2E tests
5. Document in README or inline JSDoc

### Creating a Server Example (jsgui3-server)

1. Create directory: `examples/controls/<name>/`
2. Create `client.js` — UI definition
3. Create `server.js` — Server setup
4. Create `README.md` — Documentation
5. Follow the server startup pattern:
   ```javascript
   const Server = require('jsgui3-server');
   const { My_Control } = require('./client').controls;
   Server.serve(My_Control, { port: 8080 });
   ```

---

## Testing

### Running Tests

| Repo | Command | What It Runs |
|------|---------|-------------|
| `lang-mini` | `npm test` | Jest + legacy suites |
| `lang-mini` | `npm run test:jest` | Jest only |
| `lang-tools` | `npm test` | Jest (`--runInBand --forceExit`) |
| `lang-tools` | `npm run test:careful` | Careful runner with isolation |
| `jsgui3-html` | `npm run test:playwright:all` | Playwright E2E |
| `jsgui3-html` | `npm run test:timed` | Timed test suite |
| `jsgui3-html` | `npm run lab:run-all` | Lab experiments |
| `jsgui3-client` | `npm test` | Node test runner |
| `jsgui3-client` | `npm run test:e2e` | Puppeteer E2E |
| `jsgui3-server` | `npm test` | Full test runner |
| `jsgui3-server` | Individual `test:*` scripts | Specific test suites |
| `jsgui3-webpage` | `npm test` | Mocha |
| `jsgui3-website` | `npm test` | Mocha |
| `jsgui3-gfx-core` | `npm test` | Custom test runner |

### Writing Quick Verification Scripts

For ad-hoc testing, create throwaway scripts:

```javascript
// tmp/check_my_control.js
const jsgui = require('../html-core/html-core');
const My_Control = require('../controls/organised/.../my_control');
const ctx = new jsgui.Page_Context();

const checks = [];
function ok(label, val) { checks.push({label, pass: !!val}); }

const ctrl = new My_Control({ context: ctx });
ok('Has expected class', ctrl.html.includes('my-control'));
ok('Renders HTML', ctrl.html.length > 0);

checks.forEach(c => console.log((c.pass ? '  ✓' : '  ✗') + ' ' + c.label));
const all = checks.every(c => c.pass);
console.log(all ? '\n=== ALL PASS ✓ ===' : '\n=== SOME FAILED ✗ ===');
process.exit(all ? 0 : 1);
```

Run with: `node tmp/check_my_control.js`

---

## Lab Experiments (jsgui3-html)

The jsgui3-html repo has a lab experiment system for prototyping:

```bash
# List available experiments
npm run lab:list

# Run a specific experiment
npm run lab:run -- <experiment-name>

# Run all experiments
npm run lab:run-all
```

See `/lab-experiments` workflow for details.

---

## Publishing

### Pre-Publish Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped in `package.json`
- [ ] No temp files in repo
- [ ] No `console.log` in production code
- [ ] CHANGELOG updated (if repo has one)

### Publishing Order

Always publish bottom-up through the dependency tree:

```
1. lang-mini
2. obext
3. lang-tools
4. jsgui3-gfx-core
5. jsgui3-html
6. jsgui3-webpage
7. jsgui3-website
8. jsgui3-client
9. jsgui3-server
```

### Publishing a Package

```bash
# Ensure clean state
npm test

# Bump version
npm version patch  # or minor/major

# Publish
npm publish
```

---

## Debugging

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `JSGUI_DEBUG` | Enable verbose logging | `JSGUI_DEBUG=1 node server.js` |
| `PORT` | Override server port | `PORT=3000 node server.js` |
| `HOST` | Override server host | `HOST=127.0.0.1 node server.js` |

### Common Debug Patterns

```javascript
// Check control HTML output
const ctrl = new My_Control({ context: ctx });
console.log(ctrl.all_html_render());

// Check control tree
console.log(JSON.stringify(ctrl.toObject(), null, 2));

// Check data model state
console.log(ctrl.data.model);
```

### Server Debug Logging

```javascript
const server = new Server({
    Ctrl: My_Control,
    src_path_client_js: __dirname + '/client.js'
});

// Server emits extensive console.log during startup
server.on('ready', () => {
    console.log('Server ready');
    server.start(8080, (err) => {
        if (err) throw err;
        server.print_endpoints({ include_index: true });
    });
});
```

---

## Workspace Hygiene

### Temporary Files

- **Never** commit temp files to repos
- Use `$env:TEMP` (Windows) or `/tmp` (Unix) for transient files
- If using `tmp/` in jsgui3-html, ensure it's in `.gitignore`
- Clean up debug logging before finishing work

### Git Practices

- Write descriptive commit messages
- Reference bug IDs when fixing bugs: `Fix <BUG123>: description`
- Keep commits focused — one logical change per commit
- Don't commit `node_modules/`, IDE configs, or OS files
