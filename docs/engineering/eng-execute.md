## What it does

Systematically implements tasks from an approved plan in strict dependency order with step-by-step verification.

## When to reach for it

Type /eng-execute, or the agent reaches for it to implement tasks from a plan file.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Intermediate artifacts or inspection commands are visible and eng-validated before moving to the next stage.

## Where it fits

Follows eng-plan and precedes alidate.
