---
name: eng-review-fix
description: Turn review or audit findings into verified fixes through a seven-dimension pass (code scan, architecture, security, performance, reliability, remediation plan, validation); every fix lands with a regression test and suite-green proof. Use for hardening a change before delivery.
---

# Enterprise Engineering Review & Fix

Not a single-pass review remediation: a seven-stage enterprise review pipeline that scans, audits, plans, fixes, and proves the result. Stages 1 to 5 diagnose; stage 6 converts findings into a remediation plan; stage 7 executes and validates. Existing skills provide the depth at each stage; this skill orchestrates them.

## 7-Stage Pipeline

```
Stage 1  Code Scan            findings triage from eng-code-review reports
Stage 2  Architecture         eng-analyze-codebase: topology, coupling, patterns
Stage 3  Security             eng-adversarial-audit: attack surface, boundary conditions
Stage 4  Performance          hot paths, N+1 queries, memory churn, unbounded work
Stage 5  Reliability          eng-hardening-review: failure surfaces, data integrity
Stage 6  Remediation Plan     findings -> risk-ranked fix plan (minimal diffs first)
Stage 7  Validation Report    fixes + eng-validate + evidence report + execution record
```

---

## Execution Protocol

### Stage 1: Code Scan
1. Ingest the review report or issue list (e.g. `specs/<feature>/reports/review-<pass>.md`); if none exists, **Call the Skill tool with "eng-code-review"** to produce one.
2. Triage every finding: `Critical` (correctness, security, data loss) $\rightarrow$ `Warning` (degraded behavior, contract risk) $\rightarrow$ `Suggestion` (quality, hygiene).

### Stage 2: Architecture Analysis
**Call the Skill tool with "eng-analyze-codebase"** for the modules the findings touch: coupling, dependency direction, pattern conformance. Cross-reference: does a Critical sit on a seam that makes the obvious fix the wrong fix? Architecture findings enter the plan as constraints, not as extra refactors.

### Stage 3: Security Audit
**Call the Skill tool with "eng-adversarial-audit"** on the changed surface: attack paths, boundary conditions, trust crossings. Security findings are Critical by default and bypass the priority queue straight into stage 6.

### Stage 4: Performance Analysis
Inspect the diff for the standard set: hot-path regressions, N+1 and chatty I/O, unbounded queries or loops, redundant work, memory churn in long-lived processes. Measure before claiming: cite the profile, benchmark, or complexity argument in the finding.

### Stage 5: Reliability Check
**Call the Skill tool with "eng-hardening-review"**: failure surfaces, retry/idempotency, data integrity under partial failure, timeout and circuit-breaker posture. Missing-safety findings rank with Critical.

### Stage 6: Remediation Plan
Merge all findings into one risk-ranked plan at `specs/<feature>/reports/remediation-plan.md`:
- Ordering: security and correctness first, then reliability, then performance, then hygiene.
- Every fix entry: file, root cause, minimal change, regression test to add, risk of the change itself.
- Out-of-scope findings (architectural, cross-team) become a separate hand-off list with evidence; they are not silently dropped.

### Stage 7: Validation Report
1. Apply fixes in plan order; each fix lands with its regression test.
2. **Call the Skill tool with "eng-validate"** after each batch; failures loop back to the fix that caused them (cap: 3 repair rounds, then halt with evidence).
3. Produce `specs/<feature>/reports/validation-report.md`: findings matrix vs final states (Resolved, Deferred, Not Reproducible), fixes applied, validation runs, remaining hand-offs.
4. Append the execution record per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report) next to the validation report.

---

## Checkable Completion Criteria

- [ ] All seven stages executed; none skipped silently (a stage with no findings reports "clean", it does not disappear).
- [ ] Security findings entered the plan as Critical; architecture findings entered as constraints.
- [ ] Remediation plan is risk-ranked and persisted at `specs/<feature>/reports/remediation-plan.md` with a hand-off list for out-of-scope findings.
- [ ] Every applied fix carries its regression test; `eng-validate` green within the 3-repair-round cap.
- [ ] Validation report persisted with the findings matrix and final states.
- [ ] Execution record appended per the template, values copied from generated manifests.
