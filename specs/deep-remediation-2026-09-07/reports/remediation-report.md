# Deep Remediation Report: deferred-item closure + two new defect classes

Date: 2026-09-07. Trigger: user mandate for comprehensive deep remediation. Scope: every deferred item from the multidimensional audit and the eng-review-and-fix convergence loop, plus a byte-level sweep that found classes no character-level review could see.

## New defect classes found and eliminated

### 1. Control-character corruption (7 lines, 5 files)

Byte-level scan found U+0008/U+000B/U+001B controls embedded mid-word in docs pages ("precedes \x0Balidate" displaying as "precedes alidate"). Invisible in every editor and review pass; the encoding gate checked only empty files and BOM. All repaired with intended names: eng-validate (x3), eng-bugfix-implement, eng-execute (x2), eng-bugfix-rca. Marker + ablation controls now in guard-checks/ablation tests; full-repo scan confirms zero remaining.

### 2. Graft to-variant (2 lines)

The graft marker's stranded-clause verb list missed "to"; two invocation sentences shipped colliding with leftover "to implement/remediate" clauses. Pages rewritten, marker extended, ablation control added. Notably the new marker immediately fired on its own pattern quoted in two report files, proving it live.

## Deferred items closed

| Item (source) | Resolution |
|---|---|
| HAND-2 graft variants in eng-execute/eng-bugfix-implement docs (audit) | Resolved above |
| REDIRECT_RE prose absorption (audit HAND-1, review W-handoff) | Resolved: slash required; enterprise redirects now only eng-git-pr; manifests regenerated, graph valid |
| Stack-frame-free gate exits (audit hand-off) | Resolved: all four CLI entries trap load errors, single named line, zero frames; ablated per entry |
| readJson contract stability | Resolved: 5-test suite pinning happy/corrupt/missing/empty/string-label behavior |

## Verification

- validate: 42 skills, 0 errors, 0 warnings
- tests: 59/59 (54 -> 59: 4 ablation controls + 5 read-json tests)
- eval: train 34/34, holdout 17/17, blind 11/11, output 20/20, all 100%
- release-check: 0 errors, 2 pre-existing warnings
- Ablations: control-char (VT/BS fire, tab/newline legal), to-variant fires, corrupt-file probes zero frames on all four gates, REDIRECT_RE verified through regeneration diff

## Failure-ledger additions

control-character-corruption, graft-to-variant; both with markers and ablation controls per the one-class-one-marker rule.
