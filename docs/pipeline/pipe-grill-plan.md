## What it does

Interviews you relentlessly about a plan, decision, or idea until every branch of the design tree is settled. Questions arrive in rounds; each round covers the whole frontier of decisions whose prerequisites are already settled, with a recommended answer attached.

## When to reach for it

Type `/pipe-grill-plan` when an idea needs stress-testing before any spec is written. It is stage 1 of the `pipe-ship` pipeline.

## Common questions

**When does the grilling stop?**
When the frontier is empty: every branch visited, nothing silently assumed, and you confirm the shared understanding.

**Who finds the facts?**
The agent does. It dispatches sub-agents for anything it can look up; you only answer the decisions.

## It's working if

- No decision was made without your answer.
- The session ends with a recorded shared understanding, not a silent assumption.

## Where it fits

Stage 1 of `pipe-ship`; also the grilling loop inside `pipe-code-improve-architecture`.
