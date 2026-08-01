# jsgui3-website — High-Level Website Specification API Plan

Status: Active proposal with partial local implementation (v0.1)
Owner: jsgui3-website
Related: [REPO_OWNERSHIP_MAP.md](REPO_OWNERSHIP_MAP.md), [API_STABILITY_POLICY.md](API_STABILITY_POLICY.md)
Canonical phase status: [jsgui3-ecosystem/docs/WEBSITE_SPEC_STATUS.md](../../jsgui3-ecosystem/docs/WEBSITE_SPEC_STATUS.md)

## 1. Purpose

Provide a single, ergonomic API for declaring an entire jsgui3 website as one
high-level specification. The API must:

- describe the whole site (identity, locales, base path, metadata),
- declare pages and route structure,
- declare elements that are shared across pages or sub-sections (header, nav,
  footer, sidebar, layout shells, theme, scripts, styles),
- compose pages from layouts + slots without manual repetition,
- remain backward compatible with the current `Website({ pages, api })` shape.

The result should make a typical small/medium site definable in a single file,
while still scaling to large sites with sectioned navigation, multiple layouts,
and locale variants.

## 2. Design Principles

1. **Declarative first.** A site is a value, not a sequence of imperative calls.
2. **Composition over duplication.** Headers, footers, navs, and layouts are
   declared once and referenced by pages.
3. **Layouts own shared structure.** A page picks a layout and fills slots.
4. **Additive, not breaking.** Existing keys (`pages`, `api`, `meta`, `assets`)
   keep working. New keys (`layouts`, `regions`, `navigation`, `sections`,
   `theme`, `defaults`) are introduced alongside them.
5. **Isomorphic and SSR-friendly.** Spec resolves to the same control tree on
   server and client; no DOM access at spec time.
6. **Stable contract.** All new top-level keys are versioned and documented;
   experimental keys live under `experimental: { ... }`.

## 2.1 Authoring Model

The API should make three layers explicit without forcing authors to think in
implementation terms:

| Layer | Author declares | Runtime resolves |
| --- | --- | --- |
| Website | identity, defaults, theme, assets, global regions | immutable site model |
| Section | layout, nav groups, meta/head defaults, path prefix | inherited section context |
| Page | route, title, body control, slot overrides, page metadata | render-ready webpage spec |

This keeps the authoring surface close to how people describe websites: "all
docs pages use the docs shell", "the footer is shared", "the blog has its own
title treatment", "this page removes the sidebar". Lower-level renderers can
still receive precise normalized data.

## 3. Top-Level Spec Shape

```js
const site = new Website({
    // Identity
    name: 'Example Site',
    description: 'A jsgui3 example site',
    base_path: '/',
    default_locale: 'en',
    locales: ['en', 'fr'],

    // Authoring and validation mode
    strict: false,                 // true turns warnings into hard errors

    // Optional shared data exposed to layout/page/region controls
    data: {
        brand: { name: 'Example Site' },
        social: { github: 'https://github.com/example' }
    },

    // Site-wide metadata + assets (existing)
    meta:   { /* og:, twitter:, robots, etc. */ },
    assets: { /* favicons, manifest, etc. */ },

    // NEW: theme + global head/body extras
    theme:  { tokens: { /* css custom props */ }, mode: 'light' },
    head:   { scripts: [...], styles: [...], links: [...] },

    // NEW: shared regions (header/footer/etc.)
    regions: { /* see §4 */ },

    // NEW: navigation model
    navigation: { /* see §5 */ },

    // NEW: named route registry, optional if pages use object form
    routes: { /* see §5.1 */ },

    // NEW: layouts (shared shells with named slots)
    layouts: { /* see §6 */ },

    // NEW: sections (sub-trees with their own layout/nav/footer overrides)
    sections: { /* see §7 */ },

    // Pages (existing key, extended to support layout/slots/section)
    pages: { /* see §8 */ },

    // Defaults applied to every page unless overridden
    defaults: {
        layout: 'default',
        section: 'main',
        meta: { /* per-page meta defaults */ }
    },

    // API endpoints (existing)
    api: { /* unchanged */ }
});
```

## 3.1 Construction and Composition API

The object literal should remain the core API, but large sites need composable
authoring helpers that do not change the normalized model.

```js
const base_site = Website.define({
    name: 'Acme',
    regions,
    layouts,
    navigation,
    defaults: { layout: 'default' }
});

const site = base_site.extend({
    sections: { docs: docs_section },
    pages: {
        ...marketing_pages,
        ...docs_pages,
        ...blog_pages
    }
});
```

Recommended helpers:

- `Website.define(spec)`: validates authoring spec and returns a `Website`.
- `site.extend(spec)`: returns a new site spec/instance with merged additions.
- `Website.section(id, spec)`: creates a section bundle with pages, nav, and
  layout defaults.
- `Website.pages(spec)`: validates a reusable page map before it is merged.

These helpers are convenience wrappers only. They must resolve to the same
plain spec shape and should not create a second configuration language.

Implementation note (2026-05-11): the first helper pass is implemented in
`jsgui3-website` as `Website.define(spec)`, `site.extend(spec)`,
`Website.section(id, spec)`, `Website.pages(spec)`, and `site.to_spec()`.
The helpers are additive wrappers over the existing constructor and resolved
model; they do not introduce a separate configuration language.

## 4. Regions (Shared UI Blocks)

A *region* is a named, reusable UI block intended to be embedded by layouts:
header, primary nav, secondary nav, footer, sidebar, breadcrumbs, banner, etc.

```js
regions: {
    header: {
        ctrl: Site_Header,
        props: { sticky: true },
        render_when: 'always'
    },
    footer: { ctrl: Site_Footer },
    primary_nav: {
        ctrl: Primary_Nav,
        bind: { items: 'navigation.primary' }
    },
    breadcrumbs: { ctrl: Breadcrumbs, bind: { trail: 'page.breadcrumbs' } }
}
```

Rules:

- A region is instantiated **once per layout slot** that references it.
- `bind` declares data taken from the resolved page/site context (read-only).
- Regions are pure UI; they do not own routes or API endpoints.
- A region may itself be composed from sub-regions via slots in its layout.

## 5. Navigation Model

Navigation is data, not markup. Controls render it; the spec describes it.

```js
navigation: {
    primary: [
        { label: 'Home',    path: '/' },
        { label: 'Docs',    path: '/docs', section: 'docs' },
        { label: 'Blog',    path: '/blog', section: 'blog' },
        { label: 'About',   path: '/about' }
    ],
    footer: {
        columns: [
            { title: 'Product', links: [ /* ... */ ] },
            { title: 'Company', links: [ /* ... */ ] }
        ]
    },
    docs_sidebar: 'auto:section=docs'   // auto-derived from pages in section
}
```

- Items may carry `section`, `external`, `locale`, `visible` (predicate),
  `match` (active-link rule).
- `'auto:...'` strings let the navigation be derived from page declarations,
  avoiding manual duplication for doc-style sites.

## 5.1 Routes and Named Links

Path strings are convenient for small sites, but named routes make navigation,
breadcrumbs, redirects, and generated links safer for larger sites.

```js
routes: {
    home:  '/',
    about: '/about',
    docs:  { path: '/docs', section: 'docs' },
    docs_start: { path: '/docs/start', section: 'docs' }
},

navigation: {
    primary: [
        { label: 'Home', route: 'home' },
        { label: 'Docs', route: 'docs' },
        { label: 'About', route: 'about' }
    ]
}
```

Rules:

- `path` remains the canonical runtime route; `route` is a stable authoring id.
- A page can declare `id: 'docs_start'`, or the id can be declared in `routes`.
- Navigation items may use either `path` or `route`, but the resolved model
  always includes both when possible.
- Route ids should be stable across URL changes so layout and navigation code
  does not need to chase every path rename.

## 5.2 Dynamic Routes (Reserved Syntax, Phase 7+)

Dynamic routes are reserved syntax in v1 so authors can plan for them without
relying on them yet. The resolver MUST recognize the syntax and produce a
clear error until dynamic-route support is finalized in a follow-up RFC.

```js
routes: {
    blog_post: { path: '/blog/:slug',           section: 'blog' },
    docs_page: { path: '/docs/:section/:page',  section: 'docs' },
    catch_all: { path: '/files/*rest' }
}
```

Normalization rules (v1):

- `:name` segments are extracted as `params[name]` (string).
- `*name` segments capture the remaining path as a single string.
- Routes with dynamic segments MUST declare a `ctrl` (no inferred body).
- `match(path)` returns `{ route, params, page, locale }` or `null`.
- A static route always wins over a dynamic route at the same depth.
- Two dynamic routes that resolve to the same shape (same segment kinds in
  order) are a hard error to prevent ambiguous matches.
- In v1, declaring a dynamic route without enabling
  `experimental.dynamic_routes: true` is a validation error rather than a
  silent stub. This keeps the surface honest about what is actually wired up.

## 6. Layouts and Slots

A *layout* is a reusable page shell. It declares which regions appear and where
the page body is injected via named slots.

```js
layouts: {
    default: {
        // Slots are filled by either a region key or a page-provided value.
        slots: ['header', 'nav', 'main', 'aside', 'footer'],
        defaults: {
            header: 'header',
            nav:    'primary_nav',
            footer: 'footer'
        },
        // Optional explicit shell control. If omitted, a default
        // jsgui3 shell control composes the slots in order.
        shell: Default_Shell
    },
    docs: {
        slots: ['header', 'nav', 'sidebar', 'main', 'footer'],
        defaults: {
            header:  'header',
            nav:     'primary_nav',
            sidebar: 'docs_sidebar',
            footer:  'footer'
        },
        shell: Docs_Shell
    },
    blank: { slots: ['main'], shell: Blank_Shell }
}
```

Resolution rules:

- A page picks a layout (or inherits from `defaults.layout` / its section).
- For each layout slot, the value is resolved in this order:
  1. Page-level `slots[<slot>]` override
  2. Section-level `slots[<slot>]` override
  3. Layout `defaults[<slot>]`
  4. Empty (slot omitted from output)
- The page's `ctrl` always fills the `main` slot unless the page explicitly
  routes its body to another slot.

### Slot Value Grammar

Slot values should be flexible enough for concise authoring but normalized into
one predictable shape before rendering:

```js
slots: {
        header: 'header',                         // region reference
        main: Page_Ctrl,                          // direct control class/factory
        aside: { ctrl: Promo_Box, props: {...} }, // inline region-like block
        footer: ['newsletter', 'footer'],         // ordered block list
        banner: (ctx) => ctx.page.is_home ? Hero_Banner : null,
        sidebar: null                            // explicit omission
}
```

Supported values:

- `string`: region key, resolved from `regions`.
- `Control class` or factory function: direct control for the slot.
- `{ ctrl, props, bind }`: inline block using the same shape as a region.
- `array`: ordered list of slot values; useful for stacked banners/footers.
- `null` / `false`: explicitly omit the slot.
- `(resolved_context) => slot_value`: late-bound conditional slot value.

All slot values normalize to `{ kind, ctrl, props, bind, children }`, so shell
controls and renderers can be simple.

### 6.1 Slot Resolution Edge Cases

The slot grammar is intentionally permissive on input and strict on output.
The normalizer MUST handle these cases without surprising the author:

| Input | Treated as | Notes |
| --- | --- | --- |
| `undefined` | inherit (next layer) | distinct from explicit omission |
| `null` / `false` | explicit omission | renders nothing; not inherited |
| `''` (empty string) | validation error | likely a typo, not an intent |
| `[]` (empty array) | explicit omission | array with no entries renders nothing |
| `[a, null, b]` | `[a, b]` | nulls inside arrays are filtered |
| nested array | flattened one level | `[[a, b], c]` -> `[a, b, c]` |
| function returning `undefined` | inherit (next layer) | late-bound inheritance is allowed |
| function returning `Promise` | error in v1 | slot resolution is sync; data goes through `bind` |
| unknown region key | hard error | typo guard; suggest closest match |
| region key whose `render_when` is false | omitted | regions may opt out without errors |

Layered precedence (page > section > layout default > empty) treats only
`undefined` as "inherit". This lets a page write `slots: { aside: null }` to
remove a region the section provided, without having to redefine the whole
layout.

For slots that accept a list (e.g., `banner`, `footer`), a section may append
to a layout default with `slots: { banner: { append: [extra_block] } }` or
replace with a plain value. The descriptor form keeps composition explicit
rather than relying on array-merging heuristics.

## 7. Sections (Grouped Pages)

A *section* is a named subset of pages that share layout, navigation, and meta
defaults (e.g., docs, blog, marketing).

```js
sections: {
    docs: {
        path_prefix: '/docs',
        layout: 'docs',
        regions: { nav: 'primary_nav', sidebar: 'docs_sidebar' },
        meta: { robots: 'index,follow' },
        navigation_group: 'docs_sidebar'
    },
    blog: {
        path_prefix: '/blog',
        layout: 'default',
        meta: { template: 'article' }
    }
}
```

Behavior:

- Pages declare `section: 'docs'` (or it is inferred from `path_prefix`).
- Section settings override site defaults but are overridden by page settings.
- Auto-navigation entries (`'auto:section=docs'`) iterate pages in the section.

## 8. Pages (Extended)

Existing forms continue to work:

```js
pages: {
    '/': Home_Ctrl,
    '/about': { ctrl: About_Ctrl, title: 'About' }
}
```

New optional fields:

```js
pages: {
    '/': {
        id: 'home',
        ctrl: Home_Ctrl,
        layout: 'default',          // override site default
        title: 'Home',
        meta: { description: '...' },
        slots: { aside: null }      // remove a slot for this page
    },
    '/docs/getting-started': {
        id: 'docs_start',
        ctrl: Getting_Started,
        section: 'docs',
        title: { en: 'Getting Started', fr: 'Démarrage' },
        nav_label: 'Getting Started',
        nav_order: 10,
        aliases: ['/docs/start'],
        redirect_from: ['/getting-started']
    }
}
```

Page resolution produces a normalized structure:

```js
{
    id, path, section, layout,
    title, meta, head,
    aliases, redirect_from,
    ctrl, slots: { header, nav, sidebar, main, aside, footer },
    context: { site, section, page, route, navigation, data },
    locale_variants: { en: {...}, fr: {...} }
}
```

### Page Authoring Shorthands

For convenience, page specs should accept progressively richer forms:

```js
pages: {
    '/': Home_Ctrl,
    '/about': ['About', About_Ctrl],
    '/contact': { title: 'Contact', ctrl: Contact_Ctrl },
    docs_start: { path: '/docs/start', section: 'docs', ctrl: Docs_Start }
}
```

The shorthand array is only an authoring form. It normalizes to the object
form. Route-like object keys without a leading slash are treated as route ids
when the object supplies `path`.

## 9. Theming and Head

`theme` lets the site declare design tokens and a default mode without coupling
to a specific theming system. It is consumed by jsgui3-html theme machinery.

```js
theme: {
    tokens: { '--brand': '#0055ff', '--radius-md': '8px' },
    mode: 'light',                // 'light' | 'dark' | 'system'
    profiles: { dark: { tokens: { '--brand': '#3b82f6' } } }
}
```

`head` lets the site declare globally-included scripts, styles, and links.
Pages and sections may add their own `head` entries; entries are merged in
deterministic order: site → section → page.

Implementation note (2026-05-11): the first low-level asset pass is wired
through `jsgui3-website` and `jsgui3-server`. `Website.assets.css` /
`Website.assets.stylesheets` and `Website.assets.js` / `Website.assets.scripts`
are carried into the resolved model and emitted automatically by
`serve_site`. Existing `Webpage.stylesheets` and `Webpage.scripts` are folded
into the page head during normalization. `serve_site` also scans the rendered
control tree for static `Ctrl.css` strings and injects them automatically, so
authors can specify controls at the high level without hand-maintaining style
tags for each page.

Activation test note (2026-05-11): `jsgui3-server/tests/client-activation.e2e.test.js`
now runs real Playwright coverage for client-side activation. It verifies that
the existing `Server({ Ctrl, src_path_client_js })` publisher emits a bundle
which imports `jsgui3-client`, runs `pre_activate`/`activate`, mutates SSR DOM
state, and handles browser click events. It also verifies the Website path:
when a `Webpage` declares `client_js`, `serve_site` bundles that entry,
registers generated JS/CSS asset routes under the mounted base path, injects
them into the page, and activates the SSR control in the browser. It also
verifies the automatic path: when a page uses module-exported controls and no
`client_js` is declared, `serve_site` now synthesizes a temporary client entry
that imports `jsgui3-client`, requires the discovered control modules,
registers the controls, bundles the entry, and activates the SSR control. The
Website resolved model carries explicit entries as `Resolved_Page.client_js`
and `Resolved_Page.client_controls`, so server renderers consume the resolved
contract rather than reaching back into author objects. Dynamic slot functions
can now provide `client_controls` metadata to register their possible browser
controls without writing a full client entry. Controls that are not directly
exported can also provide static module metadata (`client_module_path` plus an
export name/path) so the generated entry knows which browser constructor to
register. Fully implicit inference for request-dependent dynamic functions
remains out of scope because the output cannot be known safely at startup.

## 10. Resolution Pipeline

When `site.finalize()` is called:

1. Validate spec shape; throw on duplicate paths, unknown layouts, unknown
   region references, malformed locale objects.
2. Resolve site defaults (locale, layout, section, meta, head, theme).
3. For each page:
   - inherit section settings,
   - resolve layout and slot fills,
   - merge meta and head (site → section → page),
   - resolve i18n strings against `default_locale`.
4. Build navigation models, expanding `'auto:...'` references against the
   resolved page set.
5. Freeze the resolved site model so renderers can rely on stable shape.

The resolved model is what jsgui3-server consumes when serving requests.

Resolution is deterministic: the same input spec MUST produce a byte-stable
resolved model so caches, snapshots, and SSR fingerprints stay valid. Object
key order is preserved by insertion; arrays preserve author order; merges are
last-wins along the documented inheritance chain (site -> section -> page).

## 10.1 Renderer Contract

`jsgui3-website` should not become a server. Its job is to resolve the site
spec into render-ready structures. `jsgui3-server` remains responsible for
HTTP concerns.

Minimum renderer-facing API:

```js
site.resolve();                 // finalize if needed, return immutable model
site.get_page('/docs/start');    // resolved page by path
site.get_route('docs_start');    // route/page by id
site.match('/docs/start');       // route match result for server request
site.render_context(req);        // request-aware context for controls
```

`render_context(req)` should include:

- `site`: immutable resolved site model
- `section`: resolved section for the current page
- `page`: resolved page model
- `route`: route id/path/params
- `navigation`: resolved nav groups with active item hints
- `data`: site data merged with request-level data
- `locale`: requested locale with fallback to `default_locale`

This keeps layout and region controls from reaching back into the `Website`
instance directly, and it gives tests a stable object to assert against.

### 10.2 Failure Modes During Render

Resolution errors (bad spec) are surfaced eagerly at `finalize()`. Render
errors (a page `ctrl` throws, a `bind` path resolves to `undefined` when the
region required it) need a defined fallback so one bad page does not blank
the whole site:

- Each region and page ctrl is wrapped in an isolated error boundary at the
  shell level. The default boundary renders a small inline error block in
  development and a neutral empty block in production.
- `bind` paths that resolve to `undefined` pass `undefined` through. Regions
  may declare `bind_required: ['items']` to escalate to an error boundary
  instead of silently rendering empty.
- Authors can override the boundary per region via
  `regions.foo.on_error: (err, ctx) => fallback_ctrl`.
- Render errors are reported through `site.on('render_error', handler)` so
  jsgui3-server can log and respond appropriately without coupling to the
  spec shape.

## 11. Backward Compatibility

- All existing top-level keys (`name`, `description`, `base_path`,
  `default_locale`, `meta`, `assets`, `pages`, `api`) keep current semantics.
- Sites that do not declare `layouts`, `regions`, `navigation`, `sections`,
  `theme`, `head`, `defaults` behave exactly as today.
- Page values that are functions or `{ ctrl, ... }` continue to work; new
  fields are additive and optional.
- `Website.api.publish(...)` alias remains.

## 11.5 Edge Case Handling, Fallbacks & Diagnostics

The API stays small at the surface by absorbing common edge cases with
opinionated defaults. Authors only opt into stricter behavior when they want
it. Each entry below names the case, the default behavior, and the strict-mode
escalation.

### Locales and i18n

- **Missing translation for the active locale.** Fall back through:
  page-declared locale -> section default -> site `default_locale` -> first
  available key. Strict mode logs a `missing_translation` warning and, if
  `strict.i18n: 'error'`, throws.
- **i18n object that omits `default_locale`.** Use the first declared key as
  an implicit default and warn. Strict mode treats this as an error.
- **Locale unknown to the site.** `match` resolves with
  `locale = default_locale` and exposes `requested_locale` separately so
  middleware can redirect or serve a 404 as needed.
- **Mixed scalar and object values for the same field across pages.** The
  normalizer wraps scalars as `{ [default_locale]: value }` so downstream
  consumers always see the object form.

### Navigation

- **`auto:section=foo` against an empty section.** Resolves to `[]`. Regions
  bound to it must tolerate empty arrays. Strict mode warns once per build.
- **Navigation item points at an unknown route id.** Hard error in all modes;
  this is almost always a bug.
- **Navigation item points at a path that has no page.** Warning by default,
  error under `strict.navigation: true`. External links escape this rule via
  `external: true`.
- **Active-link matching ambiguity.** Default match is exact path; sections
  add `match: 'prefix'` so `/docs` stays active under `/docs/...`. Custom
  matchers (`match: (req, item) => boolean`) are allowed but must be pure.
- **Empty navigation group.** Resolves to `{ items: [] }` rather than being
  removed, so layouts can render an empty placeholder consistently.

### Pages, Sections, and Routes

- **Duplicate page paths after alias/redirect expansion.** Hard error,
  including the path that caused the collision and which entries produced it.
- **Page `id` collisions across sections.** Hard error. Authors who want
  per-section ids should namespace them (`docs.start`) rather than rely on
  scoping rules that vary by tool.
- **Section `path_prefix` collisions or overlap** (`/docs` vs `/docs/api`).
  Allowed; the more specific prefix wins for inference. Two sections with the
  same prefix are a hard error.
- **Page declares both `section` and a path under another section's prefix.**
  Honors the explicit `section`; warns about the prefix mismatch.
- **Alias / redirect chains.** Resolved transitively up to depth 8; cycles
  and depth overflow are hard errors with the full chain in the message.
- **Redirect target outside the site.** Allowed if it is an absolute URL;
  warns if it looks like a relative path that does not match any route.
- **Page `ctrl` is a string** (rare authoring mistake): treated as a route
  reference if it matches a route id, otherwise a validation error.

### Theming and Head

- **`theme.mode: 'system'` on the server.** SSR cannot read user preference,
  so the server emits both light and dark token sets behind a
  `prefers-color-scheme` selector and marks the resolved mode as `'system'`.
  Client activation may swap the active class without re-render.
- **Duplicate `head` entries.** Deduped by canonical key (`rel+href` for
  links, `name|property+content` for meta, `src` for scripts). Last write
  wins, with site < section < page precedence.
- **Conflicting `meta` (e.g., two canonical urls).** Last-wins with a warning
  that names both contributors. Strict mode promotes to an error.
- **`head.scripts` with `defer` and inline content together.** Hard error;
  caught at validation since browsers handle this inconsistently.

### Data and Bindings

- **`bind` path that does not exist.** Resolves to `undefined`. Regions can
  declare `bind_required` (see §10.2) or supply `bind_default`.
- **Site `data` mutated at runtime.** The resolved `data` is frozen; a
  separate `request_data` channel exists on `render_context(req)` for
  per-request values to keep the resolved model immutable.
- **`bind` path that crosses sections** (e.g., references another page) is
  allowed via the resolved navigation/page registries on `ctx`. Direct
  cross-page state coupling should go through `data` to keep pages testable.

### Composition and Reuse

- **`site.extend(spec)` redefines an existing region/layout/page.** Last-wins
  with a `redefined_*` warning. Strict mode requires explicit
  `override: true` on the new entry.
- **`Website.section(id, ...)` declares pages whose paths conflict with
  existing pages.** Hard error at merge time, not at section-definition time.
- **Hot reload / re-finalize.** `finalize()` is idempotent; calling it twice
  produces the same model. A future `finalize({ from: previous_model })` may
  preserve identity for live-reload diffing.

### Server / Client Parity

- **A page's `ctrl` reads `window` at construction.** The default shell wraps
  page construction in an SSR-safe sandbox; reads of forbidden globals
  during SSR throw a clear error rather than producing divergent HTML.
- **A region renders different markup on server vs client.** Detected by the
  isomorphism check in tests; the resolved model includes a `client_only`
  flag regions can set to opt out (rendered as a placeholder server-side).

### Diagnostics

The resolver emits a structured diagnostic stream rather than only throwing.
Each diagnostic carries `{ code, severity, message, where, hint }`.
`severity` is `info | warn | error`. Strict mode promotes selected codes
from `warn` to `error` (see §12.1). `site.diagnostics()` returns the frozen
list after `finalize()` so tooling and tests can assert on specific codes
(e.g., `nav.unresolved_path`, `i18n.missing_default`,
`slot.unknown_region`, `head.duplicate_canonical`).

## 12. Validation Rules (Hard Errors)

- Duplicate page paths.
- Duplicate route ids.
- Page references unknown layout, section, or region.
- Layout slot fill references unknown region.
- Slot value cannot be normalized by the slot grammar.
- Circular layout or region composition reference.
- Navigation item points to a path that does not resolve to a page (warning by
  default, error if `strict_navigation: true`).
- Navigation item references an unknown route id.
- Alias or redirect source conflicts with a real page path.
- Locale object missing `default_locale` entry (warning).
- Region declares both `ctrl` and `Ctrl` with different values.

## 12.1 Strict Mode Levels

`strict: true` is a convenience for "all warnings become errors". Larger
teams often want finer control, so `strict` also accepts an object whose
keys correspond to diagnostic groups:

```js
strict: {
    navigation: true,        // unresolved nav paths -> error
    i18n: 'error',           // missing translations -> error
    head: 'warn',            // duplicate head entries stay warnings
    composition: true,       // redefinition without override:true -> error
    slots: true              // unknown region or bad grammar -> error
}
```

Unknown strict keys are themselves a validation error so typos do not
silently disable safety. The default value (`strict: false`) keeps the
authoring experience friendly for small sites and prototypes; CI pipelines
are expected to enable group-level strictness as the site matures.

## 13. Example: Small Marketing + Docs Site

```js
const site = new Website({
    name: 'Acme',
    default_locale: 'en',
    theme: { tokens: { '--brand': '#0055ff' } },

    regions: {
        header: { ctrl: Site_Header },
        footer: { ctrl: Site_Footer },
        primary_nav: { ctrl: Primary_Nav, bind: { items: 'navigation.primary' } },
        docs_sidebar: { ctrl: Docs_Sidebar, bind: { items: 'navigation.docs_sidebar' } }
    },

    navigation: {
        primary: [
            { label: 'Home',  route: 'home' },
            { label: 'Docs',  route: 'docs' },
            { label: 'About', route: 'about' }
        ],
        docs_sidebar: 'auto:section=docs'
    },

    routes: {
        home: '/',
        about: '/about',
        docs: { path: '/docs', section: 'docs' },
        docs_start: { path: '/docs/start', section: 'docs' }
    },

    layouts: {
        default: { slots: ['header','nav','main','footer'],
                   defaults: { header:'header', nav:'primary_nav', footer:'footer' } },
        docs:    { slots: ['header','nav','sidebar','main','footer'],
                   defaults: { header:'header', nav:'primary_nav',
                               sidebar:'docs_sidebar', footer:'footer' } }
    },

    sections: {
        docs: { path_prefix: '/docs', layout: 'docs' }
    },

    defaults: { layout: 'default' },

    pages: {
        '/':           { id: 'home', ctrl: Home_Page, title: 'Acme' },
        '/about':      { id: 'about', ctrl: About_Page, title: 'About' },
        '/docs':       { id: 'docs', ctrl: Docs_Index, section: 'docs', nav_label: 'Overview' },
        '/docs/start': { id: 'docs_start', ctrl: Docs_Start, section: 'docs', nav_label: 'Getting Started' }
    },

    api: { health: () => ({ status: 'ok' }) }
});

site.finalize();
```

## 13.5 New Classes and Module Layout

This section maps the resolved spec onto concrete classes and shows the
ownership boundary between `jsgui3-website` (spec + resolution) and
`jsgui3-server` (HTTP + bundling). The resolver and the renderer are
deliberately separated so neither package needs to know the other's
internals.

### Class inventory

Owned by `jsgui3-website` (pure, no HTTP):

| Class | Role | Notes |
| --- | --- | --- |
| `Website` | Authoring entry point and instance | Existing class, extended with `regions`, `layouts`, `sections`, `navigation`, `routes`, `theme`, `head`, `defaults`, `data`, `strict`, `experimental`. |
| `Website_Spec_Validator` | Static validation of authoring spec | Produces diagnostics; runs before normalization. |
| `Website_Normalizer` | Spec -> resolved model | Pure, deterministic; emits `Resolved_Site_Model`. |
| `Resolved_Site_Model` | Frozen output of `finalize()` | Read-only graph of regions, layouts, sections, pages, routes, navigation, theme, head, data. |
| `Resolved_Page` | Per-route resolved record | Holds layout id, slot fills, head/meta merge result, locale variants, section ref. |
| `Resolved_Region` | Normalized region descriptor | `{ ctrl, props, bind, render_when, on_error }`. |
| `Resolved_Layout` | Normalized layout descriptor | `{ slots, defaults, shell }`. |
| `Resolved_Section` | Normalized section descriptor | `{ path_prefix, layout, slot_overrides, meta_defaults, head_defaults }`. |
| `Slot_Value` | Normalized slot fill | `{ kind, ctrl, props, bind, children, render_when }`. |
| `Route_Table` | Path/route id index | Backs `match`, `get_route`, `get_page`. |
| `Navigation_Model` | Resolved nav groups | Includes `auto:` expansions and active-item matchers. |
| `Theme_Model` | Tokens + mode + profiles | Drives the head theme bridge. |
| `Head_Model` | Deduped head entries | Built by `Head_Merger`. |
| `Diagnostic` | `{ code, severity, message, where, hint }` | Streamed during `finalize()`. |
| `Website_Diagnostics` | Frozen diagnostic list | Returned by `site.diagnostics()`. |

Owned by `jsgui3-html` (rendering primitives, isomorphic):

| Class | Role | Notes |
| --- | --- | --- |
| `Default_Site_Shell` | Default layout shell control | Renders an ordered slot list; used when a layout omits `shell`. |
| `Slot_Outlet` | Renders a single resolved `Slot_Value` | Handles `string` / `ctrl` / inline / array / function forms uniformly. |
| `Site_Region_Boundary` | Per-region error boundary | Implements §10.2 fallback behavior; calls `on_error` if provided. |
| `Site_Theme_Bridge` | Applies `Theme_Model` tokens | Server emits CSS, client toggles mode classes. |
| `Site_Navigation_Provider` | Exposes resolved nav groups via `bind` | Thin context provider; no DOM. |

Owned by `jsgui3-server` (HTTP, bundling, serving):

| Class | Role | Notes |
| --- | --- | --- |
| `Site_Server` | Thin facade over the existing `JSGUI_Single_Process_Server` for site-shaped inputs | Constructed by `Server.serve_site(site)`. |
| `Site_Route_Adapter` | Adapts `site.match(path)` to the server router | Wraps each `Resolved_Page` in an `HTTP_Webpage_Publisher` request. |
| `Site_Webpage_Publisher` | Subclass of `HTTP_Webpage_Publisher` | Composes the layout shell + page ctrl using the resolved model instead of a single `Ctrl`. |
| `Site_Asset_Bundle` | Aggregates per-page CSS/JS into one bundle | Reuses existing CSS/JS publishers; computed once after `finalize()`. |
| `Site_Api_Adapter` | Wires `site.api.endpoints` to `server.publish` | Replaces today's bespoke `normalize_website_endpoints` with a normalized iterator. |
| `Site_Render_Context_Builder` | Builds `render_context(req)` | Adds request-level `data`, locale negotiation, and active-link hints. |

### Module layout

```text
jsgui3-website/
    Website.js                       # extended, still the entry point
    spec/
        validator.js                 # Website_Spec_Validator
        normalizer.js                # Website_Normalizer
    model/
        resolved-site-model.js
        resolved-page.js
        resolved-region.js
        resolved-layout.js
        resolved-section.js
        slot-value.js
        route-table.js
        navigation-model.js
        theme-model.js
        head-model.js
        head-merger.js
    diagnostics/
        diagnostic.js
        website-diagnostics.js
    helpers/
        define.js                    # Website.define / extend / section / pages

jsgui3-html/
    controls/
        site/
            default-site-shell.js
            slot-outlet.js
            site-region-boundary.js
            site-theme-bridge.js
            site-navigation-provider.js

jsgui3-server/
    site/
        site-server.js
        site-route-adapter.js
        site-webpage-publisher.js
        site-asset-bundle.js
        site-api-adapter.js
        site-render-context-builder.js
    serve-factory.js                 # gains a `serve_site(site, opts)` branch
```

### Class collaboration during a request

```text
HTTP req
    -> Server router
    -> Site_Route_Adapter.match(req)
    -> Resolved_Page (from Resolved_Site_Model)
    -> Site_Render_Context_Builder.build(req, page)
    -> Site_Webpage_Publisher.render(page, ctx)
        -> Default_Site_Shell (or layout.shell)
            -> Slot_Outlet x N
                -> Site_Region_Boundary
                    -> Resolved_Region.ctrl
    -> HTML response
```

The collaboration uses the same `HTTP_Webpage_Publisher` rendering path that
already exists; it just gives the publisher a composed control tree
(`shell(slots(...))`) instead of the page's raw `Ctrl`.

## 13.6 Extending jsgui3-server: a Very Simple Site API

Goal: an author with a `Website` instance should be able to serve it with one
call, and existing single-control / `Webpage` callers should keep working.

### The minimal surface

Add one factory and one method; nothing else needs to change for users:

```js
const Server = require('jsgui3-server');
const { Website } = require('jsgui3-website');

const site = new Website({ /* see §3 */ });

// Single call. Auto-detects site shape, finalizes if needed,
// wires routes/api/assets, picks a free port if `port: 'auto'`.
Server.serve_site(site, { port: 8080 });
```

`Server.serve_site` is the ergonomic entry point. Internally it is sugar over
the existing `Server.serve` facade plus the new `Site_*` adapters.

For symmetry with the existing API, the unified `Server.serve` should also
accept a `Website` directly and dispatch to the site path:

```js
Server.serve(site, { port: 'auto' });          // same effect as serve_site
Server.serve({ site, port: 8080, debug: true }); // options-object form
```

### What `serve_site` does (in order)

1. **Detect and finalize.** If `site` is not yet finalized, call
   `site.finalize()` and surface diagnostics. Hard errors abort startup with
   a single grouped error message; warnings print once.
2. **Build the asset bundle.** `Site_Asset_Bundle` walks every
   `Resolved_Page` once, collects CSS from the layout shell + regions + page
   ctrl, and produces one shared `/css/css.css` and one `/js/js.js` (the same
   contract `HTTP_Webpage_Publisher` already expects). Per-page splitting is
   deferred to a later phase.
3. **Register routes.** For every static `Resolved_Page`, register a
   `Site_Webpage_Publisher` against the server router. Aliases register as
   thin wrappers that 200 with the canonical content; redirects register as
   3xx responders. Dynamic routes (when enabled) register a single
   pattern-matching responder backed by `site.match`.
4. **Register API.** `Site_Api_Adapter` iterates `site.api.endpoints` and
   calls `server.publish(name, fn, meta)` for each one — reusing the existing
   function publisher and OpenAPI registry without bespoke glue.
5. **Install the render-context middleware.** A single middleware computes
   `site.render_context(req)` and stashes it on `req.site_ctx`, so any
   downstream middleware or publisher can read locale, page, navigation, and
   request data without re-parsing the URL.
6. **Wire diagnostics.** `site.on('render_error', ...)` is bridged to the
   server's logger; `site.diagnostics()` becomes available on the admin UI.

### Stable, additive option keys

`serve_site(site, opts)` accepts only options the existing server already
understands plus a small site-specific set:

| Option | Purpose | Default |
| --- | --- | --- |
| `port` | HTTP port (number, `'auto'`, or `0`) | from `Server.serve` |
| `host` | Bind host | from `Server.serve` |
| `debug` | Verbose logging | `false` |
| `style` / `bundler` | Passed to existing CSS/JS publishers | unchanged |
| `middleware` | Extra middleware functions | `[]` |
| `on_diagnostics` | Callback invoked once after `finalize()` | console summary |
| `on_render_error` | Per-request render error handler | default boundary |
| `prepare_only` | Build bundle, do not start listening | `false` (useful in tests) |

No new top-level config language is introduced. Site-specific behavior lives
on the `Website` spec, not on the server options.

### Backward compatibility

- `Server.serve(Ctrl, opts)` (single control) — unchanged.
- `Server.serve(webpage, opts)` (existing `Webpage`) — unchanged.
- `Server.serve(website_like_object, opts)` — today's `is_website_like`
  branch keeps working; it now goes through `Site_Route_Adapter` when the
  object is an actual `Website` instance, and through the legacy normalizer
  for plain `{ pages, api }` shapes.
- `server.publish(name, fn, meta)` — unchanged; reused by `Site_Api_Adapter`.
- The `HTTP_Webpage_Publisher` contract (CSS/JS injection,
  `all_html_render()`, `Active_HTML_Document` wrapping) is preserved;
  `Site_Webpage_Publisher` extends it rather than replacing it.

### Why this stays simple at the surface

- **One entry point** (`Server.serve_site`) absorbs detection, finalization,
  bundling, route wiring, API wiring, and middleware setup.
- **No new config DSL** — the `Website` spec is the only authoring surface.
- **No fan-out of publishers** — the existing publisher set covers HTML,
  CSS, JS, function APIs, and assets; the site path just composes them.
- **Strictness is opt-in** through the spec's `strict` field, so prototypes
  stay friction-free while production sites can dial up safety.
- **Errors surface in one place** through the diagnostics stream and
  `on_render_error`, so operators do not chase per-page logging.

### Phased server work

| Phase | Server work |
| --- | --- |
| 7a | `Site_Route_Adapter` + `Site_Webpage_Publisher` against finalized sites; `Server.serve_site` factory; existing `is_website_like` path delegates here for `Website` instances. |
| 7b | `Site_Asset_Bundle` consolidates CSS/JS across pages; admin UI shows resolved routes and diagnostics. |
| 7c | `Site_Api_Adapter` replaces bespoke endpoint normalization; OpenAPI spec includes site metadata. |
| 7d | Dynamic-route responder (gated by `experimental.dynamic_routes`). |
| 7e | Request-level `render_context` middleware, locale negotiation, redirect/alias responders. |

Each sub-phase is independently shippable and falls back to the current
behavior if disabled.

## 14. Phased Delivery

1. **Phase 1 — Additive spec parsing:** add `layouts`, `regions`,
    `navigation`, `routes`, `sections`, `theme`, `head`, `defaults`, `data`,
    and `strict` to parsing; validate; no behavior change for existing sites.
2. **Phase 2 — Normalization model:** implement route ids, page shorthands,
    slot value grammar, aliases, redirects, and the immutable resolved model.
3. **Phase 3 — Layout resolution:** wire layouts and slot fills into the page
    render path via a default jsgui3-html shell control.
4. **Phase 4 — Navigation model:** expose resolved navigation to regions via
    `bind`; implement `'auto:...'` derivations and active-item hints.
5. **Phase 5 — Theme + head merge:** apply tokens, modes, and deterministic
    head/meta merging.
6. **Phase 6 — Section overrides + i18n resolution + strict validation.**
7. **Phase 7 — Server integration:** expose `resolve`, `get_page`,
    `get_route`, `match`, and `render_context` for jsgui3-server.
8. **Phase 8 — Docs and example site** demonstrating full spec end-to-end.

Each phase ships behind no flags but with focused tests; existing examples
must keep passing untouched.

## 15. Open Questions

- Should `regions` accept inline JSX-like control trees in addition to control
  classes? Likely yes via `compose: (ctx) => ctrl_tree`, but defer to Phase 3.
- Should layouts support nested layouts (a section layout wrapping the site
  layout)? Probably yes; design after Phase 2 lands.
- Where does access control live (per-page, per-section)? Out of scope for v1;
  expected to come from middleware in jsgui3-server.
- How are dynamic routes (`/blog/:slug`) declared? Reserved syntax; specify in
  a follow-up RFC, not in v1.

## 16. Done Criteria for v1

- Spec parses, validates, and resolves all sections, layouts, regions, slots,
    route ids, navigation, theme, and head correctly.
- Existing `Website` consumers run unchanged.
- A documented example site uses every new top-level key.
- `jsgui3-server` consumes the resolved model through `match` and
    `render_context` without bespoke per-site glue.
- Tests cover: duplicate paths, unknown references, slot resolution order,
    slot grammar normalization, section inheritance, auto navigation, route ids,
    aliases/redirect conflicts, head/meta merge order, locale resolution,
    edge cases enumerated in §11.5, strict-mode escalations from §12.1,
    deterministic resolution output, and render-time error boundaries.
- Diagnostics surface includes documented codes; strict-mode promotion of
    each code is covered by at least one test.
