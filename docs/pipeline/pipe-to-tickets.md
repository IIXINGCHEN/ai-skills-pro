## What it does

Breaks a spec into tracer-bullet tickets: narrow but complete vertical slices, each declaring its blocking edges, sized to fit a single fresh context window. Wide refactors get the expand-contract treatment instead of forced slicing.

## When to reach for it

Type `/pipe-to-tickets` with a frozen spec in hand. It is stage 3 of the `pipe-ship` pipeline.

## Common questions

**Do I get a say in the breakdown?**
Yes, and it is mandatory: the skill presents the breakdown as a numbered list and iterates until you approve the granularity and the blocking edges.

**Where do the tickets go?**
Local files under `specs/<feature-slug>/tickets/`, numbered `01` up in dependency order, or a real tracker (GitHub, Linear) with native blocking links.

## It's working if

- Every ticket is demoable on its own and declares exactly what blocks it.
- You approved the breakdown before anything was published.

## Where it fits

Stage 3 of `pipe-ship`, feeding `pipe-implement`, which works the frontier of unblocked tickets.
