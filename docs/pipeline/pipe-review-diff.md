## What it does

Reviews changes since a fixed point the way a careful human would: along the Standards axis (does the diff follow repo standards?) and the Spec axis (does it match the goal/spec?). Produces findings, not drive-by comments.

## When to reach for it

Type `/pipe-review-diff` after implementing a ticket or slice, before calling the work done. It is the in-loop review inside stage 4 of the `pipe-ship` pipeline.

## Common questions

**How is this different from eng-code-review?**
`pipe-review-diff` is the fast per-ticket check inside implementation; `eng-code-review` is the full six-dimension gate at stage 5 with severity levels and a formal report.

## It's working if

- Every finding became a fix task or a documented non-issue.
- The diff matches the ticket's acceptance criteria.

## Where it fits

Inside `pipe-implement`'s per-ticket loop; feeds fixes back into the same ticket.
