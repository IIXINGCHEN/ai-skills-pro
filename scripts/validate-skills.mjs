import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const buckets = ['engineering', 'productivity', 'design'];
let errors = 0;
let warnings = 0;
let totalSkills = 0;

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
    }

    // Check matching doc in docs/<bucket>/
    if (!fs.existsSync(docPath)) {
      console.warn(`[WARN] Missing companion documentation: ${docPath}`);
      warnings++;
    }

    // Check em-dashes
    if (skillContent.includes('—')) {
      console.error(`[ERROR] em-dash found in ${skillMdPath}`);
      errors++;
    }
  }
}

// 2. Check plugin.json and package.json skills match
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const plugin = JSON.parse(fs.readFileSync(path.join(rootDir, '.claude-plugin', 'plugin.json'), 'utf8'));
const marketplacePath = path.join(rootDir, '.claude-plugin', 'marketplace.json');

if (fs.existsSync(marketplacePath)) {
  try {
    JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
  } catch (err) {
    console.error(`[ERROR] Invalid JSON in ${marketplacePath}: ${err.message}`);
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