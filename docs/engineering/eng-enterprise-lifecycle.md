## What it does

Orchestrates the entire enterprise development lifecycle automatically across 13 stages and 3 human gates: briefing with fast-path classification, context priming, optional PRD, spec freezing, whitelist-scoped planning, bounded execution, validation-first quality gauntlet, first-pass multi-angle review, remediation loop, independent fix verification, completion verdict, authorization-gated push, and retrospective archival.

## When to reach for it

Type /eng-enterprise-lifecycle when starting any new feature, service, or major production capability that requires full-lifecycle rigor with minimal command friction. The fast-path rule adapts the chain for small tasks.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

**Why is validation before review?**
Automated gates (lint, types, tests, build) catch mechanical issues so human-style review focuses on design, security, and spec alignment instead of testable defects.

**Why is the completion verdict before push?**
A BLOCKED verdict after pushing would leave remote state unverified. The gate halts delivery while recovery is still free.

## It's working if

- The pipeline progresses automatically through the 13 stages.
- The agent pauses only at the three human gates (Brief, Plan plus whitelist, Push authorization).
- All artifacts (specs, plans, whitelists, test logs, audit reports, verdicts, retrospective) are saved to their designated paths.

## Where it fits

Primary end-to-end entry point for production software development.