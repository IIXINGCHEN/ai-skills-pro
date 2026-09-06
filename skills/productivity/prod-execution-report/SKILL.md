---
name: prod-execution-report
description: Generate a post-implementation retrospective report detailing changes, test results, divergences from the plan, and lessons learned. Use after completing a feature implementation.
---

# Execution Report

Reflect upon, document, and analyze a completed implementation against its original plan.

## Process

### 1. Gather Implementation Metrics
1. Collect git status, diff stats, added files, modified files, and deleted files.
2. Record full test suite and validation command outputs.

### 2. Compare Against Plan
1. Compare actual deliverables with the initial implementation plan.
2. Identify intentional divergences vs unplanned scope changes.
3. Highlight unexpected challenges and how they were overcome.

### 3. Generate Report Artifact
Save the report to `.agents/prod-execution-reports/<feature-name>.md`:

```markdown
# Execution Report: <feature-name>

## 1. Summary & Metrics
- **Plan Reference**: `.agents/plans/<feature-name>.md`
- **Files Changed**: +X lines, -Y lines across N files
- **Key Files**:
  - Created: `path/to/new_file.ext`
  - Modified: `path/to/existing_file.ext`

## 2. Validation & Test Evidence
- **Lint / Style**: PASSED
- **Type Safety**: PASSED
- **Test Suite**: X passed, 0 failed

## 3. Divergence Analysis
- **Planned vs Actual**: <Details of any design shifts>
- **Reasoning**: <Why the divergence was necessary or beneficial>

## 4. Key Learnings & Gotchas
- Insights discovered for future work on this module.

## 5. Gap Review & Post-Delivery Audit
- **Well Executed**: Delivered components that strictly adhere to the frozen specification.
- **Residual Gaps / Technical Debt**: Known edge cases, deferred optimizations, or follow-ups.
- **Removals / Cleanup**: Dead code or redundant patterns eliminated during refactoring.
- **Recommendations**: Concrete next steps for the next iteration cycle.
```
---
## Checkable Completion Criteria

- [ ] Report saved to `.agents/prod-execution-reports/<feature-name>.md`.
- [ ] Metrics grounded in real git stats and actual validation outputs, not estimates.
- [ ] Divergence analysis distinguishes planned deviations from unplanned scope changes with reasoning.
- [ ] Gap Review section records strengths, residual debt, cleanup, and next-step recommendations.
