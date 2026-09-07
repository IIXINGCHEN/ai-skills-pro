# ADR 0006: Reinstate eng-review-and-fix as the no-delivery review loop

Date: 2026-09-07
Status: accepted

## Context

ADR 0001 deleted `eng-review-and-fix` because it duplicated the convergence gauntlet of `eng-review-and-ship` with no recorded boundary: a "review and repair" request could route to either. The user has since required the skill back: fix-and-stop is a real workflow (fix first, ship later, or fix without any delivery in the run), and forcing it through the ship lifecycle couples repair to commits and a push authorization gate the task may not want.

## Decision

`eng-review-and-fix` is reinstated as a user-invoked lifecycle with an explicit, tested boundary: it composes `eng-code-review`, `eng-review-fix`, and `eng-validate` into the 3-5 pass convergence loop and stops at the consolidated report. It performs no commits and no remote actions. `eng-review-and-ship` remains the delivery lifecycle: same gauntlet, plus completion verdict, atomic commits, and gated push. Both descriptions state which sibling they do NOT replace, satisfying ADR 0001's rule for any new orchestrator.

## Consequences

Two orchestrators again share the review-fix-validate gauntlet, by composition from the same leaf skills rather than re-implementation. Routing between them is decided by one question the user's phrasing answers (is delivery part of this run?), and each skill's boundary paragraph plus the near-neighbor eval cases keep the routes distinguishable. `tests/skills.test.mjs` now requires the skill's presence instead of its absence.

## Alternatives considered

- Keep it deleted and let users compose leaf skills manually: rejected; the convergence floor (minimum 3 passes) and per-pass repair caps are exactly the sequencing users should not re-implement per run.
- One mega-lifecycle with a `--no-delivery` flag: rejected by ADR 0001 precedent; flags recreate the overlap one level up and hide the boundary from routing.
