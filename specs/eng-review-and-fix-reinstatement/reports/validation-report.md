# Validation Report: eng-review-and-fix reinstatement review pipeline

- **Timestamp**: 2026-09-07
- **Project Root**: `.` (relative repo root)
- **Overall Status**: PASSED

## Summary Matrix

| Layer | Command | Status | Notes |
|---|---|---|---|
| Skill structure gate | `npm run validate` | PASS | 40 skills, 0 errors, 0 warnings |
| Test suite | `npm test` | PASS | 52 passed, 0 failed (51 -> 52: new parity regression test) |
| Trigger + output evals | `npm run eval` | PASS | train 34/34, holdout 17/17, blind 11/11, output 20/20, all at 100% |
| Release gate | `npm run release-check` | PASS | 0 errors, 2 pre-existing exclusion warnings (.mimosa, node_modules; covered by artifact policy) |

Repair rounds used: 1 (batch FIX-1..4), 1 follow-up (orchestrator-set rule revision) — within the 3-round cap.

## Findings matrix (final states)

| ID | Severity | Finding | Final state |
|---|---|---|---|
| FIX-1 | Critical | `generate-manifests.mjs` filter dropped Skill Tool edges on call+redirect name collision; dependency graph no longer represented the body; demonstrated bypass could hide contract-violating calls into user-invoked skills | **Resolved**: CALL_RE is sole authority for required; redirects informational. New double-entry test asserts required == body call set for every skill. Restored skill's manifest now `required: [eng-code-review, eng-review-fix, eng-validate]` |
| FIX-2 | Warning | `docs/engineering/eng-router.md` stale: restored skill absent; pre-existing graft fragment on the invocation sentence | **Resolved**: page rewritten with review-family boundary; fragment removed |
| FIX-3 | Suggestion | Boundary paragraph lacked ADR provenance | **Resolved**: cites ADR 0006 |
| FIX-4 | Suggestion | Orchestrator detection was a hand-maintained enum (had already missed eng-review-and-ship) | **Resolved**: structural rule (lifecycle suffix or required >= 2) + documented single exception (eng-execute, performs steps itself, no Skill Tool edges); floor raised to 11 |
| HAND-1 | Deferred | REDIRECT_RE absorbs slash-less prose mentions as redirects (eng-enterprise-lifecycle `run \`eng-multidimensional-audit\``) | **Deferred**: harmless after FIX-1 (redirects informational); tightening the regex changes another manifest, separate change |
| HAND-2 | Deferred | Milder graft-fragment variants in `docs/engineering/eng-execute.md:7`, `eng-bugfix-implement.md:7` | **Deferred**: pre-existing, outside this change surface; same class as the recorded batch-edit defect |

## Fixes applied

1. `scripts/generate-manifests.mjs:207`: `required: [...deps].sort(), redirects: [...redirects].filter(r => !deps.has(r)).sort()`
2. `tests/skills.test.mjs`: new test "manifest required set equals the body Skill Tool calls exactly (no silent edge loss)"
3. `docs/engineering/eng-router.md`: full rewrite (routing boundary, fragment removal)
4. `skills/engineering/eng-review-and-fix/SKILL.md`: boundary sentence cites ADR 0006
5. `tests/execution-trace.test.mjs`: structural orchestrator derivation
6. `npm run generate:manifests` re-run (40 manifests + registry)

## Validation runs

1. `npm run generate:manifests` -> 40 manifests, graph valid
2. `npm test` (after batch) -> 51/52, orchestrator-set floor failed
3. Rule revision -> `npm test` 52/52
4. `npm run eval` -> all suites 100%
5. `npm run release-check` -> 0 errors

## Remaining hand-offs

HAND-1 and HAND-2 above, with evidence in `specs/eng-review-and-fix-reinstatement/reports/remediation-plan.md`.
