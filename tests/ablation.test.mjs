import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emDashViolations, completionContractViolations, legacyAgentPathViolations,
  sharedStateFileViolations, frontmatterFieldViolations, descriptionLengthViolations,
  fabricationViolations
} from '../scripts/guard-checks.mjs';

// Epistemic discipline rule 3, mechanized: every guard rule must be able to fail.
// Each check is fed a deliberately bad sample; if the check stays silent, the rule
// is dead weight and this suite fails. Remove a rule only by removing it here too.

test('em-dash check fires on an em-dash and stays silent without one', () => {
  assert.deepEqual(emDashViolations('clean text here'), []);
  assert.deepEqual(emDashViolations('bad \u2014 text').length, 1);
});

test('completion contract check fires on missing heading and empty checklist', () => {
  const good = '## Checkable Completion Criteria\n\n- [ ] one item';
  assert.deepEqual(completionContractViolations(good), []);
  assert.deepEqual(completionContractViolations('## Completion Criteria\n\n- [ ] x').length, 1);
  assert.deepEqual(completionContractViolations('## Checkable Completion Criteria\n\nprose only').length, 1);
});

test('legacy path check fires on .agents writes', () => {
  assert.deepEqual(legacyAgentPathViolations('save to specs/<feature>/plan.md'), []);
  assert.deepEqual(legacyAgentPathViolations('save to .agents/plans/x.md').length, 1);
});

test('shared-state check fires on lifecycle-state.json and misplaced state files', () => {
  assert.deepEqual(sharedStateFileViolations('record in `.scratch/<pipeline>-state.json`'), []);
  assert.deepEqual(sharedStateFileViolations('record in `.agents/lifecycle-state.json`').length >= 1, true);
  assert.deepEqual(sharedStateFileViolations('write `state/pipeline-state.json`').length, 1);
});

test('frontmatter check fires on out-of-whitelist fields', () => {
  const good = '---\nname: x\ndescription: y\n---\n';
  assert.deepEqual(frontmatterFieldViolations(good), []);
  const bad = '---\nname: x\ndescription: y\nversion: 9\nrisk: high\n---\n';
  assert.deepEqual(frontmatterFieldViolations(bad), ['version', 'risk']);
});

test('description length check fires over the declared limit', () => {
  assert.deepEqual(descriptionLengthViolations('---\ndescription: short one\n---', { userOnly: true }), []);
  const long = '---\ndescription: ' + 'x'.repeat(200) + '\n---';
  assert.deepEqual(descriptionLengthViolations(long, { userOnly: true }).length, 1);
  assert.deepEqual(descriptionLengthViolations(long, { userOnly: false }).length, 0); // under model limit 280
});

test('fabrication check fires on each marker class', () => {
  assert.deepEqual(fabricationViolations('normal engineering text'), []);
  assert.deepEqual(fabricationViolations('fill with lorem ipsum here').length, 1);
  assert.deepEqual(fabricationViolations('something\nNaN\nelse').length, 1);
  assert.deepEqual(fabricationViolations('fix later TODO: wire this').length, 1);
  assert.deepEqual(fabricationViolations('reach for it automatically when a task fits. automatically when a task fits.').length, 1);
  assert.deepEqual(fabricationViolations('when a task fits. before planning major features.').length, 1);  // graft fragment
  assert.deepEqual(fabricationViolations('when a task fits, before planning major features.').length, 0);
  // graft to-variant: shipped once inside docs pages because the verb list missed it
  assert.deepEqual(fabricationViolations('automatically when a task fits. to implement tasks from a plan file.').length, 1);
  // stray control characters: batch-edit corruption that eats a character's display
  assert.deepEqual(fabricationViolations('precedes \x0balidate.').length, 1);   // vertical tab ate the "v"
  assert.deepEqual(fabricationViolations('consumes \x08ugfix-rca.').length, 1); // backspace ate the "e" of "eng-"
  assert.deepEqual(fabricationViolations('plain text with\ttab and\nnewline').length, 0); // tab/newline are legal
});
