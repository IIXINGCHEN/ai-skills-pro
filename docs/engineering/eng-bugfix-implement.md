## What it does

Applies surgical bug fixes based on an existing RCA document, verifying fixes against repro tests.

## When to reach for it

Type `/eng-bugfix-implement`, or the agent reaches for it automatically when a task fits: applying the surgical fix for a diagnosed defect from an existing RCA document.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Intermediate artifacts or inspection commands are visible and verified before moving to the next stage.

## Where it fits

Consumes eng-bugfix-rca and completes the debugging loop.
