import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import fs from 'fs';
import { rootDir, walkFiles, fabricationViolations, legacyAgentPathViolations } from '../scripts/guard-checks.mjs';
import { buildSkillGraph } from '../scripts/generate-manifests.mjs';

// ADR 0005: no assumed, simulated, or invented content anywhere in this repository.
// Exemptions: templates/ (angle-bracket slots) and evals/ (labeled fixtures).
const EXEMPT = [/^templates\//, /^evals\//, /^\.changeset\//, /^node_modules\//, /^\.mimosa\//, /^\.git\//,
  /^scripts\/guard-checks\.mjs$/,      // the scanner's own regex literals name the markers it bans
  /^tests\/ablation\.test\.mjs$/,      // negative-control samples deliberately contain the markers
  /^tests\/no-fabrication\.test\.mjs$/ // asserts the known historical strays by quoting them
];

test('no fabrication markers outside the exempt surfaces', () => {
  const offenders = [];
  const surfaces = [
    path.join(rootDir, 'skills'), path.join(rootDir, 'docs'), path.join(rootDir, 'scripts'),
    path.join(rootDir, 'tests'), path.join(rootDir, 'security'), path.join(rootDir, 'registry'),
    path.join(rootDir, 'templates'), path.join(rootDir, 'failures'), rootDir
  ];
  const seen = new Set();
  for (const dir of surfaces) {
    if (!fs.existsSync(dir)) continue;
    for (const f of walkFiles(dir, { exclude: ['node_modules', '.git', '.mimosa'] })) {
      const rel = path.relative(rootDir, f).replace(/\\/g, '/');
      if (seen.has(rel)) continue;
      seen.add(rel);
      if (EXEMPT.some(re => re.test(rel))) continue;
      const content = fs.readFileSync(f, 'utf8');
      const v = fabricationViolations(content);
      if (v.length) offenders.push(`${rel}: ${v.join('; ')}`);
    }
  }
  assert.deepEqual(offenders, [], `fabrication markers found:\n${offenders.join('\n')}`);
});

test('the two known strays are gone (NaN line, duplicated sentence)', () => {
  const hardening = fs.readFileSync(path.join(rootDir, 'skills/engineering/eng-hardening-review/SKILL.md'), 'utf8');
  assert.ok(!/^NaN$/m.test(hardening), 'stray NaN line still present');
  const cogDoc = fs.readFileSync(path.join(rootDir, 'docs/design/cog-axiom.md'), 'utf8');
  assert.ok(!/automatically when a task fits\. automatically when a task fits\./.test(cogDoc), 'duplicated sentence still present');
});

test('the epistemic discipline module is registered and complete', () => {
  const dir = path.join(rootDir, 'skills/design/cog-axiom/cognitive/epistemic-discipline.md');
  const content = fs.readFileSync(dir, 'utf8');
  for (const rule of ['No Fabrication', 'Reproduce Before Reasoning', 'Adversarial Review',
    'Ablation', 'Occam', 'Uncertainty Ledger', 'Independent Judgment', 'Facts Are Not Inferences',
    'High Cohesion, Low Coupling']) {
    assert.ok(content.includes(rule), `discipline module missing rule: ${rule}`);
  }
  const skill = fs.readFileSync(path.join(rootDir, 'skills/design/cog-axiom/SKILL.md'), 'utf8');
  assert.ok(skill.includes('epistemic-discipline.md'), 'cog-axiom SKILL.md must index the discipline module');
});

test('each woven principle is checkable in its host skill', () => {
  const expectations = {
    'eng-bugfix-rca': ['Red and green run outputs archived', 'eliminated by ablation'],
    'eng-adversarial-audit': ['independently before reading prior analyses', 'Counterexample'],
    'eng-completion-gate': ['Uncertainty Ledger'],
    'eng-code-review': ['before reading commit messages', 'counterexample first'],
    'eng-hardening-review': ['observed', 'inferred', 'falsifying evidence'],
    'eng-analyze-codebase': ['cohesion', 'Cohesion assessed'],
    'eng-change-scope-funnel': ['named responsibility', 'ADJACENT'],
    'eng-plan': ['Occam ordering', 'second concrete ticket']
  };
  for (const [skill, needles] of Object.entries(expectations)) {
    const found = buildSkillGraph().find(s => s.name === skill);
    assert.ok(found, skill);
    const content = fs.readFileSync(path.join(rootDir, found.dir, 'SKILL.md'), 'utf8');
    for (const n of needles) assert.ok(content.includes(n), `${skill} missing woven clause: "${n}"`);
  }
});

test('ADR 0005 exists with the full record', () => {
  const adr = fs.readFileSync(path.join(rootDir, 'docs/adr/0005-no-fabrication-doctrine.md'), 'utf8');
  for (const section of ['## Context', '## Decision', '## Consequences', '## Alternatives considered']) {
    assert.ok(adr.includes(section), 'ADR 0005 incomplete');
  }
});
