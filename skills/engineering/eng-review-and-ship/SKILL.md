---
name: eng-review-and-ship
description: Run the end-to-end review, remediation, verification, and authorized delivery lifecycle.
disable-model-invocation: true
---
# Review & Ship Lifecycle

Composes `eng-code-review`, `eng-review-fix`, `eng-validate`, `eng-completion-gate`, and `eng-git-commit` into one continuous loop that ends at a verified, authorized push to the repository the working tree belongs to.

Design principles inherited from the lifecycle family:

- **Verdict before push**: the completion gate runs before any remote action, so an unverified state is structurally impossible to deliver.
- **Push requires explicit authorization**: the default outcome is a readiness report; delivery happens solely on user instruction.
- **Target resolution by inspection**: the destination remote and branch come from git metadata, never from assumption; multiple remotes always ask.
- **Convergence by repetition**: the quality gauntlet runs through convergence passes governed by `templates/convergence-gauntlet.md` (pass floor risk-tiered by ADR 0009: 3 passes for code changes, 2 for prose-only; cap of 5). A single green pass never ships on its own. Canonical gauntlet mechanics are defined in `templates/convergence-gauntlet.md` (ADR 0008).

## 8-Stage Pipeline State Machine

```
Convergence Pass p (governed by templates/convergence-gauntlet.md):
  eng-code-review (scope auto-detection, standard/strict profile)
           │
           ▼
[Gate: open Critical/Warning findings? yes -> Stage 2 in this pass]
           │
           ▼
Stage 2: eng-review-fix (triage Critical -> Warning)
           │
           ▼
Stage 3: eng-validate ──► failures return to Stage 2 (per-pass repair cap: 3)
           │
           ▼
[Convergence Gate: p >= floor and pass clean -> Stage 4;
 p < floor -> next pass; p = 5 with open findings -> halt and escalate]
           │
           ▼
Stage 4: Resolution re-review (union of findings from all passes)
           │
           ▼
Stage 5: eng-completion-gate (DONE / DONE-WITH-ACCEPTED-RISKS / BLOCKED)
           │        (BLOCKED halts here; nothing remote has happened)
           ▼
Stage 6: Commit preparation and user-run PR delivery handoff
           │
           ▼
Stage 7: Delivery Target Resolution + readiness report
           │        ───► [Gate: Explicit Push Authorization]
           ▼
Stage 8: Authorized push or PR + consolidated report archive
```

---

## Autonomous Execution Protocol

### Stages 1-4: Convergence Gauntlet

Each pass runs the full review-fix-validate sequence on the current change surface. Passes run until the risk-tiered floor is reached (3 for code changes, 2 for prose-only); the loop converges only on a clean pass at or after the floor and hard-caps at pass 5.

1. **Call the Skill tool with "eng-code-review"** with scope auto-detection: uncommitted changes use `diff` scope, staged-only changes use `staged` scope, full audits use `repo` scope. Profile defaults to `standard`; escalate to `strict` for security-sensitive or pre-release surfaces. Archive one report per pass under `specs/<feature>/reports/review-<pass>.md`.
2. **Triage gate**: any Critical or Warning finding proceeds to Stage 2 automatically within the pass. A clean pass at p >= floor converges; a clean pass at p < floor starts the next pass, because prior fixes deserve fresh review.
3. **Call the Skill tool with "eng-review-fix"**: minimal convention-following fixes, each backed by a regression test where feasible.
4. **Call the Skill tool with "eng-validate"** after each remediation batch; per-pass repair cap at 3 rounds, then halt the pipeline and hand unresolved items back with evidence.
5. **Re-review the union of findings from all passes**: every finding ends in exactly one state: `Resolved`, `Deferred (human decision required)`, or `Not Reproducible (with evidence)`. Open findings at the 5-pass cap halt delivery before Stage 5.

### Stage 5: Completion Verdict

**Call the Skill tool with "eng-completion-gate"** against the checkable criteria of this skill. A BLOCKED verdict halts the pipeline before Stage 6; no commit or remote action occurs.

### Stage 6: Atomic Commit

**Call the Skill tool with "eng-git-commit"**: staging purity checklist, conventional message format, hook respect. Record every commit hash; hashes become delivery evidence in the final report.

### Stage 7: Delivery Target Resolution

Resolve which repository this tree ships to using tool inspection, never assumption:

1. Inventory the facts: `git remote -v`, `git branch --show-current`, and `git rev-parse --abbrev-ref --symbolic-full-name @{u}` for the upstream mapping.
2. Single remote: it becomes the default target; propose `-u <remote> <branch>` when the branch lacks an upstream.
3. Multiple remotes: present a target table (name, push URL, current tracking) and let the user choose inside the authorization gate. Cross-remote guessing stays outside the contract.
4. Divergence check: compare ahead/behind counts against the upstream. A non-fast-forward target raises a risk flag in the card instead of planning a silent overwrite.

Produce the readiness report and raise the authorization card:

```markdown
## Push Authorization Requested
- Repository: `<remote>` (<push URL>)
- Branch: `<local branch>` -> `<upstream>`
- Commits: N (<hash range>)
- Evidence: verdict <state>, validation green (runs: N), findings closed
- Risk flags: <protected branch / diverged history / none>

Reply PUSH to deliver, PR to open a pull request instead, or HOLD to stop here.
```

### Stage 8: Authorized Delivery & Archive

1. Re-verify state stability: same HEAD, clean status output, unchanged remote table. Any deviation voids the authorization and returns to Stage 7.
2. On PUSH: run exactly the confirmed command sequence. On PR: **tell the user to run `/eng-git-pr`** for repositories whose contribution model routes through pull requests.
3. Hard blocks standing regardless of authorization: force push to `main`, `master`, `release`, or protected branches, and any push while the verdict is BLOCKED or missing (aligned with `eng-destructive-safety-gate`).
4. Archive the consolidated report at `specs/<feature>/reports/ship-<timestamp>.md`: findings matrix vs final states, fixes applied, validation history, verdict, commit hashes, and the delivery result (`PUSHED` / `PR OPENED` / `HELD`).

---

## State Persistence & Resumption

Record pipeline progress in `.scratch/<pipeline>-state.json`:

```
{
  "feature": "<review-scope>",
  "pipelineType": "review-and-ship",
  "currentStage": 7,
  "stageName": "delivery-target-resolution",
  "pass": 3,
  "floor": 3,
  "maxPasses": 5,
  "completedStages": [
    "eng-code-review",
    "eng-review-fix",
    "eng-validate",
    "eng-completion-gate",
    "eng-git-commit"
  ],
  "deliveryTarget": { "remote": "origin", "branch": "<branch>", "authorized": false },
  "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
}
```

An interrupted run resumes from the last incomplete stage and the interrupted convergence pass. `pass` counts the active convergence pass against the floor (3 for code changes, 2 for prose-only; see `templates/convergence-gauntlet.md`) and the cap of 5 allowed passes. An `"authorized": true` entry still requires the Stage 8 stability re-check before execution.

---

## Checkable Completion Criteria

- [ ] Review reports archived under `specs/<feature>/reports/review-<pass>.md` for every pass.
- [ ] Every finding across all passes Resolved, Deferred with rationale, or disproven with evidence.
- [ ] Convergence passes completed to the risk-tiered floor (3 for code changes, 2 for prose-only per ADR 0009); the loop exited only on a clean pass or a documented escalation at the 5-pass cap.
- [ ] Validation suite green within the per-pass 3-repair-round cap.
- [ ] Completion verdict recorded before any remote action; BLOCKED never reached delivery.
- [ ] Atomic conventional commits created with hashes recorded.
- [ ] Delivery target resolved via tool inspection; multi-remote choice made by the user.
- [ ] Push commands executed verbatim after explicit authorization on a stable state.
- [ ] Consolidated report saved under `specs/<feature>/reports/` with the final delivery result.
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from the generated manifest.
