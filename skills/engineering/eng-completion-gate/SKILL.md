---
name: eng-completion-gate
description: Produce an evidence-backed completion verdict. Use at the end of a workflow to distinguish DONE, accepted risks, and BLOCKED states.
---

# Completion Gate

The final arbiter before any work is declared complete. Every completion claim must survive an evidence audit: claims without verifiable artifacts are rejected, never accepted on assertion.

## Three-State Verdict Model

```
                 ┌──────────────────────────┐
                 │  Completion Gate Audit    │
                 └────────────┬─────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        ▼                     ▼                      ▼
   [DONE]            [DONE-WITH-ACCEPTED-     [BLOCKED]
   All criteria      RISKS]                   Criteria unmet and
   met with          Criteria met; residual   no accepted-risk
   evidence          items explicitly listed, rationale exists;
   artifacts         each risk accepted by    work must continue
                     the user                 or escalate
```
---
## Evidence Chain Requirements

A completion claim is valid only when every criterion maps to a real artifact:

| Claim Type | Required Evidence Artifact |
|---|---|
| Tests pass | Executable command output or CI run reference |
| Feature implemented | File paths with function/symbol names |
| Bug fixed | Repro case that now passes (before/after) |
| Docs updated | Document path containing the change |
| Performance improved | Measured before/after numbers with method |
| Security reviewed | Audit report or checklist with findings states |

**Hard rules:**
- Never cite a file path, test name, or metric that was not produced in this session or verified by tool inspection.
- Never convert a missing artifact into prose. A missing artifact means the criterion is unmet.

---

## Gate Procedure

1. **Collect Criteria**: Assemble the checkable completion criteria from the governing skill, plan, or spec.
2. **Audit Each Criterion**: For each item, locate the evidence artifact via tool inspection (read, grep, glob, or command output). Mark `VERIFIED` or `UNVERIFIED`.
3. **Classify Residuals**: Any known-but-unfixed item (edge case, tech debt, deferred warning) becomes an explicit risk entry with impact and likelihood.
4. **Emit Verdict**:
   - All criteria `VERIFIED` and zero unaccepted risks: **DONE**.
   - All criteria `VERIFIED` and every risk explicitly accepted by the user: **DONE-WITH-ACCEPTED-RISKS** (list the accepted risks in the report).
   - Any criterion `UNVERIFIED` or risk unaccepted: **BLOCKED** (state exactly which items block and what is needed to unblock).
5. **Archive**: Append the verdict block to the governing report or `.agents/lifecycle-state.json`.

## Verdict Report Template

```markdown
# Completion Gate Verdict: <task or feature>

## Criteria Audit
| # | Criterion | Evidence Artifact | Status |
|---|---|---|---|
| 1 | <criterion> | `<path>` | VERIFIED / UNVERIFIED |

## Residual Risks (if any)
| Risk | Impact | Likelihood | Accepted By |
|---|---|---|---|

## Verdict: [DONE | DONE-WITH-ACCEPTED-RISKS | BLOCKED]
```

---

## Checkable Completion Criteria

- [ ] Every completion criterion audited against a real artifact via tool inspection.
- [ ] Zero claims supported by prose alone.
- [ ] Residual risks enumerated and explicitly accepted or blocking.
- [ ] Three-state verdict recorded in the governing report or state file.