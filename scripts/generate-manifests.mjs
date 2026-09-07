import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getVersion } from './version.mjs';
import { readJson } from './read-json.mjs';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

const buckets = ['engineering', 'productivity', 'design'];

// Skill Tool edges extracted from SKILL.md: "Call the Skill tool with \"<name>\"".
const CALL_RE = /Call the Skill tool with "([a-z0-9-]+)"/g;
// Human redirects: "run `/<skill-name>`". The leading slash is required: a
// slash-less prose mention ("run `eng-multidimensional-audit`" inside a review
// step) describes work, it does not hand the user a command, so it must not
// become a redirect entry.
const REDIRECT_RE = /run `\/([a-z0-9-]+)`/g;

// Risk classification: what the skill is allowed to do to its environment.
// Rule (applies to both curated entries and the heuristic fallback):
//   low      = read/analyze only; output is a report, doc, or in-conversation answer
//   medium   = executes project code (tests/builds/repro) or runs local tooling
//   high     = modifies source code/artifacts or orchestrates those changes
//   critical = host, infra, remote (push/PR/deploy), or destructive-capable operations
//
// Governance fields (mirrors the yao-meta-skill manifest model):
//   owner          = accountable team for review
//   status         = active | deprecated | archived | experimental
//   maturity       = scaffold | production | library | governed
//                    (production = team-usable; library = shared across teams;
//                     governed = release-critical, security policy mandatory)
//   reviewCadence  = how often review_due gets renewed (quarterly | monthly | annually)
//   reviewDue      = ISO date; validate warns when past due, blocks governed releases
//
// Network-capable skills must also carry an entry in security/network_policy.json
// (allowed_hosts etc.); governance_check enforces the pairing.
// export for tests: every packaged skill must be classified here.
export const CURATED = {
  'eng-adversarial-audit':        { risk: 'low',      write: false, shell: true,  net: false, owner: 'security',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-analyze-codebase':         { risk: 'low',      write: false, shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-bugfix-implement':         { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-bugfix-rca':               { risk: 'medium',   write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-change-scope-funnel':      { risk: 'low',      write: false, shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-code-review':              { risk: 'low',      write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-completion-gate':          { risk: 'low',      write: true,  shell: false, net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-defect-lifecycle':         { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-destructive-safety-gate':  { risk: 'critical', write: false, shell: false, net: false, owner: 'security',  status: 'active', maturity: 'governed',  reviewCadence: 'quarterly' },
  'eng-docker-update':            { risk: 'critical', write: true,  shell: true,  net: true,  owner: 'infra',     status: 'active', maturity: 'governed',  reviewCadence: 'quarterly' },
  'eng-enterprise-lifecycle':     { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-execute':                  { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-git-commit':               { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-git-pr':                   { risk: 'critical', write: true,  shell: true,  net: true,  owner: 'platform',  status: 'active', maturity: 'governed',  reviewCadence: 'quarterly' },
  'eng-hardening-review':         { risk: 'high',     write: true,  shell: true,  net: false, owner: 'security',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-hotfix-emergency-lifecycle': { risk: 'high',   write: true,  shell: true,  net: false, owner: 'sre',       status: 'active', maturity: 'governed',  reviewCadence: 'monthly'   },
  'eng-linux-security':           { risk: 'critical', write: true,  shell: true,  net: false, owner: 'infra',     status: 'active', maturity: 'governed',  reviewCadence: 'monthly'   },
  'eng-multidimensional-audit':   { risk: 'low',      write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-onboarding-audit-lifecycle': { risk: 'low',    write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-plan':                     { risk: 'low',      write: true,  shell: false, net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-prime-context':            { risk: 'low',      write: false, shell: false, net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-refactor-lifecycle':       { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-release-ops-lifecycle':    { risk: 'critical', write: true,  shell: true,  net: true,  owner: 'infra',     status: 'active', maturity: 'governed',  reviewCadence: 'quarterly' },
  'eng-review-and-fix':           { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'governed',  reviewCadence: 'quarterly' },
  'eng-review-and-ship':          { risk: 'critical', write: true,  shell: true,  net: true,  owner: 'platform',  status: 'active', maturity: 'governed',  reviewCadence: 'quarterly' },
  'eng-skill-create':             { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-skill-optimize':           { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'eng-review-fix':               { risk: 'high',     write: true,  shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-router':                   { risk: 'low',      write: false, shell: false, net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-spec':                     { risk: 'low',      write: true,  shell: false, net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'eng-validate':                 { risk: 'medium',   write: false, shell: true,  net: false, owner: 'platform',  status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'prod-briefing-loop':           { risk: 'low',      write: false, shell: false, net: false, owner: 'product',   status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'prod-compress-context':        { risk: 'low',      write: true,  shell: false, net: false, owner: 'product',   status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'prod-content-delivery-lifecycle': { risk: 'low',   write: true,  shell: false, net: false, owner: 'product',   status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'prod-create-prd':              { risk: 'low',      write: true,  shell: false, net: false, owner: 'product',   status: 'active', maturity: 'library',   reviewCadence: 'quarterly' },
  'prod-execution-report':        { risk: 'low',      write: true,  shell: false, net: false, owner: 'product',   status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'prod-project-init':            { risk: 'low',      write: true,  shell: true,  net: false, owner: 'product',   status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'prod-system-review':           { risk: 'low',      write: true,  shell: false, net: false, owner: 'product',   status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'cog-axiom':                    { risk: 'low',      write: false, shell: false, net: false, owner: 'architecture', status: 'active', maturity: 'library',  reviewCadence: 'quarterly' },
  'vis-product-design':           { risk: 'low',      write: true,  shell: false, net: false, owner: 'design',    status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'vis-product-web':              { risk: 'medium',   write: true,  shell: true,  net: false, owner: 'design',    status: 'active', maturity: 'production', reviewCadence: 'quarterly' },
  'vis-reverse-ui':               { risk: 'low',      write: false, shell: true,  net: true,  owner: 'design',    status: 'active', maturity: 'governed',  reviewCadence: 'quarterly' }
};

// Heuristic fallback for skills not yet in CURATED. New skills must be curated
// before release; tests fail the gate if any packaged skill lacks a curated entry.
const RISK_RULES = [
  { re: /destructive|force push|firewall|intrusion|rm -rf|irreversible/i, level: 'critical' },
  { re: /git commit|git push|docker|deploy|release|hotfix|ship/i, level: 'high' },
  { re: /review|audit|analyz|inspect|plan|spec|report/i, level: 'low' }
];

// Permission footprint per skill: curated when available, heuristic otherwise.
function classifyPermissions(name, content, risk) {
  const curated = CURATED[name];
  if (curated) {
    return {
      filesystem: { read: true, write: curated.write },
      shell: { execute: curated.shell },
      network: { access: curated.net }
    };
  }
  const writesArtifacts = /\.(agents|specs|reports|docs?)\//.test(content) ||
    /write|save|archive|create .+ (file|report|commit|PR)/i.test(content);
  const runsValidation = /eng-validate|lint|type check|test suite|build verification/i.test(content);
  const vcsAction = /git (commit|push|pr)|pull request/i.test(content);
  const infraAction = /docker|compose|firewall|systemctl|host/i.test(content);
  const networkFetch = /fetch|curl|http|url|web search/i.test(content);
  return {
    filesystem: { read: true, write: writesArtifacts || vcsAction || infraAction },
    shell: { execute: writesArtifacts || runsValidation || vcsAction || infraAction },
    network: { access: networkFetch }
  };
}

function yamlEscape(v) {
  return `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function yamlValue(v, indent) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '\n' + v.map(item => `${indent}  - ${yamlValue(item, indent + '  ')}`).join('\n');
  }
  if (typeof v === 'object') {
    const pad = indent + '  ';
    return '\n' + Object.entries(v).map(([k, val]) => `${pad}${k}: ${yamlValue(val, pad)}`).join('\n');
  }
  return yamlEscape(v);
}

function yamlKey(key, val, indent) {
  if (val === null || val === undefined) return `${indent}${key}: null`;
  if (typeof val === 'boolean' || typeof val === 'number') return `${indent}${key}: ${val}`;
  const rendered = yamlValue(val, indent);
  // Inline scalars (e.g. an empty flow sequence "[]") need the space after the
  // mapping colon: YAML 1.1 parsers read "key:[]" as a plain scalar, not a
  // mapping entry. Block (newline-led) values carry their own indentation.
  return `${indent}${key}:${rendered.startsWith('\n') ? '' : ' '}${rendered}`;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(name|description):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
  }
  return fm;
}

// Review-due derivation: reviewCadence sets how far out the next review lands.
// A review is renewed by touching the curated entry or re-running generation on
// an explicit review; the date is deterministic from cadence so regeneration
// never silently extends an overdue review.
const CADENCE_MONTHS = { monthly: 1, quarterly: 3, annually: 12 };
const GOVERNANCE_EPOCH = '2026-09-06'; // date of the governance-metadata introduction
function reviewDueFor(cadence) {
  const months = CADENCE_MONTHS[cadence] || 3;
  const d = new Date(GOVERNANCE_EPOCH + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function buildSkillGraph() {
  const skills = [];
  for (const bucket of buckets) {
    const bucketPath = path.join(rootDir, 'skills', bucket);
    for (const entry of fs.readdirSync(bucketPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillDir = path.join(bucketPath, entry.name);
      const skillMd = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
      const fm = parseFrontmatter(skillMd);
      const userOnly = /^disable-model-invocation:\s*true/m.test(
        (skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/) || ['', ''])[1]);

      const deps = new Set();
      let match;
      CALL_RE.lastIndex = 0;
      while ((match = CALL_RE.exec(skillMd)) !== null) deps.add(match[1]);
      const redirects = new Set();
      REDIRECT_RE.lastIndex = 0;
      while ((match = REDIRECT_RE.exec(skillMd)) !== null) redirects.add(match[1]);

      const curated = CURATED[entry.name];
      const rule = curated
        ? { level: curated.risk }
        : RISK_RULES.find(r => r.re.test(`${entry.name} ${skillMd}`));
      const risk = rule ? rule.level : 'medium';

      const contextBudget = skillMd.length <= 4096 ? 'lean'
        : skillMd.length <= 8192 ? 'standard'
        : 'heavy';

      skills.push({
        name: fm.name || entry.name,
        bucket,
        dir: `skills/${bucket}/${entry.name}`,
        description: fm.description || '',
        invocation: userOnly ? 'user' : 'model',
        risk,
        governance: curated ? {
          owner: curated.owner,
          status: curated.status,
          maturity: curated.maturity,
          reviewCadence: curated.reviewCadence,
          reviewDue: reviewDueFor(curated.reviewCadence)
        } : null,
        contextBudget,
        permissions: classifyPermissions(entry.name, skillMd, risk),
        dependencies: { required: [...deps].sort(), redirects: [...redirects].filter(r => !deps.has(r)).sort() },
        hasDocs: fs.existsSync(path.join(rootDir, 'docs', bucket, `${entry.name}.md`))
      });
    }
  }
  return skills;
}

// Manifest-level validation: dependency edges must resolve to existing
// model-invoked skills, and no skill may depend on itself.
export function validateGraph(skills) {
  const problems = [];
  const byName = new Map(skills.map(s => [s.name, s]));
  for (const skill of skills) {
    for (const dep of skill.dependencies.required) {
      const target = byName.get(dep);
      if (!target) {
        problems.push(`${skill.name} depends on missing skill "${dep}"`);
      } else if (target.invocation === 'user') {
        problems.push(`${skill.name} Skill Tool-calls user-invoked skill "${dep}" (contract violation)`);
      }
    }
    for (const dep of skill.dependencies.redirects) {
      if (!byName.has(dep)) problems.push(`${skill.name} redirects to missing skill "/${dep}"`);
    }
    if (skill.dependencies.required.includes(skill.name)) {
      problems.push(`${skill.name} depends on itself`);
    }
  }
  // Cycle detection (DFS with color marking).
  const color = new Map();
  const stack = [];
  function visit(node) {
    color.set(node, 'gray');
    stack.push(node);
    for (const dep of (byName.get(node)?.dependencies.required || [])) {
      if (!byName.has(dep)) continue;
      const c = color.get(dep);
      if (c === 'gray') {
        const cycle = stack.slice(stack.indexOf(dep)).concat(dep);
        problems.push(`dependency cycle: ${cycle.join(' -> ')}`);
      } else if (!c) {
        visit(dep);
      }
    }
    stack.pop();
    color.set(node, 'black');
  }
  for (const s of skills) if (!color.has(s.name)) visit(s.name);
  return [...new Set(problems)];
}

export function generateManifests() {
  const skills = buildSkillGraph();
  let generated = 0;
  for (const skill of skills) {
    const manifestPath = path.join(rootDir, skill.dir, 'manifest.yaml');
    const lines = [
      '# Generated by scripts/generate-manifests.mjs; do not edit by hand.',
      `# Regenerate with: npm run generate:manifests`,
      `name: ${skill.name}`,
      `version: "${getVersion()}"`,
      `category: ${skill.bucket}`,
      `invocation: ${skill.invocation}`,
      `risk:`,
      `  level: ${skill.risk}`,
      `governance:`,
      `  owner: ${skill.governance.owner}`,
      `  status: ${skill.governance.status}`,
      `  maturity: ${skill.governance.maturity}`,
      `  review_cadence: ${skill.governance.reviewCadence}`,
      `  review_due: "${skill.governance.reviewDue}"`,
      `context_budget: ${skill.contextBudget}`,
      `description: ${yamlValue(skill.description, '')}`,
      `permissions:`,
      ...Object.entries(skill.permissions).map(([cap, grant]) =>
        yamlKey(cap, grant, '  ')),
      `dependencies:`,
      yamlKey('required', skill.dependencies.required, '  '),
      yamlKey('redirects', skill.dependencies.redirects, '  ')
    ];
    fs.writeFileSync(manifestPath, lines.join('\n') + '\n', 'utf8');
    generated++;
  }

  const registry = {
    version: getVersion(),
    generatedAt: new Date().toISOString(),
    skills: skills.map(s => ({
      name: s.name,
      path: s.dir,
      category: s.bucket,
      invocation: s.invocation,
      risk: s.risk,
      governance: s.governance,
      context_budget: s.contextBudget,
      sha256: skillDirHash(s.dir),
      dependencies: s.dependencies,
      permissions: s.permissions,
      docs: s.hasDocs ? `docs/${s.bucket}/${s.name}.md` : null
    }))
  };
  const registryDir = path.join(rootDir, 'registry');
  fs.mkdirSync(registryDir, { recursive: true });
  fs.writeFileSync(path.join(registryDir, 'skills.json'),
    JSON.stringify(registry, null, 2) + '\n', 'utf8');
  console.log(`Generated ${generated} manifests + registry/skills.json`);
}

// Deterministic content hash over the skill's source of truth (SKILL.md plus
// openai.yaml and manifest inputs); regenerating after an edit changes it,
// regeneration alone does not. Excludes generated manifest.yaml itself.
export function skillDirHash(relDir) {
  const dir = path.join(rootDir, relDir);
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name === 'manifest.yaml') continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else files.push(path.relative(rootDir, p));
    }
  })(dir);
  const h = crypto.createHash('sha256');
  for (const rel of files.sort()) {
    h.update(rel.replace(/\\/g, '/'));
    h.update(fs.readFileSync(path.join(rootDir, rel)));
  }
  return h.digest('hex').slice(0, 16);
}

// CLI entry: regenerate manifests and report graph problems.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  generateManifests();
  const skills = buildSkillGraph();
  const problems = validateGraph(skills);
  // Every packaged skill must have a curated risk/permission entry.
  for (const s of skills) {
    if (!CURATED[s.name]) problems.push(`${s.name} has no curated risk/permission entry; add it to CURATED in generate-manifests.mjs`);
  }
  // Governance freshness: an overdue review blocks governed releases and
  // warns otherwise; network skills need a security/network_policy entry.
  const netPolicy = readJson(path.join(rootDir, 'security', 'network_policy.json'));
  const today = new Date().toISOString().slice(0, 10);
  for (const s of skills) {
    if (!s.governance) continue;
    if (s.governance.reviewDue < today) {
      problems.push(`${s.name}: review overdue (due ${s.governance.reviewDue}); renew the CURATED review in generate-manifests.mjs`);
    }
    if (s.permissions.network.access) {
      const entry = (netPolicy.skills || {})[s.name];
      if (!entry) problems.push(`${s.name}: network access declared but security/network_policy.json has no entry for it`);
      else if (entry.expires_at < today) problems.push(`${s.name}: network policy approval expired ${entry.expires_at}; re-approve`);
    }
  }
  if (problems.length) {
    console.error('Graph problems:');
    for (const p of problems) console.error(`  [ERROR] ${p}`);
    process.exit(1);
  }
  console.log('Dependency graph valid: no dangling edges, no user-invoked targets, no cycles, all skills curated, governance fresh.');
}
