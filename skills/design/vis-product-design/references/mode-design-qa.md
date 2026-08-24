
# Design QA

Validate the built result against `PROJECT_CONTEXT`, `[SELECTED_DIRECTION]`, and `[REFERENCE_SOURCE]` where applicable.

## Check

### Visual
- hierarchy
- spacing
- typography
- color/contrast
- component consistency
- source fidelity

### UX
- primary task clarity
- interactions
- states
- feedback
- empty/loading/error handling

### Responsive
- desktop
- tablet
- mobile
- layout reflow
- typography scaling
- touch targets

### Accessibility
- semantics
- focus order
- keyboard access
- contrast
- reduced motion

### Motion
- purposeful
- smooth
- non-distracting
- performant

### Engineering
- data/UI separation
- reusable components
- CSS variables
- no accidental project-specific hard-coding
- no obvious runtime errors

Severity:
- `P0` broken/unusable/inaccessible
- `P1` major visual or interaction defect
- `P2` polish issue

Fix P0/P1 when implementation access exists. Re-run the relevant checks after fixes.

## Shared contract

Before executing this skill, read `references/master-prompt.md` and apply its shared rules, especially the `[PARAMETER]` rule, data/UI separation, and quality contract.
