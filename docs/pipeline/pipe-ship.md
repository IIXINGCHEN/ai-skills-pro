## What it does

Runs the full engineering loop for one feature: grill the idea, freeze the spec, split tracer-bullet tickets, implement, review, deepen the architecture, then deliver and deploy to production. Eight stages, one at a time, each with a gate, resumable from `specs/<feature-slug>/RUN.md`.

## When to reach for it

Type `/pipe-ship <feature-slug>` when a feature should go from raw idea to production without losing the thread between stages. Use it for any unit of work large enough to deserve a spec.

## Common questions

**Does ship replace the stage skills?**
No. It conducts them: `pipe-grill-plan`, `pipe-to-spec`, `pipe-to-tickets`, `pipe-implement`, `eng-code-review`, `pipe-code-improve-architecture`, `eng-review-and-ship`, `eng-release-ops-lifecycle`.

**Can I skip the production deploy?**
Yes. Stage 8 is skippable when the team deploys by pulling the pushed branch on the server; the skip is recorded in `RUN.md`.

## It's working if

- Every stage gate is recorded in `RUN.md`.
- Push and deploy each happened only after your explicit authorization.
- A release report exists for every production deploy, with a rollback plan.

## Where it fits

The flagship pipeline of the `pipeline` bucket. Deepen candidates it surfaces start new `pipe-ship` runs of their own.
