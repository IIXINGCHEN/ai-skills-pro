## What it does

Audits every completion claim against verifiable evidence artifacts and issues one of three verdicts: DONE, DONE-WITH-ACCEPTED-RISKS, or BLOCKED. Blocks unverified completion claims by treating missing artifacts as unmet criteria.

## When to reach for it

The agent invokes it at the end of any pipeline, stage, or task before declaring completion. Users can also type /eng-completion-gate to force an evidence audit of any claimed-done work.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Every criterion maps to a real artifact verified by tool inspection.
- No completion claim is supported by prose alone.
- The verdict is one of the three canonical states and is recorded.

## Where it fits

Final gate of the enterprise lifecycle and every autopilot orchestrator, before git delivery or archival.