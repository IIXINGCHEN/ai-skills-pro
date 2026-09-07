---
name: eng-refactor-lifecycle
description: Run the behavior-preserving progressive refactoring lifecycle for legacy systems.
disable-model-invocation: true
---
# Progressive Refactoring Lifecycle

Modernizes legacy code through strangler-style incremental steps where behavior preservation is contractually enforced and every step is regression-verified.

## 7-Stage Pipeline State Machine

```
Stage 1: eng-analyze-codebase (identify refactor hotspots & coupling)
           │
           ▼
Stage 2: eng-spec (behavior-preservation contract: golden tests, seams)
           │
           ▼
Stage 3: eng-plan (phased strangler roadmap) ──► [Gate: Human Plan Sign-off]
                                                        │
Stage 4: eng-execute (small-step refactor, ◄────────────┘
           │        per-step regression validation)
           ▼
Stage 5: eng-multidimensional-audit (post-refactor integrity scan)
           │
           ▼
Stage 6: eng-validate (full suite green)
           │
           ▼
Stage 7: Commit plus user-run PR delivery
```

---

## Autonomous Execution Protocol

1. **Call the Skill tool with "eng-analyze-codebase"**: Rank refactoring hotspots by coupling, churn, and risk. Produce evidence-backed targets.
2. **Call the Skill tool with "eng-spec"**: Freeze the behavior-preservation contract: observable inputs/outputs that must remain identical, characterization tests capturing current behavior, and allowed internal changes.
3. **Call the Skill tool with "eng-plan"** and present the phased strangler roadmap. **Gate (Human Sign-off)**: proceed only after explicit plan approval.
4. **Call the Skill tool with "eng-execute"**: Refactor in small steps. After every step, run the characterization tests plus affected suite subset; any behavioral drift halts and reverts the step immediately.
5. **Call the Skill tool with "eng-multidimensional-audit"**: Verify no coupling regressions, dead code residue, or consistency hazards were introduced.
6. **Call the Skill tool with "eng-validate"**: Full linters, types, tests, and build must pass with zero regressions.
7. **Call the Skill tool with "eng-git-commit"; then tell the user to run `/eng-git-pr`.**: Deliver atomic commits per phase with a PR summarizing behavior-preservation evidence.

## State Persistence & Resumption

Record pipeline progress in `.scratch/<pipeline>-state.json`:

```
{
  "feature": "<refactor-slug>",
  "pipelineType": "progressive-refactor",
  "currentStage": 4,
  "stageName": "eng-execute",
  "completedStages": [
    "eng-analyze-codebase",
    "eng-spec",
    "eng-plan"
  ],
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

## Checkable Completion Criteria

- [ ] Behavior-preservation contract frozen with characterization tests passing before any refactor.
- [ ] Phased plan approved by the user.
- [ ] Every executed step validated against characterization tests with zero behavioral drift.
- [ ] Post-refactor audit and full validation suite both green.
- [ ] Phase-level atomic commits delivered via PR.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from generated manifests.
