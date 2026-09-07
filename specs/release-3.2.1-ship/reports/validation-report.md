# Validation Report - release-3.2.1-ship

- **Timestamp**: 2026-09-07 (final run, Pass 3 convergence)
- **Project Root**: ai-skills-pro (v3.2.1)
- **Overall Status**: PASSED

## Summary Matrix (release verification contract, RELEASE.md)

| Layer | Command | Status | Notes |
|---|---|---|---|
| Skill gate | `npm run validate` | PASS | 42 skills, 0 errors, 0 warnings |
| Test suite | `npm test` | PASS | 64/64 (62 pre-existing + 2 regression tests added this pipeline) |
| Trigger + output evals | `npm run eval` | PASS | train 34/34, holdout 17/17, blind 11/11; output contracts 20/20 |
| Release gate | `npm run release-check` | PASS | 0 errors; 2 accepted warnings (`.git`, `.mimosa` present in working tree; both excluded from artifacts by the packaging whitelist) |
| Plugin version check | `npm run check-plugin-version` | PASS | plugin.json aligned at 3.2.1 (failed pre-fix, exit 1) |

All four release-contract gates exited 0 in three consecutive full runs (Pass 1 post-fix, Pass 2 post-repair, Pass 3 convergence).

## Findings Matrix (final states)

| Finding | Severity | Final State |
|---|---|---|
| F1 version drift in plugin/marketplace/registry | Critical | Resolved |
| F2 RELEASE.md stale version line | Warning | Resolved |
| F3 sync-version.mjs regex root cause | Warning | Resolved (+ regression test) |
| F4 RELEASE.md stale counts | Warning | Resolved |
| F5 QUALITY_REPORT.md 3.1.0 snapshot | Warning | Resolved (regenerated from fresh gate outputs only) |
| F6 ARCHITECTURE.md stale count | Warning | Resolved |
| F7 no-op replace (dead code) | Suggestion | Resolved; re-root-caused as W-2 |
| F8 link-skills.sh typo | Suggestion | Resolved |
| F9 .npmignore dead config | Suggestion | Deferred (human-scale housekeeping, zero functional impact) |
| W-2 unspaced empty flow sequences in manifests (found Pass 2) | Warning | Resolved (+ corpus-wide regression test; PyYAML misparse evidence) |

## Repair history

- Pass 1: batch F1-F8 + 2 regression tests; 1 in-pass repair round (no-fabrication guard caught an unbackticked marker mention in review-1.md; rewritten per ADR 0005 exemption style).
- Pass 2: W-2 found, fixed, regression-tested; 1 repair round.
- Pass 3: clean, no repairs.

Totals: 9 findings resolved, 1 deferred, 0 not-reproducible; 4 gate runs green at convergence; tests 62 -> 64 (only additions).

## Remaining hand-offs

None. F9 is recorded for a future housekeeping change.
