## What it does

Chains review, remediation, and validation into one automatic convergence loop governed by `templates/convergence-gauntlet.md`: convergence passes (floor of 3 for code changes, 2 for prose-only; cap of 5) where each pass reviews the change surface, applies minimal fixes, and re-validates, ending at a consolidated report. It stops there: no commits, no push.

## When to reach for it

You invoke this by typing `/eng-review-and-fix`, and the agent won't reach for it on its own.

Type `/eng-review-and-fix` when existing changes need review and repair to green in one run, but delivery is not part of this run: no commit or push is wanted yet, or the team fixes first and ships in a separate step. When the change must end at an authorized push in the same run, use `/eng-review-and-ship` instead; when you want a risk-ranked remediation plan without fixes applied, use `/eng-review-fix`.

## Common questions

**How is this different from `/eng-review-and-ship`?**
Same review-fix-validate gauntlet, different stopping point. This skill ends at the consolidated report with a green tree; the ship lifecycle continues into completion verdict, atomic commits, and gated push. Overlap is intentional and bounded: the shared gauntlet is composed from the same leaf skills and governed by `templates/convergence-gauntlet.md` (ADR 0008).

**How many passes does it run?**
Passes run to the risk-tiered floor (ADR 0009): 3 passes for code changes (fixes made in pass 1 deserve a fresh review in pass 2; convergence requires a clean pass at or after pass 3); 2 passes for prose-only changes. The hard cap at pass 5 halts with evidence instead of looping forever.

**What happens to findings it cannot resolve?**
Each finding ends in exactly one state: Resolved, Deferred (human decision required), or Not Reproducible (with evidence). Deferred items are listed in the report for the human.

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The review-fix-validate gauntlet ran through its risk-tiered floor before the consolidated report.
- No commit or remote action happened during the run.
- Every finding ended Resolved, Deferred with rationale, or disproven with evidence.
- The consolidated report is saved under `specs/<feature>/reports/` with a final verdict.

## Where it fits

Mid-weight loop of the engineering family: it shares the convergence gauntlet with `eng-review-and-ship` but stops before verdict, commits, and delivery.
