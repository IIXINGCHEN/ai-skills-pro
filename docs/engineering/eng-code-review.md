## What it does

Performs dual-axis code reviews (standards compliance and spec alignment) across git diffs.

## When to reach for it

Type /eng-code-review, or the agent reaches for it when reviewing branches, PRs, or uncommitted changes.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Intermediate artifacts or inspection commands are visible and eng-validated before moving to the next stage.

## Where it fits

Follows implementation and precedes eng-review-fix.
