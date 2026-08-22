## What it does

Intercepts destructive operations (deletion, history rewrite, data drops, infrastructure teardown) with a mandatory two-confirmation procedure: an operation card with scope and reversibility analysis, automatic recovery-artifact creation, and a final execute confirmation that voids on state drift.

## When to reach for it

The agent invokes it automatically before any classified destructive action. Users can also type /eng-destructive-safety-gate to audit whether a pending plan touches dangerous operations.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- No destructive command runs without two explicit matching confirmations.
- A recovery artifact exists for every reversible-target operation.
- Protected branches are never force-pushed under any confirmation.

## Where it fits

Cross-cutting safety sub-gate invoked by all lifecycle orchestrators and direct git/data skills.