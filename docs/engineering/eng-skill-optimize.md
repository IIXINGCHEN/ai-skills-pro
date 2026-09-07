## What it does

Takes one named skill of this catalog and runs a six-axis diagnosis (trigger quality, context budget, contract consistency, body quality, governance freshness, enterprise fit), writes a risk-ranked remediation plan, applies the minimal fixes, and drives all four quality gates green with the changeset and execution record.

## When to reach for it

You invoke this by typing `/eng-skill-optimize`, and the agent won't reach for it on its own.

Reach for it when an existing skill ships drift: a description that no longer routes cleanly, a docs page out of sync with its contract, an overdue review, a body that outgrew its context budget. When the skill does not exist yet, use `/eng-skill-create`; when the target is project code rather than a skill package, use `eng-review-fix`.

## Common questions

**How is this different from `eng-review-fix`?**
Different target and axes. `eng-review-fix` reviews project code changes on correctness, security, performance, and reliability; this skill diagnoses a catalog skill package on trigger, budget, contract, and governance axes, using the library's own gates and evals as instruments.

**Will it delete or restructure skills?**
Never on its own. Deletion recommendations stop with a pointer to the removal checklist, invocation-mode flips need your recorded confirmation, and re-purposing halts in favor of create-plus-remove. Catalog shape stays a human decision.

**What if the optimization reveals a defect class nobody has shipped before?**
The closeout stage records it in `failures/failure-cases.md` together with the new regression guard, so the class stays dead after this run.

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Every axis is reported, clean or with evidence; nothing silently disappears.
- The plan is risk-ranked, persisted, and its out-of-scope findings are handed off, not dropped.
- All four gates are green within the repair cap, and description changes carry their eval changes.
- The execution record's values are copied from the generated manifest.

## Where it fits

Catalog meta-skill of the engineering family (ADR 0007): the maintenance twin of `eng-skill-create`, using the library's gates as its diagnostic instruments while staying off project-code territory.
