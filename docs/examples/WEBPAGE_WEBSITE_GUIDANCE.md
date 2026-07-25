# Webpage And Website Example Guidance

`jsgui3-webpage` and `jsgui3-website` currently provide test-backed composition references rather than runnable example directories. Treat these as model-layer examples until a small served example is added in the owning repos.

## Webpage

Owner repo: `../jsgui3-webpage`

```bash
cd ../jsgui3-webpage
npm test
```

Minimal composition pattern:

```js
const Webpage = require('jsgui3-webpage');

const page = new Webpage({
    path: '/about',
    title: {
        en: 'About',
        fr: 'A propos'
    },
    ctrl: About_Ctrl,
    content: {
        heading: {
            en: 'About us',
            fr: 'A propos de nous'
        }
    }
});

page.get_title('fr');
page.get_string('heading', 'fr');
```

Use the owning repo tests as the current reference for path normalization, legacy `content` as `ctrl`, locale fallback, nested content resolution, finalization, JSON summaries, layout fields, slots, aliases, redirects, and client control metadata.

## Website

Owner repo: `../jsgui3-website`

```bash
cd ../jsgui3-website
npm test
```

Minimal composition pattern:

```js
const Website = require('jsgui3-website');
const Webpage = require('jsgui3-webpage');

const site = new Website({
    name: 'Docs Example',
    pages: {
        '/': new Webpage({
            path: '/',
            title: 'Home'
        }),
        '/about': {
            title: 'About',
            content: {
                heading: 'About this site'
            }
        }
    },
    apis: {
        '/api/status': {
            get: () => ({ ok: true })
        }
    }
});

site.finalize();
```

Use the owning repo tests as the current reference for `Website.define`, sections, shorthand page objects, extension, duplicate-route protection, remove/replace page behavior, structured API endpoints, method helpers, declarative resources, publish aliases, finalization, and resolved models.

## Ecosystem Wrapper Target

The first ecosystem-level runnable example for these packages should be a tiny `jsgui3-server` app that serves:

- a `Website` with two `Webpage` instances;
- an alias, a redirect, and one JSON status endpoint;
- a small activated control on at least one page;
- clear source links back to this doc and the owning repo tests.

The checked owner-side contract for that future example is `docs/examples/WEBPAGE_WEBSITE_SERVED_EXAMPLE_CONTRACT.md` and `docs/examples/webpage_website_served_example_contract.json`.

Until that exists, the manifest keeps `webpage.composition-tests` and `website.resolved-model-tests` as test-backed references instead of claiming a standalone served example.

Docs-viewer decision: these references are intentionally deferred from `docs/examples/docs_viewer_inventory.json` until the served wrapper exists. See `docs/examples/OWNERSHIP_STATUS.md`.
