---
"ai-skills-pro": patch
---

Enforce the documented trigger-coverage bar instead of only documenting it.

`templates/skill-authoring-checklist.md` A.9 and `CLAUDE.md` both claimed every model-invoked skill carried at least three train `should_trigger` cases, plus a `near_neighbor` and a blind case. No skill met that bar and no test enforced it, so the prose was false. The bar is now real and consistent across prose, test, and data.

- `evals/train_cases.json`: every model-invoked skill now carries at least 3 `should_trigger` cases (24 skills, 72 cases, up from 18). Adds one `near_neighbor` case for the documented `eng-execute` / `eng-plan` boundary.
- `tests/governance.test.mjs`: the coverage test now fails below three train `should_trigger` cases per model-invoked skill, and a second test asserts no model-invoked skill is invisible to all three suites.
- `templates/skill-authoring-checklist.md` and `CLAUDE.md`: state exactly what is enforced, and separate the two requirements that could not honestly be enforced as written. A `near_neighbor` case is required only where a genuinely confusable sibling exists, because inventing one would violate ADR 0005. The blind suite is an independently authored regression floor, not a per-skill quota, because a case written while reading the description is no longer blind.
