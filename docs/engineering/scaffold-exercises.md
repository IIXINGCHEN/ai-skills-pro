## What it does

Creates exercise directory structures (sections and numbered exercises with problem/solution/explainer subfolders) that pass the project's lint, leaving the new files uncommitted for the user to review.

## When to reach for it

Type /scaffold-exercises, or the agent reaches for it when adding a new course section or exercise stub.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Directory names carry the numbering contract (XX sections, XX.YY exercises) so ordering never drifts.

## Where it fits

Scaffolding course exercises that must satisfy the repo's structural lint.
