## What it does

Takes an existing project through the full hardening loop: audit for issues, fix them with regression tests, run the whole suite, re-fix until green, then ship through branch -> PR -> CI -> review -> merge. Gated at every stage, resumable from `hardening/<run-id>/RUN.md`.

## When to reach for it

Type `/pipe-harden` when a project needs to be made shippable: after a security audit, before a release, or when inherited code needs to earn trust. It is the fix loop; for building new features use `pipe-ship`.

## Common questions

**How is this different from pipe-ship?**
`pipe-ship` builds a new feature (grill -> spec -> tickets -> implement -> review -> deepen -> deliver -> deploy). `pipe-harden` fixes an existing tree (audit -> fix -> test -> re-fix -> green -> branch -> PR -> CI -> review -> merge). They compose: harden first, then ship features on the clean tree.

**What if tests never go green?**
The re-fix loop is bounded at 3 rounds per failure. After that it stops and escalates to the user with evidence instead of churning.

**Does the ship stage need my GitHub auth?**
Push and merge each need explicit authorization per run. Push uses your git auth or the Git Data API; PR, CI checks, review, and merge go through the API.

## It's working if

- Every audit finding became a fix with a regression test or a documented deferral.
- The suite is green and `test-log.md` proves it.
- The merge commit SHA is recorded and local main matches remote.

## Where it fits

pipe-ship.md
pipe-review-diff.md
pipe-code-tdd.md
