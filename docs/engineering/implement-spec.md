## What it does

Takes a spec plus its tickets and implements them with a small crew: an exploration subagent maps the territory first, then implementer subagents work tickets in parallel, then a merger integrates.

## When to reach for it

Type /implement-spec, or the agent reaches for it when a spec with tickets is ready and the work is big enough to parallelise.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Exploration notes are saved outside the repo so every implementer shares the same map.

## Where it fits

Implementing a specced feature with parallel subagents and a controlled merge.
