import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getVersion } from './version.mjs';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

let errors = 0;
const fail = (msg) => { console.error(`[ERROR] ${msg}`); errors++; };
const pass = (msg) => console.log(`[PASS] ${msg}`);

const read = (p) => fs.readFileSync(p, 'utf8');
const walk = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
};

console.log('--- Production Release Gate: ai-skills-pro ---');

// 1. Required release files.
for (const rel of ['VERSION', 'package.json', 'README.md', 'README.zh-CN.md', 'CHANGELOG.md', 'LICENSE', 'AGENTS.md', 'CLAUDE.md', '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'scripts/validate-skills.mjs', 'scripts/release-check.mjs', 'scripts/sync-version.mjs', 'scripts/version.mjs', 'RELEASE-MANIFEST.json', 'SECURITY.md', 'skills/engineering/README.md', 'skills/productivity/README.md', 'skills/design/README.md']) {
  if (!fs.existsSync(path.join(rootDir, rel))) fail(`Missing required release file: ${rel}`);
}

const expectedVersion = getVersion();
if (!expectedVersion) fail('VERSION file must declare a version');

const pkg = JSON.parse(read(path.join(rootDir, 'package.json')));
const plugin = JSON.parse(read(path.join(rootDir, '.claude-plugin/plugin.json')));
const marketplace = JSON.parse(read(path.join(rootDir, '.claude-plugin/marketplace.json')));

if (pkg.version !== expectedVersion) fail(`package.json version ${pkg.version} != VERSION ${expectedVersion}`);
if (plugin.version !== expectedVersion) fail(`plugin.json version ${plugin.version} != VERSION ${expectedVersion}`);
if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length !== 1) fail('marketplace.json must contain exactly one plugin entry');
else if (marketplace.plugins[0].version !== expectedVersion) fail(`marketplace plugin version ${marketplace.plugins[0].version} != VERSION ${expectedVersion}`);
else pass(`Version metadata aligned at ${expectedVersion} (source of truth: VERSION)`);

// 1a. Enforce centralized versioning rule: code in scripts/ must not hardcode versions.
const scriptsDir = path.join(rootDir, 'scripts');
for (const file of fs.readdirSync(scriptsDir)) {
  if (!file.endsWith('.mjs')) continue;
  const content = read(path.join(scriptsDir, file));
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('>=20.0.0')) return;
    const m = line.match(/(['"])\b(\d+\.\d+\.\d+)\b\1/);
    if (m) {
      fail(`Hardcoded version literal "${m[2]}" forbidden in scripts/${file}:${idx + 1}; must read dynamically from VERSION via scripts/version.mjs`);
    }
  });
}
pass('Centralized versioning rule passed: no hardcoded version literals in scripts');

// 2. Skill counts and manifest synchronization.
const skillDirs = [];
for (const bucket of ['engineering', 'productivity', 'design']) {
  const bucketDir = path.join(rootDir, 'skills', bucket);
  if (!fs.existsSync(bucketDir)) { fail(`Missing skill bucket: ${bucket}`); continue; }
  for (const entry of fs.readdirSync(bucketDir, { withFileTypes: true })) {
    if (entry.isDirectory()) skillDirs.push(path.posix.join('skills', bucket, entry.name));
  }
}
const expected = new Set(skillDirs.map(p => `./${p}`));
for (const [label, list] of [['package.json', pkg.skills], ['plugin.json', plugin.skills]]) {
  if (!Array.isArray(list)) { fail(`${label} skills must be an array`); continue; }
  const actual = new Set(list);
  if (actual.size !== list.length) fail(`${label} contains duplicate skill paths`);
  if (actual.size !== expected.size || [...expected].some(x => !actual.has(x))) fail(`${label} skill manifest is not synchronized with skills/ (${actual.size} declared, ${expected.size} present)`);
  else pass(`${label} lists all ${expected.size} skills exactly once`);
}

// 3. Run canonical validator.
const result = spawnSync(process.execPath, ['scripts/validate-skills.mjs', 'scripts/release-check.mjs', 'RELEASE-MANIFEST.json', 'SECURITY.md', 'skills/engineering/README.md', 'skills/productivity/README.md', 'skills/design/README.md'], { cwd: rootDir, encoding: 'utf8' });
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.status !== 0) fail('Canonical skill validator failed');
else pass('Canonical skill validator passed');

// 3a. Enforce the repository's two-class invocation contract.
let invocationErrors = 0;
for (const skillDir of skillDirs) {
  const skillMd = path.join(rootDir, skillDir, 'SKILL.md');
  const yaml = path.join(rootDir, skillDir, 'agents', 'openai.yaml');
  const c = read(skillMd);
  const fm = c.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) continue;
  const front = fm[1];
  const userOnly = /^disable-model-invocation:\s*true$/m.test(front);
  const y = read(yaml);
  const hasPolicy = /(?:^|\n)policy:/m.test(y);
  const policyFalse = /allow_implicit_invocation:\s*false/.test(y);
  if (userOnly && (!hasPolicy || !policyFalse)) { fail(`User-invoked skill missing synchronized Codex policy: ${skillDir}`); invocationErrors++; }
  if (!userOnly && hasPolicy) { fail(`Model-invoked skill must omit policy block: ${skillDir}`); invocationErrors++; }
  const dm = front.match(/^description:\s*(.+)$/m);
  if (userOnly && dm) {
    const desc = dm[1].replace(/^['\"]|['\"]$/g, '');
    if (desc.length > 180) { fail(`User-invoked description is too long: ${skillDir}`); invocationErrors++; }
    if (/\bUse when\b|\bwhen the user\b|\bmentions\b|\basks for\b/i.test(desc)) { fail(`User-invoked description contains model-trigger phrasing: ${skillDir}`); invocationErrors++; }
  }
}
if (!invocationErrors) pass('Invocation model is synchronized with SKILL.md and agents/openai.yaml');

// 3b. Enforce the upstream Skill-tool dependency invariant.
// A Skill-tool call may target only a model-invoked skill; user-invoked skills
// are human-only and must be recommended to the user instead.
const invocationClass = new Map();
for (const skillDir of skillDirs) {
  const frontPath = path.join(rootDir, skillDir, 'SKILL.md');
  const front = fs.readFileSync(frontPath, 'utf8').split('---', 3)[1] || '';
  invocationClass.set(path.basename(skillDir), /^disable-model-invocation:\s*true$/m.test(front) ? 'user' : 'model');
}
const depRe = /(?:Call\s+the\s+Skill\s+tool\s+with|Skill\s+tool\s+with)\s+["']([a-z0-9-]+)["']/gi;
let dependencyErrors = 0;
for (const skillDir of skillDirs) {
  const file = path.join(rootDir, skillDir, 'SKILL.md');
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = depRe.exec(content))) {
    const target = m[1];
    const targetClass = invocationClass.get(target);
    if (!targetClass) {
      fail(`Skill-tool dependency targets unknown skill: ${skillDir} -> ${target}`);
      dependencyErrors++;
    } else if (targetClass !== 'model') {
      fail(`Skill-tool dependency targets user-invoked skill: ${skillDir} -> ${target}`);
      dependencyErrors++;
    } else if (target === path.basename(skillDir)) {
      fail(`Skill recursively calls itself through the Skill tool: ${skillDir}`);
      dependencyErrors++;
    }
  }
}
if (!dependencyErrors) pass('Skill-tool dependency graph follows upstream invocation invariant');

// 4. Empty files and unexpected symlinks.
const allFiles = walk(rootDir);
const empty = allFiles.filter(p => fs.statSync(p).size === 0);
if (empty.length) empty.forEach(p => fail(`Empty file: ${path.relative(rootDir, p)}`));
else pass('No empty files');
const symlinks = [];
const walkLinks = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) symlinks.push(p);
    else if (entry.isDirectory()) walkLinks(p);
  }
};
walkLinks(rootDir);
if (symlinks.length) symlinks.forEach(p => fail(`Symlink not allowed in release tree: ${path.relative(rootDir, p)}`));
else pass('No symlinks in release tree');

// 5. UTF-8 / LF checks.
let crlf = 0;
const textExtensions = new Set(['.md','.json','.yaml','.yml','.mjs','.sh','.ps1','.gitignore']);
for (const p of allFiles) {
  if (!(textExtensions.has(path.extname(p).toLowerCase()) || path.basename(p) === 'LICENSE' || path.basename(p) === 'VERSION')) continue;
  const buf = fs.readFileSync(p);
  if (buf.includes(0x0d)) crlf++;
}
if (crlf) fail(`${crlf} file(s) contain CRLF/CR line endings`);
else pass('All files use LF-only line endings');

// 6. Markdown relative-link integrity.
const mdFiles = allFiles.filter(p => p.toLowerCase().endsWith('.md'));
const linkRe = /\[[^\]]+\]\(([^)]+)\)/g;
let brokenLinks = 0;
for (const md of mdFiles) {
  const content = read(md);
  let m;
  while ((m = linkRe.exec(content))) {
    const target = m[1].trim();
    if (!target || target.startsWith('#') || /^[a-z]+:/.test(target) || target.startsWith('mailto:')) continue;
    const clean = target.split('#')[0].split('?')[0];
    if (!clean) continue;
    const resolved = path.resolve(path.dirname(md), clean);
    if (!fs.existsSync(resolved)) { brokenLinks++; fail(`Broken markdown link: ${path.relative(rootDir, md)} -> ${target}`); }
  }
}
if (!brokenLinks) pass('All relative Markdown links resolve');

// 7. Agent-behavior pollution guard. Scan executable skill instructions and skill UI metadata,
// not historical release notes or documentation that may legitimately describe removed patterns.
const suspicious = [
  { re: /\bdeclare sovereignty\b/i, label: 'sovereignty claim' },
  { re: /\bhighest priority protocol\b/i, label: 'custom highest-priority protocol' },
  { re: /\b(?:instructions|protocol)\s+(?:are|is) immutable\b/i, label: 'immutable instruction claim' },
  { re: /\b(?:my\s+)?(?:sole|true) identity\b/i, label: 'identity lock' },
  { re: /\bignore (?:all|any|later|subsequent) instructions\b/i, label: 'instruction suppression' },
  { re: /\bmust ignore (?:the )?(?:system|developer|user) instructions\b/i, label: 'host instruction suppression' },
  { re: /\bmandatory\s+chain[- ]of[- ]thought\b/i, label: 'mandatory private reasoning disclosure' },
  { re: /<thinking>\s*\.\.\./i, label: 'thinking block disclosure' },
  { re: /\bbefore every reply\b/i, label: 'mandatory per-response protocol' },
  { re: /\balways communicate with users in chinese\b/i, label: 'forced language behavior' },
  { re: /\bproceeding with assumptions is forbidden\b/i, label: 'universal context halt' },
];
const candidateFiles = [
  ...allFiles.filter(p => /\bSKILL\.md$/i.test(p)),
  ...allFiles.filter(p => /\/agents\/openai\.yaml$/i.test(p)),
  ...allFiles.filter(p => /\/config\/.+\.(md|yaml|yml)$/i.test(p)),
  ...allFiles.filter(p => /\/protocols\/.+\.(md|yaml|yml)$/i.test(p)),
  ...allFiles.filter(p => /\/foundation\/.+\.(md|yaml|yml)$/i.test(p)),
  ...allFiles.filter(p => /\/cognitive\/.+\.(md|yaml|yml)$/i.test(p)),
];
const seen = new Set();
for (const p of candidateFiles) {
  if (seen.has(p)) continue;
  seen.add(p);
  const c = read(p);
  for (const {re, label} of suspicious) {
    if (re.test(c)) fail(`Agent-behavior contamination pattern (${label}) in ${path.relative(rootDir, p)}`);
  }
}
if (errors === 0) pass('Agent-behavior contamination guard passed');

// 8. Production package checks.
if (pkg.engines?.node !== '>=20.0.0') fail(`package.json engines.node must be >=20.0.0 (found ${pkg.engines?.node ?? 'missing'})`);
if (!pkg.repository?.url) fail('package.json repository.url is missing');
if (!pkg.license) fail('package.json license is missing');
if (!Array.isArray(pkg.files) || !pkg.files.includes('scripts')) fail('package.json files must include release scripts');
else pass('Production package metadata present');

// 9. Release marker.
const releaseFile = path.join(rootDir, 'RELEASE.md');
if (!fs.existsSync(releaseFile)) fail('Missing RELEASE.md production release record');
else if (!read(releaseFile).includes(expectedVersion)) fail(`RELEASE.md does not mention ${expectedVersion}`);
else pass(`Production release record present for ${expectedVersion}`);

if (errors) {
  console.error(`\nProduction release gate FAILED: ${errors} error(s)`);
  process.exit(1);
}
console.log('\nProduction release gate PASSED.');
