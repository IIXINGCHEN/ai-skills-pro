---
name: eng-onboarding-audit-lifecycle
description: Run a read-only onboarding and codebase health audit for an unfamiliar repository.
disable-model-invocation: true
---
# Codebase Onboarding & Health Audit Lifecycle

Runs the entire onboarding and audit pipeline in one pass. Read-only with respect to source code (test and build artifacts from validation aside): no source files are modified at any stage, so no human gates are required until the final report review, except the Stage 5 gate below: executing the target repository's own lint/test/build scripts runs arbitrary third-party code and always requires explicit user confirmation first.

## 5-Stage Pipeline State Machine

```
Stage 1: eng-prime-context (tech stack, conventions, entry points)
 │
 ▼
Stage 2: eng-analyze-codebase (topology, circular deps, patterns)
 │
 ▼
Stage 3: eng-multidimensional-audit (spatial, solid, reverse)
 │
 ▼
Stage 4: eng-adversarial-audit (optional deep security scan)
 │
 ▼
Stage 5: eng-validate (baseline lint, types, tests, build status)
 │
 ▼
Output: Consolidated Codebase Health Report
```

---

## Autonomous Execution Protocol

1. **Call the Skill tool with "eng-prime-context"**: Map tech stack, directory layout, conventions, and key entry points.
2. **Call the Skill tool with "eng-analyze-codebase"**: Build the dependency graph, detect circular dependencies, and catalog design patterns.
3. **Call the Skill tool with "eng-multidimensional-audit"**: Run the spatial, solid, and reverse thinking scans producing prioritized findings.
4. **Call the Skill tool with "eng-adversarial-audit"**: Include this stage per AGENTS.md pipeline #3; treat as optional only when the user explicitly narrows the audit scope (deep security analysis or mission-critical systems always include it).
5. **Gate (Human Approval)**: eng-validate executes the target repository's own lint/test/build scripts, arbitrary third-party code on an unfamiliar codebase. Proceed only on explicit user confirmation. Then **call the Skill tool with "eng-validate"**: Record the current health baseline covering what passes and what fails today.
6. **Consolidate Findings**: Merge all outputs into a single report saved to `specs/<repo-name>/codebase-health-<repo-name>.md` containing the architecture overview, risk heatmap, prioritized remediation backlog, and baseline health status.

## State Persistence & Resumption

Record pipeline progress in `.scratch/<pipeline>-state.json`:

```
{
 "feature": "<repo-name>",
 "pipelineType": "onboarding-audit",
 "currentStage": 4,
 "stageName": "eng-adversarial-audit",
 "completedStages": [
 "eng-prime-context",
 "eng-analyze-codebase",
 "eng-multidimensional-audit"
 ],
 "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

If execution is interrupted, reading `.scratch/<pipeline>-state.json` resumes from the last incomplete stage.

## Checkable Completion Criteria

- [ ] All executed stages produced their standard artifacts.
- [ ] Every finding references concrete file paths and line evidence.
- [ ] Consolidated health report saved to `specs/<repo-name>/`.
- [ ] Zero source modifications made during the audit.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report).
