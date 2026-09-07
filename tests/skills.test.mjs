import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSkillGraph, validateGraph } from '../scripts/generate-manifests.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('every skill declares valid frontmatter with name matching its directory', () => {
  for (const skill of buildSkillGraph()) {
    const dirName = path.basename(skill.dir);
    assert.equal(skill.name, dirName, `frontmatter name must match directory: ${skill.dir}`);
    assert.ok(skill.description.length > 10, `${skill.name}: description too short`);
  }
});

test('dependency graph has no dangling edges, contract violations, or cycles', () => {
  const problems = validateGraph(buildSkillGraph());
  assert.deepEqual(problems, [], `graph problems: ${problems.join('; ')}`);
});

test('user-invoked skills never appear as Skill Tool dependencies', () => {
  const graph = buildSkillGraph();
  const userInvoked = new Set(graph.filter(s => s.invocation === 'user').map(s => s.name));
  for (const skill of graph) {
    for (const dep of skill.dependencies.required) {
      assert.ok(!userInvoked.has(dep),
        `${skill.name} must not Skill Tool-call user-invoked skill ${dep}`);
    }
  }
});

test('manifest required set equals the body Skill Tool calls exactly (no silent edge loss)', () => {
  // Double-entry: recompute the call set from SKILL.md text, independent of the
  // generator's own state. Guards the class where a redirect phrase collides
  // with a call edge and a filter silently drops it from the validated graph.
  const CALL = /Call the Skill tool with "([a-z0-9-]+)"/g;
  for (const skill of buildSkillGraph()) {
    const md = fs.readFileSync(path.join(rootDir, skill.dir, 'SKILL.md'), 'utf8');
    const called = new Set();
    let m;
    CALL.lastIndex = 0;
    while ((m = CALL.exec(md)) !== null) called.add(m[1]);
    assert.deepEqual([...skill.dependencies.required].sort(), [...called].sort(),
      `${skill.name}: required [${skill.dependencies.required}] != body calls [${[...called]}]`);
  }
});

test('registry/skills.json is in sync with the skill tree', () => {
  const registry = JSON.parse(fs.readFileSync(path.join(rootDir, 'registry', 'skills.json'), 'utf8'));
  const registryNames = registry.skills.map(s => s.name).sort();
  const graphNames = buildSkillGraph().map(s => s.name).sort();
  assert.deepEqual(registryNames, graphNames);
  for (const entry of registry.skills) {
    assert.ok(fs.existsSync(path.join(rootDir, entry.path)), `registry path missing: ${entry.path}`);
    for (const dep of entry.dependencies.required) {
      assert.ok(registryNames.includes(dep), `registry edge to missing skill: ${entry.name} -> ${dep}`);
    }
  }
});

test('every skill has a manifest.yaml consistent with SKILL.md invocation mode', () => {
  for (const skill of buildSkillGraph()) {
    const manifest = fs.readFileSync(path.join(rootDir, skill.dir, 'manifest.yaml'), 'utf8');
    const invocation = manifest.match(/^invocation:\s*(\w+)$/m)?.[1];
    assert.equal(invocation, skill.invocation, `${skill.name}: manifest invocation mismatch`);
    assert.match(manifest, /^risk:\s*$/m, `${skill.name}: manifest missing risk block`);
  }
});

test('dual-invocation contract: openai.yaml policy block mirrors frontmatter flag', () => {
  for (const skill of buildSkillGraph()) {
    const yamlContent = fs.readFileSync(path.join(rootDir, skill.dir, 'agents', 'openai.yaml'), 'utf8');
    const hasPolicyFalse = /allow_implicit_invocation:\s*false/.test(yamlContent);
    const hasPolicyBlock = /(?:^|\n)policy:/m.test(yamlContent);
    if (skill.invocation === 'user') {
      assert.ok(hasPolicyFalse, `${skill.name}: user-invoked needs allow_implicit_invocation: false`);
    } else {
      assert.ok(!hasPolicyBlock, `${skill.name}: model-invoked must not carry a policy block`);
    }
  }
});

test('every skill has a curated risk/permission classification', async () => {
  const { CURATED } = await import('../scripts/generate-manifests.mjs');
  for (const skill of buildSkillGraph()) {
    assert.ok(CURATED[skill.name],
      `${skill.name} must have a curated entry in CURATED (generate-manifests.mjs)`);
    assert.ok(['low', 'medium', 'high', 'critical'].includes(CURATED[skill.name].risk),
      `${skill.name}: curated risk must be one of low/medium/high/critical`);
  }
});

test('every skill carries the machine-checkable completion contract heading', () => {
  for (const skill of buildSkillGraph()) {
    const content = fs.readFileSync(path.join(rootDir, skill.dir, 'SKILL.md'), 'utf8');
    assert.match(content, /## Checkable Completion Criteria/,
      `${skill.name}: heading must be exactly "## Checkable Completion Criteria"`);
    // at least one checklist item under the contract
    const section = content.split('## Checkable Completion Criteria')[1] || '';
    assert.match(section, /- \[ \]/, `${skill.name}: contract needs at least one checklist item`);
  }
});

test('risk levels follow the documented escalation policy', () => {
  // Skills that modify source code or orchestrate code changes are never below high;
  // host/remote/destructive-capable skills are critical; pure read/report skills are low.
  const graph = buildSkillGraph();
  const byName = Object.fromEntries(graph.map(s => [s.name, s]));
  const codeWriters = ['eng-execute', 'eng-review-fix', 'eng-bugfix-implement',
    'eng-defect-lifecycle', 'eng-refactor-lifecycle', 'eng-enterprise-lifecycle',
    'eng-hotfix-emergency-lifecycle'];
  for (const name of codeWriters) {
    assert.ok(['high', 'critical'].includes(byName[name].risk), `${name} must be high or critical, got ${byName[name].risk}`);
  }
  const criticalOps = ['eng-docker-update', 'eng-linux-security', 'eng-git-pr', 'eng-review-and-ship', 'eng-release-ops-lifecycle'];
  for (const name of criticalOps) {
    assert.equal(byName[name].risk, 'critical', `${name} must be critical`);
  }
  const readOnly = ['eng-router', 'cog-axiom', 'eng-prime-context', 'eng-analyze-codebase', 'prod-briefing-loop'];
  for (const name of readOnly) {
    assert.equal(byName[name].risk, 'low', `${name} must be low`);
  }
});

test('non-enterprise skills stay out of the registry', () => {
  const removed = ['vis-anime-stylize', 'vis-vtp-3d', 'prod-mine-keywords',
    'prod-prompt-enhancer', 'prod-export-session'];
  const names = buildSkillGraph().map(s => s.name);
  for (const name of removed) {
    assert.ok(!names.includes(name), `${name} must remain deleted`);
    assert.ok(!fs.existsSync(path.join(rootDir, 'skills', name.startsWith('vis') ? 'design' : 'productivity', name)),
      `${name} directory must remain deleted`);
  }
  // eng-review-and-fix was reinstated by ADR 0006 with an explicit no-delivery
  // boundary against eng-review-and-ship; its presence is now required.
  assert.ok(names.includes('eng-review-and-fix'), 'eng-review-and-fix must exist (ADR 0006)');
});

test('eng-router stays synchronized with the registry in both directions', () => {
  // CLAUDE.md: a new skill the router never mentions, or a stale one it still
  // routes to, is a router that lies. This turns that prose rule into a test.
  const router = fs.readFileSync(path.join(rootDir, 'skills', 'engineering', 'eng-router', 'SKILL.md'), 'utf8');
  const graph = buildSkillGraph();
  const allNames = new Set(graph.map(s => s.name));

  // Forward: every user-invoked engineering skill is reachable from the router
  // (model-invoked leaf skills are listed under reusable sections; the routing
  // contract the router owns is which lifecycle/workflow to start).
  for (const s of graph.filter(x => x.invocation === 'user' && x.category === 'engineering')) {
    assert.ok(router.includes(s.name),
      `eng-router never mentions user-invoked skill ${s.name}; re-sync the routing table (CLAUDE.md router invariant)`);
  }

  // Reverse: no mention of a skill that no longer exists.
  const mentioned = [...new Set([...router.matchAll(/(?:eng|prod|vis|cog)-[a-z0-9-]+/g)].map(m => m[0]))];
  for (const name of mentioned) {
    assert.ok(allNames.has(name),
      `eng-router still routes to "${name}" which is not in the registry; a deleted skill must leave the table`);
  }
});
