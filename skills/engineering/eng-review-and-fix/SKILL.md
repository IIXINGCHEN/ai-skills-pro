---
name: eng-review-and-fix
description: "Execute the review-and-remediate loop automatically in one command: run a structured code review, triage findings by severity, apply surgical fixes for critical and warning items, re-run validation until green, and deliver a consolidated report. Use when reviewing changes before commit or PR without manual command re-entry."
---

# Review & Fix Lifecycle

Composes `eng-code-review` and `eng-review-fix` into one continuous remediation loop: review produces findings, fixes resolve them, validation proves them green, and the loop iterates until zero critical and warning findings remain or only human-decision items are left.

## 5-Stage Pipeline State Machine

```
Stage 1: eng-code-review (collect context, evaluate 6 dimensions)
           │
           ▼
[Gate: skip if no Critical/Warning findings -> jump to Stage 5]
           │
           ▼
Stage 2: eng-review-fix (triage: Critical -> Warning)
           │
           ▼
Stage 3: eng-validate (linters, types, tests, build)
           │
      ┌────┴─────┐
      │ failures │  yes: loop back to Stage 2 (max 3 iterations)
      └────┬─────┘
           │ no
           ▼
Stage 4: Re-review changed surface (confirm findings resolved)
           │
           ▼
Stage 5: Consolidated Report (.agents/review-and-fix/<timestamp>.md)
```

---

## Autonomous Execution Protocol

### Stage 1: Review
1. **Execute `eng-code-review`** with scope auto-detection:
   - Uncommitted changes present: use `diff` scope.
   - Staged changes only: use `staged` scope.
   - User requests full audit or clean tree with explicit ask: use `repo` scope.
2. Profile defaults to `standard`; escalate to `strict` when the user mentions security, mission-critical paths, or pre-release gates.
3. Save the review report per `eng-code-review` contract at `.agents/eng-code-reviews/<timestamp>.md`.

### Gate: Findings Triage Decision
- Zero Critical and Warning findings: skip directly to Stage 5 and archive an APPROVED verdict.
- Any Critical or Warning findings: proceed to Stage 2 automatically.

### Stage 2: Remediation
1. **Execute `eng-review-fix`**: Triage findings Critical first, then Warning. Suggestions are applied only when they carry zero behavioral risk; otherwise list them as optional follow-ups.
2. Apply minimal fixes following codebase conventions, each backed by a regression test where feasible.

### Stage 3: Verification Loop

1. **Execute `eng-validate`** after each remediation batch.
2. On failure: return to Stage 2 targeting the new failures. Hard-cap at **3 iterations**, then stop and hand unresolved items back to the human with evidence.

### Stage 4: Resolution Confirmation

Re-review the changed surface against the original findings list. Every finding must end in exactly one state: `Resolved`, `Deferred (human decision required)`, or `Not Reproducible (with evidence)`.

### Stage 5: Consolidated Report

Write `.agents/review-and-fix/<timestamp>.md` containing:
- Original findings matrix vs final states.
- Files modified with fix summaries.
- Validation loop history (iterations and results).
- Deferred items requiring human architectural decisions.
- Final verdict: `[ALL RESOLVED]` | `[PARTIAL: N deferred]`.

---

## State Persistence & Resumption

Record pipeline progress in `.agents/lifecycle-state.json`:

```
{
  "feature": "<review-scope>",
  "pipelineType": "review-and-fix",
  "currentStage": 3,
  "stageName": "eng-validate",
  "iteration": 2,
  "completedStages": [
    "eng-code-review",
    "eng-review-fix"
  ],
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

---

## Checkable Completion Criteria

- [ ] Review report generated and archived under `.agents/eng-code-reviews/`.
- [ ] All Critical and Warning findings resolved, deferred with rationale, or disproven with evidence.
- [ ] Validation suite green within the 3-iteration cap.
- [ ] Consolidated report saved under `.agents/review-and-fix/` with a final verdict.