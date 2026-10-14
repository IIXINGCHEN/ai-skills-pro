## What it does

A discipline for hard bugs: build a tight red/green feedback loop first, then bisect, hypothesise and instrument against it. Secrets are redacted before anything is shown.

## When to reach for it

Type /diagnosing-bugs, or the agent reaches for it when something is broken, throwing, failing or slow and staring at code is not working.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It follows the Agent Skills standard used across compatible harnesses.

## It's working if

- The skill executes with clear step-by-step progress and verifiable completion gates.
- Phase 1 is the whole skill: one tight pass/fail signal that goes red on this bug. Everything else is mechanical.

## Where it fits

Diagnosing defects, performance regressions, or flaky behaviour that resists casual inspection.
