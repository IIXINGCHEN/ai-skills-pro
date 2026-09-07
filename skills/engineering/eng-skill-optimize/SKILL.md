---
name: eng-skill-optimize
description: "Diagnose one named skill across trigger, budget, contract, and governance axes, then apply a risk-ranked plan through the gates; project code review belongs to eng-review-fix."
disable-model-invocation: true
---

# Skill Optimize (catalog maintenance lifecycle)

Diagnoses exactly one named skill of this catalog across six axes, converts findings into a risk-ranked remediation plan, applies the minimal fixes, and drives the gates green. Boundary (ADR 0007): the target is a skill package in this repository (SKILL.md, openai.yaml, docs page, evals, router row, CURATED entry). It does not review project code changes (run `eng-review-fix`), does not create new skills (run `/eng-skill-create`), and does not delete skills or flip invocation modes (catalog-shape decisions belong to the human; see Hard Boundaries).

## 5-Stage Pipeline

```
Stage 1  Diagnose          six axes, each clean or finding with evidence
Stage 2  Plan              risk-ranked remediation plan + hand-off list
Stage 3  Apply             minimal diffs in plan order
Stage 4  Gate Verification generate:manifests + four gates, repair cap 3
Stage 5  Closeout          verdict, changeset, execution record, failure-ledger entry
```

## Stage 1: Diagnose (six axes)

Run every axis; a clean axis is reported as clean, never skipped silently.

1. **Trigger quality** (model-invoked only): score the description against its eval cases with `scripts/trigger-eval.mjs`; check the 280-char ceiling, trigger boundaries, and vocabulary ownership (a consuming skill must not carry a producer's trigger words).
2. **Context budget**: SKILL.md length against its tier (lean/standard/heavy) and the governance rule that heavy requires library maturity or user invocation.
3. **Contract consistency**: frontmatter field set, `agents/openai.yaml` mirror, docs-page four-section frame with the invocation mode stated, README and router rows aligned, manifest and registry freshness (hash match).
4. **Body quality**: checkable completion criteria present and observable, orchestrator execution-record clause when required (ADR 0004), artifact paths in the sanctioned homes (ADR 0003), no fabrication markers.
5. **Governance freshness**: CURATED entry present and matching reality, review_due not overdue, network policy paired when network access is true.
6. **Enterprise-domain recheck**: the skill still earns its place in an enterprise-only catalog.

## Stage 2: Plan

Merge findings into a risk-ranked plan at `specs/<skill-name>-optimization/reports/remediation-plan.md`. Ordering: contract and security findings first, then trigger quality, then governance freshness, then budget, then hygiene. Every entry carries file, evidence, minimal change, and the regression guard that proves it. Out-of-scope findings (catalog-shape, cross-skill refactors) go to a hand-off list with evidence; they are never silently dropped.

## Stage 3: Apply

Apply fixes in plan order, minimal diffs. A description change updates its eval cases in the same change (train cases may tune; holdout and blind must not regress). Manifest and registry regenerate in Stage 4, never by hand.

## Hard Boundaries

- **No deletion**: a removal recommendation cites `templates/skill-authoring-checklist.md` section C and stops; the human executes it.
- **No invocation flip**: user-to-model or model-to-user changes re-open the counts, eval obligations, and contract surfaces; they require explicit user confirmation recorded in the plan before Stage 3, otherwise they land on the hand-off list.
- **No re-purposing**: if the findings say the skill should become a different skill, halt and point at `/eng-skill-create` plus section C.
- **Self-reference**: optimizing `eng-skill-optimize` itself requires the user's explicit confirmation at Stage 1, mirroring the self-edit discipline of the reference meta-skill factory.

## Stage 4: Gate Verification

Run `npm run generate:manifests`, then `npm run validate`, `npm test`, `npm run eval`, `npm run release-check`. Failures loop back to the causing fix; hard cap 3 repair rounds, then halt with evidence.

## Stage 5: Closeout

**Call the Skill tool with "eng-completion-gate"** against this skill's criteria. Write the changeset. If the run discovered a new defect class (a failure mode no guard catches), add the entry to `failures/failure-cases.md` with its new regression guard. Append the execution record.

## State Persistence & Resumption

Record progress in `.scratch/skill-optimize-state.json`:

```
{
  "feature": "<skill-name>",
  "pipelineType": "skill-optimize",
  "target": "<skill-name>",
  "currentStage": 2,
  "axesClean": ["trigger", "budget"],
  "repairRounds": 0,
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

## Checkable Completion Criteria

- [ ] All six axes executed; each reported clean or with a finding plus cited evidence.
- [ ] Remediation plan persisted and risk-ranked; out-of-scope findings on the hand-off list.
- [ ] Fixes applied as minimal diffs; description changes carry their eval-case changes.
- [ ] Hard boundaries respected: no deletion, no unconfirmed invocation flip, no re-purposing.
- [ ] Four gates green within the 3-repair-round cap after manifest regeneration.
- [ ] Changeset written; new defect classes recorded in the failure ledger with their guards.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from the generated manifest.
