## What it does

Performs a deep hardening audit on two axes: data integrity (real data sources, schema consistency across layers, migration compatibility) and error-handling completeness across six failure surfaces (API, file, database, network, configuration, input).

## When to reach for it

Type `/eng-hardening-review`, or the agent reaches for it automatically when a task fits.

Type /eng-hardening-review before release candidates, after wiring new data flows, or whenever mock-to-real replacement needs verification.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Every runtime data reference resolves to a verified real origin.
- The error handling matrix has a per-surface verdict with no silent catches.
- Findings include severity, location, and concrete fix directions.

## Where it fits

Deep companion to eng-multidimensional-audit; feeds findings into eng-review-fix.