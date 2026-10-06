## What it does

Performs a one-shot read-only codebase health inspection combining context priming, topology analysis, 3D multi-dimensional audit, optional adversarial security scan, and baseline validation into a single consolidated report.

## When to reach for it

Type /eng-onboarding-audit-lifecycle when taking over an unfamiliar repository or running periodic architecture health checks.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The consolidated health report exists at .agents/audit-reports/.
- Every finding references concrete file paths and line evidence.
- Zero source modifications were made during the audit.

## Where it fits

Standalone read-only pipeline for onboarding and periodic audits.