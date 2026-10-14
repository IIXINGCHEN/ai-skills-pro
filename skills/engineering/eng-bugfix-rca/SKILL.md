---
name: eng-bugfix-rca
description: Investigate software bugs or GitHub issues and produce a structured Root Cause Analysis (RCA) document. Use when diagnosing defects, analyzing bug reports, and designing targeted bug fixes.
---

# Bugfix: Root Cause Analysis (RCA)

Investigate reported bugs, identify the root mechanism of failure, and formulate an evidence-backed remediation strategy.

## Process

### 1. Issue Triage & Reproduction
1. Ingest the issue description, error logs, and stack traces (from issue trackers or direct user input).
2. Trace the execution path that leads to the failure.
3. Establish a deterministic reproduction case (minimal test case or reproduction script).
   - **Non-deterministic bugs take the "raise-the-repro-rate" branch**: if the bug is flaky and cannot be reproduced reliably, do not force together a seemingly deterministic repro case (faked determinism is faked evidence). Switch to repro-rate-raising mode -- the goal is not a clean repro but lifting the repro rate to a debuggable level: looped triggering, parallel pressure, narrowed timing windows, injected delays. The completion bar is "a debuggable repro rate", not "reproduces every time".
   - **Loop-construction ladder** (lightest first, take the first one that works):
     1. Failing test: unit/integration/e2e, written on a seam that reaches the buggy code path.
     2. HTTP script: request script against the dev server, asserting on responses.
     3. CLI + fixture input: diff stdout against a known-good snapshot.
     4. Headless browser script: drive the UI, assert on DOM/console/network.
     5. Capture replay: persist real requests/payloads/event logs to disk, replay in isolation.
     6. Minimal harness: single service + mocked dependencies, trigger the bug path with one function call.
     7. Property/fuzz loop: when the bug shows as "occasional wrong output", run large volumes of random inputs to find failure patterns.
     8. Version bisection: when the bug appeared between two known states (commit/dataset/version), automate "switch to state X -> check -> repeat".
     9. Old-vs-new differential: run the same input against old and new versions (or two configs), diff the outputs.
     10. HITL fallback: when a human must click manually, drive the human with a structured script and feed captured output back to the agent.
   - **Stop if no loop can be built**: when all of the above are exhausted and still no loop exists, stop explicitly: list every approach tried and ask the user for three things -- access to a reproducible environment, redacted artifacts (log dumps/captures/timestamped screen recordings), and permission for temporary production instrumentation. Without a loop, do not enter the hypothesis phase; unevidenced speculation stops here.
4. **Test-First Evidence Chain**: Convert the repro into an executable failing test BEFORE any fix exists. Capture the red run output as evidence; the fix phase (later, via `eng-bugfix-implement`) is only legitimate when it turns this exact test green without weakening assertions. Archive the red run output inside the RCA document as proof the defect existed. The green run output is recorded by `eng-bugfix-implement` after the fix, completing the before/after pair.

### 2. Codebase Investigation
1. Search for affected functions, components, or API boundaries using code search tools.
2. Review recent git commit history on affected paths (`git log -n 10 -- <path>`) to see if recent changes introduced regressions.
3. Formulate and test hypotheses regarding the bug's root mechanism.
4. **Ablation of Competing Hypotheses**: When more than one root cause is plausible, eliminate them one at a time, one variable per run (disable, stub, or revert exactly one thing and re-run the repro). Record in the RCA which evidence killed each rejected hypothesis; a surviving hypothesis is the one no ablation could spare.

### 3. Formulate Remediation Plan
1. Detail the precise technical root cause (why it failed).
2. Design a minimal, clean fix with zero unintended side effects.
3. Plan regression tests to permanently prevent recurrence.
---
## Output RCA Template

Save to `specs/<bug-id>/rca.md` (the defect lifecycle and eng-bugfix-implement read it from there):

```markdown
# Root Cause Analysis: <Bug Title / Issue #ID>

## 1. Problem Description
- **Symptoms**: <What failed, error messages, broken behavior>
- **Reproduction**: <Exact steps or test case to reproduce>

## 2. Root Cause Analysis
- **Failing Component**: `path/to/file.ext:line`
- **Mechanism**: <Detailed explanation of the logical or environmental failure>
- **Contributing Factors**: <Concurrency, unhandled nulls, type mismatches, etc.>
- **Hypothesis Ablation Ledger**: <Each rejected hypothesis, the single-variable run that tested it, and the evidence that killed it; the surviving root cause is the one no ablation could spare>

### Evidence Archive
- **Red run output (pre-fix)**: <pasted verbatim; command and exit status>
- **Green run output (post-fix)**: <pasted verbatim; same test, unweakened assertions>

## 3. Proposed Fix Strategy
- **Target Files**:
  - `path/to/file.ext`: <Specific modification needed>
- **Regression Test Plan**:
  - `tests/path/to/test_issue.ext`: <New test to verify the fix>
  - **Seam check**: regression tests must be written on the seam at the call site that reproduces the real bug pattern (the test drives how the bug triggers in the real call chain, not a shallow unit it happens to pass through). If no such correct seam exists -- that is itself an architecture finding: record it in the RCA report (the architecture prevents the bug from being pinned by a test); never swallow it silently, and never manufacture false "covered" confidence with a shallow test.

## 4. Verification Command
- `<executable test command>`
```
---

## Checkable Completion Criteria

- [ ] A deterministic reproduction case exists and was captured failing BEFORE any fix (flaky bug: a pinned, debuggable reproduction rate instead, per the rate-raising branch above).
- [ ] The loop is honed "tight": faster -- second-scale runs, cached setup, skipped irrelevant init, narrowed test scope; sharper -- asserts the user's exact symptom (not just "didn't crash"); steadier -- pinned time/random seeds, isolated filesystem, frozen network, the same command yields the same verdict every run.
- [ ] Root cause identified with exact `file:line` location and failure mechanism explanation.
- [ ] RCA document saved with fix strategy, target files, and regression test plan.
- [ ] Verification command is executable and currently red on the unfixed code
- [ ] Red run output archived in the RCA document as proof the defect existed (the green run is recorded later by `eng-bugfix-implement`).
- [ ] Competing root-cause hypotheses eliminated by ablation, one variable per run, with the killing evidence recorded.
