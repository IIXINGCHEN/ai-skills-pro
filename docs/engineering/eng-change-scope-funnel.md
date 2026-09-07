## What it does

Converts a task into an explicit change whitelist through four stages: keyword net, call-chain trace, blast radius classification, and whitelist contract. Prevents collateral edits by making everything outside the whitelist off-limits.

## When to reach for it

Type `/eng-change-scope-funnel`, or the agent reaches for it automatically when a task fits.

The agent invokes it between planning and execution, before risky changes, or whenever a planned edit might touch shared code. Users can type /eng-change-scope-funnel to demand a scoped whitelist before authorizing work.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The whitelist exists before the first edit.
- Every listed file has a class, reason, and expected change size.
- Any out-of-whitelist need triggered a documented re-funnel instead of a silent expansion.

## Where it fits

Bridge stage between eng-plan and eng-execute; mandatory inside refactor and hotfix pipelines.