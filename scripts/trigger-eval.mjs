import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSkillGraph } from './generate-manifests.mjs';
import { readJson } from './read-json.mjs';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

// Deterministic trigger-quality evaluator (zero dependencies).
//
// The model-invoked `description` is the routing contract. This evaluator
// scores each case by keyword overlap with every model-invoked description:
//   - should_trigger cases must score highest on their own skill
//   - should_not_trigger cases must score below threshold on every skill
//   - near_neighbor cases must NOT trigger their confusable sibling
//
// It is a floor, not an oracle: passing means the description carries the
// vocabulary its cases name; it cannot prove semantic quality. Case authoring
// rule: each case's keywords must appear (or deliberately not appear) in the
// description under test.

const THRESHOLD = 2; // minimum distinct keyword hits for a "trigger"

// Routing noise: common English glue carries no skill signal and drowns out
// domain vocabulary, so drop it before scoring.
const STOPWORDS = new Set([
  'the','and','with','for','into','from','that','this','these','those','then','than',
  'turn','make','give','show','tell','want','need','here','there','when','what','which',
  'before','after','while','just','only','also','about','across','together','through',
  'your','our','their','them','its','have','has','are','was','were','been','will','would','should',
  'formal','complete','comprehensive','quick','good','best','new','next','last','some','every',
  'run','deliver','delivery','verify','verification','authorize','authorized','end','lifecycle','pipeline',
  'remediation','remediate'
]);

function tokenize(text) {
  return new Set((text.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) || []));
}

function score(caseTokens, description) {
  const descTokens = tokenize(description);
  let hits = 0;
  const matched = [];
  for (const t of caseTokens) {
    // direct hit, or a description token containing the case token (plurals, compounds)
    if (descTokens.has(t) || [...descTokens].some(d => d.startsWith(t) || t.startsWith(d))) {
      hits++;
      matched.push(t);
    }
  }
  return { hits, matched };
}

export function runEval(suite = 'train') {
  // suite: 'train' (tuning loop), 'holdout' (regression floor), 'blind' (never tuned against)
  const file = { train: 'train_cases.json', holdout: 'holdout_cases.json', blind: 'blind_holdout_cases.json' }[suite];
  const cases = readJson(path.join(rootDir, 'evals', file));
  const graph = buildSkillGraph().filter(s => s.invocation === 'model');
  const byName = new Map(graph.map(s => [s.name, s]));
  const results = [];
  const failures = [];

  // Reference integrity: a case naming a skill that does not exist (a typo, or
  // a skill removed without its cases) fails forever at 1/N under the train
  // floor and never reddens the gate. It must be a hard error, not a score.
  // should_not_trigger cases carry no skill field by contract (they assert
  // nothing triggers above threshold), so they are out of this check by design.
  for (const c of [...(cases.should_trigger || []), ...(cases.near_neighbor || [])]) {
    for (const ref of [c.skill, c.must_not_trigger].filter(Boolean)) {
      if (!byName.has(ref)) {
        throw new Error(`evals/${file}: case in family "${c.family}" references unknown skill "${ref}"`);
      }
    }
  }

  const evaluate = (c, kind) => {
    const caseTokens = [...tokenize(c.text)].filter(t => t.length > 3 && !STOPWORDS.has(t));
    const scored = graph.map(s => ({ name: s.name, ...score(caseTokens, s.description) }))
      .sort((a, b) => b.hits - a.hits);
    const top = scored[0];
    let ok;
    if (kind === 'should_trigger') {
      ok = top.name === c.skill && top.hits >= THRESHOLD;
    } else if (kind === 'should_not_trigger') {
      ok = top.hits < THRESHOLD;
    } else { // near_neighbor: the intended skill must win by a clear margin over its sibling
      const target = byName.get(c.skill);
      const sibling = byName.get(c.must_not_trigger);
      const targetHits = target ? score(caseTokens, target.description).hits : 0;
      const siblingHits = sibling ? score(caseTokens, sibling.description).hits : 0;
      ok = targetHits >= THRESHOLD && targetHits > siblingHits;
    }
    const entry = { kind, family: c.family, skill: c.skill || c.must_not_trigger, text: c.text, ok,
      top: top.name, topHits: top.hits };
    results.push(entry);
    if (!ok) failures.push(entry);
  };

  for (const c of cases.should_trigger || []) evaluate(c, 'should_trigger');
  for (const c of cases.should_not_trigger || []) evaluate(c, 'should_not_trigger');
  for (const c of cases.near_neighbor || []) evaluate(c, 'near_neighbor');

  return { results, failures, total: results.length,
    passRate: results.length ? (results.length - failures.length) / results.length : 1 };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  // CLI boundary: a load error (missing file, invalid JSON, unknown skill
  // reference) must exit as a single named line, not an unhandled-throw dump.
  process.on('uncaughtException', (err) => {
    console.error(`[EVAL ERROR] ${err.message}`);
    process.exit(1);
  });
  const suites = process.argv.includes('--suite')
    ? [process.argv[process.argv.indexOf('--suite') + 1]]
    : ['train', 'holdout', 'blind'];
  let failed = false;
  for (const suite of suites) {
    const { results, failures, total, passRate } = runEval(suite);
    const floor = suite === 'train' ? 0.9 : 1.0; // train tolerates iteration; holdout and blind must be clean
    const suiteOk = passRate >= floor;
    console.log(`Trigger eval [${suite}]: ${total - failures.length}/${total} pass (${(passRate * 100).toFixed(0)}%, floor ${(floor * 100)}%)`);
    if (!suiteOk || failures.length) {
      for (const f of failures) {
        console.error(`  [${f.kind}] family=${f.family} expected=${f.skill} top=${f.top}(hits=${f.topHits})`);
        console.error(`      "${f.text}"`);
      }
      if (!suiteOk) failed = true;
    }
  }
  if (failed) process.exit(1);
}
