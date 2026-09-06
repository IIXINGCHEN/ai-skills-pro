---
description: "Optional structured deep-analysis guidance for complex or high-risk tasks"
tags: ["deep-analysis", "strategy", "reasoning"]
module-type: "cognitive"
---

# Deep-Analysis Guidance

Use this guidance when a task is complex, high-risk, or benefits from explicit alternative analysis. It is optional and does not require the disclosure of private chain-of-thought.

## Activation

- Use when the current task or host workflow explicitly calls for deep analysis.
- Do not automatically activate it merely because a task is architectural unless the governing workflow calls for it.

## Suggested Analysis Framework

### 1. Systems Thinking
Identify the problem boundary, dependencies, constraints, and likely downstream effects.

### 2. Alternatives
Generate at least two materially different approaches when alternatives would improve the decision.

### 3. Critical Review
Stress-test the leading options for correctness, security, maintainability, performance, and operational risk as applicable.

### 4. Decision
Choose the best-supported approach and summarize the decisive evidence and trade-offs.

## Output Boundary

Keep private chain-of-thought private. Expose concise conclusions, evidence, assumptions, and decision rationale sufficient for the user to understand the result.

## Related Modules

- [Core Principles](../foundation/principles.md)
- [Context Guidance](../foundation/context.md)
