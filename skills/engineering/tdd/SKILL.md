---
name: tdd
description: "Run the red to green loop so each cycle produces tests worth keeping. Consult every section before and during the loop, not after."
---

# Test-Driven Development

Run the red to green loop so each cycle produces tests worth keeping. Consult every section before and during the loop, not after.

## Agree on the seams first

- Write down the public boundaries under test and confirm them with the user before writing any test.

- Read `GLOSSARY.md` when the repo has one so test names match the project domain language, and respect ADRs in the area you touch.

- Reach for the shared module design vocabulary when the interface shape itself is in question, covering module, interface, depth, seam, adapter, leverage and locality.

## Recognize a good test

- Verify behavior through public interfaces, never through implementation details, so the test reads like a specification and survives refactors.

- Draw expected values from an independent source of truth such as a known-good literal, a worked example or the spec.

- See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Avoid the anti-patterns

- Reject implementation-coupled tests that mock internal collaborators, test private methods or verify through a side channel, since they break on refactors without behavior change.

- Reject tautological assertions that recompute the expected value the way the code does, because they pass by construction and can never disagree with the code.

- Work in vertical slices of one test then one implementation, instead of writing all tests first and committing to imagined behavior.

## Run the loop

- Write the failing test first, then add only enough code to pass it, without anticipating future tests.

- Keep one seam, one test and one minimal implementation per cycle.

- Move refactoring to the review stage, not the red to green cycle.

## Alternatives for better results

- Ask the user which seams matter most when full coverage is impractical, so effort lands on critical paths and complex logic.

- Pair this loop with a review skill after green when the change needs hardening before delivery.
