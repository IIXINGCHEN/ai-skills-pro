## What it does

Installs Husky plus lint-staged plus Prettier and wires up the pre-commit hook, detecting the package manager from the lockfile first (npm, pnpm, yarn or bun).

## When to reach for it

Type /setup-pre-commit, or the agent reaches for it when a repo needs commit-time formatting, typechecking or tests.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- It stages the changes and asks the user to confirm before committing anything.

## Where it fits

Adding pre-commit hooks to a JavaScript/TypeScript repository.
