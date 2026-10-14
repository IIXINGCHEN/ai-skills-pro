## What it does

Runs a two-axis review of the diff between HEAD and a fixed point the user supplies: Standards (does the code conform to this repo's documented coding standards?) and Spec (does the code faithfully implement the originating issue or spec?).

## When to reach for it

Type /code-review, or the agent reaches for it when a branch or change set needs reviewing before merge.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- A change can pass one axis and fail the other; the skill reports both so nothing hides behind a green half.

## Where it fits

Reviewing a feature branch, a bugfix, or any work-in-progress diff against its originating spec.
