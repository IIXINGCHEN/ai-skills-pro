# ADR 0005: No fabrication anywhere in this repository

Date: 2026-09-07
Status: accepted

## Context

The repository ships guidance that other agents execute. A fabricated path in a skill, an invented metric in a report, or a mock dressed as real data does not just mislead a reader: it gets executed, and execution of fiction produces silent wrong behavior. Two real strays had already slipped in (a dangling `NaN` line inside `eng-hardening-review`, a duplicated sentence in `docs/design/cog-axiom.md`), proving that nothing catches this class of defect today.

## Decision

No file in this repository may contain assumed, simulated, or invented content. Every path, command, metric, quotation, and evidence claim must correspond to something that really exists and can be re-verified with a tool. Fabrication markers (placeholder filler text, stray non-content tokens, TODO/FIXME residue, mocks posing as data) fail the gate. Exemptions are explicit and two: angle-bracket placeholder slots inside `templates/`, and fixtures under `evals/` that are labeled as fixtures. The full discipline, including the eight operating habits that operationalize it (reproduction, adversarial review, ablation, Occam, uncertainty ledger, independent judgment, fact-vs-inference, cohesion), lives in `skills/design/cog-axiom/cognitive/epistemic-discipline.md`.

## Consequences

`tests/no-fabrication.test.mjs` scans every prose and code surface for fabrication markers and fails on any hit outside the exemptions; the two known strays are fixed in the same change and recorded in `failures/failure-cases.md` with that test as their regression guard. Writers of new content must source claims from tool output, not memory; reviewers gain a mechanical backstop for the class of defect human review scrolls past.

## Alternatives considered

- Trust review discipline alone: rejected, the two shipped strays passed several review passes already.
- Ban placeholders entirely: rejected, templates and eval fixtures are deliberate fiction containers; banning them would destroy the template system instead of the defect.
