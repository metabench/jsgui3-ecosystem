const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const {
    check_manifest_quality,
    check_continuation_prompt,
    check_docs,
    check_docs_viewer_inventory,
    check_docs_viewer_shell_contract,
    check_webpage_website_served_example_contract,
    check_own_website_docs_viewer_contract,
    command_available,
    run_smoke,
    summarize_smoke,
    summarize_scan
} = require('../scripts/example_smoke');

function make_fixture() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jsgui3-ecosystem-examples-'));
    fs.mkdirSync(path.join(root, 'repo'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs', 'examples'), { recursive: true });
    fs.writeFileSync(path.join(root, 'repo', 'example.js'), 'const value = 1;\nconsole.log(value);\n');
    fs.writeFileSync(path.join(root, 'repo', 'component.js'), 'class Fixture_Component {}\n');
    fs.writeFileSync(path.join(root, 'repo', 'framework.js'), 'module.exports = { framework: true };\n');
    fs.writeFileSync(path.join(root, 'repo', 'README.md'), '# Fixture docs\n');
    fs.writeFileSync(path.join(root, 'repo', 'example.test.js'), 'const assert = require("node:assert");\nassert.ok(true);\n');
    return root;
}

function multi_manifest() {
    return {
        schema_version: 1,
        generated: false,
        entries: [
            base_entry(),
            base_entry({
                id: 'webpage.composition-tests',
                owner: 'jsgui3-webpage',
                repo_path: './repo',
                title: 'Webpage Composition Tests',
                run: 'npm test',
                expected: 'Mocha validates Webpage creation and composition.'
            }),
            base_entry({
                id: 'website.resolved-model-tests',
                owner: 'jsgui3-website',
                repo_path: './repo',
                title: 'Website Resolved Model Tests',
                run: 'npm test',
                expected: 'Mocha validates Website and resolved model behavior.'
            })
        ]
    };
}

function manifest_with(entry) {
    return {
        schema_version: 1,
        generated: false,
        entries: [entry]
    };
}

function base_entry(overrides = {}) {
    return {
        id: 'fixture.example',
        owner: 'fixture-repo',
        repo_path: './repo',
        title: 'Fixture Example',
        category: 'core API',
        complexity: 'intro',
        purpose: 'Fixture example.',
        entrypoints: ['example.js'],
        run: 'node example.js',
        expected: 'Prints a value.',
        server: false,
        browser: false,
        packages: ['fixture-package'],
        related_tests: [],
        smoke: {
            type: 'syntax',
            syntax_files: ['example.js'],
            command: 'node example.js'
        },
        ...overrides
    };
}

function valid_continuation_prompt() {
    return `Continue in /mnt/c/Users/james/Documents/repos/jsgui3-ecosystem.

RECURSIVE OPERATING MODEL
Treat this prompt plus session files as serialized state.

PLANNING TURN REQUIREMENT
Create PLAN.md, WORKING_NOTES.md, and CONTINUATION_PROMPT.md if missing.

SOURCE OF TRUTH
Keep jsgui3-ecosystem as coordinator. Do not make broad sibling repo edits.

EXECUTION STATE
{
  "track": "jsgui3-ecosystem-examples",
  "phase": "fixture",
  "active_node": "fixture_node",
  "completed_nodes": [],
  "pending_nodes": ["next_node"]
}

REQUIRED WORKLOAD
1. Reconstruct state.
2. Confirm ownership.
3. Build inventory.
4. Classify examples.
5. Improve docs.
6. Improve smoke commands.
7. Add tests.
8. Run verification.

CONSTRAINTS
- Keep checks bounded.

VERIFICATION
- npm test

FINAL RESPONSE REQUIRED
Return summary, verification, Next recursive continuation prompt inline, Last 5 turns, and Horizon estimate.
`;
}

test('smoke fails clearly when a sibling repo is missing', () => {
    const root = make_fixture();
    const manifest = manifest_with(base_entry({ repo_path: './missing-repo' }));
    const result = run_smoke(root, manifest);

    assert.equal(result.ok, false);
    assert.equal(result.results[0].failures[0].code, 'missing_repo');
    assert.match(result.results[0].failures[0].message, /Missing owner repo/);
});

test('smoke fails clearly when an example entrypoint is missing', () => {
    const root = make_fixture();
    const manifest = manifest_with(base_entry({ entrypoints: ['missing.js'] }));
    const result = run_smoke(root, manifest);

    assert.equal(result.ok, false);
    assert.equal(result.results[0].failures[0].code, 'missing_entrypoint');
    assert.match(result.results[0].failures[0].message, /missing.js/);
});

test('smoke fails clearly when a declared command is unavailable', () => {
    const root = make_fixture();
    const entry = base_entry({
        smoke: {
            type: 'syntax',
            syntax_files: ['example.js'],
            command: 'missing_jsgui3_example_tool example.js'
        }
    });
    const result = run_smoke(root, manifest_with(entry));

    assert.equal(result.ok, false);
    assert.equal(result.results[0].failures[0].code, 'broken_command');
    assert.match(result.results[0].failures[0].message, /missing_jsgui3_example_tool/);
});

test('manifest quality check passes for a complete entry', () => {
    const result = check_manifest_quality(manifest_with(base_entry()));

    assert.equal(result.ok, true);
});

test('manifest quality check catches duplicate ids', () => {
    const result = check_manifest_quality({
        schema_version: 1,
        generated: false,
        entries: [
            base_entry(),
            base_entry()
        ]
    });

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'manifest_duplicate_id');
});

test('manifest quality check catches invalid classification and smoke type', () => {
    const result = check_manifest_quality(manifest_with(base_entry({
        category: 'misc',
        complexity: 'large',
        smoke: {
            type: 'browser'
        }
    })));

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'manifest_unknown_category');
    assert.match(result.failures.map((failure) => failure.code).join('\n'), /manifest_unknown_complexity/);
    assert.match(result.failures.map((failure) => failure.code).join('\n'), /manifest_unknown_smoke_type/);
});

test('docs check catches manifest entries missing from the index', () => {
    const root = make_fixture();
    fs.writeFileSync(path.join(root, 'docs', 'examples', 'INDEX.md'), '# Examples\n\nNo fixture here.\n');
    const result = check_docs(root, manifest_with(base_entry()), path.join('docs', 'examples', 'INDEX.md'));

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_missing_manifest_entry');
});

test('docs check passes when id and run command are documented', () => {
    const root = make_fixture();
    fs.writeFileSync(
        path.join(root, 'docs', 'examples', 'INDEX.md'),
        '# Examples\n\n`fixture.example` runs with `node example.js`.\n'
    );
    const result = check_docs(root, manifest_with(base_entry()), path.join('docs', 'examples', 'INDEX.md'));

    assert.equal(result.ok, true);
});

test('continuation prompt check passes for recursive state-machine handoff', () => {
    const root = make_fixture();
    const prompt_path = path.join('docs', 'sessions', 'fixture', 'CONTINUATION_PROMPT.md');
    fs.mkdirSync(path.dirname(path.join(root, prompt_path)), { recursive: true });
    fs.writeFileSync(path.join(root, prompt_path), valid_continuation_prompt());

    const result = check_continuation_prompt(root, prompt_path);

    assert.equal(result.ok, true);
});

test('continuation prompt check catches missing execution state sections', () => {
    const root = make_fixture();
    const prompt_path = path.join('docs', 'sessions', 'fixture', 'CONTINUATION_PROMPT.md');
    fs.mkdirSync(path.dirname(path.join(root, prompt_path)), { recursive: true });
    fs.writeFileSync(path.join(root, prompt_path), valid_continuation_prompt().replace('EXECUTION STATE', 'STATE'));

    const result = check_continuation_prompt(root, prompt_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'continuation_prompt_missing_section');
});

test('scan summary compacts discovered files and manifest ownership by repo', () => {
    const rows = [
        { repo: 'fixture-repo', status: 'found', path: 'examples/server.js', kind: 'server' },
        { repo: 'fixture-repo', status: 'found', path: 'examples/client.js', kind: 'client' },
        { repo: 'fixture-repo', status: 'found', path: 'docs/EXAMPLES.md', kind: 'docs' },
        { repo: 'missing-repo', status: 'missing', path: '../missing-repo', kind: 'repo' }
    ];
    const manifest = {
        entries: [
            base_entry({ owner: 'fixture-repo', category: 'integration' }),
            base_entry({ id: 'fixture.second', owner: 'fixture-repo', category: 'controls' }),
            base_entry({ id: 'missing.example', owner: 'missing-repo', category: 'server' })
        ]
    };

    const summary = summarize_scan(rows, manifest);
    const fixture = summary.find((item) => item.repo === 'fixture-repo');
    const missing = summary.find((item) => item.repo === 'missing-repo');

    assert.equal(fixture.manifest, 2);
    assert.equal(fixture.discovered, 3);
    assert.equal(fixture.server, 1);
    assert.equal(fixture.client, 1);
    assert.equal(fixture.docs, 1);
    assert.equal(fixture.status, 'present');
    assert.equal(fixture.categories, 'controls,integration');
    assert.equal(missing.manifest, 1);
    assert.equal(missing.status, 'missing');
});

test('smoke summary reports pass and fail counts by owner', () => {
    const result = {
        ok: false,
        results: [
            { ok: true, entry: base_entry({ owner: 'fixture-repo' }) },
            { ok: false, entry: base_entry({ id: 'fixture.bad', owner: 'fixture-repo' }) },
            { ok: true, entry: base_entry({ id: 'other.good', owner: 'other-repo' }) }
        ]
    };

    const summary = summarize_smoke(result);
    const fixture = summary.find((item) => item.owner === 'fixture-repo');
    const other = summary.find((item) => item.owner === 'other-repo');

    assert.equal(fixture.total, 2);
    assert.equal(fixture.pass, 1);
    assert.equal(fixture.fail, 1);
    assert.equal(fixture.status, 'fail');
    assert.equal(fixture.failures, 'fixture.bad');
    assert.equal(other.status, 'pass');
});

function docs_viewer_inventory(overrides = {}) {
    return {
        schema_version: 1,
        generated: false,
        last_smoke_policy: {
            status_values: ['pass', 'manual-pass', 'blocked', 'not_recorded']
        },
        viewer_controls: [
            { repo_path: './repo', path: 'component.js', role: 'source_view' }
        ],
        entries: [
            {
                id: 'viewer.fixture.example',
                manifest_id: 'fixture.example',
                owner_repo: 'fixture-repo',
                viewer_path: '/docs/examples/fixture.example',
                run_command: 'node example.js',
                expected_result: 'Prints a value.',
                live_preview: {
                    mode: 'server-route',
                    route: '/examples/fixture.example/',
                    status: 'planned',
                    activation: 'not_required'
                },
                docs: [
                    { repo_path: './repo', path: 'README.md', role: 'example_docs' }
                ],
                source: {
                    framework: [
                        { repo_path: './repo', path: 'framework.js', role: 'framework_source' }
                    ],
                    component: [
                        { repo_path: './repo', path: 'component.js', role: 'component_source' }
                    ],
                    example: [
                        { repo_path: './repo', path: 'example.js', role: 'example_source' }
                    ]
                },
                related_tests: [
                    { repo_path: './repo', path: 'example.test.js' }
                ],
                last_smoke: {
                    command: 'npm run smoke:examples',
                    status: 'not_recorded'
                }
            }
        ],
        deferred_manifest_ids: [
            {
                manifest_id: 'webpage.composition-tests',
                reason: 'Wait for a served Webpage example before presenting this as live docs-viewer material.'
            },
            {
                manifest_id: 'website.resolved-model-tests',
                reason: 'Wait for a served Website example before presenting this as live docs-viewer material.'
            }
        ],
        ...overrides
    };
}

function docs_viewer_shell_contract(overrides = {}) {
    return {
        schema_version: 1,
        generated: false,
        status: 'owner-implementation-contract',
        decision: 'contract-only-this-pass',
        coordination_owner: 'jsgui3-ecosystem',
        implementation_owner: 'jsgui3-server',
        implementation_owner_path: './repo',
        control_owner: 'jsgui3-html',
        owner_readiness: {
            last_checked: '2026-05-29',
            status: 'blocked_dirty_worktree',
            safe_without_owner_acceptance: false,
            status_command: 'git status --short --branch',
            dirty_core_paths: ['server.js'],
            untracked_related_paths: [],
            gate: 'Wait for owner reconciliation.'
        },
        inventory_source: 'docs/examples/docs_viewer_inventory.json',
        owner_inventory_source: '../jsgui3-ecosystem/docs/examples/docs_viewer_inventory.json',
        route_prefix: '/docs/examples',
        api_prefix: '/api/docs-viewer',
        first_runnable_path: {
            owner_repo: 'jsgui3-server',
            owner_path: 'examples/docs-viewer/server.js',
            start_command: 'node examples/docs-viewer/server.js',
            url_path: '/docs/examples',
            first_manifest_id: 'fixture.example',
            status: 'blocked_dirty_worktree',
            blocked_by: 'Wait for owner reconciliation.'
        },
        implementation_files: [
            { path: 'examples/docs-viewer/server.js', purpose: 'Start the docs viewer shell.', status: 'planned' },
            { path: 'examples/docs-viewer/docs-viewer-shell.js', purpose: 'Register docs viewer routes.', status: 'planned' },
            { path: 'examples/docs-viewer/controls/Docs_Viewer_App.js', purpose: 'Render docs viewer slots.', status: 'planned' },
            { path: 'examples/docs-viewer/client.js', purpose: 'Bundle entry.', status: 'planned' },
            { path: 'tests/docs-viewer-shell.test.js', purpose: 'Route contract tests.', status: 'planned' }
        ],
        routes: [
            { method: 'GET', path: '/docs/examples', owner_file: 'examples/docs-viewer/docs-viewer-shell.js', response: 'Index HTML.' },
            { method: 'GET', path: '/docs/examples/', owner_file: 'examples/docs-viewer/docs-viewer-shell.js', response: 'Index HTML.' },
            { method: 'GET', path: '/docs/examples/:manifest_id', owner_file: 'examples/docs-viewer/docs-viewer-shell.js', response: 'Entry HTML.' },
            { method: 'GET', path: '/api/docs-viewer/inventory', owner_file: 'examples/docs-viewer/docs-viewer-shell.js', response: 'Inventory JSON.' },
            { method: 'GET', path: '/api/docs-viewer/source', owner_file: 'examples/docs-viewer/docs-viewer-shell.js', response: 'Source text.' },
            { method: 'GET', path: '/api/docs-viewer/status', owner_file: 'examples/docs-viewer/docs-viewer-shell.js', response: 'Status JSON.' }
        ],
        source_kinds: ['docs', 'framework', 'component', 'example'],
        render_slots: [
            'docs',
            'live_preview',
            'activation_status',
            'framework_source',
            'component_source',
            'example_source',
            'run_command',
            'owner_repo',
            'smoke_status',
            'related_tests',
            'failure_panel'
        ],
        runtime_data_loading: [
            {
                source: 'docs_viewer_inventory',
                owner_file: 'examples/docs-viewer/docs-viewer-shell.js',
                rule: 'Load inventory JSON.'
            }
        ],
        required_tests: [
            {
                path: 'tests/docs-viewer-shell.test.js',
                assertions: [
                    'Inventory API returns checked fields.',
                    'Index page includes required slots.',
                    'Source API supports kind=docs, kind=framework, kind=component, and kind=example.',
                    'GET /api/docs-viewer/status returns entry counts, smoke status counts, routes, and missing refs.'
                ]
            }
        ],
        owner_validation_commands: [
            'node --check examples/docs-viewer/server.js',
            'node tests/test-runner.js --test=docs-viewer-shell.test.js'
        ],
        ecosystem_validation_commands: [
            'npm run docs:viewer:check'
        ],
        deferred_manifest_ids: [],
        ...overrides
    };
}

test('docs viewer inventory check passes for manifest-linked source metadata', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));

    const result = check_docs_viewer_inventory(root, multi_manifest(), inventory_path);

    assert.equal(result.ok, true);
});

test('docs viewer inventory check catches run command drift', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const inventory = docs_viewer_inventory({
        entries: [
            {
                ...docs_viewer_inventory().entries[0],
                run_command: 'node changed.js'
            }
        ]
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(inventory, null, 2));

    const result = check_docs_viewer_inventory(root, multi_manifest(), inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_run_command_drift');
});

test('docs viewer inventory check catches owner drift', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const inventory = docs_viewer_inventory({
        entries: [
            {
                ...docs_viewer_inventory().entries[0],
                owner_repo: 'other-repo'
            }
        ]
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(inventory, null, 2));

    const result = check_docs_viewer_inventory(root, multi_manifest(), inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_owner_drift');
});

test('docs viewer inventory check requires docs and framework source refs', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const inventory = docs_viewer_inventory({
        entries: [
            {
                ...docs_viewer_inventory().entries[0],
                docs: [],
                source: {
                    ...docs_viewer_inventory().entries[0].source,
                    framework: []
                }
            }
        ]
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(inventory, null, 2));

    const result = check_docs_viewer_inventory(root, multi_manifest(), inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_invalid_field');
    assert.match(result.failures.map((failure) => failure.message).join('\n'), /entries\[0\]\.docs/);
    assert.match(result.failures.map((failure) => failure.message).join('\n'), /entries\[0\]\.source\.framework/);
});

test('docs viewer shell contract check passes for owner route contract metadata', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(docs_viewer_shell_contract(), null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, true);
});

test('docs viewer shell contract check requires files marked implemented to exist', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        implementation_files: docs_viewer_shell_contract().implementation_files.map((file, index) => ({
            ...file,
            status: index === 0 ? 'implemented' : 'planned'
        }))
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_contract_missing_implemented_file');
});

test('docs viewer shell contract check catches missing required route', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        routes: docs_viewer_shell_contract().routes.filter((route) => route.path !== '/api/docs-viewer/source')
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_contract_missing_route');
});

test('docs viewer shell contract check requires status route test coverage', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        required_tests: [
            {
                path: 'tests/docs-viewer-shell.test.js',
                assertions: [
                    'Inventory API returns checked fields.',
                    'Index page includes required slots.',
                    'Source API supports kind=docs, kind=framework, kind=component, and kind=example.'
                ]
            }
        ]
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_contract_missing_status_route_test');
});

test('docs viewer shell contract check requires all source kinds', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        source_kinds: ['component', 'example']
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_contract_missing_source_kind');
});

test('docs viewer shell contract check requires tests for all source kinds', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        required_tests: [
            {
                path: 'tests/docs-viewer-shell.test.js',
                assertions: [
                    'Inventory API returns checked fields.',
                    'Source API returns source for kind=component and kind=example.'
                ]
            }
        ]
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_contract_missing_source_kind_test');
});

test('docs viewer shell contract check requires first runnable path metadata', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        first_runnable_path: null
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_contract_invalid_field');
});

test('docs viewer shell contract check requires dirty path evidence when owner implementation is blocked', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        owner_readiness: {
            ...docs_viewer_shell_contract().owner_readiness,
            dirty_core_paths: []
        }
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'docs_viewer_contract_missing_owner_readiness_paths');
});

function webpage_website_served_example_contract(overrides = {}) {
    return {
        schema_version: 1,
        generated: false,
        status: 'owner-implementation-contract-blocked',
        decision: 'contract-only-until-owner-worktrees-clear',
        coordination_owner: 'jsgui3-ecosystem',
        implementation_owner: 'jsgui3-server',
        implementation_owner_path: './repo',
        route_prefix: '/examples/webpage-website',
        deferred_manifest_ids: [
            'webpage.composition-tests',
            'website.resolved-model-tests'
        ],
        owner_readiness: {
            last_checked: '2026-06-04',
            status: 'blocked_dirty_worktree',
            safe_without_owner_acceptance: false,
            status_command: 'git status --short --branch',
            dirty_core_paths: ['server.js'],
            gate: 'Wait for owner reconciliation.'
        },
        model_owner_readiness: [
            {
                repo: 'jsgui3-webpage',
                repo_path: './repo',
                status: 'blocked_dirty_worktree'
            },
            {
                repo: 'jsgui3-website',
                repo_path: './repo',
                status: 'blocked_dirty_worktree'
            }
        ],
        implementation_files: [
            { path: 'examples/webpage-website/server.js', purpose: 'Start the served Webpage/Website example.' },
            { path: 'examples/webpage-website/controls/Webpage_Website_Demo.js', purpose: 'Activated demo control.' },
            { path: 'examples/webpage-website/client.js', purpose: 'Browser activation entry.' },
            { path: 'tests/webpage-website-example.test.js', purpose: 'Route contract tests.' }
        ],
        routes: [
            { method: 'GET', path: '/examples/webpage-website', response: 'Home Webpage HTML.' },
            { method: 'GET', path: '/examples/webpage-website/about', response: 'About Webpage HTML.' },
            { method: 'GET', path: '/examples/webpage-website/start', response: 'Alias to the home page.' },
            { method: 'GET', path: '/examples/webpage-website/old-about', response: 'Redirect to the about page.' },
            { method: 'GET', path: '/examples/webpage-website/api/status', response: 'JSON status endpoint.' }
        ],
        required_features: [
            'website_with_two_webpages',
            'alias_route',
            'redirect_route',
            'json_status_endpoint',
            'activated_control',
            'docs_viewer_inventory_ready'
        ],
        required_tests: [
            {
                path: 'tests/webpage-website-example.test.js',
                assertions: [
                    'GET home renders the Website and first Webpage.',
                    'GET about renders the second Webpage.',
                    'GET start follows the alias.',
                    'GET old-about redirects.',
                    'GET api/status returns JSON.',
                    'The HTML includes an activated control marker.'
                ]
            }
        ],
        owner_validation_commands: [
            'node --check examples/webpage-website/server.js',
            'node --check examples/webpage-website/client.js',
            'node tests/test-runner.js --test=webpage-website-example.test.js'
        ],
        ...overrides
    };
}

test('Webpage/Website served example contract check passes for deferred owner plan', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'webpage_website_served_example_contract.json');
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(webpage_website_served_example_contract(), null, 2));

    const result = check_webpage_website_served_example_contract(root, multi_manifest(), contract_path, inventory_path);

    assert.equal(result.ok, true);
});

test('Webpage/Website served example contract check requires deferred manifest ids', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'webpage_website_served_example_contract.json');
    const contract = webpage_website_served_example_contract({
        deferred_manifest_ids: ['webpage.composition-tests']
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_webpage_website_served_example_contract(root, multi_manifest(), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'webpage_website_contract_missing_deferred_manifest');
});

test('Webpage/Website served example contract check requires activated control feature', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'webpage_website_served_example_contract.json');
    const contract = webpage_website_served_example_contract({
        required_features: webpage_website_served_example_contract().required_features.filter((feature) => feature !== 'activated_control')
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_webpage_website_served_example_contract(root, multi_manifest(), contract_path, inventory_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'webpage_website_contract_missing_feature');
});

test('docs viewer shell contract inventory_source is path-separator tolerant', () => {
    const root = make_fixture();
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    const contract_path = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
    const contract = docs_viewer_shell_contract({
        inventory_source: 'docs\\examples\\docs_viewer_inventory.json'
    });
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify(docs_viewer_inventory(), null, 2));
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_docs_viewer_shell_contract(root, manifest_with(base_entry()), contract_path, inventory_path);

    assert.equal(result.ok, true);
});

test('command availability resolves runtime and tooling and reports missing tools', () => {
    assert.equal(command_available('node example.js').ok, true);
    assert.equal(command_available('npm start').ok, true);
    const missing = command_available('definitely_missing_jsgui3_tool_xyz example.js');
    assert.equal(missing.ok, false);
    assert.equal(missing.executable, 'definitely_missing_jsgui3_tool_xyz');
});

function own_website_docs_viewer_contract(overrides = {}) {
    return {
        schema_version: 1,
        generated: false,
        status: 'owner-implementation-contract',
        decision: 'extensive-docs-viewer-owned-by-jsgui3-own-website',
        coordination_owner: 'jsgui3-ecosystem',
        implementation_owner: 'jsgui3-own-website',
        implementation_owner_path: './repo',
        control_source_owner: 'jsgui3-html',
        route_prefix: '/',
        api_prefix: '/api/docs',
        inventory_source: 'docs/examples/docs_viewer_inventory.json',
        rendering_model: {
            ssr: 'Controls compose on the server when spec.el is absent.',
            activation: 'On the client the framework reattaches each control and calls activate(); this is activation, not hydration.',
            isomorphic_entry: 'A single client.js is passed to jsgui3-server as src_path_client_js.'
        },
        new_controls: [
            { name: 'Source_Code_Viewer', path: 'controls/Source_Code_Viewer.js', extends: 'Control', purpose: 'Read-only source pane.', ssr_compose: true, client_activation: true, status: 'planned' },
            { name: 'Docs_Viewer_Shell', path: 'controls/Docs_Viewer_Shell.js', extends: 'Active_HTML_Document', purpose: 'App shell.', ssr_compose: true, client_activation: true, status: 'planned' }
        ],
        reused_controls: [
            { name: 'Markdown_Viewer', owner: 'jsgui3-html', role: 'Docs pane.' }
        ],
        implementation_files: [
            { path: 'package.json', purpose: 'Consumer package.', status: 'planned' },
            { path: 'server.js', purpose: 'Server entry.', status: 'planned' },
            { path: 'client.js', purpose: 'Client entry.', status: 'planned' },
            { path: 'controls/Source_Code_Viewer.js', purpose: 'Source control.', status: 'planned' },
            { path: 'tests/docs-viewer.test.js', purpose: 'Tests.', status: 'planned' }
        ],
        routes: [
            { method: 'GET', path: '/', purpose: 'Landing.' },
            { method: 'GET', path: '/controls/:control_name', purpose: 'Control page.' },
            { method: 'GET', path: '/examples', purpose: 'Examples index.' },
            { method: 'GET', path: '/examples/:manifest_id', purpose: 'Example page.' },
            { method: 'GET', path: '/api/docs/inventory', purpose: 'Inventory.' },
            { method: 'GET', path: '/api/docs/source', purpose: 'Source.' },
            { method: 'GET', path: '/api/docs/control-source', purpose: 'Control source.' },
            { method: 'GET', path: '/api/docs/status', purpose: 'Status.' }
        ],
        render_panes: [
            'docs', 'live_preview', 'activation_status', 'framework_source', 'component_source',
            'example_source', 'run_command', 'owner_repo', 'smoke_status', 'related_tests', 'failure_panel'
        ],
        source_kinds: ['docs', 'framework', 'component', 'example'],
        phases: [
            { id: 'phase-1', title: 'Scaffold', status: 'in_progress', files: ['package.json'] }
        ],
        required_tests: [
            {
                path: 'tests/docs-viewer.test.js',
                assertions: [
                    'Pages render with a source-code-viewer region.',
                    'The client activation marker is set after the bundle runs.',
                    'A missing source path renders a visible failure panel.'
                ]
            }
        ],
        owner_readiness: {
            last_checked: '2026-06-06',
            status: 'clean_ready',
            status_command: 'git status --short --branch',
            safe_without_owner_acceptance: true,
            gate: 'Additive scaffolding is safe.'
        },
        owner_validation_commands: ['node --check controls/Source_Code_Viewer.js'],
        ecosystem_validation_commands: ['npm run docs:viewer:check'],
        ...overrides
    };
}

test('own-website docs viewer contract passes for complete extensive viewer metadata', () => {
    const root = make_fixture();
    const contract_path = path.join('docs', 'examples', 'own_website_docs_viewer_contract.json');
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(own_website_docs_viewer_contract(), null, 2));

    const result = check_own_website_docs_viewer_contract(root, multi_manifest(), contract_path);

    assert.equal(result.ok, true);
});

test('own-website docs viewer contract follows the inventory extensive owner role', () => {
    const root = make_fixture();
    const contract_path = path.join('docs', 'examples', 'own_website_docs_viewer_contract.json');
    const inventory_path = path.join('docs', 'examples', 'docs_viewer_inventory.json');
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(own_website_docs_viewer_contract(), null, 2));
    fs.writeFileSync(path.join(root, inventory_path), JSON.stringify({
        implementation_owner: 'jsgui3-own-website',
        implementation_owners: {
            extensive_viewer: 'different-owner',
            minimal_shell: 'jsgui3-server'
        }
    }, null, 2));

    const result = check_own_website_docs_viewer_contract(root, multi_manifest(), contract_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'own_website_contract_owner_drift');
});

test('own-website docs viewer contract catches a missing required route', () => {
    const root = make_fixture();
    const contract_path = path.join('docs', 'examples', 'own_website_docs_viewer_contract.json');
    const contract = own_website_docs_viewer_contract({
        routes: own_website_docs_viewer_contract().routes.filter((route) => route.path !== '/api/docs/status')
    });
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_own_website_docs_viewer_contract(root, multi_manifest(), contract_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'own_website_contract_missing_route');
});

test('own-website docs viewer contract rejects a hydration rendering model', () => {
    const root = make_fixture();
    const contract_path = path.join('docs', 'examples', 'own_website_docs_viewer_contract.json');
    const contract = own_website_docs_viewer_contract({
        rendering_model: {
            ssr: 'Controls compose on the server.',
            activation: 'The client performs hydration by re-rendering the virtual tree.',
            isomorphic_entry: 'A single client.js is the bundler entry.'
        }
    });
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_own_website_docs_viewer_contract(root, multi_manifest(), contract_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'own_website_contract_activation_model');
});

test('own-website docs viewer contract requires the Source_Code_Viewer control', () => {
    const root = make_fixture();
    const contract_path = path.join('docs', 'examples', 'own_website_docs_viewer_contract.json');
    const contract = own_website_docs_viewer_contract({
        new_controls: [
            { name: 'Docs_Viewer_Shell', path: 'controls/Docs_Viewer_Shell.js', extends: 'Active_HTML_Document', purpose: 'App shell.', ssr_compose: true, client_activation: true, status: 'planned' }
        ]
    });
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_own_website_docs_viewer_contract(root, multi_manifest(), contract_path);

    assert.equal(result.ok, false);
    assert.match(result.failures.map((failure) => failure.code).join('\n'), /own_website_contract_missing_source_viewer/);
});

test('own-website docs viewer contract requires seeded files to exist', () => {
    const root = make_fixture();
    const contract_path = path.join('docs', 'examples', 'own_website_docs_viewer_contract.json');
    const contract = own_website_docs_viewer_contract({
        implementation_files: [
            { path: 'package.json', purpose: 'Consumer package.', status: 'planned' },
            { path: 'server.js', purpose: 'Server entry.', status: 'planned' },
            { path: 'client.js', purpose: 'Client entry.', status: 'planned' },
            { path: 'controls/Source_Code_Viewer.js', purpose: 'Source control.', status: 'seeded' },
            { path: 'tests/docs-viewer.test.js', purpose: 'Tests.', status: 'planned' }
        ]
    });
    fs.writeFileSync(path.join(root, contract_path), JSON.stringify(contract, null, 2));

    const result = check_own_website_docs_viewer_contract(root, multi_manifest(), contract_path);

    assert.equal(result.ok, false);
    assert.equal(result.failures[0].code, 'own_website_contract_missing_seeded_file');
});
