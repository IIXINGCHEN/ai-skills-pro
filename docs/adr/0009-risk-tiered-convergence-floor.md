# ADR 0009: Risk-tiered convergence floors

Date: 2026-09-07
Status: accepted

## Context

The convergence gauntlet originally enforced a rigid floor of 3 passes unconditionally (`p >= 3 and pass clean -> converge`). For code changes this is earned (fixes can introduce subtler bugs that pass 2 exposes and pass 3 proves stable). For prose-only changes (documentation, prompt updates, copy edits, templates), however, fixes cannot introduce runtime regressions or break test suites. Forcing 3 passes on a docs change burns tokens and wall-clock time on an artificial stability proof for a failure mode the change cannot produce.

## Decision

The gauntlet floor is risk-tiered by change type:

- **Code-bearing changes** (default): floor of 3 passes, cap of 5. Any pass that adds, edits, or deletes executable code, configuration that alters runtime behavior, or tests, uses floor 3.
- **Prose-only changes**: floor of 2 passes, cap of 5. Permitted only when every pass touched exclusively Markdown, text documentation, or prompt files with zero runtime effects. The pipeline state records `"floor": 2` and `"floorJustification": "prose-only: <summary of touched paths>"`.

If a prose-only run uncovers a need for a code edit (e.g., an example fix requires modifying a script), the floor immediately escalates to 3 for the remainder of the run.

## Consequences

Documentation and prompt maintenance cycles converge after pass 2 when clean, cutting one full review-fix-validate round of token burn on low-risk tasks. Code-bearing lifecycles retain their full 3-pass stability guarantee with zero dilution. The rule is specified in `templates/convergence-gauntlet.md` and referenced by the lifecycles; it adds a required `floorJustification` field to pipeline state when floor 2 is exercised.

## Alternatives considered

- Single-pass fast path for docs: rejected; a single pass cannot catch regressions introduced by the first remediation batch (e.g. broken links, invalid references). Two passes is the minimum that provides a re-review of fixes.
- Per-file heuristics: rejected; simple binary distinction (code-bearing vs prose-only) is observable and tool-verifiable without brittle heuristic engines.
