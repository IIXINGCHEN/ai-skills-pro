---
name: eng-router
description: Browse the engineering capability map and choose the right workflow or reusable skill for the current task.
disable-model-invocation: true
---
# Engineering Skill Router

Use this skill to choose a focused engineering workflow. It is an index, not a global execution protocol. Skills remain independently usable and should be composed only when the task benefits from the handoff.

## Choose a workflow

| Situation | Start here |
| --- | --- |
| Large feature with multiple delivery stages | `/eng-enterprise-lifecycle` |
| Existing change needs review and repair | `/eng-review-and-fix` |
| Review, remediation, verification, and delivery | `/eng-review-and-ship` |
| Defect with an unclear root cause | `/eng-defect-lifecycle` |
| Active production incident | `/eng-hotfix-emergency-lifecycle` |
| Unfamiliar repository | `/eng-onboarding-audit-lifecycle` |
| Legacy cleanup without behavior change | `/eng-refactor-lifecycle` |
| Production release and operations | `/eng-release-ops-lifecycle` |

## Choose a reusable skill

### Understand and plan

- `eng-prime-context`: build a focused codebase mental model.
- `eng-analyze-codebase`: inspect topology, coupling, and design patterns.
- `eng-change-scope-funnel`: constrain the edit surface before risky changes.
- `eng-spec`: freeze executable requirements and contracts.
- `eng-plan`: turn the accepted scope into an implementation plan.

### Implement and verify

- `eng-execute`: implement an approved plan in dependency order.
- `eng-bugfix-rca`: reproduce a defect and isolate its root cause.
- `eng-bugfix-implement`: apply a surgical fix with a regression test.
- `eng-validate`: run the repository's real validation commands.

### Review and harden

- `eng-code-review`: review a diff or repository against standards and the originating spec.
- `eng-review-fix`: remediate concrete review findings.
- `eng-adversarial-audit`: probe security and architectural failure modes.
- `eng-multidimensional-audit`: inspect architecture, flow, and scenario risks together.
- `eng-hardening-review`: check failure surfaces and data integrity.
- `eng-completion-gate`: produce an evidence-backed DONE, DONE-WITH-ACCEPTED-RISKS, or BLOCKED verdict.
- `eng-destructive-safety-gate`: gate irreversible operations behind explicit user confirmation.

### Delivery and operations

- `eng-git-commit`: create atomic, reviewable commits.
- `/eng-git-pr`: prepare or submit a pull request under explicit human control.
- `/eng-docker-update`: update Compose images with health and rollback checks.
- `/eng-linux-security`: apply host firewall and intrusion-defense changes.

## Invocation boundary

The router may recommend any user-invoked skill for the human to run. It may call model-invoked skills only when the current workflow requires them. It never uses a Skill Tool call to reach a user-invoked skill.

## Routing rule

Choose the smallest skill that completely addresses the task. Prefer a focused reusable skill over a full lifecycle when the task is local. Choose a lifecycle only when its handoffs, gates, or artifacts add value.

## Completion Criteria

- [ ] One appropriate starting skill or workflow is identified.
- [ ] The selected skill's invocation mode is respected.
- [ ] No user-invoked skill is presented as an automatic Skill Tool dependency.
