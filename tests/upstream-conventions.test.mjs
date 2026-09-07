import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSkillGraph } from '../scripts/generate-manifests.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Prose surfaces under the upstream no-em-dash rule (CLAUDE.md): SKILL.md files,
// docs, READMEs, CHANGELOG, manifests, scripts, tests, registry.
function proseFiles() {
  const files = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (['node_modules', '.git', '.mimosa', '.out-of-scope'].includes(e.name)) continue;
        walk(p);
      } else if (/\.(md|json|yaml|yml|mjs|sh|ps1)$/.test(e.name)) {
        files.push(p);
      }
    }
  };
  for (const top of ['skills', 'docs', 'scripts', 'tests', 'registry', '.agents', '.claude-plugin', '.github']) {
    const dir = path.join(rootDir, top);
    if (fs.existsSync(dir)) walk(dir);
  }
  for (const f of ['README.md', 'README.zh-CN.md', 'CHANGELOG.md', 'CLAUDE.md', 'AGENTS.md',
    'CONTEXT.md', 'RELEASE.md', 'QUALITY_REPORT.md', 'SECURITY.md', 'package.json', 'RELEASE-MANIFEST.json']) {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) files.push(p);
  }
  return files;
}

test('no em-dashes anywhere in repo prose (upstream rule)', () => {
  const offenders = [];
  for (const file of proseFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('\u2014')) offenders.push(path.relative(rootDir, file));
  }
  assert.deepEqual(offenders, [], `files containing em-dashes: ${offenders.join(', ')}`);
});

test('SKILL.md frontmatter uses only the upstream field set', () => {
  for (const skill of buildSkillGraph()) {
    const content = fs.readFileSync(path.join(rootDir, skill.dir, 'SKILL.md'), 'utf8');
    const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
    const fields = [...fm.matchAll(/^([a-z-]+):/gm)].map(m => m[1]);
    const allowed = ['name', 'description', 'disable-model-invocation'];
    for (const f of fields) {
      assert.ok(allowed.includes(f), `${skill.name}: unexpected frontmatter field "${f}" (allowed: ${allowed.join(', ')})`);
    }
  }
});

test('every docs page carries the four-section frame and Where it fits', () => {
  for (const skill of buildSkillGraph()) {
    const docPath = path.join(rootDir, 'docs', skill.bucket, `${skill.name}.md`);
    const content = fs.readFileSync(docPath, 'utf8');
    for (const section of ['## What it does', '## When to reach for it', "## It's working if", '## Where it fits']) {
      assert.ok(content.includes(section), `${skill.name}: docs page missing "${section}"`);
    }
    // no H1: published page takes its title from the slug
    assert.ok(!/^# /m.test(content), `${skill.name}: docs page must not carry an H1`);
  }
});

test('docs pages state the invocation mode in When to reach for it', () => {
  for (const skill of buildSkillGraph()) {
    const docPath = path.join(rootDir, 'docs', skill.bucket, `${skill.name}.md`);
    const section = fs.readFileSync(docPath, 'utf8').split('## When to reach for it')[1]?.split('##')[0] || '';
    if (skill.invocation === 'user') {
      assert.ok(/won'?t reach|only.*type|human[- ]only|you (type|invoke)/i.test(section),
        `${skill.name}: user-invoked docs page must say the agent will not fire it on its own`);
    } else {
      assert.ok(/agent reaches|automatically|model[- ]reachable|type `?\//i.test(section),
        `${skill.name}: model-invoked docs page must say the agent can reach it automatically`);
    }
  }
});

test('manifest.yaml content matches regeneration (no hand edits)', () => {
  for (const skill of buildSkillGraph()) {
    const manifestPath = path.join(rootDir, skill.dir, 'manifest.yaml');
    const expected = fs.readFileSync(manifestPath, 'utf8');
    const m = expected.match(/^invocation:\s*(\w+)$/m);
    assert.equal(m?.[1], skill.invocation, `${skill.name}: manifest invocation drifted from SKILL.md; regenerate with npm run generate:manifests`);
  }
});

test('AGENTS.md is a single-line pointer to CLAUDE.md (upstream convention)', () => {
  const content = fs.readFileSync(path.join(rootDir, 'AGENTS.md'), 'utf8').trim();
  assert.equal(content, 'CLAUDE.md');
});

test('GitHub Actions workflows pin one common Node.js major version', () => {
  // The 3.2.1 ship briefly regressed validate-skills.yml to Node 20 while
  // release.yml stayed on 22; pin the invariant both files must share.
  const dir = path.join(rootDir, '.github', 'workflows');
  const versions = new Map();
  for (const entry of fs.readdirSync(dir)) {
    const content = fs.readFileSync(path.join(dir, entry), 'utf8');
    const m = content.match(/^\s*node-version:\s*"?(\d+)"?\s*$/m);
    assert.ok(m, `${entry}: no node-version pin found`);
    versions.set(entry, m[1]);
  }
  assert.equal(new Set(versions.values()).size, 1,
    `workflows disagree on Node major: ${JSON.stringify([...versions])}`);
});

test('vis-reverse-ui keeps its SSRF defense boundary (CHANGELOG 3.2.1 claim)', () => {
  const content = fs.readFileSync(
    path.join(rootDir, 'skills', 'design', 'vis-reverse-ui', 'SKILL.md'), 'utf8');
  assert.ok(content.includes('SSRF Defense / Host Validation Boundary'),
    'vis-reverse-ui/SKILL.md must keep the SSRF defense / host validation rule');
  assert.match(content, /localhost.*loopback|loopback.*localhost/s,
    'SSRF rule must name localhost and loopback rejection');
});

test('docs pages share uniform ecosystem support framing', () => {
  const expectedPhrase = 'Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.';
  for (const skill of buildSkillGraph()) {
    const docPath = path.join(rootDir, 'docs', skill.bucket, `${skill.name}.md`);
    const body = fs.readFileSync(docPath, 'utf8');
    assert.ok(body.includes(expectedPhrase),
      `${skill.name}: docs page must use uniform ecosystem support response`);
  }
});

test('no hardcoded local filesystem absolute paths in tracked repository files', () => {
  // Enforce zero hardcoded workstation or drive paths (C:\, E:\, /c/Users, /home/<user>): only relative paths are permitted.
  // Standard user environment wildcards (~/.claude/skills) and target-OS standard system paths (/etc/os-release, /var/log/...) are legitimate.
  const walk = (dir) => {
    let out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', '.git', '.mimosa', '.scratch'].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...walk(full));
      else if (/\.(md|json|yaml|yml|mjs|sh|ps1)$/.test(entry.name)) out.push(full);
    }
    return out;
  };

  const candidateFiles = walk(rootDir);
  // Match Windows drive letter paths: C:\path, E:\path, C:/path, etc.
  const winDrivePattern = /(?<![\\/a-zA-Z0-9_-])[A-Za-z]:\\[a-zA-Z0-9_.-]+/;
  const winForwardDrivePattern = /(?<![\\/a-zA-Z0-9_.-])[A-Za-z]:\/[a-zA-Z0-9_.-]+/;
  // Match workstation home/drive paths: /Users/<name>, /home/<name>, /c/Users, /e/UI
  const workstationPathPattern = /(?:^|[\s"'`(\[])\/(?:Users|home\/[a-zA-Z0-9_.-]+|[cde]\/[A-Za-z0-9_.-]+)\//;

  const violations = [];
  for (const file of candidateFiles) {
    const rel = path.relative(rootDir, file).replaceAll(path.sep, '/');
    if (rel === 'tests/upstream-conventions.test.mjs') continue;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      // Strip URLs (http://, https://) before matching
      const stripped = line.replace(/https?:\/\/[^\s"')\]]+/g, '');
      if (winDrivePattern.test(stripped) ||
          winForwardDrivePattern.test(stripped) ||
          workstationPathPattern.test(stripped)) {
        violations.push(`${rel}:${idx + 1}: ${line.trim()}`);
      }
    });
  }

  assert.deepEqual(violations, [],
    `Hardcoded absolute filesystem paths found (repository must use relative paths only):\n${violations.join('\n')}`);
});


