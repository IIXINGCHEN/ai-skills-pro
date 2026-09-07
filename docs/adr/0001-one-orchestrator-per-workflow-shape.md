# ADR 0001: One lifecycle orchestrator per workflow shape

Date: 2026-09-06
Status: superseded by ADR 0006

## Context

An earlier catalog shipped three overlapping review orchestrators (`eng-review-fix`, `eng-review-and-fix`, and `eng-review-and-ship`) whose convergence gauntlets (review, fix, validate, 3-5 passes) were near-identical. The model could route a "review and repair" request to any of them; nothing recorded which was canonical, and each new variant re-implemented the same gauntlet with drift.

## Decision

We keep exactly one orchestrator per workflow shape. Review-to-delivery is owned by `eng-review-and-ship`; the leaf steps (`eng-code-review`, `eng-review-fix`, `eng-validate`, `eng-completion-gate`, `eng-git-commit`) remain independently invocable. A new orchestrator may not ship unless its description states which existing lifecycle it does not replace.

## Consequences

`eng-review-and-fix` was deleted (subsumed). Orchestrators stay few and distinguishable; the near-neighbor eval families (`evals/train_cases.json` near-neighbor families) and `eng-router` guard the boundary. Cost: users wanting a mid-weight loop must compose leaf skills themselves.

## Alternatives considered

- Keep all three and document precedence: rejected, documentation does not route; the model still picked at random.
- Merge into one mega-lifecycle with flags: rejected, `eng-enterprise-lifecycle` already covers the full path; flags would recreate overlap one level up.
