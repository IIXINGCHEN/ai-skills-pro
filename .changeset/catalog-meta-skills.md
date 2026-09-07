---
"ai-skills-pro": minor
---

Catalog meta-skills: two automation skills that maintain the catalog with itself (ADR 0007):

- **`eng-skill-create`** (user-invoked): authors one complete new skill end to end through `templates/skill-authoring-checklist.md` section A. Three intake gates (enterprise fit, worth-building, de-duplication with the ADR 0001 boundary statement), a human-confirmed design freeze (ADR 0002: governance is proposed and confirmed, never derived), scaffolding from the new `templates/skill-scaffold.md`, mechanical surface wiring, four-gate verification with a 3-repair-round cap, then link script, changeset, and execution record.
- **`eng-skill-optimize`** (user-invoked): diagnoses exactly one named skill across six axes (trigger quality via the eval suites, context budget, contract consistency, body quality, governance freshness, enterprise-domain recheck), writes a risk-ranked plan to `specs/<skill>-optimization/reports/`, applies minimal diffs (description changes carry their eval changes), and drives the gates green. Hard boundaries: no deletion, no unconfirmed invocation flip, no re-purposing, self-optimization needs explicit confirmation.
- New `templates/skill-scaffold.md` (angle-bracket slots for the three-part scaffold, placeholders legal only in templates/ per ADR 0005) and ADR 0007 recording the catalog-meta vs project-engineering boundary.
- Catalog: 40 -> 42 skills (18 user-invoked / 24 model-invoked); both skills curated high risk, production maturity, platform owner; router rows added; execution-record clauses present (structural orchestrator detection catches both by their 2+ required dependencies).
