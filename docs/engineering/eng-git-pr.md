## What it does

Generates comprehensive GitHub Pull Requests with change summaries, test evidence, and linked issues.

## When to reach for it

You invoke this by typing `/eng-git-pr`, and the agent won't reach for it on its own, when preparing code for team review.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Intermediate artifacts or inspection commands are visible and verified before moving to the next stage.

## Where it fits

Runs after eng-validate and eng-git-commit.
