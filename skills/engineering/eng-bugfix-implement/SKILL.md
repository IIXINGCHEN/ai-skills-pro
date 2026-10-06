---
name: eng-bugfix-implement
description: Implement the surgical patch and regression test laid out in an existing RCA report (the rca.md produced by eng-bugfix-rca). Use only when that report already exists; never as the starting point for a bug.
---

# Bugfix Implement

Apply a verified bug fix guided by a Root Cause Analysis (RCA) document.

## Process

### 1. Ingest RCA
1. Read the RCA document at `specs/<bug-id>/rca.md` (or a provided RCA summary).
2. Confirm the root cause, target files, and proposed fix strategy.

### 2. Confirm Failing State (Red Phase)
1. Write or run the reproduction test to observe the expected failure before applying fixes.

### 3. Apply Surgical Fix (Green Phase)
1. Modify the target files with minimal necessary diff.
2. Adhere strictly to existing coding styles and patterns.

### 4. Regression & Verification Gate
1. Confirm the regression test sits on a correct seam: it must exercise the real bug pattern as it occurs at the call site, not a shallow proxy. If the RCA flagged "no correct seam" as an architecture finding, do not silently add a shallow test for false confidence - surface the finding in the delivery report instead.
2. Run the new regression test to confirm the fix works.
3. Run the full project test suite to verify zero side-effect regressions.
---
## Completion Checklist

- [ ] Reproduction test passes green.
- [ ] No regression across entire test suite.
- [ ] Code changes are minimal, focused, and clean.

---

## Checkable Completion Criteria

- [ ] RCA document ingested; fix maps directly to its documented root cause.
- [ ] The red reproduction test turns green without weakening any assertion.
- [ ] Green run output appended to the RCA document, completing the red/green before/after pair.
- [ ] Full regression suite passes after the fix lands.
