# Code Review Report (Pass 1)

- **Scope**: diff (multidimensional-audit remediation change set)
- **Profile**: standard (post-audit surface)
- **Spec Reference**: `specs/multidimensional-audit-2026-09-07/reports/audit-report.md` (claims "all gate JSON loads route through read-json")
- **Target**: scripts/read-json.mjs (new), scripts/release-check.mjs, scripts/validate-skills.mjs, scripts/trigger-eval.mjs, .github/workflows/validate-skills.yml, failures/failure-cases.md (2 entries), .changeset/multidimensional-audit-hardening.md

Reviewer stance: independent; the audit's own claims treated as hypotheses. Probes re-executed rather than trusted.

## Summary Matrix

| Severity | Count | Status |
|---|---|---|
| 🚨 Critical | 1 | Action Required |
| ⚠️ Warning | 2 | Review Needed |
| 💡 Suggestion | 1 | Optional |

## Detailed Findings

### [CRITICAL] scripts/output-eval.mjs:30 - npm run eval still crashes raw on corrupt contracts file
- **Category**: Correctness / remediation completeness
- **Description**: The audit fix routed the three gate scripts through read-json.mjs, but `output-eval.mjs` (the second half of `npm run eval`, wired into CI) still calls bare `JSON.parse` on `evals/output_contracts.json`. Probe: corrupting that file makes output-eval fail with `<anonymous_script>:1` and echo the file contents, the exact raw-crash class the audit claimed eliminated. The audit report's "all gate JSON loads" claim was written against the three named scripts, not the gate command surface.
- **Recommended Fix**: route through read-json.mjs.

### [WARNING] scripts/generate-manifests.mjs:347, scripts/sync-version.mjs (5 sites), scripts/sync-plugin-version.mjs (3 sites) - same class, partially covered
- **Category**: Consistency
- **Description**: generate-manifests (network_policy.json, runs in CI via validate imports and generate:manifests), sync-version (5 manifest files), sync-plugin-version (2 sites) retain bare JSON.parse. Lower severity: these are authoring/release tools rather than CI gates, but the failure-ledger entry says "all gate JSON loads route through it"; either cover them or narrow the claim.
- **Recommended Fix**: route all through read-json.mjs; the ledger claim then holds without qualification.

### [WARNING] scripts/read-json.mjs:12 - ENOENT reported as "invalid JSON"
- **Category**: Error semantics
- **Description**: A missing file produces `invalid JSON reading evals/nonexistent.json: ENOENT...`. Accurate enough to locate, but "invalid JSON" is the wrong diagnosis for a missing file; a user following it will hunt for corruption, not absence. Also, paths outside cwd render as long ../ chains.
- **Recommended Fix**: distinguish ENOENT ("missing file") from SyntaxError ("invalid JSON").

### [SUGGESTION] trigger-eval ghost guard excludes should_not_trigger by design; document it
- **Category**: Maintainability
- **Description**: should_not_trigger cases carry `skill: null` (family human_only), so the reference check skips them correctly, but nothing states that invariant. A future case author adding a named skill there would get silently unscored-against behavior (should_not_trigger ignores c.skill by contract).
- **Recommended Fix**: one comment line in the guard loop naming the invariant.

## Verified clean

- read-json.mjs itself: em-dash free, no fabrication markers, ENOENT path includes the filename, empty-file handled as invalid JSON (correct).
- CI permissions block present and minimal.
- Failure-ledger entries match the shipped guards (with the W1/W2 coverage caveat above).
- Ghost-guard ablation still trips; governance suite green.

## Verdict: [CHANGES REQUESTED]
