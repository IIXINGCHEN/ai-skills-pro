---
name: eng-defect-lifecycle
description: Run the end-to-end defect resolution lifecycle from RCA through verified delivery.
disable-model-invocation: true
---
# Defect Resolution Lifecycle

Orchestrates the full bug-fix loop as a continuous, state-tracked workflow. Advances automatically between stages and pauses only at the mandatory human RCA sign-off gate.

## 5-Stage Pipeline State Machine

```
Stage 1: eng-bugfix-rca ───────► [Gate: Human RCA Sign-off]
                                        │
Stage 2: eng-bugfix-implement ◄────────┘
           │
           ▼
Stage 3: eng-validate (full regression suite)
           │
           ▼
Stage 4: `eng-git-commit` after the validation gate
           │
           ▼
Stage 5: prod-execution-report (fix retrospective)
```

---

## Autonomous Execution Protocol

1. **Call the Skill tool with "eng-bugfix-rca"**: Reproduce the defect, isolate the root cause, and write `specs/<bug-id>/rca.md`.
2. **Gate (Human Sign-off)**: Present the RCA summary covering root cause, blast radius, and proposed fix strategy. Wait for explicit user approval.
3. **Call the Skill tool with "eng-bugfix-implement"**: Apply the minimal surgical patch plus the regression test derived from the repro loop.
4. **Call the Skill tool with "eng-validate"**: Run linters, type checks, unit tests, integration tests, and build verification. Any failure loops back to Stage 2 automatically.
5. **Call the Skill tool with "eng-git-commit"**: Create an atomic conventional commit referencing the bug id.
6. **Call the Skill tool with "prod-execution-report"**: Write the fix retrospective including divergence analysis and learnings.

## State Persistence & Resumption

Record pipeline progress in `.scratch/<pipeline>-state.json`:

```
{
  "feature": "<bug-id>",
  "pipelineType": "defect-resolution",
  "currentStage": 3,
  "stageName": "eng-validate",
  "completedStages": [
    "eng-bugfix-rca",
    "eng-bugfix-implement"
  ],
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

If execution is interrupted, reading `.scratch/<pipeline>-state.json` resumes from the last incomplete stage.

## Checkable Completion Criteria

- [ ] RCA document written and approved by the user before any code change.
- [ ] Surgical patch applied with a regression test covering the defect.
- [ ] Full validation suite green with zero regressions.
- [ ] Atomic commit created referencing the bug id.
- [ ] Fix retrospective saved to `specs/<feature>/`.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from generated manifests.
