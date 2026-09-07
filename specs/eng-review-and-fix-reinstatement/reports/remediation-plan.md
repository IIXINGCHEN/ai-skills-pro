# Remediation Plan: eng-review-and-fix reinstatement review

Feature: `eng-review-and-fix-reinstatement`
Sources: review-pass1.md (Stage 1), architecture analysis (Stage 2), adversarial audit (Stage 3), performance check (Stage 4, clean), hardening review (Stage 5).

## Fix queue (risk-ranked, minimal diffs first)

### FIX-1 [Critical / Blocker] Generator drops Skill Tool edges on call+redirect name collision
- **File**: `scripts/generate-manifests.mjs:207`
- **Root cause**: `required: [...deps].filter(d => !redirects.has(d))` encodes an unstated invariant (a skill never both calls and redirects to the same name). The restored skill's ADR 0006 boundary sentence violates it, and the filter silently deletes a real Skill Tool edge from the dependency graph. Adversarial escalation: any future skill whose body both calls and mentions `run /X` hides its edge from `validateGraph`, including contract-violating calls into user-invoked skills (bypass demonstrated in Stage 3).
- **Minimal change**: Make CALL_RE the sole authority for `required`; REDIRECT_RE entries become informational and are suppressed only when they duplicate a call edge, never the reverse:
  `required: [...deps].sort(), redirects: [...redirects].filter(r => !deps.has(r)).sort()`
- **Regression test**: new assertion in `tests/skills.test.mjs`: for every skill, the set of `Call the Skill tool with "X"` names in SKILL.md equals `manifest.required` exactly (double-entry: recomputed in the test, independent of the generator's own state). This kills the silent-drop class: any future filter bug fails loudly.
- **Risk of change**: low. Only the restored skill's manifest changes (gains `eng-review-fix` in required, loses it from redirects); `eng-review-and-ship` and others unchanged (verified: their call/redirect sets are disjoint).

### FIX-2 [Warning] Router docs page stale: restored skill absent, plus a pre-existing graft fragment
- **File**: `docs/engineering/eng-router.md`
- **Root cause**: SKILL.md routing table was updated but the companion docs page was not (CLAUDE.md requires re-sync on routing changes). The page also carries a pre-existing graft fragment on line 7 (stranded `automatically when determining multi-stage development workflows`).
- **Minimal change**: rewrite the page with the routing rows including the review-family boundary (`/eng-review-and-fix` no-delivery vs `/eng-review-and-ship` delivery), removing the fragment. Keep the four-section frame.
- **Regression test**: existing upstream-conventions test already checks frame and invocation mode; the fix restores prose quality. The fragment's phrasing evades current scanner markers; per failure-ledger rule, note the new phrasing class in the failure ledger only if it recurs (it is a variant of the recorded graft class, same root: batch-edited standardized sentences).
- **Risk of change**: none (docs only).

### FIX-3 [Suggestion] Boundary paragraph should cite ADR 0006
- **File**: `skills/engineering/eng-review-and-fix/SKILL.md:11`
- **Minimal change**: append `(ADR 0006)` after the boundary sentence pointing at `docs/adr/0006-reinstate-eng-review-and-fix.md`.
- **Risk of change**: none (provenance link; manifest hash changes, regenerate after).

### FIX-4 [Suggestion] Orchestrator detection is a hand-maintained enum
- **File**: `tests/execution-trace.test.mjs:21-24`
- **Root cause**: the enum already missed `eng-review-and-ship` once; the next non-`-lifecycle` orchestrator will be missed again.
- **Minimal change**: derive structurally from the registry: an orchestrator is any user-invoked skill with >= 2 `dependencies.required` entries (or `-lifecycle` suffix); keep the >= 10 count assertion as tripwire.
- **Risk of change**: low; structural set equals today's enum (verified 11 members include the 4 named ones).

## Explicitly deferred (out of scope, hand-off list)

- HAND-1: `eng-enterprise-lifecycle` line 91 prose `run \`eng-multidimensional-audit\`` is absorbed as a redirect without being a real human redirect (REDIRECT_RE matches slash-less prose). With FIX-1 the semantics become harmless (redirects informational), but tightening REDIRECT_RE to require the slash would change the enterprise manifest; separate change with its own eval run. Evidence: registry `eng-enterprise-lifecycle.redirects` contains `eng-multidimensional-audit`.
- HAND-2: `docs/engineering/eng-execute.md:7` and `eng-bugfix-implement.md:7` carry milder variants of the standardized-sentence collision (an invocation sentence ending mid-air into a leftover "to implement tasks" clause). Same class as FIX-2's fragment, pre-existing, outside this change surface. [Resolved in the later deep-fix sweep: both pages rewritten, to-variant marker added.]

## Ordering

FIX-1 first (correctness of the governance graph), then FIX-2, FIX-3 (docs/prose), then FIX-4 (test hardening). After all fixes: `npm run generate:manifests`, then `eng-validate` (validate + tests + eval + release-check), then validation report + execution record.
