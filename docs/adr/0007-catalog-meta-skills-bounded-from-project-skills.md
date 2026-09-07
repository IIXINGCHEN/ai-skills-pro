# ADR 0007: Catalog meta-skills are engineering-bucket skills, bounded from project engineering skills

Date: 2026-09-07
Status: accepted

## Context

The library gained two automations that operate on the library itself: `eng-skill-create` (author a complete new skill through the authoring checklist) and `eng-skill-optimize` (diagnose one named skill across trigger, budget, contract, and governance axes and apply a risk-ranked plan). They overlap by topic with the project-engineering family: `eng-review-fix` reviews code changes, `eng-spec` and `eng-plan` produce feature specs and plans, `eng-review-and-fix`/`eng-review-and-ship` converge and deliver changes. Without a recorded boundary, the duplicate-orchestrator class (failures/failure-cases.md) can recur one level up: two skills that both sound like "improve this thing".

## Decision

Catalog meta-skills live in the engineering bucket, are user-invoked, and are bounded by their target: they operate on skill-package surfaces (SKILL.md, openai.yaml, docs pages, manifests, evals, router, CURATED, release manifests) in this repository, executing `templates/skill-authoring-checklist.md` mechanically. Project engineering skills operate on target-project code and delivery. `eng-skill-optimize` explicitly defers project-code review to `eng-review-fix`; neither meta-skill replaces any lifecycle. Both carry the execution-record clause (structural orchestrator detection catches them by their 2+ required dependencies).

## Consequences

Routing stays one-question: is the target a skill in this catalog (meta) or code in a project (engineering family)? The authoring checklist is the single source for the touch surface; the meta-skills reference it, never re-enumerate it. Gates already enforce the boundary: router sync (every user-invoked engineering skill appears in the router), eval coverage (model-invoked only, so not applicable here), and the required-vs-body parity test govern their own manifests. Cost: two more consequential user-invoked entry points that must stay in the router table.

## Alternatives considered

- A separate `meta/` bucket: rejected; the bucket set is an upstream convention (engineering, productivity, design) and these are engineering work on a governed artifact.
- Model-invoked so "improve this skill" fires automatically: rejected; authoring mutates 10+ catalog surfaces, and consequential operations stay human-triggered in this repository.
- Folding both into one skill with a mode flag: rejected by the one-skill-one-stopping-point lesson (ADR 0001); creating from zero and optimizing an existing skill have different intake gates and different failure classes.
