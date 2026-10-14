## What it does

Runs one delivery through the full pipeline: requirements, then an implement-audit-test inner loop that must come out clean before leaving, then global audit plus global test as dual release gates.

## When to reach for it

Type /pipeline, or the agent reaches for it when the user explicitly asks to run the full pipeline on a piece of work.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Three hard constraints: the inner loop never ships dirty, nothing ships without both global gates green, and no mocks or demo data ever enter a deliverable.

## Where it fits

End-to-end delivery where audit and test gates are non-negotiable.
