## What it does

Scans a codebase for deepening opportunities: refactors that turn shallow modules into deep ones, improving testability and AI-navigability. Presents candidates as a visual HTML report with before/after diagrams, then grills your pick.

## When to reach for it

Type `/pipe-code-improve-architecture` when a subsystem feels harder to change than it should. It is stage 6 of the `pipe-ship` pipeline, scoped there to the files the run just changed.

## Common questions

**What vocabulary does it use?**
The `code-design` vocabulary (module, interface, depth, seam, adapter, leverage, locality) plus the project's `CONTEXT.md` domain language. Candidates that contradict an ADR are flagged, not hidden.

**What happens after I pick a candidate?**
A grilling loop settles the design, then the deepening either starts a new `pipe-ship` run or becomes a parked follow-up ticket.

## It's working if

- The report names concrete friction with files, problem, solution, and benefits.
- You made an explicit choice per candidate: explore, park, or reject with an ADR.

## Where it fits

Stage 6 of `pipe-ship`; pairs with `code-design` and `code-domain-modeling`.
