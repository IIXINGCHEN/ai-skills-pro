---
name: pipe-implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Use /pipe-code-tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /pipe-review-diff to review the work.

Commit your work to the current branch.

When run inside `pipe-ship` stage 4, this skill executes within the orchestrator's 8-step per-ticket loop (implement, test, audit, review, fix, retest, refix, green) with 3 repair rounds per failure and escalation on red. Standalone, it covers implement → TDD → review-diff → commit as described above.
