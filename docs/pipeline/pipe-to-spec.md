## What it does

Turns the current conversation into a frozen spec: problem statement, solution, extensive user stories, implementation decisions, testing decisions, out of scope, and further notes. No interview; it synthesizes what was already discussed.

## When to reach for it

Type `/pipe-to-spec` after grilling, when the design is settled and needs to become the contract every later stage builds against. It is stage 2 of the `pipe-ship` pipeline.

## Common questions

**Does it ask me questions?**
No. If something is still undecided, that belongs back in `pipe-grill-plan`.

**Where does the spec live?**
`specs/<feature-slug>/spec.md` in a `pipe-ship` run, published to the issue tracker when one is configured.

## It's working if

- The spec uses the project's domain glossary and respects ADRs.
- Test seams are sketched and agreed before the freeze.

## Where it fits

Stage 2 of `pipe-ship`, feeding `pipe-to-tickets`.
