import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const rootDir = path.resolve(path.dirname(__filename), '..');

// Shared guard checks: each function takes content and returns violations.
// Tests assert them green on the real repository (tests/*.test.mjs) and
// assert they fire on injected-bad samples (tests/ablation.test.mjs), so
// every rule proves it can fail. One rule, one place, two directions.

export function emDashViolations(content) {
  return content.includes('\u2014') ? ['em-dash present'] : [];
}

export function completionContractViolations(content) {
  const v = [];
  if (!/## Checkable Completion Criteria/.test(content)) v.push('missing "## Checkable Completion Criteria" heading');
  else {
    const section = content.split('## Checkable Completion Criteria')[1] || '';
    if (!/- \[ \]/.test(section)) v.push('completion contract has no checklist item');
  }
  return v;
}

export function legacyAgentPathViolations(content) {
  return (content.match(/\.agents\/[^\s`)\]]*/g) || []);
}

export function sharedStateFileViolations(content) {
  const v = [];
  if (/lifecycle-state\.json/.test(content)) v.push('shared lifecycle-state.json (ADR 0003 hazard)');
  for (const ref of content.matchAll(/`(\S*state\.json)`/g)) {
    if (!/^\.scratch\/[<>\w-]+-state\.json$/.test(ref[1])) v.push(`state file "${ref[1]}" not .scratch/<pipeline>-state.json`);
  }
  return v;
}

export function frontmatterFieldViolations(content) {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return ['no frontmatter'];
  const allowed = ['name', 'description', 'disable-model-invocation'];
  return [...fm[1].matchAll(/^([a-z-]+):/gm)]
    .map(m => m[1]).filter(f => !allowed.includes(f));
}

export function descriptionLengthViolations(content, { userLimit = 180, modelLimit = 280, userOnly = false } = {}) {
  const m = content.match(/^description:\s*(.+)$/m);
  if (!m) return ['no description'];
  const len = m[1].trim().replace(/^['"]|['"]$/g, '').length;
  const limit = userOnly ? userLimit : modelLimit;
  return len > limit ? [`description ${len} > ${limit}`] : [];
}

// No-fabrication markers (ADR 0005): text that looks like content but is not.
// Rule text that NAMES a marker (backticked or quoted, e.g. "TODO/FIXME residue")
// is exempt: prose about the rule is not the defect the rule bans.
export function fabricationViolations(content) {
  const v = [];
  if (/lorem ipsum/i.test(content)) v.push('lorem ipsum filler');
  if (/^NaN$/m.test(content)) v.push('stray NaN line');
  // stray control characters (backspace, vertical tab, escape, and other C0
  // controls except tab/newline/cr): batch edits on Windows have shipped them
  // inside docs lines where they silently eat the following character's display
  const ctl = content.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/);
  if (ctl) v.push(`stray control character U+${ctl[0].charCodeAt(0).toString(16).padStart(4, '0')}`);
  const outsideRuleText = content.replace(/`[^`]*`/g, '``');  // strip code spans
  if (/\bTODO:|\bFIXME\b(?![^]*residue)/.test(outsideRuleText)) v.push('TODO/FIXME residue');
  if (/\bXXX\b/.test(outsideRuleText)) v.push('XXX marker');
  // duplicated prose span: words repeated back-to-back (symbols like box-drawing and
  // template slots like GIVEN <x> WHEN <y> are layout, not accidental duplication)
  const proseOnly = outsideRuleText.replace(/[^\w\s]/g, ' ');
  const dup = proseOnly.match(/\b([A-Za-z][\w']+(?:\s+[\w']+){4,})\s+\1\b/);
  if (dup) v.push(`duplicated span: "${dup[1].slice(0, 40)}..."`);
  // graft fragment: a standardized sentence ending mid-air with a stranded clause
  // ("...when a task fits. before planning major features."; the to-variant
  // "...when a task fits. to implement tasks from a plan file." shipped once
  // because the marker's verb list missed it)
  const graft = content.match(/(?:when a task fits|on its own)\.\s+(?:during|when|for|after|before|to)\b/);
  if (graft) v.push(`graft fragment: "${graft[0]}"`);
  return v;
}

export function walkFiles(dir, { exclude = [], exts = /\.(md|json|yaml|yml|mjs|sh|ps1)$/, include = [] } = {}) {
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      const rel = path.relative(rootDir, p).replace(/\\/g, '/');
      if (e.isDirectory()) {
        if (exclude.includes(e.name) || rel.includes('/.git/')) continue;
        walk(p);
      } else if (exts.test(e.name) && !include.length) files.push(p);
      else if (include.some(re => re.test(rel))) files.push(p);
    }
  })(dir);
  return files;
}
