## What it does

Executes deep, multi-dimensional code reviews and architectural repairs across three complementary mental models: spatial thinking (module topology and layer isolation), solid thinking (end-to-end data-flow lifecycle), and reverse thinking (failure-mode and threat deduction).

## When to reach for it

Type `/eng-multidimensional-audit`, or the agent reaches for it automatically when a task fits, before major releases, architectural refactorings, or mission-critical quality gates.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The review covers spatial, solid, and reverse thinking dimensions systematically.
- Findings point directly to concrete file paths and line numbers.
- Proposed fixes eliminate hardcoding, close resource leaks, and establish transactional integrity.

## Where it fits

Pre-release quality gate, pairs with eng-validate and eng-review-fix.