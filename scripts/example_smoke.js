#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_MANIFEST = path.join('docs', 'examples', 'examples_manifest.json');
const DEFAULT_DOC = path.join('docs', 'examples', 'INDEX.md');
const DEFAULT_DOCS_VIEWER = path.join('docs', 'examples', 'docs_viewer_inventory.json');
const DEFAULT_DOCS_VIEWER_CONTRACT = path.join('docs', 'examples', 'docs_viewer_shell_contract.json');
const DEFAULT_WEBPAGE_WEBSITE_CONTRACT = path.join('docs', 'examples', 'webpage_website_served_example_contract.json');
const DEFAULT_OWN_WEBSITE_CONTRACT = path.join('docs', 'examples', 'own_website_docs_viewer_contract.json');
const DEFAULT_CONTINUATION_PROMPT = path.join(
    'docs',
    'sessions',
    '2026-05-28-jsgui3-ecosystem-examples',
    'CONTINUATION_PROMPT.md'
);

function read_json(file_path) {
    return JSON.parse(fs.readFileSync(file_path, 'utf8'));
}

function repo_root_from_manifest(manifest_path) {
    return path.resolve(path.dirname(manifest_path), '..', '..');
}

function load_manifest(manifest_path = path.resolve(DEFAULT_MANIFEST)) {
    const abs_manifest_path = path.resolve(manifest_path);
    const root = repo_root_from_manifest(abs_manifest_path);
    const manifest = read_json(abs_manifest_path);
    if (!manifest || !Array.isArray(manifest.entries)) {
        throw new Error(`Manifest must contain an entries array: ${abs_manifest_path}`);
    }
    return { root, manifest, manifest_path: abs_manifest_path };
}

function resolve_repo(root, entry) {
    return path.resolve(root, entry.repo_path || '.');
}

function file_exists(root, rel_path) {
    return fs.existsSync(path.resolve(root, rel_path));
}

function tokenize_command(command) {
    if (!command || typeof command !== 'string') return [];
    const tokens = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let match;
    while ((match = re.exec(command))) {
        tokens.push(match[1] || match[2] || match[3]);
    }
    return tokens;
}

function first_executable(command) {
    const tokens = tokenize_command(command);
    while (tokens.length > 0) {
        const token = tokens.shift();
        if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(token)) continue;
        if (token === 'cd' && tokens.length > 1) {
            tokens.shift();
            continue;
        }
        if (token === '&&' || token === ';') continue;
        return token;
    }
    return null;
}

function resolve_on_path(executable) {
    if (!executable) return null;
    if (executable.includes('/') || executable.includes('\\') || path.isAbsolute(executable)) {
        try {
            return fs.existsSync(executable) && fs.statSync(executable).isFile() ? executable : null;
        } catch (err) {
            return null;
        }
    }
    const is_windows = process.platform === 'win32';
    const path_dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
    const exts = is_windows
        ? (process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD').split(';').map((ext) => ext.trim()).filter(Boolean)
        : [''];
    for (const dir of path_dirs) {
        for (const ext of exts) {
            const candidate = path.join(dir, executable + ext);
            try {
                if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
                    return candidate;
                }
            } catch (err) {
                // Ignore unreadable PATH entries and keep scanning.
            }
        }
    }
    return null;
}

// Availability is resolved by scanning PATH (with PATHEXT on Windows so npm/npx
// resolve via npm.cmd) instead of executing the command. This is cross-platform,
// locale-independent, and avoids running anything during a pre-flight check.
function command_available(command) {
    const executable = first_executable(command);
    if (!executable) {
        return { ok: false, executable, message: 'No executable found in command.' };
    }
    if (executable === 'node') {
        return { ok: true, executable };
    }
    const resolved = resolve_on_path(executable);
    if (!resolved) {
        return { ok: false, executable, message: `Executable not found: ${executable}` };
    }
    return { ok: true, executable };
}

function unique(values) {
    return [...new Set(values.filter(Boolean))];
}

function syntax_files_for_entry(entry) {
    const smoke = entry.smoke || {};
    const syntax_files = Array.isArray(smoke.syntax_files) ? smoke.syntax_files : [];
    const js_entrypoints = (entry.entrypoints || []).filter((file) => file.endsWith('.js'));
    return unique([...syntax_files, ...js_entrypoints]);
}

function check_syntax(repo_abs, rel_file) {
    const result = spawnSync(process.execPath, ['--check', rel_file], {
        cwd: repo_abs,
        encoding: 'utf8',
        shell: false
    });
    return {
        ok: result.status === 0,
        file: rel_file,
        stdout: result.stdout || '',
        stderr: result.stderr || ''
    };
}

function check_entry(root, entry, options = {}) {
    const repo_abs = resolve_repo(root, entry);
    const failures = [];
    const details = [];

    if (!fs.existsSync(repo_abs)) {
        failures.push({
            code: 'missing_repo',
            message: `Missing owner repo for ${entry.id}: ${repo_abs}`
        });
        return { ok: false, entry, repo_abs, failures, details };
    }

    for (const rel_file of entry.entrypoints || []) {
        const abs_file = path.resolve(repo_abs, rel_file);
        if (!fs.existsSync(abs_file)) {
            failures.push({
                code: 'missing_entrypoint',
                message: `Missing entrypoint for ${entry.id}: ${abs_file}`
            });
        }
    }

    if (options.check_related_tests) {
        for (const rel_file of entry.related_tests || []) {
            const abs_file = path.resolve(repo_abs, rel_file);
            if (!fs.existsSync(abs_file)) {
                failures.push({
                    code: 'missing_related_test',
                    message: `Missing related test for ${entry.id}: ${abs_file}`
                });
            }
        }
    }

    const smoke = entry.smoke || {};
    if (options.check_commands !== false && smoke.command) {
        const command_check = command_available(smoke.command);
        if (!command_check.ok) {
            failures.push({
                code: 'broken_command',
                message: `${entry.id} has an unavailable command: ${smoke.command}. ${command_check.message}`
            });
        } else {
            details.push(`command:${command_check.executable}`);
        }
    }

    if (options.check_syntax !== false) {
        for (const rel_file of syntax_files_for_entry(entry)) {
            if (!file_exists(repo_abs, rel_file)) continue;
            const syntax = check_syntax(repo_abs, rel_file);
            if (!syntax.ok) {
                failures.push({
                    code: 'syntax_error',
                    message: `${entry.id} failed syntax check: ${path.resolve(repo_abs, rel_file)}\n${syntax.stderr || syntax.stdout}`
                });
            } else {
                details.push(`syntax:${rel_file}`);
            }
        }
    }

    if (options.run_startup && smoke.startup_command) {
        const startup_timeout_ms = positive_number(smoke.startup_timeout_ms)
            || positive_number(options.startup_timeout_ms)
            || 150000;
        const result = spawnSync(smoke.startup_command, {
            cwd: repo_abs,
            encoding: 'utf8',
            shell: true,
            timeout: startup_timeout_ms
        });
        if (result.status !== 0) {
            const error_detail = result.error ? `\n${result.error.message}` : '';
            failures.push({
                code: 'startup_command_failed',
                message: `${entry.id} startup command failed: ${smoke.startup_command}${error_detail}\n${result.stdout || ''}${result.stderr || ''}`
            });
        } else {
            details.push(`startup:${smoke.startup_command}`);
        }
    }

    return { ok: failures.length === 0, entry, repo_abs, failures, details };
}

function run_smoke(root, manifest, options = {}) {
    const results = manifest.entries.map((entry) => check_entry(root, entry, options));
    return {
        ok: results.every((result) => result.ok),
        results
    };
}

function positive_number(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function require_manifest_string(value, path_label, failures) {
    if (typeof value !== 'string' || value.length === 0) {
        failures.push({
            code: 'manifest_invalid_field',
            message: `Examples manifest requires a non-empty string at ${path_label}`
        });
        return false;
    }
    return true;
}

function require_manifest_array(value, path_label, failures, options = {}) {
    const allow_empty = options.allow_empty === true;
    if (!Array.isArray(value) || (!allow_empty && value.length === 0)) {
        failures.push({
            code: 'manifest_invalid_field',
            message: `Examples manifest requires ${allow_empty ? 'an array' : 'a non-empty array'} at ${path_label}`
        });
        return false;
    }
    return true;
}

function check_manifest_string_array(value, path_label, failures, options = {}) {
    if (!require_manifest_array(value, path_label, failures, options)) return;
    value.forEach((item, index) => {
        if (typeof item !== 'string' || item.length === 0) {
            failures.push({
                code: 'manifest_invalid_field',
                message: `Examples manifest requires a non-empty string at ${path_label}[${index}]`
            });
        } else if (options.relative_owner_file && !is_relative_owner_file(item)) {
            failures.push({
                code: 'manifest_invalid_owner_file',
                message: `Examples manifest path must be relative inside the owner repo at ${path_label}[${index}]: ${item}`
            });
        }
    });
}

function check_manifest_quality(manifest) {
    const failures = [];
    const allowed_categories = new Set([
        'core API',
        'HTML/rendering',
        'client/browser',
        'server',
        'controls',
        'integration',
        'experimental'
    ]);
    const allowed_complexities = new Set(['intro', 'intermediate', 'advanced']);
    const allowed_smoke_types = new Set(['docs', 'syntax']);
    const id_re = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
        return {
            ok: false,
            failures: [{
                code: 'manifest_invalid',
                message: 'Examples manifest must be an object.'
            }]
        };
    }
    if (manifest.schema_version !== 1) {
        failures.push({
            code: 'manifest_invalid_field',
            message: `Examples manifest schema_version must be 1; got ${manifest.schema_version}`
        });
    }
    if (typeof manifest.generated !== 'boolean') {
        failures.push({
            code: 'manifest_invalid_field',
            message: 'Examples manifest requires boolean generated field.'
        });
    }
    if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
        failures.push({
            code: 'manifest_invalid_field',
            message: 'Examples manifest requires a non-empty entries array.'
        });
        return { ok: failures.length === 0, failures };
    }

    const ids = new Set();
    manifest.entries.forEach((entry, index) => {
        const label = `entries[${index}]`;
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            failures.push({
                code: 'manifest_invalid_entry',
                message: `Examples manifest entry must be an object at ${label}`
            });
            return;
        }

        const has_id = require_manifest_string(entry.id, `${label}.id`, failures);
        if (has_id) {
            if (!id_re.test(entry.id)) {
                failures.push({
                    code: 'manifest_invalid_id',
                    message: `Examples manifest id must use lowercase letters, digits, dots, and hyphens: ${entry.id}`
                });
            }
            if (ids.has(entry.id)) {
                failures.push({
                    code: 'manifest_duplicate_id',
                    message: `Examples manifest has duplicate id: ${entry.id}`
                });
            }
            ids.add(entry.id);
        }

        require_manifest_string(entry.owner, `${label}.owner`, failures);
        const has_repo_path = require_manifest_string(entry.repo_path, `${label}.repo_path`, failures);
        if (has_repo_path && path.isAbsolute(entry.repo_path)) {
            failures.push({
                code: 'manifest_invalid_repo_path',
                message: `Examples manifest repo_path must be relative: ${entry.repo_path}`
            });
        }
        require_manifest_string(entry.title, `${label}.title`, failures);
        const has_category = require_manifest_string(entry.category, `${label}.category`, failures);
        if (has_category && !allowed_categories.has(entry.category)) {
            failures.push({
                code: 'manifest_unknown_category',
                message: `Examples manifest category for ${entry.id || label} must be one of ${[...allowed_categories].join(', ')}`
            });
        }
        const has_complexity = require_manifest_string(entry.complexity, `${label}.complexity`, failures);
        if (has_complexity && !allowed_complexities.has(entry.complexity)) {
            failures.push({
                code: 'manifest_unknown_complexity',
                message: `Examples manifest complexity for ${entry.id || label} must be one of ${[...allowed_complexities].join(', ')}`
            });
        }
        require_manifest_string(entry.purpose, `${label}.purpose`, failures);
        require_manifest_string(entry.run, `${label}.run`, failures);
        require_manifest_string(entry.expected, `${label}.expected`, failures);

        if (typeof entry.server !== 'boolean') {
            failures.push({
                code: 'manifest_invalid_field',
                message: `Examples manifest requires boolean at ${label}.server`
            });
        }
        if (typeof entry.browser !== 'boolean') {
            failures.push({
                code: 'manifest_invalid_field',
                message: `Examples manifest requires boolean at ${label}.browser`
            });
        }

        check_manifest_string_array(entry.entrypoints, `${label}.entrypoints`, failures, {
            relative_owner_file: true
        });
        check_manifest_string_array(entry.packages, `${label}.packages`, failures);
        check_manifest_string_array(entry.related_tests, `${label}.related_tests`, failures, {
            allow_empty: true,
            relative_owner_file: true
        });

        if (!entry.smoke || typeof entry.smoke !== 'object' || Array.isArray(entry.smoke)) {
            failures.push({
                code: 'manifest_invalid_field',
                message: `Examples manifest requires smoke object at ${label}.smoke`
            });
            return;
        }
        const has_smoke_type = require_manifest_string(entry.smoke.type, `${label}.smoke.type`, failures);
        if (has_smoke_type && !allowed_smoke_types.has(entry.smoke.type)) {
            failures.push({
                code: 'manifest_unknown_smoke_type',
                message: `Examples manifest smoke type for ${entry.id || label} must be one of ${[...allowed_smoke_types].join(', ')}`
            });
        }
        if (entry.smoke.type === 'syntax') {
            check_manifest_string_array(entry.smoke.syntax_files, `${label}.smoke.syntax_files`, failures, {
                relative_owner_file: true
            });
        }
        if (entry.smoke.command !== undefined) {
            require_manifest_string(entry.smoke.command, `${label}.smoke.command`, failures);
        }
        if (entry.smoke.startup_command !== undefined) {
            require_manifest_string(entry.smoke.startup_command, `${label}.smoke.startup_command`, failures);
        }
        if (entry.smoke.startup_timeout_ms !== undefined && !positive_number(entry.smoke.startup_timeout_ms)) {
            failures.push({
                code: 'manifest_invalid_field',
                message: `Examples manifest startup_timeout_ms must be a positive number at ${label}.smoke.startup_timeout_ms`
            });
        }
        if (entry.smoke.notes !== undefined && typeof entry.smoke.notes !== 'string') {
            failures.push({
                code: 'manifest_invalid_field',
                message: `Examples manifest smoke notes must be a string at ${label}.smoke.notes`
            });
        }
    });

    return { ok: failures.length === 0, failures };
}

function summarize_smoke(result) {
    const by_owner = new Map();

    function ensure(owner) {
        if (!by_owner.has(owner)) {
            by_owner.set(owner, {
                owner,
                total: 0,
                pass: 0,
                fail: 0,
                failures: []
            });
        }
        return by_owner.get(owner);
    }

    for (const item of result.results) {
        const row = ensure(item.entry.owner);
        row.total++;
        if (item.ok) {
            row.pass++;
        } else {
            row.fail++;
            row.failures.push(item.entry.id);
        }
    }

    return [...by_owner.values()]
        .sort((a, b) => a.owner.localeCompare(b.owner))
        .map((row) => ({
            ...row,
            status: row.fail === 0 ? 'pass' : 'fail',
            failures: row.failures.join(',')
        }));
}

function check_docs(root, manifest, doc_rel_path = DEFAULT_DOC) {
    const doc_abs = path.resolve(root, doc_rel_path);
    const failures = [];

    if (!fs.existsSync(doc_abs)) {
        return {
            ok: false,
            failures: [{ code: 'missing_docs_index', message: `Missing docs index: ${doc_abs}` }]
        };
    }

    const doc = fs.readFileSync(doc_abs, 'utf8');
    for (const entry of manifest.entries) {
        if (!doc.includes(entry.id)) {
            failures.push({
                code: 'docs_missing_manifest_entry',
                message: `Docs index does not mention manifest entry: ${entry.id}`
            });
        }
        if (entry.run && !doc.includes(entry.run)) {
            failures.push({
                code: 'docs_missing_run_command',
                message: `Docs index does not mention run command for ${entry.id}: ${entry.run}`
            });
        }
    }

    return { ok: failures.length === 0, failures };
}

function check_continuation_prompt(root, prompt_rel_path = DEFAULT_CONTINUATION_PROMPT) {
    const prompt_abs = path.resolve(root, prompt_rel_path);
    const failures = [];

    if (!fs.existsSync(prompt_abs)) {
        return {
            ok: false,
            failures: [{
                code: 'missing_continuation_prompt',
                message: `Missing continuation prompt: ${prompt_abs}`
            }]
        };
    }

    const prompt = fs.readFileSync(prompt_abs, 'utf8');
    const required_phrases = [
        ['continue_path', 'Continue in /mnt/c/Users/james/Documents/repos/jsgui3-ecosystem'],
        ['recursive_operating_model', 'RECURSIVE OPERATING MODEL'],
        ['planning_turn_requirement', 'PLANNING TURN REQUIREMENT'],
        ['source_of_truth', 'SOURCE OF TRUTH'],
        ['execution_state', 'EXECUTION STATE'],
        ['track', '"track": "jsgui3-ecosystem-examples"'],
        ['active_node', '"active_node"'],
        ['completed_nodes', '"completed_nodes"'],
        ['pending_nodes', '"pending_nodes"'],
        ['required_workload', 'REQUIRED WORKLOAD'],
        ['coordinator_boundary', 'Keep jsgui3-ecosystem as coordinator'],
        ['sibling_boundary', 'Do not make broad sibling'],
        ['verification', 'VERIFICATION'],
        ['final_response_required', 'FINAL RESPONSE REQUIRED'],
        ['inline_next_prompt', 'Next recursive continuation prompt inline'],
        ['last_5_turns', 'Last 5 turns'],
        ['horizon_estimate', 'Horizon estimate']
    ];

    for (const [label, phrase] of required_phrases) {
        if (!prompt.includes(phrase)) {
            failures.push({
                code: 'continuation_prompt_missing_section',
                message: `Continuation prompt is missing required ${label} text: ${phrase}`
            });
        }
    }

    const workload_start = prompt.indexOf('REQUIRED WORKLOAD');
    const workload_end = prompt.indexOf('CONSTRAINTS', workload_start);
    const workload = workload_start === -1
        ? ''
        : prompt.slice(workload_start, workload_end === -1 ? prompt.length : workload_end);
    const workload_items = workload.match(/^\d+\.\s/gm) || [];
    if (workload_items.length < 8) {
        failures.push({
            code: 'continuation_prompt_insufficient_workload',
            message: `Continuation prompt must keep a broad workload with at least 8 numbered items; found ${workload_items.length}.`
        });
    }

    return { ok: failures.length === 0, failures };
}

function require_string(value, path_label, failures) {
    if (typeof value !== 'string' || value.length === 0) {
        failures.push({
            code: 'docs_viewer_invalid_field',
            message: `Docs viewer inventory requires a non-empty string at ${path_label}`
        });
        return false;
    }
    return true;
}

function require_contract_string(value, path_label, failures) {
    if (typeof value !== 'string' || value.length === 0) {
        failures.push({
            code: 'docs_viewer_contract_invalid_field',
            message: `Docs viewer shell contract requires a non-empty string at ${path_label}`
        });
        return false;
    }
    return true;
}

function require_contract_array(value, path_label, failures) {
    if (!Array.isArray(value) || value.length === 0) {
        failures.push({
            code: 'docs_viewer_contract_invalid_field',
            message: `Docs viewer shell contract requires a non-empty array at ${path_label}`
        });
        return false;
    }
    return true;
}

function check_source_refs(root, refs, path_label, failures) {
    if (!Array.isArray(refs) || refs.length === 0) {
        failures.push({
            code: 'docs_viewer_invalid_field',
            message: `Docs viewer inventory requires at least one source reference at ${path_label}`
        });
        return;
    }

    refs.forEach((ref, index) => {
        const ref_label = `${path_label}[${index}]`;
        if (!ref || typeof ref !== 'object') {
            failures.push({
                code: 'docs_viewer_invalid_field',
                message: `Docs viewer source reference must be an object at ${ref_label}`
            });
            return;
        }
        const has_repo = require_string(ref.repo_path, `${ref_label}.repo_path`, failures);
        const has_path = require_string(ref.path, `${ref_label}.path`, failures);
        if (has_repo && has_path) {
            const abs_file = path.resolve(root, ref.repo_path, ref.path);
            if (!fs.existsSync(abs_file)) {
                failures.push({
                    code: 'docs_viewer_missing_source',
                    message: `Docs viewer source reference does not exist at ${ref_label}: ${abs_file}`
                });
            }
        }
    });
}

function check_docs_viewer_inventory(root, manifest, inventory_rel_path = DEFAULT_DOCS_VIEWER) {
    const inventory_abs = path.resolve(root, inventory_rel_path);
    const failures = [];

    if (!fs.existsSync(inventory_abs)) {
        return {
            ok: false,
            failures: [{ code: 'missing_docs_viewer_inventory', message: `Missing docs viewer inventory: ${inventory_abs}` }]
        };
    }

    const inventory = read_json(inventory_abs);
    if (!inventory || !Array.isArray(inventory.entries)) {
        return {
            ok: false,
            failures: [{ code: 'docs_viewer_invalid_inventory', message: `Docs viewer inventory must contain an entries array: ${inventory_abs}` }]
        };
    }

    const manifest_by_id = new Map(manifest.entries.map((entry) => [entry.id, entry]));
    const allowed_smoke_statuses = new Set(
        Array.isArray(inventory.last_smoke_policy && inventory.last_smoke_policy.status_values)
            ? inventory.last_smoke_policy.status_values
            : []
    );

    if (Array.isArray(inventory.viewer_controls)) {
        check_source_refs(root, inventory.viewer_controls, 'viewer_controls', failures);
    }

    if (Array.isArray(inventory.deferred_manifest_ids)) {
        inventory.deferred_manifest_ids.forEach((item, index) => {
            const manifest_id = item && typeof item === 'object' ? item.manifest_id : item;
            if (typeof manifest_id !== 'string' || manifest_id.length === 0) {
                failures.push({
                    code: 'docs_viewer_invalid_field',
                    message: `Docs viewer deferred manifest id must be a string at deferred_manifest_ids[${index}]`
                });
            } else if (!manifest_by_id.has(manifest_id)) {
                failures.push({
                    code: 'docs_viewer_unknown_manifest_entry',
                    message: `Docs viewer deferred list references an unknown manifest entry: ${manifest_id}`
                });
            }
        });
    }

    inventory.entries.forEach((entry, index) => {
        const label = `entries[${index}]`;
        if (!entry || typeof entry !== 'object') {
            failures.push({
                code: 'docs_viewer_invalid_entry',
                message: `Docs viewer entry must be an object at ${label}`
            });
            return;
        }

        require_string(entry.id, `${label}.id`, failures);
        const has_manifest_id = require_string(entry.manifest_id, `${label}.manifest_id`, failures);
        require_string(entry.owner_repo, `${label}.owner_repo`, failures);
        require_string(entry.viewer_path, `${label}.viewer_path`, failures);
        require_string(entry.run_command, `${label}.run_command`, failures);
        require_string(entry.expected_result, `${label}.expected_result`, failures);

        const manifest_entry = has_manifest_id ? manifest_by_id.get(entry.manifest_id) : null;
        if (has_manifest_id && !manifest_entry) {
            failures.push({
                code: 'docs_viewer_unknown_manifest_entry',
                message: `Docs viewer entry references an unknown manifest entry: ${entry.manifest_id}`
            });
        }
        if (manifest_entry && entry.run_command !== manifest_entry.run) {
            failures.push({
                code: 'docs_viewer_run_command_drift',
                message: `Docs viewer run command drift for ${entry.manifest_id}: expected "${manifest_entry.run}", got "${entry.run_command}"`
            });
        }
        if (manifest_entry && entry.owner_repo !== manifest_entry.owner) {
            failures.push({
                code: 'docs_viewer_owner_drift',
                message: `Docs viewer owner drift for ${entry.manifest_id}: expected "${manifest_entry.owner}", got "${entry.owner_repo}"`
            });
        }
        if (manifest_entry && entry.expected_result !== manifest_entry.expected) {
            failures.push({
                code: 'docs_viewer_expected_result_drift',
                message: `Docs viewer expected result drift for ${entry.manifest_id}: expected "${manifest_entry.expected}", got "${entry.expected_result}"`
            });
        }

        if (!entry.live_preview || typeof entry.live_preview !== 'object') {
            failures.push({
                code: 'docs_viewer_invalid_field',
                message: `Docs viewer inventory requires live_preview object at ${label}.live_preview`
            });
        } else {
            require_string(entry.live_preview.status, `${label}.live_preview.status`, failures);
            require_string(entry.live_preview.mode, `${label}.live_preview.mode`, failures);
            require_string(entry.live_preview.route, `${label}.live_preview.route`, failures);
            require_string(entry.live_preview.activation, `${label}.live_preview.activation`, failures);
        }

        check_source_refs(root, entry.docs, `${label}.docs`, failures);

        const source = entry.source || {};
        check_source_refs(root, source.framework, `${label}.source.framework`, failures);
        check_source_refs(root, source.component, `${label}.source.component`, failures);
        check_source_refs(root, source.example, `${label}.source.example`, failures);

        if (!Array.isArray(entry.related_tests)) {
            failures.push({
                code: 'docs_viewer_invalid_field',
                message: `Docs viewer inventory requires related_tests array at ${label}.related_tests`
            });
        } else {
            check_source_refs(root, entry.related_tests, `${label}.related_tests`, failures);
        }

        if (!entry.last_smoke || typeof entry.last_smoke !== 'object') {
            failures.push({
                code: 'docs_viewer_invalid_field',
                message: `Docs viewer inventory requires last_smoke object at ${label}.last_smoke`
            });
        } else {
            require_string(entry.last_smoke.command, `${label}.last_smoke.command`, failures);
            require_string(entry.last_smoke.status, `${label}.last_smoke.status`, failures);
            if (allowed_smoke_statuses.size > 0 && !allowed_smoke_statuses.has(entry.last_smoke.status)) {
                failures.push({
                    code: 'docs_viewer_invalid_smoke_status',
                    message: `Docs viewer last_smoke status for ${entry.manifest_id} must be one of ${[...allowed_smoke_statuses].join(', ')}`
                });
            }
        }
    });

    return { ok: failures.length === 0, failures };
}

function is_relative_owner_file(file_path) {
    if (typeof file_path !== 'string' || file_path.length === 0) return false;
    if (path.isAbsolute(file_path)) return false;
    return !file_path.split(/[\\/]/).includes('..');
}

function check_owner_file_path(file_path, path_label, failures) {
    if (!require_contract_string(file_path, path_label, failures)) return false;
    if (!is_relative_owner_file(file_path)) {
        failures.push({
            code: 'docs_viewer_contract_invalid_owner_file',
            message: `Docs viewer shell contract owner file must be a relative path inside the owner repo at ${path_label}: ${file_path}`
        });
        return false;
    }
    return true;
}

function check_docs_viewer_shell_contract(
    root,
    manifest,
    contract_rel_path = DEFAULT_DOCS_VIEWER_CONTRACT,
    inventory_rel_path = DEFAULT_DOCS_VIEWER
) {
    const contract_abs = path.resolve(root, contract_rel_path);
    const failures = [];

    if (!fs.existsSync(contract_abs)) {
        return {
            ok: false,
            failures: [{
                code: 'missing_docs_viewer_shell_contract',
                message: `Missing docs viewer shell contract: ${contract_abs}`
            }]
        };
    }

    const contract = read_json(contract_abs);
    if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
        return {
            ok: false,
            failures: [{
                code: 'docs_viewer_contract_invalid',
                message: `Docs viewer shell contract must be an object: ${contract_abs}`
            }]
        };
    }

    const manifest_entries = manifest && Array.isArray(manifest.entries) ? manifest.entries : [];
    const manifest_by_id = new Map(manifest_entries.map((entry) => [entry.id, entry]));

    require_contract_string(contract.status, 'status', failures);
    require_contract_string(contract.decision, 'decision', failures);
    require_contract_string(contract.coordination_owner, 'coordination_owner', failures);
    require_contract_string(contract.implementation_owner, 'implementation_owner', failures);
    const has_owner_path = require_contract_string(contract.implementation_owner_path, 'implementation_owner_path', failures);
    require_contract_string(contract.inventory_source, 'inventory_source', failures);
    require_contract_string(contract.owner_inventory_source, 'owner_inventory_source', failures);
    require_contract_string(contract.route_prefix, 'route_prefix', failures);
    require_contract_string(contract.api_prefix, 'api_prefix', failures);

    if (!contract.first_runnable_path || typeof contract.first_runnable_path !== 'object' || Array.isArray(contract.first_runnable_path)) {
        failures.push({
            code: 'docs_viewer_contract_invalid_field',
            message: 'Docs viewer shell contract requires first_runnable_path object'
        });
    } else {
        const first = contract.first_runnable_path;
        require_contract_string(first.owner_repo, 'first_runnable_path.owner_repo', failures);
        require_contract_string(first.owner_path, 'first_runnable_path.owner_path', failures);
        require_contract_string(first.start_command, 'first_runnable_path.start_command', failures);
        require_contract_string(first.url_path, 'first_runnable_path.url_path', failures);
        require_contract_string(first.first_manifest_id, 'first_runnable_path.first_manifest_id', failures);
        require_contract_string(first.status, 'first_runnable_path.status', failures);
        require_contract_string(first.blocked_by, 'first_runnable_path.blocked_by', failures);
        if (first.owner_repo && contract.implementation_owner && first.owner_repo !== contract.implementation_owner) {
            failures.push({
                code: 'docs_viewer_contract_owner_drift',
                message: `Docs viewer first runnable owner drift: expected ${contract.implementation_owner}, got ${first.owner_repo}`
            });
        }
        if (first.owner_path && !is_relative_owner_file(first.owner_path)) {
            failures.push({
                code: 'docs_viewer_contract_invalid_owner_file',
                message: `Docs viewer first runnable owner_path must be relative inside owner repo: ${first.owner_path}`
            });
        }
        if (first.first_manifest_id && !manifest_by_id.has(first.first_manifest_id)) {
            failures.push({
                code: 'docs_viewer_contract_unknown_manifest_entry',
                message: `Docs viewer first runnable path references an unknown manifest entry: ${first.first_manifest_id}`
            });
        }
    }

    if (!contract.owner_readiness || typeof contract.owner_readiness !== 'object' || Array.isArray(contract.owner_readiness)) {
        failures.push({
            code: 'docs_viewer_contract_invalid_field',
            message: 'Docs viewer shell contract requires owner_readiness object'
        });
    } else {
        const readiness = contract.owner_readiness;
        require_contract_string(readiness.last_checked, 'owner_readiness.last_checked', failures);
        require_contract_string(readiness.status, 'owner_readiness.status', failures);
        require_contract_string(readiness.status_command, 'owner_readiness.status_command', failures);
        require_contract_string(readiness.gate, 'owner_readiness.gate', failures);
        if (typeof readiness.safe_without_owner_acceptance !== 'boolean') {
            failures.push({
                code: 'docs_viewer_contract_invalid_field',
                message: 'Docs viewer shell contract requires boolean at owner_readiness.safe_without_owner_acceptance'
            });
        }
        const dirty_core_paths = readiness.dirty_core_paths;
        if (readiness.safe_without_owner_acceptance === false) {
            if (!Array.isArray(dirty_core_paths) || dirty_core_paths.length === 0) {
                failures.push({
                    code: 'docs_viewer_contract_missing_owner_readiness_paths',
                    message: 'Docs viewer shell contract must list dirty_core_paths when owner implementation is blocked'
                });
            } else {
                dirty_core_paths.forEach((dirty_path, index) => {
                    if (!is_relative_owner_file(dirty_path)) {
                        failures.push({
                            code: 'docs_viewer_contract_invalid_owner_file',
                            message: `Docs viewer shell contract dirty_core_paths[${index}] must be a relative owner path: ${dirty_path}`
                        });
                    }
                });
            }
        }
        if (readiness.untracked_related_paths !== undefined) {
            if (!Array.isArray(readiness.untracked_related_paths)) {
                failures.push({
                    code: 'docs_viewer_contract_invalid_field',
                    message: 'Docs viewer shell contract owner_readiness.untracked_related_paths must be an array when present'
                });
            } else {
                readiness.untracked_related_paths.forEach((dirty_path, index) => {
                    if (!is_relative_owner_file(dirty_path)) {
                        failures.push({
                            code: 'docs_viewer_contract_invalid_owner_file',
                            message: `Docs viewer shell contract untracked_related_paths[${index}] must be a relative owner path: ${dirty_path}`
                        });
                    }
                });
            }
        }
    }

    let owner_abs = null;
    if (has_owner_path) {
        owner_abs = path.resolve(root, contract.implementation_owner_path);
        if (!fs.existsSync(owner_abs)) {
            failures.push({
                code: 'docs_viewer_contract_missing_owner_repo',
                message: `Docs viewer shell contract implementation owner repo does not exist: ${owner_abs}`
            });
        }
    }

    const inventory_abs = path.resolve(root, inventory_rel_path);
    if (fs.existsSync(inventory_abs)) {
        const inventory = read_json(inventory_abs);
        const expected_minimal_owner = inventory
            && inventory.implementation_owners
            && inventory.implementation_owners.minimal_shell
            ? inventory.implementation_owners.minimal_shell
            : (inventory && inventory.implementation_owner);
        if (expected_minimal_owner && contract.implementation_owner !== expected_minimal_owner) {
            failures.push({
                code: 'docs_viewer_contract_owner_drift',
                message: `Docs viewer shell contract owner drift: inventory expects ${expected_minimal_owner}, contract has ${contract.implementation_owner}`
            });
        }
    }

    const expected_inventory_source = inventory_rel_path.replace(/\\/g, '/');
    const actual_inventory_source = typeof contract.inventory_source === 'string'
        ? contract.inventory_source.replace(/\\/g, '/')
        : contract.inventory_source;
    if (actual_inventory_source !== expected_inventory_source) {
        failures.push({
            code: 'docs_viewer_contract_inventory_drift',
            message: `Docs viewer shell contract inventory_source must be ${expected_inventory_source}, got ${contract.inventory_source}`
        });
    }

    const allowed_implementation_statuses = new Set(['planned', 'in_progress', 'implemented', 'parked']);
    if (require_contract_array(contract.implementation_files, 'implementation_files', failures)) {
        contract.implementation_files.forEach((file, index) => {
            const label = `implementation_files[${index}]`;
            if (!file || typeof file !== 'object' || Array.isArray(file)) {
                failures.push({
                    code: 'docs_viewer_contract_invalid_field',
                    message: `Docs viewer shell contract implementation file must be an object at ${label}`
                });
                return;
            }
            const valid_path = check_owner_file_path(file.path, `${label}.path`, failures);
            require_contract_string(file.purpose, `${label}.purpose`, failures);
            const has_status = require_contract_string(file.status, `${label}.status`, failures);
            if (has_status && !allowed_implementation_statuses.has(file.status)) {
                failures.push({
                    code: 'docs_viewer_contract_invalid_implementation_status',
                    message: `Docs viewer shell implementation status must be one of ${[...allowed_implementation_statuses].join(', ')} at ${label}`
                });
            }
            if (owner_abs && valid_path && file.status === 'implemented') {
                const implementation_abs = path.resolve(owner_abs, file.path);
                if (!fs.existsSync(implementation_abs)) {
                    failures.push({
                        code: 'docs_viewer_contract_missing_implemented_file',
                        message: `Docs viewer shell contract marks ${label} as implemented but the owner file does not exist: ${implementation_abs}`
                    });
                }
            }
        });
    }

    const required_route_keys = [
        'GET /docs/examples',
        'GET /docs/examples/',
        'GET /docs/examples/:manifest_id',
        'GET /api/docs-viewer/inventory',
        'GET /api/docs-viewer/source',
        'GET /api/docs-viewer/status'
    ];
    const route_keys = new Set();
    if (require_contract_array(contract.routes, 'routes', failures)) {
        contract.routes.forEach((route, index) => {
            const label = `routes[${index}]`;
            if (!route || typeof route !== 'object' || Array.isArray(route)) {
                failures.push({
                    code: 'docs_viewer_contract_invalid_field',
                    message: `Docs viewer shell contract route must be an object at ${label}`
                });
                return;
            }
            const has_method = require_contract_string(route.method, `${label}.method`, failures);
            const has_path = require_contract_string(route.path, `${label}.path`, failures);
            check_owner_file_path(route.owner_file, `${label}.owner_file`, failures);
            require_contract_string(route.response, `${label}.response`, failures);
            if (has_method && has_path) {
                const method = route.method.toUpperCase();
                route_keys.add(`${method} ${route.path}`);
                const route_prefix = contract.route_prefix || '/docs/examples';
                const api_prefix = contract.api_prefix || '/api/docs-viewer';
                if (!route.path.startsWith(route_prefix) && !route.path.startsWith(api_prefix)) {
                    failures.push({
                        code: 'docs_viewer_contract_route_outside_prefix',
                        message: `Docs viewer shell contract route is outside route_prefix/api_prefix at ${label}: ${route.path}`
                    });
                }
            }
        });
    }
    for (const key of required_route_keys) {
        if (!route_keys.has(key)) {
            failures.push({
                code: 'docs_viewer_contract_missing_route',
                message: `Docs viewer shell contract is missing required route: ${key}`
            });
        }
    }

    const required_source_kinds = ['docs', 'framework', 'component', 'example'];
    const source_kind_set = new Set(Array.isArray(contract.source_kinds) ? contract.source_kinds : []);
    if (require_contract_array(contract.source_kinds, 'source_kinds', failures)) {
        for (const kind of required_source_kinds) {
            if (!source_kind_set.has(kind)) {
                failures.push({
                    code: 'docs_viewer_contract_missing_source_kind',
                    message: `Docs viewer shell contract is missing required source kind: ${kind}`
                });
            }
        }
    }

    const required_slots = [
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
    ];
    const slot_set = new Set(Array.isArray(contract.render_slots) ? contract.render_slots : []);
    if (!require_contract_array(contract.render_slots, 'render_slots', failures)) {
        // The missing-array failure is enough here.
    } else {
        for (const slot of required_slots) {
            if (!slot_set.has(slot)) {
                failures.push({
                    code: 'docs_viewer_contract_missing_slot',
                    message: `Docs viewer shell contract is missing required render slot: ${slot}`
                });
            }
        }
    }

    if (require_contract_array(contract.runtime_data_loading, 'runtime_data_loading', failures)) {
        contract.runtime_data_loading.forEach((rule, index) => {
            const label = `runtime_data_loading[${index}]`;
            if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
                failures.push({
                    code: 'docs_viewer_contract_invalid_field',
                    message: `Docs viewer shell contract runtime data rule must be an object at ${label}`
                });
                return;
            }
            require_contract_string(rule.source, `${label}.source`, failures);
            check_owner_file_path(rule.owner_file, `${label}.owner_file`, failures);
            require_contract_string(rule.rule, `${label}.rule`, failures);
        });
    }

    if (require_contract_array(contract.required_tests, 'required_tests', failures)) {
        const test_paths = new Set();
        const assertion_text = [];
        contract.required_tests.forEach((test_ref, index) => {
            const label = `required_tests[${index}]`;
            if (!test_ref || typeof test_ref !== 'object' || Array.isArray(test_ref)) {
                failures.push({
                    code: 'docs_viewer_contract_invalid_field',
                    message: `Docs viewer shell contract required test must be an object at ${label}`
                });
                return;
            }
            if (check_owner_file_path(test_ref.path, `${label}.path`, failures)) {
                test_paths.add(test_ref.path);
            }
            if (require_contract_array(test_ref.assertions, `${label}.assertions`, failures)) {
                test_ref.assertions.forEach((assertion, assertion_index) => {
                    if (typeof assertion !== 'string' || assertion.length === 0) {
                        failures.push({
                            code: 'docs_viewer_contract_invalid_field',
                            message: `Docs viewer shell contract assertion must be a non-empty string at ${label}.assertions[${assertion_index}]`
                        });
                    } else {
                        assertion_text.push(assertion);
                    }
                });
            }
        });
        if (!test_paths.has('tests/docs-viewer-shell.test.js')) {
            failures.push({
                code: 'docs_viewer_contract_missing_test',
                message: 'Docs viewer shell contract must require tests/docs-viewer-shell.test.js'
            });
        }
        const assertions_joined = assertion_text.join('\n');
        for (const kind of required_source_kinds) {
            if (!assertions_joined.includes(`kind=${kind}`)) {
                failures.push({
                    code: 'docs_viewer_contract_missing_source_kind_test',
                    message: `Docs viewer shell contract required tests must cover source API kind=${kind}`
                });
            }
        }
        if (!assertions_joined.includes('/api/docs-viewer/status')) {
            failures.push({
                code: 'docs_viewer_contract_missing_status_route_test',
                message: 'Docs viewer shell contract required tests must cover /api/docs-viewer/status'
            });
        }
    }

    if (require_contract_array(contract.owner_validation_commands, 'owner_validation_commands', failures)) {
        const owner_commands = contract.owner_validation_commands.join('\n');
        if (!owner_commands.includes('docs-viewer-shell.test.js')) {
            failures.push({
                code: 'docs_viewer_contract_missing_validation_command',
                message: 'Docs viewer shell contract owner validation commands must include docs-viewer-shell.test.js'
            });
        }
    }
    if (require_contract_array(contract.ecosystem_validation_commands, 'ecosystem_validation_commands', failures)) {
        if (!contract.ecosystem_validation_commands.includes('npm run docs:viewer:check')) {
            failures.push({
                code: 'docs_viewer_contract_missing_validation_command',
                message: 'Docs viewer shell contract ecosystem validation commands must include npm run docs:viewer:check'
            });
        }
    }

    if (Array.isArray(contract.deferred_manifest_ids)) {
        for (const manifest_id of contract.deferred_manifest_ids) {
            if (typeof manifest_id !== 'string' || manifest_id.length === 0) {
                failures.push({
                    code: 'docs_viewer_contract_invalid_field',
                    message: 'Docs viewer shell contract deferred_manifest_ids must contain strings'
                });
            } else if (!manifest_by_id.has(manifest_id)) {
                failures.push({
                    code: 'docs_viewer_contract_unknown_manifest_entry',
                    message: `Docs viewer shell contract defers an unknown manifest entry: ${manifest_id}`
                });
            }
        }
    }

    return { ok: failures.length === 0, failures };
}

function check_webpage_website_served_example_contract(
    root,
    manifest,
    contract_rel_path = DEFAULT_WEBPAGE_WEBSITE_CONTRACT,
    inventory_rel_path = DEFAULT_DOCS_VIEWER
) {
    const contract_abs = path.resolve(root, contract_rel_path);
    const failures = [];

    if (!fs.existsSync(contract_abs)) {
        return {
            ok: false,
            failures: [{
                code: 'missing_webpage_website_contract',
                message: `Missing Webpage/Website served example contract: ${contract_abs}`
            }]
        };
    }

    const contract = read_json(contract_abs);
    if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
        return {
            ok: false,
            failures: [{
                code: 'webpage_website_contract_invalid',
                message: `Webpage/Website served example contract must be an object: ${contract_abs}`
            }]
        };
    }

    const manifest_entries = manifest && Array.isArray(manifest.entries) ? manifest.entries : [];
    const manifest_by_id = new Map(manifest_entries.map((entry) => [entry.id, entry]));

    require_contract_string(contract.status, 'webpage_website.status', failures);
    require_contract_string(contract.decision, 'webpage_website.decision', failures);
    require_contract_string(contract.coordination_owner, 'webpage_website.coordination_owner', failures);
    require_contract_string(contract.implementation_owner, 'webpage_website.implementation_owner', failures);
    const has_owner_path = require_contract_string(contract.implementation_owner_path, 'webpage_website.implementation_owner_path', failures);
    require_contract_string(contract.route_prefix, 'webpage_website.route_prefix', failures);

    if (has_owner_path) {
        const owner_abs = path.resolve(root, contract.implementation_owner_path);
        if (!fs.existsSync(owner_abs)) {
            failures.push({
                code: 'webpage_website_contract_missing_owner_repo',
                message: `Webpage/Website served example owner repo does not exist: ${owner_abs}`
            });
        }
    }

    const required_deferred_ids = ['webpage.composition-tests', 'website.resolved-model-tests'];
    const deferred_ids = new Set(Array.isArray(contract.deferred_manifest_ids) ? contract.deferred_manifest_ids : []);
    if (require_contract_array(contract.deferred_manifest_ids, 'webpage_website.deferred_manifest_ids', failures)) {
        for (const id of contract.deferred_manifest_ids) {
            if (typeof id !== 'string' || id.length === 0) {
                failures.push({
                    code: 'webpage_website_contract_invalid_field',
                    message: 'Webpage/Website served example deferred_manifest_ids must contain strings'
                });
            } else if (!manifest_by_id.has(id)) {
                failures.push({
                    code: 'webpage_website_contract_unknown_manifest_entry',
                    message: `Webpage/Website served example contract references an unknown manifest entry: ${id}`
                });
            }
        }
        for (const id of required_deferred_ids) {
            if (!deferred_ids.has(id)) {
                failures.push({
                    code: 'webpage_website_contract_missing_deferred_manifest',
                    message: `Webpage/Website served example contract must defer manifest entry until served: ${id}`
                });
            }
        }
    }

    const inventory_abs = path.resolve(root, inventory_rel_path);
    if (fs.existsSync(inventory_abs)) {
        const inventory = read_json(inventory_abs);
        const inventory_deferred = new Set(
            Array.isArray(inventory.deferred_manifest_ids)
                ? inventory.deferred_manifest_ids.map((item) => item && typeof item === 'object' ? item.manifest_id : item)
                : []
        );
        for (const id of required_deferred_ids) {
            if (!inventory_deferred.has(id)) {
                failures.push({
                    code: 'webpage_website_contract_inventory_drift',
                    message: `Docs viewer inventory must keep ${id} deferred until the Webpage/Website served example exists`
                });
            }
        }
    }

    if (!contract.owner_readiness || typeof contract.owner_readiness !== 'object' || Array.isArray(contract.owner_readiness)) {
        failures.push({
            code: 'webpage_website_contract_invalid_field',
            message: 'Webpage/Website served example contract requires owner_readiness object'
        });
    } else {
        const readiness = contract.owner_readiness;
        require_contract_string(readiness.last_checked, 'webpage_website.owner_readiness.last_checked', failures);
        require_contract_string(readiness.status, 'webpage_website.owner_readiness.status', failures);
        require_contract_string(readiness.status_command, 'webpage_website.owner_readiness.status_command', failures);
        require_contract_string(readiness.gate, 'webpage_website.owner_readiness.gate', failures);
        if (typeof readiness.safe_without_owner_acceptance !== 'boolean') {
            failures.push({
                code: 'webpage_website_contract_invalid_field',
                message: 'Webpage/Website served example contract requires boolean at owner_readiness.safe_without_owner_acceptance'
            });
        }
        if (readiness.safe_without_owner_acceptance === false) {
            if (!Array.isArray(readiness.dirty_core_paths) || readiness.dirty_core_paths.length === 0) {
                failures.push({
                    code: 'webpage_website_contract_missing_owner_readiness_paths',
                    message: 'Webpage/Website served example contract must list dirty_core_paths when owner implementation is blocked'
                });
            } else {
                readiness.dirty_core_paths.forEach((dirty_path, index) => {
                    if (!is_relative_owner_file(dirty_path)) {
                        failures.push({
                            code: 'webpage_website_contract_invalid_owner_file',
                            message: `Webpage/Website served example dirty_core_paths[${index}] must be a relative owner path: ${dirty_path}`
                        });
                    }
                });
            }
        }
    }

    if (!Array.isArray(contract.model_owner_readiness) || contract.model_owner_readiness.length < 2) {
        failures.push({
            code: 'webpage_website_contract_invalid_field',
            message: 'Webpage/Website served example contract requires model_owner_readiness entries for jsgui3-webpage and jsgui3-website'
        });
    } else {
        const model_owners = new Set();
        contract.model_owner_readiness.forEach((owner, index) => {
            const label = `webpage_website.model_owner_readiness[${index}]`;
            if (!owner || typeof owner !== 'object' || Array.isArray(owner)) {
                failures.push({
                    code: 'webpage_website_contract_invalid_field',
                    message: `Webpage/Website model owner readiness must be an object at ${label}`
                });
                return;
            }
            require_contract_string(owner.repo, `${label}.repo`, failures);
            require_contract_string(owner.repo_path, `${label}.repo_path`, failures);
            require_contract_string(owner.status, `${label}.status`, failures);
            if (owner.repo) model_owners.add(owner.repo);
        });
        for (const repo of ['jsgui3-webpage', 'jsgui3-website']) {
            if (!model_owners.has(repo)) {
                failures.push({
                    code: 'webpage_website_contract_missing_model_owner',
                    message: `Webpage/Website served example contract must record model owner readiness for ${repo}`
                });
            }
        }
    }

    const required_files = [
        'examples/webpage-website/server.js',
        'examples/webpage-website/controls/Webpage_Website_Demo.js',
        'examples/webpage-website/client.js',
        'tests/webpage-website-example.test.js'
    ];
    const implementation_file_paths = new Set();
    if (require_contract_array(contract.implementation_files, 'webpage_website.implementation_files', failures)) {
        contract.implementation_files.forEach((file, index) => {
            const label = `webpage_website.implementation_files[${index}]`;
            if (!file || typeof file !== 'object' || Array.isArray(file)) {
                failures.push({
                    code: 'webpage_website_contract_invalid_field',
                    message: `Webpage/Website implementation file must be an object at ${label}`
                });
                return;
            }
            if (check_owner_file_path(file.path, `${label}.path`, failures)) {
                implementation_file_paths.add(file.path);
            }
            require_contract_string(file.purpose, `${label}.purpose`, failures);
        });
        for (const file of required_files) {
            if (!implementation_file_paths.has(file)) {
                failures.push({
                    code: 'webpage_website_contract_missing_file',
                    message: `Webpage/Website served example contract is missing required owner file: ${file}`
                });
            }
        }
    }

    const required_route_keys = [
        'GET /examples/webpage-website',
        'GET /examples/webpage-website/about',
        'GET /examples/webpage-website/start',
        'GET /examples/webpage-website/old-about',
        'GET /examples/webpage-website/api/status'
    ];
    const route_keys = new Set();
    if (require_contract_array(contract.routes, 'webpage_website.routes', failures)) {
        contract.routes.forEach((route, index) => {
            const label = `webpage_website.routes[${index}]`;
            if (!route || typeof route !== 'object' || Array.isArray(route)) {
                failures.push({
                    code: 'webpage_website_contract_invalid_field',
                    message: `Webpage/Website route must be an object at ${label}`
                });
                return;
            }
            const has_method = require_contract_string(route.method, `${label}.method`, failures);
            const has_path = require_contract_string(route.path, `${label}.path`, failures);
            require_contract_string(route.response, `${label}.response`, failures);
            if (has_method && has_path) {
                route_keys.add(`${route.method.toUpperCase()} ${route.path}`);
                if (!route.path.startsWith(contract.route_prefix || '/examples/webpage-website')) {
                    failures.push({
                        code: 'webpage_website_contract_route_outside_prefix',
                        message: `Webpage/Website route is outside route_prefix at ${label}: ${route.path}`
                    });
                }
            }
        });
        for (const key of required_route_keys) {
            if (!route_keys.has(key)) {
                failures.push({
                    code: 'webpage_website_contract_missing_route',
                    message: `Webpage/Website served example contract is missing required route: ${key}`
                });
            }
        }
    }

    const required_features = [
        'website_with_two_webpages',
        'alias_route',
        'redirect_route',
        'json_status_endpoint',
        'activated_control',
        'docs_viewer_inventory_ready'
    ];
    const feature_set = new Set(Array.isArray(contract.required_features) ? contract.required_features : []);
    if (require_contract_array(contract.required_features, 'webpage_website.required_features', failures)) {
        for (const feature of required_features) {
            if (!feature_set.has(feature)) {
                failures.push({
                    code: 'webpage_website_contract_missing_feature',
                    message: `Webpage/Website served example contract is missing required feature: ${feature}`
                });
            }
        }
    }

    if (require_contract_array(contract.required_tests, 'webpage_website.required_tests', failures)) {
        const test_paths = new Set();
        contract.required_tests.forEach((test_ref, index) => {
            const label = `webpage_website.required_tests[${index}]`;
            if (!test_ref || typeof test_ref !== 'object' || Array.isArray(test_ref)) {
                failures.push({
                    code: 'webpage_website_contract_invalid_field',
                    message: `Webpage/Website required test must be an object at ${label}`
                });
                return;
            }
            if (check_owner_file_path(test_ref.path, `${label}.path`, failures)) {
                test_paths.add(test_ref.path);
            }
            require_contract_array(test_ref.assertions, `${label}.assertions`, failures);
        });
        if (!test_paths.has('tests/webpage-website-example.test.js')) {
            failures.push({
                code: 'webpage_website_contract_missing_test',
                message: 'Webpage/Website served example contract must require tests/webpage-website-example.test.js'
            });
        }
    }

    if (require_contract_array(contract.owner_validation_commands, 'webpage_website.owner_validation_commands', failures)) {
        const commands = contract.owner_validation_commands.join('\n');
        if (!commands.includes('webpage-website-example.test.js')) {
            failures.push({
                code: 'webpage_website_contract_missing_validation_command',
                message: 'Webpage/Website served example owner validation commands must include webpage-website-example.test.js'
            });
        }
    }

    return { ok: failures.length === 0, failures };
}

function check_own_website_docs_viewer_contract(
    root,
    manifest,
    contract_rel_path = DEFAULT_OWN_WEBSITE_CONTRACT
) {
    const contract_abs = path.resolve(root, contract_rel_path);
    const failures = [];

    if (!fs.existsSync(contract_abs)) {
        return {
            ok: false,
            failures: [{
                code: 'missing_own_website_contract',
                message: `Missing extensive docs viewer contract: ${contract_abs}`
            }]
        };
    }

    const contract = read_json(contract_abs);
    if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
        return {
            ok: false,
            failures: [{
                code: 'own_website_contract_invalid',
                message: `Extensive docs viewer contract must be an object: ${contract_abs}`
            }]
        };
    }

    require_contract_string(contract.status, 'own_website.status', failures);
    require_contract_string(contract.decision, 'own_website.decision', failures);
    require_contract_string(contract.coordination_owner, 'own_website.coordination_owner', failures);
    require_contract_string(contract.implementation_owner, 'own_website.implementation_owner', failures);
    const has_owner_path = require_contract_string(contract.implementation_owner_path, 'own_website.implementation_owner_path', failures);
    require_contract_string(contract.control_source_owner, 'own_website.control_source_owner', failures);
    require_contract_string(contract.route_prefix, 'own_website.route_prefix', failures);
    require_contract_string(contract.api_prefix, 'own_website.api_prefix', failures);
    const has_inventory_source = require_contract_string(contract.inventory_source, 'own_website.inventory_source', failures);

    if (has_inventory_source) {
        const inventory_abs = path.resolve(root, contract.inventory_source);
        if (fs.existsSync(inventory_abs)) {
            const inventory = read_json(inventory_abs);
            const expected_extensive_owner = inventory
                && inventory.implementation_owners
                && inventory.implementation_owners.extensive_viewer
                ? inventory.implementation_owners.extensive_viewer
                : (inventory && inventory.implementation_owner);
            if (expected_extensive_owner && contract.implementation_owner !== expected_extensive_owner) {
                failures.push({
                    code: 'own_website_contract_owner_drift',
                    message: `Extensive docs viewer owner drift: inventory expects ${expected_extensive_owner}, contract has ${contract.implementation_owner}`
                });
            }
        }
    }

    let owner_abs = null;
    if (has_owner_path) {
        owner_abs = path.resolve(root, contract.implementation_owner_path);
        if (!fs.existsSync(owner_abs)) {
            failures.push({
                code: 'own_website_contract_missing_owner_repo',
                message: `Extensive docs viewer owner repo does not exist: ${owner_abs}`
            });
        }
    }

    const rendering = contract.rendering_model;
    if (!rendering || typeof rendering !== 'object' || Array.isArray(rendering)) {
        failures.push({
            code: 'own_website_contract_invalid_field',
            message: 'Extensive docs viewer contract requires rendering_model object'
        });
    } else {
        require_contract_string(rendering.ssr, 'own_website.rendering_model.ssr', failures);
        const has_activation = require_contract_string(rendering.activation, 'own_website.rendering_model.activation', failures);
        require_contract_string(rendering.isomorphic_entry, 'own_website.rendering_model.isomorphic_entry', failures);
        if (has_activation) {
            const activation_lc = rendering.activation.toLowerCase();
            if (!activation_lc.includes('activate')) {
                failures.push({
                    code: 'own_website_contract_activation_model',
                    message: 'Extensive docs viewer rendering_model.activation must describe activate().'
                });
            }
            if (activation_lc.includes('hydration') && !activation_lc.includes('not hydration')) {
                failures.push({
                    code: 'own_website_contract_activation_model',
                    message: 'Extensive docs viewer rendering_model.activation must use activation, not hydration.'
                });
            }
        }
    }

    const allowed_status = new Set(['planned', 'seeded', 'implemented', 'in_progress']);
    const check_owner_file_exists_for_status = (rel_path, status, label) => {
        if (!owner_abs) return;
        if (status === 'seeded' || status === 'implemented') {
            const abs = path.resolve(owner_abs, rel_path);
            if (!fs.existsSync(abs)) {
                failures.push({
                    code: 'own_website_contract_missing_seeded_file',
                    message: `Extensive docs viewer contract marks ${label} as ${status} but the file does not exist: ${abs}`
                });
            }
        }
    };

    const required_source_kinds = ['docs', 'framework', 'component', 'example'];
    const source_kind_set = new Set(Array.isArray(contract.source_kinds) ? contract.source_kinds : []);
    if (require_contract_array(contract.source_kinds, 'own_website.source_kinds', failures)) {
        for (const kind of required_source_kinds) {
            if (!source_kind_set.has(kind)) {
                failures.push({
                    code: 'own_website_contract_missing_source_kind',
                    message: `Extensive docs viewer contract is missing required source kind: ${kind}`
                });
            }
        }
    }

    const required_panes = [
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
    ];
    const pane_set = new Set(Array.isArray(contract.render_panes) ? contract.render_panes : []);
    if (require_contract_array(contract.render_panes, 'own_website.render_panes', failures)) {
        for (const pane of required_panes) {
            if (!pane_set.has(pane)) {
                failures.push({
                    code: 'own_website_contract_missing_pane',
                    message: `Extensive docs viewer contract is missing required render pane: ${pane}`
                });
            }
        }
    }

    const control_names = new Set();
    if (require_contract_array(contract.new_controls, 'own_website.new_controls', failures)) {
        contract.new_controls.forEach((ctrl, index) => {
            const label = `own_website.new_controls[${index}]`;
            if (!ctrl || typeof ctrl !== 'object' || Array.isArray(ctrl)) {
                failures.push({
                    code: 'own_website_contract_invalid_field',
                    message: `Extensive docs viewer new control must be an object at ${label}`
                });
                return;
            }
            const has_name = require_contract_string(ctrl.name, `${label}.name`, failures);
            check_owner_file_path(ctrl.path, `${label}.path`, failures);
            require_contract_string(ctrl.purpose, `${label}.purpose`, failures);
            const has_status = require_contract_string(ctrl.status, `${label}.status`, failures);
            if (has_status && !allowed_status.has(ctrl.status)) {
                failures.push({
                    code: 'own_website_contract_invalid_status',
                    message: `Extensive docs viewer new control status must be one of ${[...allowed_status].join(', ')} at ${label}`
                });
            }
            if (has_name) control_names.add(ctrl.name);
            if (ctrl.path && has_status) {
                check_owner_file_exists_for_status(ctrl.path, ctrl.status, `${label} (${ctrl.name})`);
            }
        });
        if (!control_names.has('Source_Code_Viewer')) {
            failures.push({
                code: 'own_website_contract_missing_source_viewer',
                message: 'Extensive docs viewer contract must define the Source_Code_Viewer control.'
            });
        }
    }

    const file_paths = new Set();
    if (require_contract_array(contract.implementation_files, 'own_website.implementation_files', failures)) {
        contract.implementation_files.forEach((file, index) => {
            const label = `own_website.implementation_files[${index}]`;
            if (!file || typeof file !== 'object' || Array.isArray(file)) {
                failures.push({
                    code: 'own_website_contract_invalid_field',
                    message: `Extensive docs viewer implementation file must be an object at ${label}`
                });
                return;
            }
            const ok_path = check_owner_file_path(file.path, `${label}.path`, failures);
            require_contract_string(file.purpose, `${label}.purpose`, failures);
            const has_status = require_contract_string(file.status, `${label}.status`, failures);
            if (has_status && !allowed_status.has(file.status)) {
                failures.push({
                    code: 'own_website_contract_invalid_status',
                    message: `Extensive docs viewer implementation file status must be one of ${[...allowed_status].join(', ')} at ${label}`
                });
            }
            if (ok_path) file_paths.add(file.path);
            if (file.path && has_status) {
                check_owner_file_exists_for_status(file.path, file.status, label);
            }
        });
        const required_files = [
            'package.json',
            'server.js',
            'client.js',
            'controls/Source_Code_Viewer.js',
            'tests/docs-viewer.test.js'
        ];
        for (const required_file of required_files) {
            if (!file_paths.has(required_file)) {
                failures.push({
                    code: 'own_website_contract_missing_file',
                    message: `Extensive docs viewer contract is missing required owner file: ${required_file}`
                });
            }
        }
    }

    const required_route_keys = [
        'GET /',
        'GET /controls/:control_name',
        'GET /examples',
        'GET /examples/:manifest_id',
        'GET /api/docs/inventory',
        'GET /api/docs/source',
        'GET /api/docs/control-source',
        'GET /api/docs/status'
    ];
    const route_keys = new Set();
    if (require_contract_array(contract.routes, 'own_website.routes', failures)) {
        contract.routes.forEach((route, index) => {
            const label = `own_website.routes[${index}]`;
            if (!route || typeof route !== 'object' || Array.isArray(route)) {
                failures.push({
                    code: 'own_website_contract_invalid_field',
                    message: `Extensive docs viewer route must be an object at ${label}`
                });
                return;
            }
            const has_method = require_contract_string(route.method, `${label}.method`, failures);
            const has_path = require_contract_string(route.path, `${label}.path`, failures);
            require_contract_string(route.purpose, `${label}.purpose`, failures);
            if (has_method && has_path) {
                route_keys.add(`${route.method.toUpperCase()} ${route.path}`);
            }
        });
        for (const key of required_route_keys) {
            if (!route_keys.has(key)) {
                failures.push({
                    code: 'own_website_contract_missing_route',
                    message: `Extensive docs viewer contract is missing required route: ${key}`
                });
            }
        }
    }

    if (require_contract_array(contract.phases, 'own_website.phases', failures)) {
        contract.phases.forEach((phase, index) => {
            const label = `own_website.phases[${index}]`;
            if (!phase || typeof phase !== 'object' || Array.isArray(phase)) {
                failures.push({
                    code: 'own_website_contract_invalid_field',
                    message: `Extensive docs viewer phase must be an object at ${label}`
                });
                return;
            }
            require_contract_string(phase.id, `${label}.id`, failures);
            require_contract_string(phase.title, `${label}.title`, failures);
            const has_status = require_contract_string(phase.status, `${label}.status`, failures);
            if (has_status && !allowed_status.has(phase.status)) {
                failures.push({
                    code: 'own_website_contract_invalid_status',
                    message: `Extensive docs viewer phase status must be one of ${[...allowed_status].join(', ')} at ${label}`
                });
            }
            require_contract_array(phase.files, `${label}.files`, failures);
        });
    }

    if (require_contract_array(contract.required_tests, 'own_website.required_tests', failures)) {
        const test_paths = new Set();
        const assertion_text = [];
        contract.required_tests.forEach((test_ref, index) => {
            const label = `own_website.required_tests[${index}]`;
            if (!test_ref || typeof test_ref !== 'object' || Array.isArray(test_ref)) {
                failures.push({
                    code: 'own_website_contract_invalid_field',
                    message: `Extensive docs viewer required test must be an object at ${label}`
                });
                return;
            }
            if (check_owner_file_path(test_ref.path, `${label}.path`, failures)) {
                test_paths.add(test_ref.path);
            }
            if (require_contract_array(test_ref.assertions, `${label}.assertions`, failures)) {
                test_ref.assertions.forEach((assertion) => {
                    if (typeof assertion === 'string') assertion_text.push(assertion);
                });
            }
        });
        if (!test_paths.has('tests/docs-viewer.test.js')) {
            failures.push({
                code: 'own_website_contract_missing_test',
                message: 'Extensive docs viewer contract must require tests/docs-viewer.test.js'
            });
        }
        const assertions_joined = assertion_text.join('\n').toLowerCase();
        if (!assertions_joined.includes('activation')) {
            failures.push({
                code: 'own_website_contract_missing_activation_test',
                message: 'Extensive docs viewer required tests must assert client activation.'
            });
        }
        if (!assertions_joined.includes('failure')) {
            failures.push({
                code: 'own_website_contract_missing_failure_test',
                message: 'Extensive docs viewer required tests must assert a visible failure panel.'
            });
        }
    }

    if (!contract.owner_readiness || typeof contract.owner_readiness !== 'object' || Array.isArray(contract.owner_readiness)) {
        failures.push({
            code: 'own_website_contract_invalid_field',
            message: 'Extensive docs viewer contract requires owner_readiness object'
        });
    } else {
        require_contract_string(contract.owner_readiness.last_checked, 'own_website.owner_readiness.last_checked', failures);
        require_contract_string(contract.owner_readiness.status, 'own_website.owner_readiness.status', failures);
        require_contract_string(contract.owner_readiness.status_command, 'own_website.owner_readiness.status_command', failures);
        require_contract_string(contract.owner_readiness.gate, 'own_website.owner_readiness.gate', failures);
        if (typeof contract.owner_readiness.safe_without_owner_acceptance !== 'boolean') {
            failures.push({
                code: 'own_website_contract_invalid_field',
                message: 'Extensive docs viewer contract requires boolean at owner_readiness.safe_without_owner_acceptance'
            });
        }
    }

    if (require_contract_array(contract.owner_validation_commands, 'own_website.owner_validation_commands', failures)) {
        const joined = contract.owner_validation_commands.join('\n');
        if (!joined.includes('controls/Source_Code_Viewer.js')) {
            failures.push({
                code: 'own_website_contract_missing_validation_command',
                message: 'Extensive docs viewer owner validation commands must include a node --check for controls/Source_Code_Viewer.js'
            });
        }
    }
    if (require_contract_array(contract.ecosystem_validation_commands, 'own_website.ecosystem_validation_commands', failures)) {
        if (!contract.ecosystem_validation_commands.includes('npm run docs:viewer:check')) {
            failures.push({
                code: 'own_website_contract_missing_validation_command',
                message: 'Extensive docs viewer ecosystem validation commands must include npm run docs:viewer:check'
            });
        }
    }

    return { ok: failures.length === 0, failures };
}

function combine_check_results(results) {
    const failures = results.flatMap((result) => result.failures || []);
    return {
        ok: results.every((result) => result.ok),
        failures
    };
}

function walk_files(dir, options = {}) {
    const skip = new Set(options.skip || [
        '.git',
        '.jsgui3-server-cache',
        'node_modules',
        'output',
        'public',
        'screenshots'
    ]);
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const name of fs.readdirSync(dir)) {
        if (skip.has(name)) continue;
        const abs = path.join(dir, name);
        const stat = fs.statSync(abs);
        if (stat.isDirectory()) {
            out.push(...walk_files(abs, options));
        } else if (stat.isFile()) {
            out.push(abs);
        }
    }
    return out;
}

function discover_examples(root) {
    const surfaces = [
        { repo: 'jsgui3-ecosystem', repo_path: '.', dirs: ['docs'] },
        { repo: 'jsgui3-html', repo_path: '../jsgui3-html', dirs: ['examples', 'dev-examples'] },
        { repo: 'jsgui3-client', repo_path: '../jsgui3-client', dirs: ['examples'] },
        { repo: 'jsgui3-server', repo_path: '../jsgui3-server', dirs: ['examples'] },
        { repo: 'jsgui3-gfx-core', repo_path: '../jsgui3-gfx-core', dirs: ['examples', 'docs'] },
        { repo: 'jsgui3-modern-examples', repo_path: '../jsgui3-modern-examples', dirs: ['plain-control-document', 'serve-site-multipage'] },
        { repo: 'jsgui3-simple-example', repo_path: '../jsgui3-simple-example', dirs: ['.'] }
    ];
    const rows = [];

    for (const surface of surfaces) {
        const repo_abs = path.resolve(root, surface.repo_path);
        if (!fs.existsSync(repo_abs)) {
            rows.push({ repo: surface.repo, status: 'missing', path: surface.repo_path, kind: 'repo' });
            continue;
        }
        for (const dir of surface.dirs) {
            const abs_dir = path.resolve(repo_abs, dir);
            const files = walk_files(abs_dir).filter((file) => {
                const rel = path.relative(repo_abs, file).replace(/\\/g, '/');
                if (rel.includes('/node_modules/')) return false;
                if (surface.repo === 'jsgui3-ecosystem') return /GETTING_STARTED|TUTORIAL|EXAMPLE|examples/i.test(rel);
                return /\.(js|md)$/.test(rel);
            });
            for (const file of files) {
                const rel = path.relative(repo_abs, file).replace(/\\/g, '/');
                const kind = rel.endsWith('/server.js') ? 'server'
                    : rel.endsWith('/client.js') ? 'client'
                    : rel.endsWith('.md') ? 'docs'
                    : 'script';
                rows.push({ repo: surface.repo, status: 'found', path: rel, kind });
            }
        }
    }

    return rows;
}

function summarize_scan(rows, manifest) {
    const by_repo = new Map();
    const manifest_entries = manifest && Array.isArray(manifest.entries) ? manifest.entries : [];

    function ensure(repo) {
        if (!by_repo.has(repo)) {
            by_repo.set(repo, {
                repo,
                manifest: 0,
                discovered: 0,
                server: 0,
                client: 0,
                docs: 0,
                script: 0,
                missing_repo: false,
                categories: new Set()
            });
        }
        return by_repo.get(repo);
    }

    for (const entry of manifest_entries) {
        const item = ensure(entry.owner);
        item.manifest++;
        if (entry.category) item.categories.add(entry.category);
    }

    for (const row of rows) {
        const item = ensure(row.repo);
        if (row.status === 'missing') {
            item.missing_repo = true;
            continue;
        }
        item.discovered++;
        if (row.kind === 'server') item.server++;
        else if (row.kind === 'client') item.client++;
        else if (row.kind === 'docs') item.docs++;
        else item.script++;
    }

    return [...by_repo.values()]
        .sort((a, b) => a.repo.localeCompare(b.repo))
        .map((item) => ({
            ...item,
            status: item.missing_repo ? 'missing' : 'present',
            categories: [...item.categories].sort().join(',')
        }));
}

function print_list(manifest) {
    for (const entry of manifest.entries) {
        const flags = [
            entry.server ? 'server' : null,
            entry.browser ? 'browser' : null
        ].filter(Boolean).join('+') || 'node/docs';
        console.log(`${entry.id}\t${entry.owner}\t${entry.category}\t${entry.complexity}\t${flags}\t${entry.run}`);
    }
}

function print_scan(rows) {
    for (const row of rows) {
        console.log(`${row.repo}\t${row.kind}\t${row.status}\t${row.path}`);
    }
}

function print_scan_summary(rows) {
    console.log('repo\tmanifest\tdiscovered\tserver\tclient\tdocs\tscript\tstatus\tcategories');
    for (const row of rows) {
        console.log([
            row.repo,
            row.manifest,
            row.discovered,
            row.server,
            row.client,
            row.docs,
            row.script,
            row.status,
            row.categories
        ].join('\t'));
    }
}

function print_smoke(result) {
    for (const item of result.results) {
        if (item.ok) {
            console.log(`PASS ${item.entry.id}`);
            continue;
        }
        console.log(`FAIL ${item.entry.id}`);
        for (const failure of item.failures) {
            console.log(`  ${failure.code}: ${failure.message}`);
        }
    }
    console.log(result.ok ? 'ALL PASS' : 'SOME FAILED');
}

function print_smoke_summary(result) {
    console.log('owner\ttotal\tpass\tfail\tstatus\tfailures');
    for (const row of summarize_smoke(result)) {
        console.log([
            row.owner,
            row.total,
            row.pass,
            row.fail,
            row.status,
            row.failures
        ].join('\t'));
    }
    console.log(result.ok ? 'ALL PASS' : 'SOME FAILED');
}

function print_docs(result) {
    if (result.ok) {
        console.log('PASS examples manifest, docs/examples index, and continuation prompt are in sync.');
        return;
    }
    for (const failure of result.failures) {
        console.log(`FAIL ${failure.code}: ${failure.message}`);
    }
}

function print_docs_viewer(result) {
    if (result.ok) {
        console.log('PASS docs viewer inventory, shell contract, Webpage/Website served example contract, and extensive own-website docs viewer contract are valid.');
        return;
    }
    for (const failure of result.failures) {
        console.log(`FAIL ${failure.code}: ${failure.message}`);
    }
}

function parse_args(argv) {
    const args = {
        command: null,
        manifest_path: path.resolve(DEFAULT_MANIFEST),
        doc_path: DEFAULT_DOC,
        docs_viewer_path: DEFAULT_DOCS_VIEWER,
        docs_viewer_contract_path: DEFAULT_DOCS_VIEWER_CONTRACT,
        continuation_prompt_path: DEFAULT_CONTINUATION_PROMPT,
        run_startup: false,
        check_related_tests: false,
        summary: false
    };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--list') args.command = 'list';
        else if (arg === '--scan') args.command = 'scan';
        else if (arg === '--smoke') args.command = 'smoke';
        else if (arg === '--check-docs') args.command = 'check-docs';
        else if (arg === '--check-docs-viewer') args.command = 'check-docs-viewer';
        else if (arg === '--summary') args.summary = true;
        else if (arg === '--run-startup') args.run_startup = true;
        else if (arg === '--check-related-tests') args.check_related_tests = true;
        else if (arg === '--manifest') args.manifest_path = path.resolve(argv[++i]);
        else if (arg === '--doc') args.doc_path = argv[++i];
        else if (arg === '--docs-viewer') args.docs_viewer_path = argv[++i];
        else if (arg === '--docs-viewer-contract') args.docs_viewer_contract_path = argv[++i];
        else if (arg === '--continuation-prompt') args.continuation_prompt_path = argv[++i];
        else if (arg === '--help' || arg === '-h') args.command = 'help';
        else throw new Error(`Unknown argument: ${arg}`);
    }
    return args;
}

function usage() {
    console.log(`Usage:
  node scripts/example_smoke.js --list
  node scripts/example_smoke.js --scan [--summary]
  node scripts/example_smoke.js --smoke [--summary] [--run-startup] [--check-related-tests]
  node scripts/example_smoke.js --check-docs
  node scripts/example_smoke.js --check-docs-viewer

Options:
  --manifest <path>          Use a custom examples manifest.
  --doc <path>               Use a custom docs index path for --check-docs.
  --continuation-prompt <path>
                             Use a custom continuation prompt path for --check-docs.
  --docs-viewer <path>       Use a custom docs viewer inventory path.
  --docs-viewer-contract <path>
                             Use a custom docs viewer shell contract path.
  --summary                  Print compact scan or smoke totals for operators.
  --run-startup              Also run bounded startup commands declared in the manifest.
  --check-related-tests      Require related_tests paths to exist.
`);
}

function main(argv = process.argv.slice(2)) {
    const args = parse_args(argv);
    if (!args.command || args.command === 'help') {
        usage();
        return 0;
    }

    const { root, manifest } = load_manifest(args.manifest_path);

    if (args.command === 'list') {
        print_list(manifest);
        return 0;
    }
    if (args.command === 'scan') {
        const rows = discover_examples(root);
        if (args.summary) {
            print_scan_summary(summarize_scan(rows, manifest));
        } else {
            print_scan(rows);
        }
        return 0;
    }
    if (args.command === 'smoke') {
        const result = run_smoke(root, manifest, {
            run_startup: args.run_startup,
            check_related_tests: args.check_related_tests
        });
        if (args.summary) {
            print_smoke_summary(result);
        } else {
            print_smoke(result);
        }
        return result.ok ? 0 : 1;
    }
    if (args.command === 'check-docs') {
        const result = combine_check_results([
            check_manifest_quality(manifest),
            check_docs(root, manifest, args.doc_path),
            check_continuation_prompt(root, args.continuation_prompt_path)
        ]);
        print_docs(result);
        return result.ok ? 0 : 1;
    }
    if (args.command === 'check-docs-viewer') {
        const result = combine_check_results([
            check_docs_viewer_inventory(root, manifest, args.docs_viewer_path),
            check_docs_viewer_shell_contract(root, manifest, args.docs_viewer_contract_path, args.docs_viewer_path),
            check_webpage_website_served_example_contract(root, manifest, DEFAULT_WEBPAGE_WEBSITE_CONTRACT, args.docs_viewer_path),
            check_own_website_docs_viewer_contract(root, manifest, DEFAULT_OWN_WEBSITE_CONTRACT)
        ]);
        print_docs_viewer(result);
        return result.ok ? 0 : 1;
    }

    throw new Error(`Unhandled command: ${args.command}`);
}

if (require.main === module) {
    try {
        process.exit(main());
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = {
    check_manifest_quality,
    check_continuation_prompt,
    check_docs,
    check_docs_viewer_inventory,
    check_docs_viewer_shell_contract,
    check_webpage_website_served_example_contract,
    check_own_website_docs_viewer_contract,
    check_entry,
    command_available,
    combine_check_results,
    discover_examples,
    first_executable,
    load_manifest,
    main,
    run_smoke,
    summarize_smoke,
    summarize_scan,
    tokenize_command
};
