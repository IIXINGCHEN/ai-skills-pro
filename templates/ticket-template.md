# Vertical Slice Ticket Template

One file per ticket at `specs/<feature>/tickets/NNN-<slug>.md`. A ticket is a **vertical slice**: one complete user-facing capability cutting through every layer it touches (frontend, backend, tests, acceptance). Never a horizontal task ("do all the backend", "write all the tests"). Copy, fill, delete guidance.

```markdown
# Ticket NNN: <user-visible capability>

Feature: <feature-name>  |  Blocked by: <ticket numbers or none>

## User story

As a <role>, I can <capability>, so that <benefit>.

## Slice scope

One demonstrable outcome. If this ticket cannot be demoed on its own, it is not a slice; split or merge.

## Layers touched

- [ ] Frontend / interface: <files or components, or "none"]
- [ ] Backend / logic: <files or modules, or "none">
- [ ] Data / persistence: <schema or migration, or "none">
- [ ] Tests: <unit + integration coverage this slice adds>
- [ ] Acceptance: <how a reviewer verifies the story end to end>

## Acceptance criteria

- [ ] Given <context>, when <action>, then <observable result>.
- [ ] <One criterion per user-visible behavior; no implementation detail.>

## Done means

- [ ] Every checked layer above is complete within this ticket (no "backend done, UI next ticket").
- [ ] Validation suite green (`eng-validate`).
- [ ] Slice demoed against the user story.
```

Rules:
- **Tracer-bullet over layer-cake**: prefer a thin end-to-end slice grown in later tickets over a complete layer finished early.
- **Blocking edges are declared** (`Blocked by`), so tickets can run in parallel where independent.
- A ticket that touches only one layer is legitimate only when the capability genuinely lives in that layer (a pure CLI flag, a pure migration); say so explicitly in Slice scope rather than leaving it implied.
