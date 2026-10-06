## What it does

Runs test-driven development as red-green-refactor: write the failing test first, make it pass with the smallest change, then refactor. Covers unit tests, mocking strategies, and test organization.

## When to reach for it

Type `/pipe-code-tdd` when implementing new behavior, or when `pipe-implement` points at it for the agreed test seams. It is the testing discipline inside stage 4 of the `pipe-ship` pipeline.

## Common questions

**Does TDD apply to every ticket?**
At the agreed seams, yes. The seam sketch from `pipe-to-spec` decides where the tests live before code is written.

## It's working if

- No production code was written without a failing test first.
- Refactor steps kept the suite green.

## Where it fits

Inside `pipe-implement`; referenced companions are `mocking.md` and `tests.md` in the skill directory.
