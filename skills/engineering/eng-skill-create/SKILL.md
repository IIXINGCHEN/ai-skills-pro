---
name: eng-skill-create
description: "Author a new skill end to end through the authoring checklist: intake gates, scaffold, surface wiring, gate verification, and changeset."
disable-model-invocation: true
---

# Skill Create (catalog authoring lifecycle)

Authors one complete new skill in this repository, executing `templates/skill-authoring-checklist.md` section A mechanically. The checklist is the single source for the touch surface; this skill orchestrates it and never re-enumerates the surfaces in prose. Boundary (ADR 0007): it operates on skill-package surfaces in this catalog. It does not review project code (`eng-review-fix`), does not produce feature specs or plans (`eng-spec`, `eng-plan`), and does not optimize an existing skill (run `/eng-skill-optimize`).

## 6-Stage Pipeline

```
Stage 0  Intake Gates        three hard gates; any failure stops the run
Stage 1  Design Freeze       governance proposal confirmed by the human
Stage 2  Scaffold            three-part scaffold from templates/skill-scaffold.md
Stage 3  Surface Wiring      authoring checklist section A, item by item
Stage 4  Gate Verification   generate:manifests + four gates, repair cap 3
Stage 5  Closeout            verdict, link script, changeset, execution record
```

## Stage 0: Intake Gates

Each gate is a stop condition, not a suggestion. Cite the evidence for pass.

1. **Enterprise gate**: the skill's purpose must be enterprise work (engineering, delivery, governance, productivity, enterprise design). Entertainment, personal-assistant, and SEO/marketing purposes are rejected by repository mandate.
2. **Worth-building gate**: the request must show repeated use and a reusable output contract (a deliverable shape that recurs across runs). A one-off request is not a skill; report the recommendation to skip.
3. **De-duplication gate**: scan every existing description in `registry/skills.json` and the `eng-router` table for near-neighbors. If the new skill is an orchestrator or lifecycle, its description must state which existing skill it does NOT replace (ADR 0001). A near-neighbor hit is a stop: either the existing skill covers the request, or the boundary is recorded before any file is written.

## Stage 1: Design Freeze

Propose, then get the human's confirmation before writing files (ADR 0002: governance data is a human decision, never derived):

- Invocation mode (user-invoked for consequential workflows, model-invoked for reusable discipline) and the description draft under its length rule (user: one line, max 180 chars, no trigger phrasing; model: trigger boundaries, max 280 chars, producers keep their own trigger words).
- Risk level, permission footprint (filesystem/shell/network), owner, maturity, review cadence: the proposed CURATED entry.
- Skill Tool dependencies (model-invoked targets only) and the knowledge layout for artifacts (`specs/<skill>/` durable, `.scratch/` run state).

## Stage 2: Scaffold

Fill `templates/skill-scaffold.md` slots and create exactly: `skills/<bucket>/<name>/SKILL.md`, `skills/<bucket>/<name>/agents/openai.yaml`, `docs/<bucket>/<name>.md`. No `manifest.yaml` by hand: manifests and registry are generated (Stage 4). Placeholders are legal only in the template; shipped files carry real values (ADR 0005).

## Stage 3: Surface Wiring

Execute `templates/skill-authoring-checklist.md` section A in order, checking off items: bucket README, both top-level READMEs (entry, badge, section counts), `.claude-plugin/plugin.json` and `package.json` arrays, CURATED entry, RELEASE-MANIFEST counts, router row (engineering bucket), eval cases (model-invoked: at least 3 train should_trigger, 1 near_neighbor, 1 blind), security policy entries (network-capable only). Each item lands in this stage; a skipped item fails Stage 4 gates or ships a stale surface the gates cannot see.

## Stage 4: Gate Verification

Run `npm run generate:manifests`, then the four gates: `npm run validate`, `npm test`, `npm run eval`, `npm run release-check`. A failure loops back to the wiring item that caused it; hard cap 3 repair rounds, then halt with the evidence and hand back.

## Stage 5: Closeout

**Call the Skill tool with "eng-completion-gate"** against this skill's completion criteria. On DONE: run the link script (`scripts/link-skills.ps1` or `.sh`) so the local harness sees the skill, write the changeset describing the user-visible addition, and append the execution record.

## State Persistence & Resumption

Record progress in `.scratch/skill-create-state.json`:

```
{
  "feature": "<skill-name>",
  "pipelineType": "skill-create",
  "currentStage": 3,
  "completedStages": ["intake-gates", "design-freeze", "scaffold"],
  "failedGate": null,
  "repairRounds": 0,
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

## Checkable Completion Criteria

- [ ] All three intake gates passed with cited evidence, or the run stopped at the failed gate with a reason.
- [ ] Design freeze confirmed by the human: invocation mode, description within its length rule, CURATED proposal.
- [ ] Scaffold produced exactly the three files, no hand-written manifest.
- [ ] Every section-A checklist item executed and recorded; the modified file list matches it.
- [ ] Four gates green within the 3-repair-round cap after `npm run generate:manifests`.
- [ ] Completion verdict recorded; link script re-run; changeset written.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from the generated manifest.
