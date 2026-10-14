---
name: prod-export-session
description: Export the current agent session logs, execution history, tool calls, and created artifacts into a structured markdown backup.
disable-model-invocation: true
---

# Export Session

Serialize and archive the current session's execution history, decisions, and artifacts.

## Process

1. **Collect Session Telemetry** (source: this session's own tool-call history - do not invent entries you did not observe):
   - Start timestamp and duration.
   - Files read, edited, or created (from the file read/write tool calls in this session).
   - Shell commands executed and their exit statuses (from the shell tool calls in this session).
   - **Secret redaction (fail-closed):** before writing, scrub every telemetry entry for secrets: tokens, API keys, passwords, private keys, and any `KEY=VALUE` pair whose key matches `*TOKEN*`, `*KEY*`, `*SECRET*`, `*PASSWORD*`, `*AUTH*`. Replace the value with `[REDACTED]`. If you cannot determine whether a value is secret, treat it as secret. Never write an unredacted command line that carried credentials to the archive.
2. **Summarize Outcomes**:
   - Objectives completed.
   - Divergences or follow-up items.
3. **Format & Write**:
   - Write structured markdown summary to `.agents/utils/session-<timestamp>.md` (create the `.agents/utils/` directory first if it does not exist).

---

## Checkable Completion Criteria

- [ ] Session telemetry collected: timestamps, file operations, commands with exit statuses.
- [ ] Every telemetry entry scrubbed for secrets (tokens, keys, passwords); uncertain values treated as secret and redacted.
- [ ] Outcomes summarized with objectives completed plus divergences or follow-ups.
- [ ] Structured markdown written to `.agents/utils/session-<timestamp>.md`.
