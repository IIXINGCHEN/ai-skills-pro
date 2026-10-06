---
name: pipe-ship
description: "Run the full engineering loop for one feature: grill the idea, freeze the spec, split tracer-bullet tickets, implement, review, deepen the architecture, then deliver and deploy to production. One stage at a time, gated, resumable."
disable-model-invocation: true
---

# Ship

`/pipe-ship <feature-slug>` takes one feature from raw idea to reviewed, merged code, then looks for architectural deepening. It does not replace the eight stage skills - it conducts them, in order, with a gate at every stage and a shared run directory.

Stages: `pipe-grill-plan` -> `pipe-to-spec` -> `pipe-to-tickets` -> `pipe-implement` -> `eng-code-review` -> `pipe-code-improve-architecture` -> `eng-review-and-ship` -> `eng-release-ops-lifecycle`.

## Run directory

Everything for one run lives under `specs/<feature-slug>/`:

- `spec.md` - the frozen spec (stage 2 output)
- `tickets/` - ticket files, one per ticket (stage 3 output)
- `reports/` - review reports (stages 5 and 7 output)
- `releases/` - production release reports, one `<release-id>.md` per deploy (stage 8 output)
- `RUN.md` - the pipeline log: stage, status, dates, verdicts, commits, digests

The stage skills must read from and write to these paths. Where a stage skill names a different default path, map it: `pipe-to-spec` publishes the spec to the tracker but the frozen copy always lands at `spec.md`; `pipe-to-tickets` in local-file mode writes to `tickets/` (not `.scratch/...`); `eng-code-review` already expects `specs/<feature>/` and `reports/`; `eng-release-ops-lifecycle` writes its ops report to `releases/<release-id>.md` (not `specs/<release-id>/`).

## Session and context discipline

The run directory is the source of truth; the context window is not. Follow this discipline so reasoning survives stage transitions:

- **Stages 1-3 in one unbroken context.** Grill, spec, and tickets build on the same thinking: the grilling reasoning is the next stage's primary source. Do not compact or clear between these stages. If context pressure builds before tickets are done, compact at a stage boundary only - never mid-stage - and only after the current stage's output is recorded in `RUN.md`.
- **Stage 4 starts fresh from the ticket.** Each `pipe-implement` invocation begins a clean session working from its ticket file, `spec.md`, and `RUN.md` - not from the stage 1-3 conversation. In frontier parallel mode, each ticket's subagent gets this same clean handoff; subagents coordinate through `RUN.md` and report pointers, never by sharing full context.
- **Stages 5-8 operate on artifacts.** Review, deepen, deliver, and deploy work from reports, diffs, and `RUN.md`. A continuing or fresh session both work, as long as every verdict, commit hash, and authorization lands in `RUN.md` before the stage closes.

Rule of thumb: context carries reasoning forward; `RUN.md` carries decisions across. If a stage's reasoning is not in `RUN.md`, the next stage cannot trust it.

## Stage 0 - Setup

1. Run `scripts/scaffold-run.sh <feature-slug>` to create the run directory.
2. Ask the user: tracker for spec/tickets - `local` (default, files under the run directory), `github`, or `linear`. Record the choice in `RUN.md`.
3. If resuming an existing run, read `RUN.md` and continue from the first incomplete stage.

## Stage 1 - Grill (`pipe-grill-plan`)

Call the Skill tool with `pipe-grill-plan`. Interview the user in rounds until the design tree's frontier is empty and the user confirms shared understanding.

- Gate: user confirms the shared understanding. Record the settled decisions in `RUN.md`.
- Skip allowed only if the user says the idea is already fully grilled; record the skip.

## Stage 2 - Spec (`pipe-to-spec`)

Call the Skill tool with `pipe-to-spec`. Input: the conversation plus the stage 1 decisions. Output: `spec.md` using the skill's spec template. Do the seam-sketch check with the user, then freeze.

- Gate: user approves `spec.md`. After approval the spec is frozen - later changes go back through stage 1 as amendments, not silent edits. Record the freeze in `RUN.md`.
- If the tracker is `github`/`linear`, publish the spec there too, but `spec.md` stays the source of truth for the rest of the run.

## Stage 3 - Tickets (`pipe-to-tickets`)

Call the Skill tool with `pipe-to-tickets`, pointing it at `spec.md`. Run the skill's quiz: present the breakdown, iterate until the user approves.

- Gate: user approves the ticket breakdown. Write tickets to the tracker (`tickets/` in local mode, numbered `01` up in dependency order, blockers first). Record the ticket list in `RUN.md`.

## Stage 4 - Implement (`pipe-implement`)

Call the Skill tool with `pipe-implement`. Work the frontier: start any ticket whose blockers are all done. Every ticket runs the implement loop below until green - no ticket moves on with open findings or red tests.

1. Implement - write the code, TDD at the agreed seams.
2. Test - typecheck, the ticket's own tests, and its acceptance criteria.
3. Audit - audit the change for security and hardening: `eng-adversarial-audit` for security-sensitive surfaces, otherwise `eng-hardening-review`. Security issues are fix-first, before anything else.
4. Review - review the diff with `pipe-review-diff`; treat every finding as a fix task, not a comment.
5. Fix - fix all audit and review findings.
6. Retest - rerun typecheck and the affected tests; rerun the full suite if the fix touched shared code.
7. Refix - any new failure or finding goes back to step 5.
8. Green - only when typecheck, ticket tests, and the full suite are all green does the ticket close. Then commit and move to the next ticket.

Cap fix-retest at 3 repair rounds per failure per ticket; hard stop with escalation: if the loop still is not green, stop and escalate to the user with the failing evidence instead of looping silently.

- Gate: every ticket closed green through the loop above. Record commit hashes in `RUN.md`.

## Stage 5 - Review (`eng-code-review`)

Call the Skill tool with `eng-code-review`, scope `diff`, spec reference `spec.md`. Save the report to `reports/review-<pass>.md`.

- If the verdict is `CHANGES REQUESTED`: call the Skill tool with `eng-review-fix`, then re-run the review as the skill's second independent review. Repeat until the verdict is `APPROVED` or `[ALL RESOLVED]`.
- Gate: `APPROVED` / `[ALL RESOLVED]`. Record the verdict in `RUN.md`.

## Stage 6 - Deepen (`pipe-code-improve-architecture`)

Call the Skill tool with `pipe-code-improve-architecture`, scoped to the files this run changed (they are the hot spot by construction). Present the HTML report, then ask the user to pick a candidate, park them all, or end the run.

- Picked a candidate: run the skill's grilling loop, then start a new `pipe-ship` run for the deepening (`<feature-slug>-deepen-<n>`), beginning at stage 1 with the grilling output as input.
- Parked: convert the candidate into a follow-up ticket in `tickets/` and end the run.
- Gate: the user makes one of the three choices above. Record it in `RUN.md`.

## Stage 7 - Deliver (`eng-review-and-ship`)

Call the Skill tool with `eng-review-and-ship`. It runs its own convergence gauntlet (review, fix, validate, 3 to 5 passes), a completion gate, atomic commits, then raises a push authorization card.

- Stage 5's APPROVED report counts as prior evidence but does not skip this gauntlet: the pre-push loop is the final fresh-eyes check.
- Gate 1: completion verdict is not BLOCKED.
- Gate 2: the user explicitly authorizes delivery (PUSH, PR, or HOLD). HOLD ends the run here; record it in `RUN.md`.
- The consolidated report lands in `reports/`. Record commit hashes and the delivery result (PUSHED / PR OPENED / HELD) in `RUN.md`.

## Stage 8 - Deploy (`eng-release-ops-lifecycle`)

Call the Skill tool with `eng-release-ops-lifecycle`. It inventories the target environment, then waits for release-window approval, recreates containers with zero downtime, verifies health, and generates an executable rollback plan.

- Gate: the user explicitly approves the release window and the digest change set. Nothing touches production before that.
- The ops report lands in `releases/<release-id>.md`. Record the release id, image digests, health results, and rollback plan path in `RUN.md`.
- Skip allowed when the team deploys by pulling the pushed branch on the server instead; record the skip and the expected pull target. A skipped stage 8 still leaves the run's code production-ready at the end of stage 7.

## Rules

- Never skip a gate silently. A skipped stage needs the user's explicit say-so and a line in `RUN.md`. Push (stage 7) and production deploy (stage 8) are never implicit: each needs fresh authorization inside that run.
- The run is resumable: `RUN.md` always shows the last completed stage. Re-invoking `/pipe-ship <feature-slug>` continues from there.
- One feature per run. A new idea means a new slug, not a scope edit to a frozen spec.
- Wide refactors keep the `pipe-to-tickets` expand-contract treatment; do not force them into tracer bullets.
