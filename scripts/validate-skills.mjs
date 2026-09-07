import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getVersion } from './version.mjs';
import { buildSkillGraph, validateGraph } from './generate-manifests.mjs';
import { readJson } from './read-json.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const buckets = ['engineering', 'productivity', 'design'];
let errors = 0;
let warnings = 0;
let totalSkills = 0;

// CLI boundary: a load error (missing file, invalid JSON) must exit as a
// single named line counted as an error, not an unhandled-throw dump.
process.on('uncaughtException', (err) => {
  console.error(`[ERROR] ${err.message}`);
  process.exit(1);
});

console.log('--- Validating ai-skills-pro ---');

// 1. Check skills directory & documentation correspondence
for (const bucket of buckets) {
  const bucketPath = path.join(rootDir, 'skills', bucket);
  if (!fs.existsSync(bucketPath)) {
    console.error(`[ERROR] Missing bucket directory: ${bucketPath}`);
    errors++;
    continue;
  }

  const entries = fs.readdirSync(bucketPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    totalSkills++;
    const skillDir = path.join(bucketPath, entry.name);
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    const yamlPath = path.join(skillDir, 'agents', 'openai.yaml');
    const docPath = path.join(rootDir, 'docs', bucket, `${entry.name}.md`);

    // Check SKILL.md
    if (!fs.existsSync(skillMdPath)) {
      console.error(`[ERROR] Missing SKILL.md in ${skillDir}`);
      errors++;
      continue;
    }

    const skillContent = fs.readFileSync(skillMdPath, 'utf8');

    // Check frontmatter
    const fmMatch = skillContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) {
      console.error(`[ERROR] Invalid or missing YAML frontmatter in ${skillMdPath}`);
      errors++;
      continue;
    }

    const fm = fmMatch[1];
    if (fm.includes('#') || fm.split('\n').length > 8) {
      console.error(`[ERROR] Frontmatter closing delimiter '---' missing or malformed in ${skillMdPath}`);
      errors++;
    }
    const hasName = /^name:\s*.+$/m.test(fm);
    const hasDesc = /^description:\s*.+$/m.test(fm);
    const isUserOnly = /^disable-model-invocation:\s*true/m.test(fm);

    if (!hasName) {
      console.error(`[ERROR] Missing 'name' in frontmatter: ${skillMdPath}`);
      errors++;
    }
    if (!hasDesc) {
      console.error(`[ERROR] Missing 'description' in frontmatter: ${skillMdPath}`);
      errors++;
    }

    // Check agents/openai.yaml
    if (!fs.existsSync(yamlPath)) {
      console.error(`[ERROR] Missing agents/openai.yaml in ${skillDir}`);
      errors++;
    } else {
      const yamlContent = fs.readFileSync(yamlPath, 'utf8');
      const hasDisplayName = /display_name:\s*.+/.test(yamlContent);
      if (!hasDisplayName) {
        console.warn(`[WARN] Missing display_name in ${yamlPath}`);
        warnings++;
      }
      const hasPolicyFalse = /allow_implicit_invocation:\s*false/.test(yamlContent);
      if (isUserOnly && !hasPolicyFalse) {
        console.error(`[ERROR] ${skillDir} has disable-model-invocation: true but openai.yaml lacks allow_implicit_invocation: false`);
        errors++;
      }
      const hasPolicyBlock = /(?:^|\n)policy:/m.test(yamlContent);
      if (!isUserOnly && hasPolicyBlock) {
        console.error(`[ERROR] ${skillDir} is model-invoked but openai.yaml contains a policy block`);
        errors++;
      }
      if (isUserOnly) {
        const descMatch = fm.match(/^description:\s*(.+)$/m);
        if (descMatch) {
          const desc = descMatch[1].replace(/^['\"]|['\"]$/g, '');
          if (desc.length > 180) {
            console.error(`[ERROR] User-invoked skill description is too long: ${skillMdPath}`);
            errors++;
          }
          if (/\bUse when\b|\bwhen the user\b|\bmentions\b|\basks for\b/i.test(desc)) {
            console.error(`[ERROR] User-invoked description contains model-trigger phrasing: ${skillMdPath}`);
            errors++;
          }
        }
      }
    }

    // Check matching doc in docs/<bucket>/
    if (!fs.existsSync(docPath)) {
      console.warn(`[WARN] Missing companion documentation: ${docPath}`);
      warnings++;
    }

    // Check em-dashes
    if (skillContent.includes('\u2014')) {
      console.error(`[ERROR] em-dash found in ${skillMdPath}`);
      errors++;
    }
  }
}

// 2. Check plugin.json and package.json skills match
const expectedVersion = getVersion();
const pkg = readJson(path.join(rootDir, 'package.json'));
const plugin = readJson(path.join(rootDir, '.claude-plugin', 'plugin.json'));
const marketplacePath = path.join(rootDir, '.claude-plugin', 'marketplace.json');

if (pkg.version !== expectedVersion) {
  console.error(`[ERROR] package.json version ${pkg.version} does not match VERSION ${expectedVersion}`);
  errors++;
}
if (plugin.version !== expectedVersion) {
  console.error(`[ERROR] plugin.json version ${plugin.version} does not match VERSION ${expectedVersion}`);
  errors++;
}

if (fs.existsSync(marketplacePath)) {
  try {
    readJson(marketplacePath);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    errors++;
  }
}

for (const s of pkg.skills) {
  const fullPath = path.join(rootDir, s);
  if (!fs.existsSync(fullPath)) {
    console.error(`[ERROR] package.json points to non-existent skill: ${s}`);
    errors++;
  }
}

for (const s of plugin.skills) {
  const fullPath = path.join(rootDir, s);
  if (!fs.existsSync(fullPath)) {
    console.error(`[ERROR] plugin.json points to non-existent skill: ${s}`);
    errors++;
  }
}

// 3. Dependency graph integrity + manifest freshness
const graph = buildSkillGraph();
for (const problem of validateGraph(graph)) {
  console.error(`[ERROR] Dependency graph: ${problem}`);
  errors++;
}

const registryPath = path.join(rootDir, 'registry', 'skills.json');
if (!fs.existsSync(registryPath)) {
  console.error(`[ERROR] registry/skills.json missing - run "npm run generate:manifests"`);
  errors++;
} else {
  const registry = readJson(registryPath);
  const regSkills = registry.skills.map(s => s.name).sort();
  const graphNames = graph.map(s => s.name).sort();
  if (JSON.stringify(regSkills) !== JSON.stringify(graphNames)) {
    console.error('[ERROR] registry/skills.json is stale - regenerate with "npm run generate:manifests"');
    errors++;
  }
  if (registry.version !== expectedVersion) {
    console.error(`[ERROR] registry version ${registry.version} does not match VERSION ${expectedVersion} - regenerate manifests`);
    errors++;
  }
}

for (const skill of graph) {
  const manifestPath = path.join(rootDir, skill.dir, 'manifest.yaml');
  if (!fs.existsSync(manifestPath)) {
    console.error(`[ERROR] Missing manifest.yaml for ${skill.name} - run "npm run generate:manifests"`);
    errors++;
  }
}

console.log(`\nValidation complete:`);
console.log(`  Total skills validated: ${totalSkills}`);
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('All skills and configurations are verified and compliant!');
  process.exit(0);
}
