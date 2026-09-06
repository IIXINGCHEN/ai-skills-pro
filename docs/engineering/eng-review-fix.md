## What it does

Systematically applies fixes for issues identified in code review reports with automated regression tests.

## When to reach for it

Type /eng-review-fix, or the agent reaches for it after review reports are generated.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Intermediate artifacts or inspection commands are visible and eng-validated before moving to the next stage.

## Where it fits

Consumes findings from eng-code-review and feeds back into alidate.
