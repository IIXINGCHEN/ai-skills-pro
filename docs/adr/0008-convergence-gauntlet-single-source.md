# ADR 0008: The convergence gauntlet has one canonical source

Date: 2026-09-07
Status: accepted

## Context

Three governed lifecycles (`eng-review-and-ship`, `eng-review-and-fix`, `eng-enterprise-lifecycle`) each restated the convergence gauntlet mechanics (pass floor, pass cap, per-pass repair cap, convergence rule, re-review scope) in full inside their own `SKILL.md`. Skills are independently loaded, so the restatement was deliberate self-containment, but it left four copies of the same numbers with no mechanism keeping them equal. ADR 0001's own history (three drifting near-identical orchestrators) is the documented cost of that shape: near-neighbor evals guard routing, nothing guarded mechanism text.

## Decision

The gauntlet mechanics live once, in `templates/convergence-gauntlet.md` (single source, alongside the authoring checklist). Each lifecycle `SKILL.md` keeps a two-line summary (floor/cap plus the risk-tiered floor rule) and points there for the full rules. Changing any gauntlet number now requires editing one file plus an ADR, instead of N skill bodies drifting silently.

## Consequences

Lifecycles shrink and stay synchronized by construction. A regression guard test pins the pointer: every lifecycle that mentions the gauntlet must reference `templates/convergence-gauntlet.md`, and the numbers appearing in lifecycle prose must match the single source. The summary in each skill is intentionally lossy: if a number matters at execution time, the agent reads the canonical file, the same pattern `eng-skill-create` already uses for the authoring checklist.

## Alternatives considered

- Keep full restatement per skill for self-containment: rejected; self-containment is preserved by the summary plus pointer, while drift risk is what the ADR system exists to remove.
- Move the gauntlet into `cog-axiom` as a reference module: rejected; `cog-axiom` is vendor-neutral guidance by its own charter, while the gauntlet is this catalog's execution doctrine and belongs beside the checklist that governs catalog surfaces.
