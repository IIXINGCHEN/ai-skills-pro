// export-distillation-directory.mjs
// Generate an everythingskill.net-compatible directory entry from this
// package's metadata, so the skill pack can be submitted to skill
// distillation directories and discovered by other developers.
//
// Usage: node scripts/export-distillation-directory.mjs [--out <path>]
// Default output: dist/everythingskill-entry.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outPath = outIdx >= 0 && args[outIdx + 1]
  ? path.resolve(args[outIdx + 1])
  : path.join(rootDir, 'dist', 'everythingskill-entry.json');

const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// Count skills from the canonical registry.
const skillCount = Array.isArray(pkg.skills) ? pkg.skills.length : 0;

// Chinese summary: first meaningful paragraph of README.zh-CN.md.
const zhReadme = fs.readFileSync(path.join(rootDir, 'README.zh-CN.md'), 'utf8');
const zhLead = (zhReadme.match(/^> (.+)$/m) || [])[1] || '';
const summaryZh = zhLead.split('。')[0] + '。';

const today = new Date().toISOString().slice(0, 10);

// Preserve the original addedAt when regenerating an existing entry, so
// repeated runs stay reproducible; only updatedAt refreshes each run.
let addedAt = today;
try {
  const prev = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  if (prev && typeof prev.addedAt === 'string' && prev.addedAt) addedAt = prev.addedAt;
} catch { /* fresh entry: keep today */ }

const entry = {
  id: 'ai-skills-pro',
  slug: 'ai-skills-pro',
  name: 'ai-skills-pro',
  nameZh: 'AI Skills Pro 技能库',
  summary: pkg.description,
  summaryZh,
  detailIntroZh:
    `生产级模块化 AI Agent 技能库，共 ${skillCount} 个技能，覆盖工程、生产力、设计、流水线四大领域。` +
    `包含 pipe-ship 端到端流水线（拷问、规格、任务、实现、审查、深化、交付、部署），每个阶段都有人工门禁。` +
    `全部技能带可勾选验收标准与多 harness 接口元数据（Claude Code、OpenAI Codex、DeepSeek Harness、Cursor），` +
    `自带校验器保证结构合规，可直接作为其他开发者蒸馏技能时的元数据参考与复用基础。`,
  category: 'tool',
  author: 'IIXINGCHEN',
  github: 'https://github.com/IIXINGCHEN/ai-skills-pro',
  stars: 0,
  tags: ['engineering', 'pipeline', 'code-review', 'devops', 'skills', 'claude-code'],
  featured: false,
  addedAt,
  updatedAt: today,
  readmeLocales: ['en', 'zh'],
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(entry, null, 2) + '\n', 'utf8');
console.log('Wrote ' + outPath + ' (' + skillCount + ' skills in registry)');
console.log(JSON.stringify(entry, null, 2));
