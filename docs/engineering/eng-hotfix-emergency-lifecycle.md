## What it does

Executes the fast-track emergency pipeline for P0/P1 production incidents: time-boxed root cause lock, human approval gate, minimal surgical diff, targeted smoke regression, hotfix branch delivery, and a mandatory postmortem.

## When to reach for it

You invoke this by typing `/eng-hotfix-emergency-lifecycle`, and the agent won't reach for it on its own.

Type /eng-hotfix-emergency-lifecycle during live incident response when production is broken and speed matters with safety rails.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Root cause was locked with reproducible evidence before any fix.
- The minimal diff passed smoke tests and shipped on a hotfix branch.
- The postmortem document was completed after stabilization.

## Where it fits

Standalone emergency pipeline, deliberately bypassing full SDD ceremony.