import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { readJson } from './read-json.mjs';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

// Output-contract evaluator: asserts that the artifacts flagship skills promise
// are structurally deliverable. Each suite in evals/output_contracts.json names
// required sections and format invariants; fixtures under evals/output/fixtures/
// hold exemplar artifacts the skills themselves must be able to produce.
//
// This checks the CONTRACT (structure), not content quality: a passing plan
// fixture proves the template is complete and self-consistent, so when a skill
// deviates from it, the deviation is the skill's error, not the template's gap.

function fixtureFiles(dir) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else out.push(p);
    }
  })(dir);
  return out;
}

export function runOutputEval() {
  const contracts = readJson(path.join(rootDir, 'evals', 'output_contracts.json'));
  const results = [];
  const failures = [];

  for (const [skill, contract] of Object.entries(contracts.suites)) {
    for (const fixtureRel of contract.fixtures) {
      const dir = path.join(rootDir, fixtureRel);
      if (!fs.existsSync(dir)) {
        failures.push({ skill, check: 'fixture-exists', detail: `${fixtureRel} missing` });
        continue;
      }
      const files = fixtureFiles(dir);
      // merge all fixture markdown into one surface for section checks
      const text = files.filter(f => f.endsWith('.md'))
        .map(f => fs.readFileSync(f, 'utf8')).join('\n');

      for (const section of contract.required_sections) {
        const ok = new RegExp(`#+[^\\n]*${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);
        (ok ? results : failures).push({ skill, check: `section:${section}`, fixture: fixtureRel,
          detail: ok ? '' : `required section "${section}" absent from fixture` });
      }

      // ticket-level fields (eng-plan style suites)
      if (contract.ticket_required_fields) {
        const tickets = files.filter(f => /tickets[/\\]/.test(f) && f.endsWith('.md'));
        if (tickets.length === 0) {
          failures.push({ skill, check: 'tickets-present', fixture: fixtureRel, detail: 'no ticket files under tickets/' });
        }
        for (const t of tickets) {
          const tText = fs.readFileSync(t, 'utf8');
          for (const field of contract.ticket_required_fields) {
            const ok = tText.toLowerCase().includes(field.toLowerCase());
            if (!ok) failures.push({ skill, check: `ticket-field:${field}`, fixture: path.relative(rootDir, t),
              detail: `ticket missing "${field}"` });
            else results.push({ skill, check: `ticket-field:${field}`, fixture: fixtureRel, detail: '' });
          }
        }
      }

      // content invariants implementable deterministically
      const inv = contract.invariants || {};
      if (inv.ac_identifiers) {
        const ok = /AC-\d+/.test(text);
        (ok ? results : failures).push({ skill, check: 'inv:ac_identifiers', fixture: fixtureRel,
          detail: ok ? '' : 'no AC-N identifiers found' });
      }
      if (inv.metrics_quantified) {
        // metric body = lines under a Metrics heading until the next heading
        const lines = text.split('\n');
        const metricLines = [];
        let inMetrics = false;
        for (const line of lines) {
          if (/^#{1,6}\s/.test(line)) { inMetrics = /metric|kpi|success/i.test(line); continue; }
          if (inMetrics && line.trim().startsWith('-')) metricLines.push(line);
        }
        const ok = metricLines.length > 0 && metricLines.every(l => /\d/.test(l));
        (ok ? results : failures).push({ skill, check: 'inv:metrics_quantified', fixture: fixtureRel,
          detail: ok ? '' : 'every Success Metrics bullet must carry a number or threshold' });
      }
      if (inv.blocking_edges_declared) {
        const tickets = files.filter(f => /tickets[/\\]/.test(f) && f.endsWith('.md'));
        const ok = tickets.every(t => /[Bb]locked by/.test(fs.readFileSync(t, 'utf8')));
        (ok ? results : failures).push({ skill, check: 'inv:blocking_edges', fixture: fixtureRel,
          detail: ok ? '' : 'a ticket lacks "Blocked by"' });
      }
    }
  }
  return { results, failures, total: results.length + failures.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  // CLI boundary: a load error must exit as a single named line (see read-json.mjs).
  process.on('uncaughtException', (err) => {
    console.error(`[EVAL ERROR] ${err.message}`);
    process.exit(1);
  });
  const { failures, total } = runOutputEval();
  console.log(`Output eval: ${total - failures.length}/${total} checks pass`);
  if (failures.length) {
    console.error('Failing checks:');
    for (const f of failures) console.error(`  [${f.skill}] ${f.check}: ${f.detail}`);
    process.exit(1);
  }
}
