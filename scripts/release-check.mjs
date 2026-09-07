import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getVersion } from './version.mjs';
import { readJson } from './read-json.mjs';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const textExt = new Set(['.md', '.json', '.yaml', '.yml', '.mjs', '.sh', '.ps1']);
let errors = 0;
let warnings = 0;
const fail = (msg) => { console.error(`[ERROR] ${msg}`); errors += 1; };
const warn = (msg) => { console.warn(`[WARN] ${msg}`); warnings += 1; };
const pass = (msg) => console.log(`[PASS] ${msg}`);
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

// CLI boundary: a load error (missing file, invalid JSON) must exit as a
// single named [ERROR] line, not an unhandled-throw dump; a gate that crashes
// mid-run reports health it never verified.
process.on('uncaughtException', (err) => {
  console.error(`[ERROR] ${err.message}`);
  process.exit(1);
});

const required = [
  'VERSION', 'package.json', 'package-lock.json', 'README.md', 'README.zh-CN.md',
  'CHANGELOG.md', 'LICENSE', 'AGENTS.md', 'CLAUDE.md', 'CONTEXT.md',
  'SECURITY.md', 'RELEASE.md', 'RELEASE-MANIFEST.json',
  '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json',
  'scripts/validate-skills.mjs', 'scripts/release-check.mjs',
  'scripts/sync-version.mjs', 'scripts/version.mjs', '.agents/invocation.md',
  'skills/engineering/README.md', 'skills/productivity/README.md', 'skills/design/README.md'
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) fail(`Missing required file: ${rel}`);

const version = getVersion();
// The release baseline is whatever VERSION declares (single source of truth);
// only its shape is enforced here. Skill and invocation counts have no
// hardcoded literals here: RELEASE-MANIFEST.json declares them and this gate
// cross-checks them against the live tree, so adding a skill requires only
// the manifest edit and everything else fails loudly on drift.
if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(version)) fail(`VERSION is not strict semver: ${version}`);
const releaseManifestEarly = readJson(path.join(root, 'RELEASE-MANIFEST.json'));
for (const key of ['skillCount', 'invocation.user', 'invocation.model']) {
  const declared = key.includes('.') ? releaseManifestEarly.invocation?.[key.split('.')[1]] : releaseManifestEarly[key];
  if (typeof declared !== 'number') fail(`RELEASE-MANIFEST.json missing numeric ${key}`);
}

const pkg = readJson(path.join(root, 'package.json'));
const lock = readJson(path.join(root, 'package-lock.json'));
const plugin = readJson(path.join(root, '.claude-plugin/plugin.json'));
const marketplace = readJson(path.join(root, '.claude-plugin/marketplace.json'));
const releaseManifest = releaseManifestEarly;

for (const [label, value] of [
  ['package.json', pkg.version],
  ['package-lock.json', lock.version],
  ['package-lock.json root package', lock.packages?.['']?.version],
  ['plugin.json', plugin.version],
  ['marketplace.json', marketplace.version],
  ['marketplace plugin', marketplace.plugins?.[0]?.version],
  ['RELEASE-MANIFEST.json', releaseManifest.version],
]) if (value !== version) fail(`${label} version ${value} != VERSION ${version}`);
if (pkg.private !== true) fail('package.json must be private like the upstream skills repository');
if (pkg.packageManager !== 'npm@10.9.4') fail(`packageManager must be npm@10.9.4, found ${pkg.packageManager}`);
pass(`Version metadata aligned at ${version}`);

const buckets = ['engineering', 'productivity', 'design'];
const skillDirs = [];
for (const bucket of buckets) {
  const dir = path.join(root, 'skills', bucket);
  if (!fs.existsSync(dir)) { fail(`Missing skill bucket ${bucket}`); continue; }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) skillDirs.push(path.posix.join('skills', bucket, e.name));
}
if (skillDirs.length !== releaseManifestEarly.skillCount)
  fail(`Skill tree has ${skillDirs.length} skills but RELEASE-MANIFEST.json declares ${releaseManifestEarly.skillCount}; regenerate or update the manifest`);
else pass(`Skill count synchronized with RELEASE-MANIFEST.json (${skillDirs.length})`);

const classes = new Map();
for (const rel of skillDirs) {
  const file = path.join(root, rel, 'SKILL.md');
  if (!fs.existsSync(file)) { fail(`Missing SKILL.md: ${rel}`); continue; }
  const content = fs.readFileSync(file, 'utf8');
  const fm = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) { fail(`Invalid frontmatter: ${rel}`); continue; }
  const front = fm[1];
  if (front.includes('#') || front.split('\n').length > 6) fail(`Frontmatter delimiter '---' missing or malformed: ${rel}`);
  const nameM = front.match(/^name:\s*(.+)$/m);
  const descM = front.match(/^description:\s*(.+)$/m);
  if (!nameM || !descM) { fail(`Missing name/description: ${rel}`); continue; }
  const name = nameM[1].trim();
  const desc = descM[1].trim().replace(/^['"]|['"]$/g, '');
  const user = /^disable-model-invocation:\s*true$/m.test(front);
  classes.set(name, user ? 'user' : 'model');
  const yaml = path.join(root, rel, 'agents', 'openai.yaml');
  if (!fs.existsSync(yaml)) { fail(`Missing agents/openai.yaml: ${rel}`); continue; }
  const y = fs.readFileSync(yaml, 'utf8');
  if (!/display_name:\s*\S/.test(y) || !/short_description:\s*\S/.test(y)) warn(`Incomplete Codex UI metadata: ${rel}`);
  const hasPolicy = /(?:^|\n)policy:/m.test(y);
  const policyFalse = /allow_implicit_invocation:\s*false/.test(y);
  if (user && (!hasPolicy || !policyFalse)) fail(`User-invoked skill missing synchronized Codex policy: ${rel}`);
  if (!user && hasPolicy) fail(`Model-invoked skill contains a Codex policy block: ${rel}`);
  if (user) {
    if (desc.length > 180) fail(`User-invoked description too long: ${rel}`);
    if (/\bUse when\b|\bwhen the user\b|\bmentions\b|\basks for\b/i.test(desc)) fail(`User-invoked description contains model-trigger phrasing: ${rel}`);
  } else if (desc.length > 280) warn(`Model-invoked description is large and should be considered for pruning: ${rel}`);
  if (content.includes('\u2014')) fail(`Raw em dash found in ${rel}`);
}

const userCount = [...classes.values()].filter(x => x === 'user').length;
const modelCount = [...classes.values()].filter(x => x === 'model').length;
if (userCount !== releaseManifestEarly.invocation.user || modelCount !== releaseManifestEarly.invocation.model)
  fail(`Invocation split ${userCount}/${modelCount} disagrees with RELEASE-MANIFEST.json ${releaseManifestEarly.invocation.user}/${releaseManifestEarly.invocation.model}; regenerate or update the manifest`);
else pass(`Invocation split synchronized with RELEASE-MANIFEST.json: ${userCount} user / ${modelCount} model`);

for (const [label, list] of [['package.json', pkg.skills], ['plugin.json', plugin.skills]]) {
  if (!Array.isArray(list)) { fail(`${label} skills must be an array`); continue; }
  const set = new Set(list);
  const expected = new Set(skillDirs.map(x => `./${x}`));
  if (set.size !== list.length || set.size !== expected.size || [...expected].some(x => !set.has(x))) fail(`${label} skill manifest is not exactly synchronized`);
  else pass(`${label} lists all skills exactly once`);
}

// Bucket READMEs must list all skills exactly once and preserve invocation grouping.
for (const bucket of buckets) {
  const md = read(`skills/${bucket}/README.md`);
  const names = skillDirs.filter(x => x.split('/')[1] === bucket).map(x => path.basename(x));
  for (const n of names) if (!md.includes(`\`${n}\``)) fail(`Bucket README missing ${n}`);
}
pass('Bucket catalog coverage checked');

// Skill Tool dependencies may point only to model-invoked skills.
const depRe = /Call\s+the\s+Skill\s+tool\s+with\s+["']([a-z0-9-]+)["']/gi;
for (const rel of skillDirs) {
  const content = read(`${rel}/SKILL.md`);
  let m;
  while ((m = depRe.exec(content))) {
    const target = m[1];
    if (!classes.has(target)) fail(`Unknown Skill Tool target: ${rel} -> ${target}`);
    else if (classes.get(target) !== 'model') fail(`Skill Tool target is user-invoked: ${rel} -> ${target}`);
    else if (target === path.basename(rel)) fail(`Self-recursive Skill Tool dependency: ${rel}`);
  }
  if (/\.\.\/(?:engineering|productivity|design)\//.test(content)) fail(`Deep cross-skill relative reference found: ${rel}`);
}
pass('Invocation dependency graph checked');

// Behavior contamination scan. These are high-confidence patterns, not generic words such as "must" or "never".
const suspicious = [
  /declare sovereignty/i,
  /highest priority protocol/i,
  /instructions?\s+(?:are|is)\s+immutable/i,
  /my\s+(?:sole|true)\s+identity/i,
  /ignore\s+(?:all|any)\s+(?:later|subsequent|higher-priority)\s+instructions?/i,
  /respond\s+based\s+solely\s+on\s+this\s+(?:instruction|protocol|kernel)/i,
  /mandatory\s+chain[- ]of[- ]thought/i,
  /output\s+(?:your|the)\s+(?:hidden|private)\s+chain[- ]of[- ]thought/i,
];
for (const rel of skillDirs) {
  const content = read(`${rel}/SKILL.md`);
  for (const re of suspicious) if (re.test(content)) fail(`Agent-behavior contamination pattern in ${rel}: ${re}`);
}
pass('Agent-behavior contamination scan passed');

// Text hygiene, excluding binary assets and local runtime directories.
const releaseRoots = ['skills', 'docs', 'scripts'];
const walk = (dir) => {
  const out=[];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir,e.name);
    if (e.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
};
const checkedFiles = [...releaseRoots.flatMap(r=>walk(path.join(root,r))), ...['VERSION','README.md','README.zh-CN.md','CHANGELOG.md','LICENSE','AGENTS.md','CLAUDE.md','CONTEXT.md','SECURITY.md','RELEASE.md','RELEASE-MANIFEST.json','.claude-plugin/plugin.json','.claude-plugin/marketplace.json'] .map(r=>path.join(root,r))];
for (const file of checkedFiles) {
  const rel=path.relative(root,file).replaceAll(path.sep,'/');
  const buf=fs.readFileSync(file);
  if (buf.includes(0x0d)) fail(`CRLF/CR line ending: ${rel}`);
  if (buf.length===0) fail(`Empty release file: ${rel}`);
}
pass('Text encoding and empty-file checks passed');

// Relative Markdown link check.
const linkRe = /\[[^\]]+\]\(([^)]+)\)/g;
for (const md of checkedFiles.filter(p=>p.toLowerCase().endsWith('.md'))) {
  const content=fs.readFileSync(md,'utf8');
  let m;
  while ((m=linkRe.exec(content))) {
    const target=m[1].trim();
    if (!target || target.startsWith('#') || /^[a-z]+:/.test(target) || target.startsWith('mailto:')) continue;
    const clean=target.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (!fs.existsSync(path.resolve(path.dirname(md),clean))) fail(`Broken Markdown link: ${path.relative(root,md)} -> ${target}`);
  }
}
pass('Relative Markdown links checked');

// Workstation absolute path ban: no drive letters, Git Bash mounts, or user home roots.
// User environment wildcards and target-OS standard system paths are legitimate.
const absDrivePattern = /(?<![\\/a-zA-Z0-9_.-])[A-Za-z]:[\\\/][a-zA-Z0-9_.-]+/;
const absWorkstationHomePattern = /(?:^|[\s"'`(\[])\/(?:Users|home\/[a-zA-Z0-9_.-]+|[cde]\/[A-Za-z0-9_.-]+)\//;

for (const file of checkedFiles) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  if (rel.startsWith('tests/') || rel === 'scripts/release-check.mjs') continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const stripped = line.replace(/https?:\/\/[^\s"')\]]+/g, '');
    if (absDrivePattern.test(stripped) || absWorkstationHomePattern.test(stripped)) {
      fail(`Hardcoded workstation absolute path in ${rel}:${idx + 1}: ${line.trim()}`);
    }
  });
}
pass('Zero hardcoded workstation absolute paths policy passed');

// Release manifest policy.
const badTop = ['.git', '.mimosa', 'node_modules'];
for (const d of badTop) if (fs.existsSync(path.join(root,d))) warn(`Local development directory exists in source tree: ${d}; it must be excluded from the production artifact`);
pass('Production-tree exclusion policy recorded');

if (warnings === 0) pass('No release warnings'); else console.log(`[INFO] ${warnings} warning(s)`);
console.log(`\nRelease gate complete: ${errors} error(s), ${warnings} warning(s)`);
process.exitCode = errors ? 1 : 0;
