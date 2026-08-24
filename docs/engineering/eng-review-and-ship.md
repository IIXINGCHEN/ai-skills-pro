# eng-review-and-ship

## What it does

Chains review, remediation, validation, completion verdict, atomic commits, and delivery-target resolution into one automatic loop that ends at a push authorized explicitly by the user to the repository resolved from git metadata.

## When to reach for it

Type `/eng-review-and-ship` when changes are functionally complete and need the full quality gauntlet plus delivery in one step: review findings fixed, tests proven green, commits made atomic, and the push aimed at the correct remote without manual command re-entry.

## Common questions

**How does it pick the right repository?**
It inventories `git remote -v` together with the branch upstream mapping. A single remote becomes the default target; several remotes produce a selection table answered inside the push authorization gate, so delivery never guesses.

**Can it push straight to main?**
Direct pushes to protected branches show a dedicated risk flag in the authorization card and require the same explicit confirmation as any other target. Force pushes to protected branches stay hard-blocked regardless of confirmations.

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The pipeline stops before any remote action whenever the verdict is BLOCKED.
- The review-fix-validate gauntlet ran at least three passes before the completion gate.
- Pushes happen only after an explicit PUSH reply on a stable, re-verified state.
- The consolidated report records findings, fixes, validation runs, verdict, commit hashes, and the delivery result.

## Where it fits

Delivery tail of the engineering family: it extends `eng-review-and-fix` past green validation into gated version-control delivery.
