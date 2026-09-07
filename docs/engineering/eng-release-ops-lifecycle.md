## What it does

Automates release windows end to end: pre-flight inventory, human window approval, zero-downtime container updates with health probes, optional server hardening, rollback plan generation, and an operations report.

## When to reach for it

You invoke this by typing `/eng-release-ops-lifecycle`, and the agent won't reach for it on its own.

Type /eng-release-ops-lifecycle when executing a release window or routine production maintenance across containers and servers.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The change set with old vs new digests was approved before deployment.
- Every recreated container passed its health probe.
- An executable rollback plan and operations report were produced.

## Where it fits

Standalone operations pipeline composing eng-docker-update and eng-linux-security.