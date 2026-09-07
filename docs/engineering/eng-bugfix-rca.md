## What it does

Investigates software defects, isolates reproduction triggers, and produces a structured Root Cause Analysis document at `specs/<bug-id>/rca.md`. The evidence chain is closed end to end: the red run output before any fix, the green run of the same unweakened test after, both archived in the RCA, plus an ablation ledger recording which single-variable run killed each rejected hypothesis.

## When to reach for it

Type `/eng-bugfix-rca`, or the agent reaches for it automatically when a task fits: troubleshooting bugs or test failures.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Intermediate artifacts or inspection commands are visible and verified before moving to the next stage.

## Where it fits

Precedes eng-bugfix-implement.
