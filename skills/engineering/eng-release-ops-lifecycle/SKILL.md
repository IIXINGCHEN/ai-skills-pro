---
name: eng-release-ops-lifecycle
description: Run the production release-operations lifecycle with health checks and rollback planning.
disable-model-invocation: true
---
# Release & Production Operations Lifecycle

Automates the recurring release and maintenance workflow while keeping humans in command of the production window decision.

## 5-Stage Pipeline State Machine

```
Stage 1: Pre-flight Inventory (targets, images, configs)
           │
           ▼
[Gate: Human Release Window Approval]
           │
           ▼
Stage 2: eng-docker-update (digest diff, zero-downtime recreation)
           │
           ▼
Stage 3: eng-linux-security Hardening (optional flag)
           │
           ▼
Stage 4: Health Verification + Rollback Plan Generation
           │
           ▼
Stage 5: Operations Report at releases/<release-id>.md
```

---

## Autonomous Execution Protocol

1. **Execute Stage 1 (Pre-flight Inventory)**: Enumerate compose stacks, current image digests, target hosts, exposed ports, and volume mounts. Verify all configuration paths resolve on the target environment.
2. **Gate (Human Approval)**: Present the change set (old digest vs new digest per service), maintenance window, and rollback triggers. Proceed only on explicit approval.
3. **Call the Skill tool with "eng-docker-update"**: Perform image digest comparison and zero-downtime container recreation with health probes between batches. **Gate (Human Approval)**: container recreation and image pruning proceed only on explicit user confirmation for this window. Pruning must exclude every digest recorded in the Stage 1 inventory as a rollback candidate; only images superseded by the current update and not referenced by any rollback plan may be pruned.
4. **Call the Skill tool with "eng-linux-security"** (optional): Include this stage when the user requests server hardening during the same window; firewall rule changes proceed only on explicit user confirmation.
5. **Execute Stage 4 (Health & Rollback)**: Probe every service endpoint, verify logs are free of fatal errors, and generate an executable rollback plan mapping each service to its previous digest.
6. **Execute Stage 5 (Report)**: Save the operations report to `releases/<release-id>.md` covering applied changes, probe results, and rollback instructions.

## State Persistence & Resumption

Record pipeline progress in `.scratch/<pipeline>-state.json`:

```
{
  "feature": "<release-id>",
  "pipelineType": "release-ops",
  "currentStage": 2,
  "stageName": "eng-docker-update",
  "completedStages": [
    "pre-flight-inventory"
  ],
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

## Checkable Completion Criteria

- [ ] Pre-flight inventory verified against the real target environment.
- [ ] Explicit human approval captured for the release window.
- [ ] All container recreations passed health probes.
- [ ] Executable rollback plan produced covering every changed service.
- [ ] Operations report saved to `releases/<release-id>.md`.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report).
