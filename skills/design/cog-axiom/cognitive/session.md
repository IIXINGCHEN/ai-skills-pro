---
description: "Guidance for compact session summaries and state handoff"
version: "1.6.0"
tags: ["session", "state", "context"]
module-type: "cognitive"
---

# Session State Guidance

Use a compact session summary when work needs to be handed off, resumed, exported, or compressed. The exact format should follow the active workflow or user's requested format.

## When to Use

- The user explicitly requests a context summary, handoff, or session export.
- A governing workflow requires a checkpoint before a long or interrupted task.
- A task is likely to cross sessions and durable state would reduce rework.

## Suggested Summary

```yaml
previous_context: concise summary
current_work: current task and status
decisions: key decisions and rationale
files: relevant paths or artifacts
validation: completed checks and evidence
pending: next steps or unresolved questions
assumptions: material assumptions only
```

## Restoration

When restoring a session, use whatever checkpoint format the active workflow expects. Do not require a magic XML block or reject useful context solely because it uses another valid format.

## Related Modules

- [Context Guidance](../foundation/context.md)
- [Interaction Guidance](../protocols/interaction.md)
