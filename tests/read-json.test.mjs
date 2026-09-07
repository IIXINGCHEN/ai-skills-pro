import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, readJsonString } from '../scripts/read-json.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = path.join(rootDir, '.scratch', 'read-json-probe.json');

test('readJson returns parsed JSON on the happy path', () => {
  const pkg = readJson(path.join(rootDir, 'package.json'));
  assert.equal(pkg.name, 'ai-skills-pro');
});

test('readJson names the file on invalid JSON', () => {
  fs.writeFileSync(tmp, '{broken');
  assert.throws(() => readJson(tmp), /invalid JSON at .*read-json-probe\.json/);
});

test('readJson reports a missing file as missing, not corrupt', () => {
  const missing = path.join(rootDir, '.scratch', 'definitely-absent.json');
  assert.throws(() => readJson(missing), /^Error: missing file /);
});

test('readJsonString labels in-memory parse failures', () => {
  assert.throws(() => readJsonString('{broken', 'rewritten plugin.json'),
    /invalid JSON in rewritten plugin\.json/);
  assert.deepEqual(readJsonString('{"ok":1}'), { ok: 1 });
});

test('readJson rejects an empty file as invalid JSON', () => {
  fs.writeFileSync(tmp, '');
  assert.throws(() => readJson(tmp), /invalid JSON at .*read-json-probe\.json/);
});

// cleanup runs after assertions; state lives under .scratch/ per ADR 0003
test.after?.(() => { try { fs.unlinkSync(tmp); } catch {} });
