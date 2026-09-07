# Convergence Gauntlet (Single Source)

The canonical specification of the review-fix-validate convergence loop shared by the governed lifecycles (`eng-review-and-ship`, `eng-review-and-fix`, `eng-enterprise-lifecycle` Stages 8-9). Lifecycles keep a short summary plus a pointer here; this file is the authority for the numbers and the rules. Any change to the mechanics below requires an ADR.

## Loop Shape

One pass = `eng-code-review` (fresh scope detection, one archived report per pass) -> triage gate -> `eng-review-fix` (Critical first, then Warning) -> `eng-validate` (after each remediation batch).

## Rules

| Rule | Value | Meaning |
|---|---|---|
| Pass cap | 5 | At 5 passes with open findings, halt and escalate with evidence; never start pass 6. |
| Per-pass repair cap | 3 | `eng-validate` failures loop back to remediation at most 3 times per pass, then halt with evidence. |
| Convergence | clean pass at or after the floor | A pass with zero open Critical/Warning findings converges only when its number has reached the floor. |
| Floor (code-bearing changes) | 3 | Any pass that adds or modifies code, or is not provably prose-only. The default; assume it when unsure. |
| Floor (prose-only changes) | 2 | Every pass touched only documentation, prompts, or other non-executing text. Justification is recorded per pass; a single code-bearing pass raises the whole run back to 3. |
| Triage gate | any Critical/Warning finding | Proceeds to remediation within the current pass automatically; Suggestions are applied only at zero behavioral risk. |
| Re-review scope | union of findings from all passes | The closing review checks the accumulated fix diff and the union, never just the last pass. |

## Why a floor at all

Later passes exist to catch regressions introduced by earlier fixes, not to re-doubt a clean result: a clean early pass below the floor still starts the next pass. The floor is a stability proof, so it scales with what the fixes could have broken: prose edits cannot break code, hence the lower prose-only floor.

## State contract

Per-pipeline state files carry `"pass"`, `"maxPasses": 5`, `"floor"`, and `"floorJustification"` (required when floor is 2). See `CONTEXT.md` for the state-file layout terms.

## Resolution states

Every finding ends the run in exactly one state: `Resolved`, `Deferred (human decision required)`, or `Not Reproducible (with evidence)`.
