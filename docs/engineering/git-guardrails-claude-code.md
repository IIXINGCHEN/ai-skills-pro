## What it does

Sets up a PreToolUse hook that intercepts and blocks dangerous git commands (push, reset --hard, clean -fd, branch -D and variants) before Claude Code executes them.

## When to reach for it

Type /git-guardrails-claude-code, or the agent reaches for it when working in a repo where destructive git operations must be impossible by default.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- The hook parses the actual subcommand after stripping git global flags, and fails closed when its jq dependency is missing.

## Where it fits

Any repo where an agent writes code and push/reset/clean must never happen implicitly.
