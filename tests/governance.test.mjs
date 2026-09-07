import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSkillGraph, CURATED, skillDirHash } from '../scripts/generate-manifests.mjs';
import { runEval } from '../scripts/trigger-eval.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const graph = buildSkillGraph();

test('every skill carries full governance metadata', () => {
  const owners = ['platform', 'security', 'infra', 'sre', 'product', 'design', 'architecture'];
  for (const skill of graph) {
    const g = skill.governance;
    assert.ok(g, `${skill.name}: governance block missing`);
    assert.ok(owners.includes(g.owner), `${skill.name}: unknown owner "${g.owner}"`);
    assert.ok(['active', 'deprecated', 'archived', 'experimental'].includes(g.status), `${skill.name}: bad status`);
    assert.ok(['scaffold', 'production', 'library', 'governed'].includes(g.maturity), `${skill.name}: bad maturity`);
    assert.ok(['monthly', 'quarterly', 'annually'].includes(g.reviewCadence), `${skill.name}: bad cadence`);
    assert.match(g.reviewDue, /^\d{4}-\d{2}-\d{2}$/, `${skill.name}: review_due must be ISO date`);
  }
});

test('critical-risk and network-capable skills are governed maturity with short cadence', () => {
  for (const skill of graph) {
    if (skill.risk === 'critical' || skill.permissions.network.access) {
      assert.equal(skill.governance.maturity, 'governed',
        `${skill.name}: critical/network skills must be maturity governed`);
      assert.ok(['monthly', 'quarterly'].includes(skill.governance.reviewCadence),
        `${skill.name}: governed skills need monthly or quarterly review`);
    }
  }
});

test('review_due dates are never in the past', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const skill of graph) {
    assert.ok(skill.governance.reviewDue >= today,
      `${skill.name}: review overdue (due ${skill.governance.reviewDue}); renew in CURATED`);
  }
});

test('every network-capable skill has a current network policy approval', () => {
  const policy = JSON.parse(fs.readFileSync(path.join(rootDir, 'security', 'network_policy.json'), 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  for (const skill of graph) {
    if (!skill.permissions.network.access) continue;
    const entry = policy.skills[skill.name];
    assert.ok(entry, `${skill.name}: no security/network_policy.json entry`);
    assert.ok(Array.isArray(entry.allowed_hosts) && entry.allowed_hosts.length > 0,
      `${skill.name}: allowed_hosts must be a non-empty list`);
    assert.ok(entry.expires_at >= today, `${skill.name}: network approval expired ${entry.expires_at}`);
  }
  // and the reverse: every policy entry corresponds to a network-capable skill
  for (const name of Object.keys(policy.skills)) {
    const s = graph.find(x => x.name === name);
    assert.ok(s?.permissions.network.access,
      `security/network_policy.json entry "${name}" targets a skill without network access`);
  }
});

test('trigger eval passes every suite at its floor', () => {
  for (const suite of ['train', 'holdout', 'blind']) {
    const { failures, total, passRate } = runEval(suite);
    const floor = suite === 'train' ? 0.9 : 1.0;
    assert.ok(passRate >= floor,
      `suite ${suite} below floor: ${failures.map(f => `[${f.kind}] ${f.family}: expected ${f.skill}, top ${f.top} | "${f.text}"`).join('; ')}`);
  }
  assert.ok(runEval('train').total + runEval('holdout').total >= 45,
    'combined train+holdout case set too thin; grow evals/');
  assert.ok(runEval('blind').total >= 8, 'blind holdout too thin; grow evals/blind_holdout_cases.json');
});

test('every model-invoked skill has trigger coverage in the CI suites', () => {
  // The description is the routing contract; a skill with zero cases ships
  // an untested contract. eng-destructive-safety-gate once shipped exactly
  // that way and its blind case later exposed a real routing gap.
  const covered = new Set();
  for (const file of ['train_cases.json', 'holdout_cases.json', 'blind_holdout_cases.json']) {
    const cases = JSON.parse(fs.readFileSync(path.join(rootDir, 'evals', file), 'utf8'));
    for (const c of [...cases.should_trigger, ...cases.near_neighbor]) {
      if (c.skill) covered.add(c.skill);
    }
  }
  for (const skill of graph.filter(s => s.invocation === 'model')) {
    assert.ok(covered.has(skill.name),
      `${skill.name}: no should_trigger/near_neighbor case in any CI suite; add cases to evals/train_cases.json (and blind_holdout_cases.json) in the same change`);
  }
});

test('output contracts hold for every fixture', async () => {
  const { runOutputEval } = await import('../scripts/output-eval.mjs');
  const { failures, total } = runOutputEval();
  assert.equal(failures.length, 0,
    `output eval failures:\n${failures.map(f => `  [${f.skill}] ${f.check}: ${f.detail}`).join('\n')}`);
  assert.ok(total >= 15, 'output contract set too thin; add fixtures in evals/output/');
});

test('trigger cases only reference model-invoked skills', () => {
  const graph2 = graph;
  const modelInvoked = new Set(graph2.filter(s => s.invocation === 'model').map(s => s.name));
  for (const file of ['train_cases.json', 'holdout_cases.json', 'blind_holdout_cases.json']) {
    const cases = JSON.parse(fs.readFileSync(path.join(rootDir, 'evals', file), 'utf8'));
    for (const c of [...cases.should_trigger, ...cases.near_neighbor]) {
      if (c.skill) assert.ok(modelInvoked.has(c.skill), `${file}: case references non-model-invoked skill "${c.skill}"`);
      if (c.must_not_trigger) assert.ok(modelInvoked.has(c.must_not_trigger),
        `${file}: near_neighbor references non-model-invoked sibling "${c.must_not_trigger}"`);
    }
  }
});

test('registry sha256 matches recomputed skill hashes', () => {
  const registry = JSON.parse(fs.readFileSync(path.join(rootDir, 'registry', 'skills.json'), 'utf8'));
  for (const entry of registry.skills) {
    assert.equal(entry.sha256, skillDirHash(entry.path),
      `${entry.name}: registry sha256 stale; run npm run generate:manifests`);
  }
});

test('context budget stays measurable and bounded', () => {
  for (const skill of graph) {
    assert.ok(['lean', 'standard', 'heavy'].includes(skill.contextBudget), `${skill.name}: bad budget tier`);
    if (skill.contextBudget === 'heavy') {
      // heavy is tolerated only for reference-heavy skills; surface them explicitly
      assert.ok(skill.maturity === 'library' || skill.invocation === 'user',
        `${skill.name}: heavy context budget requires library maturity or user invocation`);
    }
  }
});

test('failure cases document every shipped defect class with a guard', () => {
  const content = fs.readFileSync(path.join(rootDir, 'failures', 'failure-cases.md'), 'utf8');
  for (const cls of ['Overlapping capabilities', 'Contract contradictions', 'Governance metadata drift']) {
    assert.ok(content.includes(cls), `failures/failure-cases.md missing class "${cls}"`);
  }
  // every entry names its regression guard
  const entries = content.split('### ').slice(1);
  for (const e of entries) {
    assert.ok(/Regression guard:/.test(e), `failure entry "${e.split('\n')[0]}" names no regression guard`);
  }
});
