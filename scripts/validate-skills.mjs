import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buckets = ['engineering', 'productivity', 'design', 'pipeline'];
const excludedDirectories = new Set(['.agents', '.dsh-vision-toolkit', '.git', 'artifacts', 'node_modules']);
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.mjs', '.yaml', '.yml']);
const discoveredSkills = new Set();
const bareNameToBuckets = new Map();
let errors = 0;
let warnings = 0;
let totalSkills = 0;

function error(message) {
  console.error('[ERROR] ' + message);
  errors++;
}

function warning(message) {
  console.warn('[WARN] ' + message);
  warnings++;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) return [];
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function parseJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (parseError) {
    error('Invalid JSON in ' + filePath + ': ' + parseError.message);
    return null;
  }
}

function parseYamlScalar(rawValue, filePath, lineNumber) {
  const withoutComment = rawValue.replace(/\s+#.*$/, '').trim();
  if (withoutComment.startsWith('"')) {
    try {
      return JSON.parse(withoutComment);
    } catch (parseError) {
      throw new Error(filePath + ':' + lineNumber + ': invalid quoted scalar: ' + parseError.message);
    }
  }
  if (withoutComment.startsWith("'")) {
    if (!withoutComment.endsWith("'") || withoutComment.length < 2) {
      throw new Error(filePath + ':' + lineNumber + ': unterminated single-quoted scalar');
    }
    return withoutComment.slice(1, -1).replaceAll("''", "'");
  }
  if (withoutComment === 'true') return true;
  if (withoutComment === 'false') return false;
  if (withoutComment === 'null') return null;
  if (/^-?\d+(?:\.\d+)?$/.test(withoutComment)) return Number(withoutComment);
  if (/^[\[\]{]|[\]}]$/.test(withoutComment)) {
    throw new Error(filePath + ':' + lineNumber + ': unsupported or malformed collection syntax');
  }
  return withoutComment;
}

function parseSimpleYaml(text, filePath) {
  const root = {};
  const stack = [{ indent: -1, value: root }];
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (!line.trim() || line.trimStart().startsWith('#')) return;
    if (line.includes('\t')) throw new Error(filePath + ':' + lineNumber + ': tabs are not valid indentation');

    const match = line.match(/^(\s*)([A-Za-z_][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
    if (!match) throw new Error(filePath + ':' + lineNumber + ': unsupported or malformed YAML line');
    const indent = match[1].length;
    const key = match[2];
    const rawValue = match[3] ?? '';

    while (stack.length > 1 && stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1).value;
    if (Object.hasOwn(parent, key)) throw new Error(filePath + ':' + lineNumber + ': duplicate key ' + key);

    if (rawValue.trim() === '') {
      const child = {};
      parent[key] = child;
      stack.push({ indent, value: child });
    } else {
      parent[key] = parseYamlScalar(rawValue, filePath, lineNumber);
    }
  });

  return root;
}

function parseYamlFile(filePath) {
  try {
    return parseSimpleYaml(fs.readFileSync(filePath, 'utf8'), filePath);
  } catch (parseError) {
    error('Invalid YAML in ' + filePath + ': ' + parseError.message);
    return null;
  }
}

function duplicateValues(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

function resolveSchemaRef(rootSchema, reference) {
  if (!reference.startsWith('#/')) return null;
  return reference
    .slice(2)
    .split('/')
    .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))
    .reduce((value, part) => value && value[part], rootSchema);
}

function validateSchemaValue(value, schema, rootSchema, location = '$') {
  const issues = [];
  if (!schema) return [location + ': schema node is missing'];
  if (schema.$ref) {
    const resolved = resolveSchemaRef(rootSchema, schema.$ref);
    return resolved
      ? validateSchemaValue(value, resolved, rootSchema, location)
      : [location + ': unresolved schema reference ' + schema.$ref];
  }

  const actualType = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (schema.type) {
    const typeMatches = schema.type === actualType || (schema.type === 'integer' && Number.isInteger(value));
    if (!typeMatches) return [location + ': expected ' + schema.type + ', received ' + actualType];
  }

  if (schema.enum && !schema.enum.includes(value)) issues.push(location + ': value is outside the enum');
  if (typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) issues.push(location + ': shorter than minLength ' + schema.minLength);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) issues.push(location + ': does not match ' + schema.pattern);
    if (schema.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) issues.push(location + ': invalid email address');
  }
  if (Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) issues.push(location + ': fewer than ' + schema.minItems + ' items');
    if (schema.items) value.forEach((item, index) => issues.push(...validateSchemaValue(item, schema.items, rootSchema, location + '[' + index + ']')));
  }
  if (actualType === 'object') {
    const properties = schema.properties || {};
    for (const key of schema.required || []) {
      if (!Object.hasOwn(value, key)) issues.push(location + '.' + key + ': required property is missing');
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(properties, key)) issues.push(location + '.' + key + ': unknown property');
      }
    }
    for (const [key, childSchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, key)) issues.push(...validateSchemaValue(value[key], childSchema, rootSchema, location + '.' + key));
    }
  }
  return issues;
}

function validateExampleFixture(fixture, templatePath) {
  const requireExample = (value, location) => {
    if (typeof value !== 'string' || !value.startsWith('EXAMPLE:')) {
      error('Unmarked Apple fixture content at ' + location + ' in ' + templatePath);
    }
  };
  const requireExampleUrl = (value, location) => {
    if (typeof value !== 'string' || !value.includes('example.invalid')) {
      error('Unmarked Apple fixture destination at ' + location + ' in ' + templatePath);
    }
  };
  const visitLocalizedText = (value, location) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (Object.keys(value).length === 2 && Object.hasOwn(value, 'en') && Object.hasOwn(value, 'zh')) {
        requireExample(value.en, location + '.en');
        requireExample(value.zh, location + '.zh');
        return;
      }
      Object.entries(value).forEach(([key, child]) => visitLocalizedText(child, location + '.' + key));
    } else if (Array.isArray(value)) {
      value.forEach((child, index) => visitLocalizedText(child, location + '[' + index + ']'));
    }
  };

  visitLocalizedText(fixture, '$');
  requireExample(fixture.profile.location, '$.profile.location');
  requireExampleUrl(fixture.profile.email, '$.profile.email');
  if (!String(fixture.profile.media.src).startsWith('data:image/')) {
    error('Apple fixture portrait must use inert inline bitmap data in ' + templatePath);
  }
  fixture.marquee.forEach((value, index) => requireExample(value, '$.marquee[' + index + ']'));
  requireExample(fixture.bento.philosophy.author, '$.bento.philosophy.author');
  fixture.timeline.forEach((item, index) => {
    requireExample(item.period, '$.timeline[' + index + '].period');
    requireExample(item.company, '$.timeline[' + index + '].company');
    item.tags.forEach((value, tagIndex) => requireExample(value, '$.timeline[' + index + '].tags[' + tagIndex + ']'));
  });
  fixture.projects.forEach((item, index) => {
    requireExample(item.category, '$.projects[' + index + '].category');
    item.tags.forEach((value, tagIndex) => requireExample(value, '$.projects[' + index + '].tags[' + tagIndex + ']'));
    if (!String(item.media.src).startsWith('data:image/')) {
      error('Apple fixture project media must use inert inline bitmap data at $.projects[' + index + '].media.src in ' + templatePath);
    }
    requireExampleUrl(item.link, '$.projects[' + index + '].link');
  });
  fixture.articles.forEach((item, index) => {
    requireExample(item.date, '$.articles[' + index + '].date');
    requireExample(item.category, '$.articles[' + index + '].category');
    requireExampleUrl(item.link, '$.articles[' + index + '].link');
  });
  fixture.socials.forEach((item, index) => {
    requireExample(item.name, '$.socials[' + index + '].name');
    requireExampleUrl(item.url, '$.socials[' + index + '].url');
  });
}

function checkModuleSyntax(source, label) {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-skills-pro-module-'));
  const tempPath = path.join(tempDirectory, 'inline-script.mjs');
  try {
    fs.writeFileSync(tempPath, source, 'utf8');
    const result = spawnSync(process.execPath, ['--check', tempPath], { encoding: 'utf8', windowsHide: true });
    if (result.status !== 0) {
      const detail = (result.stderr || result.stdout || 'unknown syntax error').trim();
      error('Invalid module script in ' + label + ': ' + detail);
    }
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

function isCanonicalSkillPath(value) {
  return typeof value === 'string'
    && /^\.\/skills\/(engineering|productivity|design|pipeline)\/[a-z0-9][a-z0-9-]*$/.test(value)
    && !path.isAbsolute(value)
    && !value.includes('..')
    && !value.includes('\\');
}

console.log('--- Validating ai-skills-pro ---');

// 1. Validate skill identity, metadata, and companion docs.
for (const bucket of buckets) {
  const bucketPath = path.join(rootDir, 'skills', bucket);
  if (!fs.existsSync(bucketPath)) {
    error('Missing bucket directory: ' + bucketPath);
    continue;
  }

  for (const entry of fs.readdirSync(bucketPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    totalSkills++;
    const skillDir = path.join(bucketPath, entry.name);
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    const yamlPath = path.join(skillDir, 'agents', 'openai.yaml');
    const docPath = path.join(rootDir, 'docs', bucket, entry.name + '.md');
    const canonicalPath = './skills/' + bucket + '/' + entry.name;
    discoveredSkills.add(canonicalPath);
    if (!bareNameToBuckets.has(entry.name)) bareNameToBuckets.set(entry.name, []);
    bareNameToBuckets.get(entry.name).push(bucket);

    if (!fs.existsSync(skillMdPath)) {
      error('Missing SKILL.md in ' + skillDir);
      continue;
    }
    const skillContent = fs.readFileSync(skillMdPath, 'utf8');
    const frontmatterMatch = skillContent.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!frontmatterMatch) {
      error('Invalid or missing YAML frontmatter in ' + skillMdPath);
      continue;
    }
    let frontmatter = null;
    try {
      frontmatter = parseSimpleYaml(frontmatterMatch[1], skillMdPath);
    } catch (parseError) {
      error('Invalid YAML frontmatter in ' + skillMdPath + ': ' + parseError.message);
    }
    if (frontmatter) {
      if (frontmatter.name !== entry.name) error('Frontmatter name does not match folder in ' + skillMdPath);
      if (typeof frontmatter.description !== 'string' || !frontmatter.description.trim()) error('Missing string description in ' + skillMdPath);
    }

    if (!fs.existsSync(yamlPath)) {
      error('Missing agents/openai.yaml in ' + skillDir);
    } else {
      const metadata = parseYamlFile(yamlPath);
      if (metadata) {
        if (!metadata.interface || typeof metadata.interface.display_name !== 'string' || !metadata.interface.display_name.trim()) {
          error('Missing interface.display_name string in ' + yamlPath);
        }
        if (frontmatter?.['disable-model-invocation'] === true && metadata.policy?.allow_implicit_invocation !== false) {
          error(skillDir + ' disables model invocation but metadata policy is not false');
        }
      }
    }
    if (!fs.existsSync(docPath)) warning('Missing companion documentation: ' + docPath);
  }
}

// 1b. Bare skill names must be unique across buckets: link-skills.sh links by
// bare name, so a same-named skill in two buckets would silently overwrite at install.
for (const [bareName, bucketList] of bareNameToBuckets) {
  if (bucketList.length > 1) {
    error('Duplicate bare skill name across buckets (install collision): ' + bareName + ' in ' + bucketList.join(', '));
  }
}

// 2. Validate shipped prose and structured reference files.
for (const filePath of walkFiles(rootDir)) {
  if (!textExtensions.has(path.extname(filePath).toLowerCase())) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('\u2014')) error('em-dash found in ' + filePath);
}
for (const jsonPath of walkFiles(path.join(rootDir, 'skills')).filter((filePath) => filePath.endsWith('.json'))) parseJson(jsonPath);

// 3. Validate canonical registry parity and completeness.
const packagePath = path.join(rootDir, 'package.json');
const pluginPath = path.join(rootDir, '.claude-plugin', 'plugin.json');
const pkg = parseJson(packagePath);
const plugin = parseJson(pluginPath);
const marketplacePath = path.join(rootDir, '.claude-plugin', 'marketplace.json');
if (fs.existsSync(marketplacePath)) parseJson(marketplacePath);

if (pkg && plugin) {
  const packageSkills = Array.isArray(pkg.skills) ? pkg.skills : [];
  const pluginSkills = Array.isArray(plugin.skills) ? plugin.skills : [];
  if (!Array.isArray(pkg.skills)) error('package.json skills must be an array');
  if (!Array.isArray(plugin.skills)) error('plugin.json skills must be an array');
  packageSkills.forEach((value) => { if (!isCanonicalSkillPath(value)) error('Noncanonical package.json skill path: ' + value); });
  pluginSkills.forEach((value) => { if (!isCanonicalSkillPath(value)) error('Noncanonical plugin.json skill path: ' + value); });
  duplicateValues(packageSkills).forEach((value) => error('Duplicate package.json skill registration: ' + value));
  duplicateValues(pluginSkills).forEach((value) => error('Duplicate plugin.json skill registration: ' + value));

  const packageSet = new Set(packageSkills);
  const pluginSet = new Set(pluginSkills);
  for (const skillPath of discoveredSkills) {
    if (!packageSet.has(skillPath)) error('Discovered skill is missing from package.json: ' + skillPath);
    if (!pluginSet.has(skillPath)) error('Discovered skill is missing from plugin.json: ' + skillPath);
  }
  for (const skillPath of packageSet) {
    if (!discoveredSkills.has(skillPath)) error('package.json contains an undiscovered skill: ' + skillPath);
    if (!pluginSet.has(skillPath)) error('Skill is in package.json but missing from plugin.json: ' + skillPath);
  }
  for (const skillPath of pluginSet) {
    if (!discoveredSkills.has(skillPath)) error('plugin.json contains an undiscovered skill: ' + skillPath);
    if (!packageSet.has(skillPath)) error('Skill is in plugin.json but missing from package.json: ' + skillPath);
  }
}

// 4. Validate published skill counts against discovery.
const readmePath = path.join(rootDir, 'README.md');
const readmeZhPath = path.join(rootDir, 'README.zh-CN.md');
const readme = fs.readFileSync(readmePath, 'utf8');
const readmeZh = fs.readFileSync(readmeZhPath, 'utf8');
const countChecks = [
  [readme, totalSkills + ' skills', readmePath],
  [readme, 'skills-' + totalSkills + '-blue', readmePath],
  [readme, 'validation-' + totalSkills + '%2F' + totalSkills + '%20pass', readmePath],
  [readme, 'all ' + totalSkills + ' skills', readmePath],
  [readmeZh, totalSkills + ' 个技能', readmeZhPath],
  [readmeZh, 'skills-' + totalSkills + '-blue', readmeZhPath],
  [readmeZh, 'validation-' + totalSkills + '%2F' + totalSkills + '%20pass', readmeZhPath],
  [readmeZh, '全部 ' + totalSkills + ' 个技能', readmeZhPath]
];
countChecks.forEach(([content, expected, filePath]) => {
  if (!content.includes(expected)) error('Published skill count is stale in ' + filePath + ': missing ' + expected);
});

// 5. Validate the Apple template fixture, syntax, and explicit render-sink contract.
const appleSchemaPath = path.join(rootDir, 'skills', 'design', 'vis-apple-portfolio', 'references', 'data-contract.json');
const appleTemplatePath = path.join(rootDir, 'skills', 'design', 'vis-apple-portfolio', 'references', 'template.html');
const appleSchema = parseJson(appleSchemaPath);
if (appleSchema && fs.existsSync(appleTemplatePath)) {
  const html = fs.readFileSync(appleTemplatePath, 'utf8');
  const dataMatch = html.match(/<script\s+type=["']application\/json["']\s+id=["']site-data["']>([\s\S]*?)<\/script>/i);
  if (!dataMatch) {
    error('Missing site-data JSON script in ' + appleTemplatePath);
  } else {
    try {
      const fixture = JSON.parse(dataMatch[1]);
      validateSchemaValue(fixture, appleSchema, appleSchema).forEach((issue) => error('Apple template data contract violation: ' + issue));
      validateExampleFixture(fixture, appleTemplatePath);
    } catch (parseError) {
      error('Invalid site-data JSON in ' + appleTemplatePath + ': ' + parseError.message);
    }
  }

  const moduleScripts = [...html.matchAll(/<script\s+type=["']module["']>([\s\S]*?)<\/script>/gi)];
  if (moduleScripts.length === 0) error('Missing module script in ' + appleTemplatePath);
  moduleScripts.forEach((match, index) => checkModuleSyntax(match[1], appleTemplatePath + '#module-' + (index + 1)));

  const forbiddenSinks = [
    [/\.innerHTML\s*=/i, 'innerHTML assignment'],
    [/\.outerHTML\s*=/i, 'outerHTML assignment'],
    [/insertAdjacentHTML\s*\(/i, 'insertAdjacentHTML call'],
    [/document\.write(?:ln)?\s*\(/i, 'document.write call'],
    [/\.srcdoc\s*=/i, 'srcdoc assignment'],
    [/<[^>]+\son[a-z]+\s*=/i, 'inline event handler']
  ];
  forbiddenSinks.forEach(([pattern, label]) => {
    if (pattern.test(html)) error('Forbidden ' + label + ' in ' + appleTemplatePath);
  });
}

console.log('\nValidation complete:');
console.log('  Total skills validated: ' + totalSkills);
console.log('  Errors: ' + errors);
console.log('  Warnings: ' + warnings);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('All skills passed structural validation (frontmatter, manifests, references, prose rules).');
  process.exit(0);
}
