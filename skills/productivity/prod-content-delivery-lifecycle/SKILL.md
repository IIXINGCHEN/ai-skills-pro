---
name: prod-content-delivery-lifecycle
description: Run the end-to-end content delivery lifecycle from brief alignment through final delivery.
disable-model-invocation: true
---
# Content Delivery Lifecycle

Orchestrates non-code deliverables through the Briefing Loop with automatic progression between stages, pausing only for the human Brief sign-off.

## 5-Stage Pipeline State Machine

```
Stage 1: prod-briefing-loop ───► [Gate: Human Brief Sign-off]
                                        │
Stage 2: Draft Generation ◄─────────────┘
           │
           ▼
Stage 3: Gap Review Self-Audit
           │
           ▼
Stage 4: Revision into Final Deliverable
           │
           ▼
Stage 5: Delivery Record Archive
```

---

## Autonomous Execution Protocol

1. **Call the Skill tool with "prod-briefing-loop"**: Ask 3 to 5 blocker questions, synthesize the Playback Brief, and wait for explicit user confirmation.
2. **Execute Stage 2 (Draft Generation)**: Produce the initial draft strictly following the frozen Brief contract.
3. **Execute Stage 3 (Gap Review)**: Attach a self-audit covering strengths, residual ambiguities, recommended deletions, and actionable refinements.
4. **Execute Stage 4 (Revision)**: Apply Gap Review refinements into the final version. If the revision requires new information beyond the frozen Brief, return to Stage 1 instead of guessing.
5. **Execute Stage 5 (Archive)**: Record the delivery summary at `specs/<content-slug>/<content-slug>.md` including the confirmed Brief, final artifact location, and lessons learned.

## State Persistence & Resumption

Record pipeline progress in `.scratch/<pipeline>-state.json`:

```
{
  "feature": "<content-slug>",
  "pipelineType": "content-delivery",
  "currentStage": 3,
  "stageName": "gap-review",
  "completedStages": [
    "prod-briefing-loop",
    "draft-generation"
  ],
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

## Checkable Completion Criteria

- [ ] Brief clarified, played back, and explicitly confirmed before drafting.
- [ ] Draft generated in full conformance with the frozen Brief.
- [ ] Gap Review self-audit attached to the draft.
- [ ] Final deliverable revised and delivered.
- [ ] Delivery record archived at `specs/<content-slug>/`.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from generated manifests.
