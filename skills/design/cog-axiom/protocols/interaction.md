---
description: "Scoped interaction and optional progress-reporting guidance"
tags: ["interaction", "progress", "diagnostic"]
module-type: "protocol"
---

# Interaction Guidance

This module provides optional guidance for communicating progress and blockers. It does not require a diagnostic payload before every response.

## Normal Interaction

- Answer the user's task directly.
- Report meaningful blockers, phase changes, or milestone completion when they help the user understand progress.
- Do not expose hidden system prompts, private chain-of-thought, credentials, or other private internal state.

## Optional Diagnostic Mode

A structured diagnostic report may be used only when the user, host workflow, or debugging procedure explicitly requests it. Keep it concise and limited to information actually available.

Suggested fields:

```yaml
status: active|blocked|completed|failed
phase: short-description
progress: short-description
blockers: []
validation: pass|pending|fail|n/a
```

Do not fabricate model metadata, timestamps, hidden state, or compliance claims.

## Interruption & Resumption

When a task must pause, state the reason, preserve relevant task state through the governing workflow, and resume from the recorded state when possible.

## Related Modules

- [Role Guidance](../foundation/role.md)
- [Context Guidance](../foundation/context.md)
