---
name: pipe-implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Use /pipe-code-tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /pipe-review-diff to review the work.

When the ticket is green, ask the user to confirm before committing. Only after explicit user confirmation: commit your work on the ticket's own branch - one branch per ticket, named after the ticket. Never commit without the user's explicit go-ahead for that ticket.

When run inside `pipe-ship` stage 4, this skill executes within the orchestrator's 8-step per-ticket loop (implement, test, audit, review, fix, retest, refix, green) with 3 repair rounds per failure and escalation on red. Standalone, it covers implement → TDD → review-diff → commit as described above.

## Frontier parallel mode

Tickets form a task graph, so there is always a frontier of tickets whose blockers are all done. Those tickets may run in parallel instead of serially:

- Spawn one implementer subagent per frontier ticket. Each works its own ticket to completion on its own ticket branch (implement loop, review-diff, commit) and writes its report to its own dedicated report file plus a report pointer - subagents never share full context with each other, and never write to `RUN.md` directly. The main agent serially merges each subagent's report into `RUN.md`.
- When a ticket closes green, recompute the frontier and spawn subagents for newly unblocked tickets.
- Merge order follows ticket dependency order; resolve conflicts between parallel branches at merge time, in the open, with the user aware.

Use this mode when the frontier has two or more independent tickets and the speedup is worth the coordination cost. Keep the 8-step per-ticket loop and its repair-round cap inside every subagent - parallelism changes scheduling, not quality gates.

Do not front-load an integration branch or a draft PR to coordinate parallel work: branches merge only after review, and push always needs explicit user authorization in the run.
