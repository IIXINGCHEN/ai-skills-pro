import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getVersion } from '../scripts/version.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('VERSION is strict semver', () => {
  assert.match(getVersion(), /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/);
});

test('package.json, plugin.json, and registry agree with VERSION', () => {
  const version = getVersion();
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const plugin = JSON.parse(fs.readFileSync(path.join(rootDir, '.claude-plugin', 'plugin.json'), 'utf8'));
  const registry = JSON.parse(fs.readFileSync(path.join(rootDir, 'registry', 'skills.json'), 'utf8'));
  assert.equal(pkg.version, version);
  assert.equal(plugin.version, version);
  assert.equal(registry.version, version);
});

test('RELEASE.md announces the current version', () => {
  const release = fs.readFileSync(path.join(rootDir, 'RELEASE.md'), 'utf8');
  assert.match(release, /^# AI Skills Pro \d+\.\d+\.\d+ Production Release$/m);
  assert.ok(release.includes(`Release version: ${getVersion()}`),
    'RELEASE.md "Release version:" line must match VERSION (sync-version.mjs keeps it aligned)');
});

test('generated manifests never render an unspaced empty flow sequence', () => {
  for (const bucket of ['engineering', 'productivity', 'design']) {
    const dir = path.join(rootDir, 'skills', bucket);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const manifest = path.join(dir, entry.name, 'manifest.yaml');
      if (!fs.existsSync(manifest)) continue;
      const content = fs.readFileSync(manifest, 'utf8');
      assert.ok(!content.includes(':[]'),
        `unspaced empty flow sequence (YAML 1.1 parsers misread it as a scalar): ${entry.name}/manifest.yaml`);
    }
  }
});

test('package.json and plugin.json list identical skill sets', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const plugin = JSON.parse(fs.readFileSync(path.join(rootDir, '.claude-plugin', 'plugin.json'), 'utf8'));
  assert.deepEqual([...pkg.skills].sort(), [...plugin.skills].sort());
});

test('every packaged skill directory exists and every on-disk skill is packaged', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const listed = new Set(pkg.skills);
  for (const bucket of ['engineering', 'productivity', 'design']) {
    const dir = path.join(rootDir, 'skills', bucket);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const rel = `./skills/${bucket}/${entry.name}`;
      assert.ok(listed.has(rel), `skill on disk but not packaged: ${rel}`);
    }
  }
  for (const rel of listed) {
    assert.ok(fs.existsSync(path.join(rootDir, rel)), `packaged skill missing on disk: ${rel}`);
  }
});

test('each skill has a companion doc under docs/<bucket>/', () => {
  for (const bucket of ['engineering', 'productivity', 'design']) {
    const dir = path.join(rootDir, 'skills', bucket);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const doc = path.join(rootDir, 'docs', bucket, `${entry.name}.md`);
      assert.ok(fs.existsSync(doc), `missing companion doc: docs/${bucket}/${entry.name}.md`);
    }
  }
});
