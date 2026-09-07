import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSkillGraph } from '../scripts/generate-manifests.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ADR 0003 enforcement: artifacts land in the four sanctioned homes and never
// in the target project's .agents/ tree.
test('no skill writes run state or artifacts into .agents/ of a target project', () => {
  for (const skill of buildSkillGraph()) {
    const content = fs.readFileSync(path.join(rootDir, skill.dir, 'SKILL.md'), 'utf8');
    const refs = content.match(/\.agents\/[^\s`)\]]*/g) || [];
    assert.deepEqual(refs, [], `${skill.name} still references .agents/ paths: ${refs.join(', ')}`);
  }
});

test('every artifact a skill writes lands in a sanctioned home', () => {
  // The four homes govern artifacts skills WRITE into a working project. Exemptions:
  // host-system paths (firewall configs, system logs) are the target machine's own
  // surfaces; skill-package-relative paths (references/, foundation/, config/, ...)
  // live inside the skill's own folder and ship with it.
  const sanctioned = [/^specs\//, /^\.scratch\//, /^docs\/adr\//, /^docs\//, /^\//];
  const skillLocal = [/^[a-z][\w-]*\//];  // bare relative paths resolve inside the skill package
  const WRITE_VERB = /(?:[Ss]ave[d]?|[Ww]rite|[Rr]ecord|[Aa]rchive[d]?|[Gg]enerate[d]?|[Aa]ppend)[^\n]{0,80}?`([^\s`]*\/[^\s`]*)`/g;
  for (const skill of buildSkillGraph()) {
    const content = fs.readFileSync(path.join(rootDir, skill.dir, 'SKILL.md'), 'utf8');
    const writes = [...content.matchAll(WRITE_VERB)].map(m => m[1]).filter(p => !p.startsWith('http'));
    for (const p of writes) {
      const ok = sanctioned.some(re => re.test(p)) || skillLocal.some(re => re.test(p));
      assert.ok(ok,
        `${skill.name}: written artifact "${p}" outside the four homes (specs/, .scratch/, docs/adr/, docs/)`);
    }
  }
});

test('run state uses per-pipeline filenames under .scratch/', () => {
  for (const skill of buildSkillGraph()) {
    const content = fs.readFileSync(path.join(rootDir, skill.dir, 'SKILL.md'), 'utf8');
    assert.ok(!/lifecycle-state\.json/.test(content),
      `${skill.name}: shared lifecycle-state.json is a concurrency hazard (ADR 0003); use .scratch/<pipeline>-state.json`);
    const stateRefs = [...content.matchAll(/`(\S*state\.json)`/g)].map(m => m[1]);
    for (const ref of stateRefs) {
      assert.ok(/^\.scratch\/[<>\w-]+-state\.json$/.test(ref),
        `${skill.name}: state file "${ref}" must match .scratch/<pipeline>-state.json`);
    }
  }
});

test('the ADR directory holds sequenced, complete, non-empty records', () => {
  const dir = path.join(rootDir, 'docs', 'adr');
  const files = fs.readdirSync(dir).filter(f => f !== 'TEMPLATE.md' && f.endsWith('.md'));
  assert.ok(files.length >= 3, 'expected at least the three seed ADRs');
  const nums = files.map(f => parseInt(f.slice(0, 4), 10));
  assert.deepEqual(nums, [...nums].sort((a, b) => a - b), 'ADR filenames must be sequence-ordered');
  assert.equal(new Set(nums).size, nums.length, 'ADR sequence numbers must be unique');
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const section of ['## Context', '## Decision', '## Consequences', '## Alternatives considered']) {
      assert.ok(content.includes(section), `${f}: missing "${section}"`);
    }
    assert.match(content, /^Date: \d{4}-\d{2}-\d{2}$/m, `${f}: missing ISO date`);
    assert.match(content, /^Status: (proposed|accepted|superseded by ADR \d{4})$/m, `${f}: missing status`);
  }
});
