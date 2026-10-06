## What it does

Chains code review and remediation into a single automatic loop: each pass reviews changes across six dimensions, triages findings by severity, applies surgical fixes, and re-validates; the full cycle repeats across 3 to 5 convergence passes before a consolidated resolution report is archived.

## When to reach for it

Type /eng-review-and-fix before committing or opening a PR, or whenever review findings need to be resolved end to end without manually alternating between eng-code-review and eng-review-fix.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- At least three passes ran even when earlier passes came back clean.
- The loop stops only on a clean pass, a documented escalation at the 5-pass cap, or explicitly deferred human decisions.
- Every finding ends as Resolved, Deferred, or Not Reproducible with evidence.
- The consolidated report records the full iteration history and final verdict.

## Where it fits

Quality gate between implementation and git delivery inside the enterprise lifecycle.