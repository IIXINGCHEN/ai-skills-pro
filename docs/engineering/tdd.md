## What it does

Runs the red-green-refactor loop so each cycle produces tests worth keeping: agree on the seams under test first, then write one failing test, make it pass, refactor.

## When to reach for it

Type /tdd, or the agent reaches for it when building features or fixing bugs test-first.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- No test is written at an unconfirmed seam; test names follow the project's GLOSSARY.md when one exists.

## Where it fits

Test-driven feature work or bugfixes where the tests must survive the implementation.
