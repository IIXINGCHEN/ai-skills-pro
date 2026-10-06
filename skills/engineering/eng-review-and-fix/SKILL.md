---
name: eng-review-and-fix
description: "Review-and-remediate convergence loop that stops before delivery; for the same gauntlet ending in commits and an authorized push, run eng-review-and-ship instead."
disable-model-invocation: true
---

# Review & Fix Lifecycle (no delivery)

Orchestrates code review, targeted remediation, and automated validation into a structured convergence loop: each pass reviews, fixes detected issues, and validates until the change surface converges cleanly. The pipeline concludes with a consolidated findings and validation report. It performs **no git commits and no remote actions**.

Scope boundary:
- Use `/eng-review-and-fix` for iterative review-repair-validate convergence on existing working tree changes without committing or pushing.
- Use `/eng-review-fix` for a standalone single-run enterprise hardening audit (7-stage pipeline covering architecture, security, performance, and reliability).
- Use `/eng-review-and-ship` for the full gauntlet extending this convergence loop through atomic commits and authorized delivery.

## Convergence State Machine

```
Pass p (p = 1 .. 5):
  Stage 1: eng-code-review (collect diff context, evaluate 6 dimensions)
           │
           ▼
[Triage Gate: Open Critical/Warning findings?]
   ├─► NO (Clean Pass):
   │     ├─► p < 3: Passes 1-3 are mandatory ──► Next Pass (p + 1)
   │     └─► p >= 3 (Verified Clean): Loop Converged ──► Stage 4
   │
   └─► YES:
         │
         ▼
  Stage 2: Targeted Remediation (Critical -> Warning, minimal diffs)
           │
           ▼
  Stage 3: eng-validate (linters, type check, tests, build)
           │
      ┌────┴───────────────────────────┐
      │ Validation Failures?           │
      ├─► Yes (repair round <= 3) ────► Loop back to Stage 2
      ├─► Yes (repair round > 3) ─────► Halt with BLOCKED status ──► Stage 5
      └─► No  (Validation Green):
            ├─► p < 5 ──► Next Pass (p + 1)
            └─► p == 5 ──► Converge ──► Stage 4
           │
           ▼
Stage 4: Resolution Confirmation (Re-review diff against union of findings)
           │
           ▼
Stage 5: Consolidated Report & Execution Record (Archive artifact)
```

---

## Autonomous Execution Protocol

### Directory Resolution
Determine the report artifact destination before starting:
- If a matching spec directory exists at `specs/<feature>/`: use `specs/<feature>/reports/`.
- Otherwise (ad-hoc diff, bugfix, or non-spec repository): create and use `.scratch/reports/`.

---

### Stage 1: Code Review
1. **Call the Skill tool with "eng-code-review"** with scope auto-detection:
   - Uncommitted changes present: use `diff` scope.
   - Staged changes only: use `staged` scope.
   - Full audit explicitly requested: use `repo` scope.
2. Profile defaults to `standard`; escalate to `strict` when user mentions security, payment/auth paths, or pre-release gates.
3. Save the pass report to `<report-dir>/review-pass-<p>.md`.

### Triage & Convergence Gate
- **Zero Critical & Zero Warning findings**:
  - If `p < 3`: Passes 1-3 are mandatory even on clean passes. Advance to Pass `p + 1`.
  - If `p >= 3`: The change surface has converged clean across the mandatory passes. Advance to Stage 4.
- **Open Critical or Warning findings**:
  - If `p < 5`: Proceed immediately to Stage 2 within the current pass.
  - If `p == 5`: Maximum convergence passes reached. Halt remediation, flag unresolved items, and skip to Stage 5 with `[HALTED: MAX PASSES REACHED]` verdict.

### Stage 2: Targeted Remediation
1. Triage detected findings by priority: `Critical` first, then `Warning`.
2. Apply targeted, minimal diff fixes directly to the codebase:
   - Fix the root cause without unrelated cosmetic changes.
   - Accompany each behavioral fix with a corresponding regression test where feasible.
   - Suggestions are addressed only if zero behavioral risk is introduced; otherwise defer as follow-ups.
3. Track each addressed finding with its resolution summary and modified files.

### Stage 3: Verification Loop (per pass)
1. **Call the Skill tool with "eng-validate"** to verify the remediation batch.
2. On failure:
   - Inspect errors and increment `repairRound` counter (tracked within the current pass).
   - If `repairRound <= 3`: Loop back to Stage 2 targeting the new validation failures.
   - If `repairRound > 3`: Stop automated repairs to avoid thrashing. Escalate to human and advance directly to Stage 5 with verdict `[BLOCKED: VALIDATION FAILED]`.
3. On validation success:
   - If `p < 5`: Advance to Pass `p + 1` (Stage 1) to independently confirm that the fixes cleanly resolved the issues without introducing regressions.
   - If `p == 5`: Converge to Stage 4; there is no pass 6.

### Stage 4: Resolution Confirmation
1. Perform a final verification across the union of all findings identified in all passes.
2. Assign each finding to exactly one terminal state:
   - `Resolved`: Code fix applied, regression test added, and validation green.
   - `Deferred`: Architectural or scope boundary issue requiring human decision (documented with rationale).
   - `Not Reproducible`: Proved false positive or superseded by subsequent clean review (documented with evidence).

### Stage 5: Consolidated Report & Execution Record
Write `<report-dir>/review-and-fix-<timestamp>.md` containing:
1. **Executive Summary**: Pass count, repair rounds, final status verdict (`[ALL RESOLVED]`, `[PARTIAL: N DEFERRED]`, `[BLOCKED]`, `[HALTED: MAX PASSES REACHED]`, or `[CLEAN: NO ACTION NEEDED]`).
2. **Findings Matrix**: Complete table mapping each finding (ID, severity, category, originating pass, file:line) to its terminal state.
3. **Remediation Summary**: List of modified files with concise descriptions of minimal changes and regression tests introduced.
4. **Validation History**: Summary of every validation execution (pass number, repair round, tool commands, PASS/FAIL status).
5. **Execution Record**: Self-contained execution metadata:
   - Timestamp and duration.
   - Skill name and active profile (`standard` / `strict`).
   - Triggered scopes and touched file paths.
   - Unresolved/deferred action items requiring human intervention.

---

## State Persistence & Resumption

Record pipeline state in `.scratch/review-and-fix-state.json` at each stage transition:

```json
{
  "targetScope": "<diff | staged | repo>",
  "reportDir": "<specs/<feature>/reports | .scratch/reports>",
  "pipelineType": "review-and-fix",
  "pass": 1,
  "maxPasses": 5,
  "repairRound": 0,
  "maxRepairRounds": 3,
  "currentStage": 1,
  "stageName": "eng-code-review",
  "completedStages": [],
  "findingsSummary": {
    "critical": 0,
    "warning": 0,
    "resolved": 0,
    "deferred": 0
  },
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

Resumption loads `.scratch/review-and-fix-state.json` and resumes from the interrupted stage and pass.

---

## Checkable Completion Criteria

- [ ] Review reports archived under `<report-dir>/review-pass-<p>.md` for each completed pass.
- [ ] Convergence logic respected: Clean first pass exits early; remediated passes verified by a subsequent clean review.
- [ ] Every Critical and Warning finding resolved, deferred with explicit human-facing rationale, or disproven with evidence.
- [ ] Validation suite green, or halted cleanly within the 3-repair-round / 5-pass limit.
- [ ] Consolidated report persisted with findings matrix, remediation summaries, validation history, and inline execution record.
- [ ] No git commits created and no remote push operations initiated.
