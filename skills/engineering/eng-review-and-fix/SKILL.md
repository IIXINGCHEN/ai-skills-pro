---
name: eng-review-and-fix
description: "Review-and-remediate convergence loop that stops before delivery; for the same gauntlet ending in commits and an authorized push, run eng-review-and-ship instead."
disable-model-invocation: true
---

# Review & Fix Lifecycle (no delivery)

Composes `eng-code-review`, `eng-review-fix`, and `eng-validate` into one continuous remediation loop: each pass reviews, fixes, and validates; the full cycle repeats across convergence passes governed by `templates/convergence-gauntlet.md` (pass floor risk-tiered by ADR 0009: 3 passes for code changes, 2 for prose-only; cap of 5). The pipeline stops at a consolidated report. It performs no commits and no remote actions.

Boundary (ADR 0006): this is the mid-weight loop for existing changes that need review and repair but no delivery in the same run. For the full gauntlet ending in an authorized push, run `/eng-review-and-ship`; for an architectural, security, and reliability review pipeline that produces a risk-ranked plan without fixing, run `/eng-review-fix`. Canonical gauntlet mechanics (pass floor, caps, triage rules) are defined in `templates/convergence-gauntlet.md` (ADR 0008).

## 5-Stage Pipeline State Machine

```
Convergence Pass p (governed by templates/convergence-gauntlet.md):
  eng-code-review (collect context, evaluate 6 dimensions, fresh pass)
           │
           ▼
[Gate: open Critical/Warning findings? yes -> Stage 2 in this pass]
           │
           ▼
Stage 2: eng-review-fix (triage: Critical -> Warning)
           │
           ▼
Stage 3: eng-validate (linters, types, tests, build)
           │
      ┌────┴─────┐
      │ failures │  yes: loop back to Stage 2 (per-pass cap: 3 repair rounds)
      └────┬─────┘
           │ no
           ▼
[Convergence Gate: p >= floor and pass clean -> Stage 4]
[p < floor -> next pass; p = 5 with open findings -> halt and escalate]
           │
           ▼
Stage 4: Re-review changed surface (union of findings from all passes)
           │
           ▼
Stage 5: Consolidated Report (specs/<feature>/reports/review-and-fix-<timestamp>.md)
```

---

## Autonomous Execution Protocol

### Stage 1: Review
1. **Call the Skill tool with "eng-code-review"** with scope auto-detection:
   - Uncommitted changes present: use `diff` scope.
   - Staged changes only: use `staged` scope.
   - User requests full audit or clean tree with explicit ask: use `repo` scope.
2. Profile defaults to `standard`; escalate to `strict` when the user mentions security, mission-critical paths, or pre-release gates.
3. Archive one report per pass under `specs/<feature>/reports/review-<pass>.md` (one report per pass).

### Gate: Findings Triage Decision
- Any Critical or Warning findings: proceed to Stage 2 automatically within the current pass.
- Zero open findings and p >= floor: the loop converges and advances to Stage 4.
- Zero open findings and p < floor: start the next pass anyway. Early passes prove stability; later passes catch regressions introduced by prior fixes.

### Stage 2: Remediation
1. **Call the Skill tool with "eng-review-fix"**: Triage findings Critical first, then Warning. Suggestions are applied only when they carry zero behavioral risk; otherwise list them as optional follow-ups.
2. Apply minimal fixes following codebase conventions, each backed by a regression test where feasible.

### Stage 3: Verification Loop (per pass)

1. **Call the Skill tool with "eng-validate"** after each remediation batch within the pass.
2. On failure: return to Stage 2 targeting the new failures. Per-pass hard cap at **3 repair rounds**, then stop and hand unresolved items back to the human with evidence.
3. On success: advance to the Convergence Gate. Passes below the floor always continue into a fresh pass.

### Stage 4: Resolution Confirmation

Re-review the changed surface against the union of findings from all passes. Every finding must end in exactly one state: `Resolved`, `Deferred (human decision required)`, or `Not Reproducible (with evidence)`.

### Stage 5: Consolidated Report

Write `specs/<feature>/reports/review-and-fix-<timestamp>.md` containing:
- Original findings matrix vs final states (each finding tagged by its pass).
- Files modified with fix summaries.
- Validation history (passes, per-pass repair rounds, and results).
- Deferred items requiring human architectural decisions.
- Final verdict: `[ALL RESOLVED]` | `[PARTIAL: N deferred]` | `[HALTED: 5-pass cap reached]`.

---

## State Persistence & Resumption

Record pipeline progress in `.scratch/review-and-fix-state.json`:

```
{
  "feature": "<review-scope>",
  "pipelineType": "review-and-fix",
  "currentStage": 3,
  "stageName": "eng-validate",
  "pass": 2,
  "floor": 3,
  "maxPasses": 5,
  "repairRound": 1,
  "completedStages": [
    "eng-code-review",
    "eng-review-fix"
  ],
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

Resumption restarts the interrupted pass. `pass` counts the active convergence pass against the floor (3 for code changes, 2 for prose-only; see `templates/convergence-gauntlet.md`) and the cap of 5 allowed passes; `repairRound` tracks validate-fail repairs inside the current pass.

---

## Checkable Completion Criteria

- [ ] Review reports archived under `specs/<feature>/reports/review-<pass>.md` for every pass.
- [ ] All Critical and Warning findings across all passes resolved, deferred with rationale, or disproven with evidence.
- [ ] Convergence passes completed to the risk-tiered floor (3 for code changes, 2 for prose-only per ADR 0009); the loop exited only on a clean pass or a documented escalation at the 5-pass cap.
- [ ] Validation suite green within the per-pass 3-repair-round cap.
- [ ] Consolidated report saved under `specs/<feature>/reports/` with a final verdict.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from the generated manifest.
