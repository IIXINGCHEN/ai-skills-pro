---
"ai-skills-pro": patch
---

Convergence gauntlet consolidation and risk-tiered floors (ADR 0008, ADR 0009):

- Canonical gauntlet specification (ADR 0008): created `templates/convergence-gauntlet.md` as the single authoritative source of convergence loop mechanics (pass floor, cap 5, per-pass repair cap 3, triage rules, re-review union scope) shared across `eng-review-and-ship`, `eng-review-and-fix`, and `eng-enterprise-lifecycle`. Lifecycles now summarize rules concisely and point to the template, eliminating drift across multi-pass orchestrators.
- Risk-tiered convergence floor (ADR 0009): differentiated convergence floors by change type. Code-bearing changes retain the full 3-pass stability guarantee; prose-only changes (documentation, copy, prompts) converge after pass 2 when clean, eliminating one unneeded round of token burn on changes that cannot cause runtime regressions. State files carry `floor` and `floorJustification`.
- Documentation sync: updated docs pages for `eng-review-and-ship`, `eng-review-and-fix`, and `eng-enterprise-lifecycle` to reflect risk-tiered floors; unified ecosystem support framing across all 42 docs pages.
- Regression guard: added unit tests in `tests/execution-trace.test.mjs` verifying canonical template existence, floor/cap parameters, and lifecycle references; added test in `tests/upstream-conventions.test.mjs` asserting uniform ecosystem support across all docs pages (suite now passes 61/61).
- Manifests and registry regenerated cleanly via `npm run generate:manifests`; all four quality gates green (`validate`, `test`, `eval`, `release-check`).
