---
name: prod-prod-export-session
description: Export the current agent session logs, execution history, tool calls, and created artifacts into a structured markdown backup.
disable-model-invocation: true
---

# Export Session

Serialize and archive the current session's execution history, decisions, and artifacts.

## Process

1. **Collect Session Telemetry**:
   - Start timestamp and duration.
   - Files read, edited, or created.
   - Shell commands executed and their exit statuses.
2. **Summarize Outcomes**:
   - Objectives completed.
   - Divergences or follow-up items.
3. **Format & Write**:
   - Write structured markdown summary to `.agents/utils/session-<timestamp>.md`.
