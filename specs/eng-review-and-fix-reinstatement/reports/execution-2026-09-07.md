# Execution Record: eng-review-fix pipeline - 2026-09-07

## 1. Executor

Human: PengJianBo (session owner, authorized the review run). Agent: ZCode session on the ai-skills-pro repository, executing the eng-review-fix seven-stage pipeline.

## 2. Skill

Skill: `eng-review-fix` (model-invoked; seven-stage enterprise review pipeline). Orchestrator: invoked directly by the user in-session. Sub-skills orchestrated per contract: `eng-code-review` (Stage 1), `eng-analyze-codebase` (Stage 2), `eng-adversarial-audit` (Stage 3), `eng-hardening-review` (Stage 5), `eng-validate` (Stage 7). Stage 4 (performance) executed inline: declarative markdown/config change surface plus one generator filter line; no hot-path, I/O, or memory implications; recorded clean.

## 3. Version

Skill version: 3.1.0 (from `skills/engineering/eng-review-fix/manifest.yaml`). Project version at run start: 3.1.0 (from `VERSION`).

## 4. Permissions

Copied from the skill's manifest.yaml: filesystem read=true, write=true; shell execute=true; network access=false (no network_policy.json approval required; rule applies to network-capable skills only).

## 5. Steps

1. Stage 1 Code Scan: loaded `eng-code-review`; reviewed the 19-file restoration change set across six dimensions; wrote `specs/eng-review-and-fix-reinstatement/reports/review-pass1.md`. Found 1 Critical + 2 Warnings + 2 Suggestions.
2. Stage 2 Architecture: loaded `eng-analyze-codebase`; mapped the review-family dependency graph from registry/skills.json; identified the unstated invariant behind the required/redirects filter and the REDIRECT_RE prose-absorption weakness.
3. Stage 3 Security: loaded `eng-adversarial-audit`; demonstrated on real files that the filter removes a live Skill Tool edge, and by simulation that the same mechanism hides contract-violating calls into user-invoked skills from validateGraph. Permission claims of the restored skill verified consistent with its body (write/shell true, network false).
4. Stage 4 Performance: inline check, clean (no runtime code in the change surface).
5. Stage 5 Reliability: loaded `eng-hardening-review`; classified findings observed/inferred; confirmed count double-writes fail loud in all drift directions, state-file contract ADR 0003 compliant, and the absence of any required-vs-body parity guard (now added).
6. Stage 6 Remediation Plan: wrote `specs/eng-review-and-fix-reinstatement/reports/remediation-plan.md` (risk-ranked FIX-1..4, hand-off list HAND-1..2).
7. Stage 7 Validation: applied FIX-1 (generator semantics + regression test), FIX-2 (router docs page rewrite), FIX-3 (ADR 0006 citation), FIX-4 (structural orchestrator derivation, revised once after the structural floor exposed eng-execute's non-structural nature); regenerated 40 manifests; ran the full suite. Repair rounds: 2 of 3 allowed.

## 6. Results

1. `npm run validate`: pass (40 skills, 0 errors, 0 warnings)
2. `npm test`: pass 52/52 (was 51; +1 new parity regression test)
3. `npm run eval`: pass (train 34/34, holdout 17/17, blind 11/11, output 20/20)
4. `npm run release-check`: pass (0 errors, 2 pre-existing warnings)
5. Fixes applied: 5 changes across 4 files + manifest regeneration; evidence in validation-report.md
6. Gates green: 4/4

## 7. Risk level

Skill-declared risk: high (from manifest.yaml).

## 8. Final report

`specs/eng-review-and-fix-reinstatement/reports/validation-report.md` — verdict PASSED; findings matrix: 4 Resolved, 2 Deferred (HAND-1 REDIRECT_RE prose absorption, HAND-2 mild graft-fragment variants in two docs pages), 0 Not Reproducible.
