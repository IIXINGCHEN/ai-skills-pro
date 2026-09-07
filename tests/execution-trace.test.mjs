import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSkillGraph } from '../scripts/generate-manifests.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ADR 0004 enforcement: the append-only execution trace chain.
const CHAIN = ['Executor', 'Skill', 'Version', 'Permissions', 'Steps', 'Results', 'Risk level', 'Final report'];

test('the execution record template carries the full chain in order', () => {
  const t = fs.readFileSync(path.join(rootDir, 'templates', 'execution-record.md'), 'utf8');
  const positions = CHAIN.map(link => t.indexOf(`## ${CHAIN.indexOf(link) + 1}. ${link}`));
  for (const p of positions) assert.ok(p >= 0, `template missing a numbered chain link`);
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), 'chain links out of order');
  assert.ok(/append-only/i.test(t), 'template must state the append-only rule');
});

test('every orchestrating skill appends the execution record', () => {
  // Structural derivation, not a hand-maintained enum: every lifecycle, plus
  // any skill with 2+ Skill Tool dependencies (user- or model-invoked), is an
  // orchestrator. eng-execute is the one semantic exception: it performs the
  // steps itself instead of Skill Tool-calling leaf skills, so no structural
  // signal can catch it; it stays listed with this note. The enum form missed
  // eng-review-and-ship once; this rule cannot miss the next orchestrator.
  const orchestrators = buildSkillGraph().filter(s =>
    s.name.endsWith('-lifecycle') ||
    s.dependencies.required.length >= 2 ||
    s.name === 'eng-execute');
  assert.ok(orchestrators.length >= 11, 'expected at least 11 orchestrators');
  for (const skill of orchestrators) {
    const content = fs.readFileSync(path.join(rootDir, skill.dir, 'SKILL.md'), 'utf8');
    assert.ok(/execution-record\.md/.test(content),
      `${skill.name}: must wire templates/execution-record.md into its completion criteria (ADR 0004)`);
  }
});

test('the record rule is part of the repository contract', () => {
  const claude = fs.readFileSync(path.join(rootDir, 'CLAUDE.md'), 'utf8');
  assert.ok(/execution record/i.test(claude), 'CLAUDE.md must document the execution trace doctrine');
  const adr = fs.readFileSync(path.join(rootDir, 'docs', 'adr', '0004-execution-trace-doctrine.md'), 'utf8');
  for (const section of ['## Context', '## Decision', '## Consequences', '## Alternatives considered']) {
    assert.ok(adr.includes(section), 'ADR 0004 incomplete');
  }
});

test('eng-review-fix runs the seven-dimension enterprise pipeline', () => {
  const content = fs.readFileSync(path.join(rootDir, 'skills', 'engineering', 'eng-review-fix', 'SKILL.md'), 'utf8');
  const stages = ['Code Scan', 'Architecture', 'Security', 'Performance', 'Reliability', 'Remediation Plan', 'Validation Report'];
  for (const stage of stages) {
    assert.ok(content.includes(stage), `eng-review-fix missing stage: ${stage}`);
  }
  // it orchestrates the existing leaf skills rather than re-implementing them
  for (const dep of ['eng-code-review', 'eng-analyze-codebase', 'eng-adversarial-audit', 'eng-hardening-review', 'eng-validate']) {
    assert.ok(content.includes(`"${dep}"`), `eng-review-fix must Skill Tool-call ${dep}`);
  }
});

test('governed lifecycles reference the canonical convergence gauntlet (ADR 0008, ADR 0009)', () => {
  const gauntletTemplate = path.join(rootDir, 'templates', 'convergence-gauntlet.md');
  assert.ok(fs.existsSync(gauntletTemplate), 'templates/convergence-gauntlet.md must exist (ADR 0008)');
  const canonical = fs.readFileSync(gauntletTemplate, 'utf8');
  assert.ok(/Pass cap\s*\|\s*5/.test(canonical), 'canonical gauntlet must specify cap 5');
  assert.ok(/Floor \(code-bearing changes\)\s*\|\s*3/.test(canonical), 'canonical gauntlet must specify code floor 3');
  assert.ok(/Floor \(prose-only changes\)\s*\|\s*2/.test(canonical), 'canonical gauntlet must specify prose floor 2 (ADR 0009)');

  // All three lifecycles that run the convergence loop must reference the canonical template
  const lifecycles = ['eng-review-and-ship', 'eng-review-and-fix', 'eng-enterprise-lifecycle'];
  for (const name of lifecycles) {
    const file = path.join(rootDir, 'skills', 'engineering', name, 'SKILL.md');
    const body = fs.readFileSync(file, 'utf8');
    assert.ok(body.includes('templates/convergence-gauntlet.md'),
      `${name} must reference templates/convergence-gauntlet.md (ADR 0008)`);
    assert.ok(body.includes('ADR 0008'), `${name} must cite ADR 0008`);
    assert.ok(body.includes('ADR 0009'), `${name} must cite ADR 0009`);
  }
});

