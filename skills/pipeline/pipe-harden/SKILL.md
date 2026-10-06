---
name: pipe-harden
description: "Harden an existing project end to end: audit for issues, fix them, run the full test suite, re-fix until green, then ship through branch -> PR -> CI -> review -> merge. Gated stages, bounded fix loops, resumable runs."
disable-model-invocation: true
---

# Harden

`/pipe-harden <project-dir>` takes an existing project through audit, fix, test, re-fix until green, then ships the result through the full GitHub flow. One stage at a time, gated, resumable. This is the fix loop; for building new features use `pipe-ship`.

Stages: audit -> fix -> test -> re-fix loop -> green gate -> ship (branch -> PR -> CI -> review -> merge).

## Run directory

Everything for one run lives under `hardening/<run-id>/`, created relative to the directory where you invoke the skill (normally the project root, which may differ from `<project-dir>` when hardening another checkout):

- `audit-report.md` - findings with severity and evidence paths (stage 1 output)
- `fix-plan.md` - what gets fixed, in what order (stage 2 input)
- `test-log.md` - every test run: command, result, failures (stages 3-4 output)
- `RUN.md` - the pipeline log: stage, status, dates, verdicts, commits, SHAs

Run `scripts/scaffold-run.sh <run-id>` to create it at stage 0. If resuming, read `RUN.md` and continue from the first incomplete stage.

## Stage 1 - Audit

Run the audit that fits the project:

- Security-sensitive or mission-critical: `eng-adversarial-audit`.
- Otherwise: `eng-code-review` (general quality) or `eng-hardening-review` (failure-surface hardening).

Write every finding to `audit-report.md` with severity and an evidence path. No fixes yet.

- Gate: user confirms the fix scope. Record the decision in `RUN.md`.

## Stage 2 - Fix

Turn the confirmed findings into fixes with `eng-review-fix`: every fix lands with a regression test. Update `fix-plan.md` as you go.

- Gate: all in-scope findings have a fix or a documented reason for deferral.

## Stage 3 - Test

Run the project's full validation suite with `eng-validate` (linters, type checkers, unit and integration tests, build). Log every run to `test-log.md`: command, pass/fail, failing tests.

- Gate: suite is green. If red, go to stage 4.

## Stage 4 - Re-fix loop

For each failing test: diagnose the root cause, apply the minimal fix, re-run the suite. Bounded at 3 repair rounds per failure; hard stop with escalation: if a failure survives 3 rounds, stop and escalate to the user with the evidence (failing test, attempted fixes, logs) instead of churning.

- Gate: suite is green, or the user accepts the remaining risk in writing.

## Stage 5 - Ship

Ship the hardened tree through branch -> PR -> CI -> review -> merge. Each step is gated; do not skip ahead.

1. **Branch**: create `<type>/<slug>` from the latest `main`. Verify the working tree is clean first.
2. **Push**: `git push` with the user's auth, or the Git Data API (blobs -> tree -> commit -> ref) when pushing without a local credential. Verify the remote tree SHA matches the local tree SHA before opening the PR.
3. **PR**: open against `main` with a summary, the verification evidence (test results, audit report reference), and the change list.
4. **CI**: wait for the checks on the branch head to complete. Required: all green. If red, fix on the branch and re-run; do not merge over red CI.
5. **Review**: confirm the branch contains exactly the intended commits, the tree matches, and CI is green on the head SHA.
6. **Merge**: squash-merge (default), then sync the local `main` to the remote and delete the branch. Record the merge commit SHA in `RUN.md`.

Push and merge each need the user's explicit authorization per run; a yes to opening the PR is not a yes to merging it.

## Checkable Completion Criteria

- [ ] `audit-report.md` lists every finding with severity and evidence; fix scope confirmed by the user.
- [ ] Every in-scope finding has a fix with a regression test, or a documented deferral.
- [ ] Full suite is green; `test-log.md` shows the final passing run.
- [ ] No failure survived more than 3 repair rounds per failure without user escalation.
- [ ] Branch -> PR -> CI -> review -> merge completed in order; merge commit SHA recorded in `RUN.md`.
- [ ] Local `main` synced to remote; working tree clean.
