---
name: prod-prod-system-review
description: Perform a meta-level retrospective on development workflow execution, analyzing plan adherence and process improvements.
disable-model-invocation: true
---

# System Review

Analyze the development process itself rather than the application code, identifying friction, planning flaws, and opportunities for workflow optimization.

## Review Inputs

1. **Original Plan**: `.agents/plans/<feature-name>.md`
2. **Execution Report**: `.agents/prod-execution-reports/<feature-name>.md`
3. **Workflow Rules**: Project guidelines and skill definitions.

## Core Analysis Dimensions

- **Plan Quality**: Was the plan clear, atomic, and accurate? Were codebase patterns correctly identified?
- **Execution Discipline**: Did the execution agent follow the plan in order, or did it skip verification steps?
- **Divergence Root Causes**:
  - *Good Divergence*: Discovered missing details during execution $\rightarrow$ improve planning rules.
  - *Bad Divergence*: Ignored plan instructions or hallucinated patterns $\rightarrow$ improve guardrails.
- **Tooling Friction**: Did validation commands fail due to missing local tools or broken paths?

---

## Output Report Structure

Save to `.agents/prod-system-reviews/<feature-name>-prod-system-review.md`:

```markdown
# System Process Review: <feature-name>

## Executive Summary
- **Plan-Execution Fidelity**: High | Moderate | Low
- **Primary Bottleneck / Friction Point**: <Summary>

## Divergence & Root Cause Analysis
| Divergence | Type (Good/Bad) | Root Cause | Preventive Action |
|---|---|---|---|
| Example deviation | Good | Missing API docs | Add doc scan to planning |

## Process & Template Improvements
- Recommended changes to skills, templates, or `AGENTS.md`.
```
