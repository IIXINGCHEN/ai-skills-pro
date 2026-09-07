# Remediation Plan - release-3.2.1-ship (Pass 1 findings)

Source: `specs/release-3.2.1-ship/reports/review-1.md`. Ordering: correctness/spec first, then hygiene. F9 deferred by review disposition.

| # | Sev | File(s) | Root cause | Minimal change | Regression test | Risk |
|---|---|---|---|---|---|---|
| F1 | Critical | .claude-plugin/plugin.json, marketplace.json, registry/skills.json | 3.2.1 bump skipped packaging manifests | Project-blessed path: `node scripts/sync-plugin-version.mjs` (format-preserving), manual 2-field marketplace edit, `npm run generate:manifests` | existing tests/repo.test.mjs:14 + validate/release-check gates | Low: generated files; registry hashes recomputed |
| F3 | Warning | scripts/sync-version.mjs:95 | regex `^Version:` does not match actual `Release version:` field | Extend regex to `^Release version:` | new repo.test assertion: RELEASE.md contains `Release version: <VERSION>` | Low: single line, release-day tooling |
| F2 | Warning | RELEASE.md:4 | stale body version | 3.1.0 -> 3.2.1 | same new assertion | None |
| F4 | Warning | RELEASE.md:8,16 | counts captured at 3.1.0 | 40 skills -> 42; 51 tests -> 62 (verified: release-check PASS 42; npm test tests=62) | covered by release-check count gates for the tree; prose lines guarded by review | None |
| F5 | Warning | QUALITY_REPORT.md | whole doc is a 3.1.0 snapshot | Regenerate title + all metrics from freshly executed gates only (42 skills, 18/24, real edge count from regenerated registry, 62/62, evals, 3.2.1) | gates themselves | Low: must copy verified numbers, no fabrication (ADR 0005) |
| F6 | Warning | ARCHITECTURE.md:7 | stale count | 40 -> 42 | none feasible (prose) | None |
| F7 | Suggestion | scripts/generate-manifests.mjs:288 | no-op `.replace('[]','[]')` | Drop the call | existing generation tests + registry determinism | Low |
| F8 | Suggestion | scripts/link-skills.sh:11 | typo "grsecius" | -> "grsecurity" | none (comment) | None |
| F9 | Suggestion | .npmignore | dead config (files whitelist wins) | DEFERRED to later housekeeping | n/a | n/a |

Out-of-scope hand-offs: none. Security/performance/reliability stages: clean in Pass 1 strict review (no findings entered).

Validation plan: after the batch, run all four gates (`npm run validate`, `npm test`, `npm run eval`, `npm run release-check`); all must exit 0 per RELEASE.md:27.
