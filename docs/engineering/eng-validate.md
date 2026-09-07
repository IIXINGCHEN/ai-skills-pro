## What it does

Executes full-suite health checks including syntax linters, type checkers, unit tests, and build checks.

## When to reach for it

Type `/eng-validate`, or the agent reaches for it automatically when a task fits. as a mandatory pre-commit or quality gate.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Intermediate artifacts or inspection commands are visible and verified before moving to the next stage.

## Where it fits

The universal quality gate across all development stages.
