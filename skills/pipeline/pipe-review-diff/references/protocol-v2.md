# Diff review protocol

## Standards
- convention breaks, risky patterns
- Smell baseline (advisory): applies even when the repo documents nothing. Every item below is a judgement call, never a hard violation.
  - Naming that hides intent (functions, variables, or types whose names don't say what they hold or do)
  - Duplicated logic shapes appearing in more than one hunk or file
  - One function or module changed for several unrelated reasons
  - Error paths missing, swallowed, or untested
  - Shared mutable state or ordering assumptions without synchronization
  - Abstraction or hooks added for needs the spec doesn't have
- Adjudication: a documented repo standard always wins over the baseline; where the repo endorses something the baseline would flag, suppress the finding. Baseline findings stay advisory. Skip anything the toolchain already enforces (linters, type checkers, formatters).

## Spec
- missing requirements, scope creep, wrong behavior

## Summary
- counts and worst item per axis
