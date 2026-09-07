---
name: eng-plan
description: Produce the implementation plan for a feature or frozen spec: ordered coding phases, files to touch, and risks. Use when planning software work before coding starts; for carrying out an existing plan use eng-execute.
---

# Plan Feature

Transform a feature request or frozen specification into a **comprehensive implementation plan** through systematic codebase analysis, context gathering, and dependency-ordered task breakdown.

## Core Rules & Guardrails

- **Zero-Code Phase**: Do NOT write or modify application source code during this phase. Only create the plan document.
- **Spec-First Ingestion**: If `specs/<feature-name>/` exists, treat `requirements.md` and `design.md` as the frozen single source of truth. Derive tasks and acceptance criteria directly from the spec's AC identifiers without re-inventing requirements.
- **Anti-Hallucination & Reality Check**:
  - Every referenced file, symbol, or pattern MUST exist in the codebase and be confirmed with tools (`grep`, `glob`, `read`).
  - Validation commands MUST match actual project tooling (e.g. detect `package.json`, `Cargo.toml`, `pytest.ini`).
  - Never invent URLs or unverified file paths in the delivered plan ,  cite only tool-confirmed artifacts.
- **No Full Code Dumps in Tasks**: Provide interface signatures, key logic outlines, and pattern references, NOT 100-line code blocks.
---
## 5-Phase Planning Workflow

```
[Phase 1: Spec / Scope Ingestion & Ambiguity Gate] ➔ [Phase 2: Codebase Intelligence] ➔ [Phase 3: Architecture & Contract Alignment] ➔ [Phase 4: Task Breakdown] ➔ [Phase 5: Plan Output & Verification Gate]
```

### Phase 1: Scope & Ambiguity Gate
1. **Check for Spec**: Inspect `specs/<feature-name>/`. If frozen, ingest `requirements.md` (ACs, scope) and `design.md` (contracts).
2. If no spec exists, extract user intent, determine category (`New Capability` | `Enhancement` | `Refactor` | `Bug Fix`), and assess complexity.
3. **Ambiguity Gate**: If requirements, core technical stack, or breaking changes are ambiguous (and no frozen spec exists), **stop and ask the user** (or suggest running `eng-spec`) before proceeding.

### Phase 2: Codebase Intelligence Gathering
1. **Locate Integrations**: Identify existing files that need modifications and new files to create.
2. **Extract Conventions**: Identify existing project patterns for naming, error handling, logging, and database access.
3. **Verify Build & Test Commands**: Discover exact test, lint, and build commands from project configs.
4. **Identify Gotchas**: Note deprecations, concurrency constraints, or edge cases.

### Phase 3: Architecture & Contract Alignment
1. Align component boundaries and API interfaces with codebase conventions (or frozen `design.md`).
2. Document architectural trade-offs and rationale.
3. Ensure backward compatibility and error recovery strategies.

### Phase 4: Vertical Slice Ticket Breakdown
Break the work into **vertical slice tickets** using `templates/ticket-template.md` (write each to `specs/<feature>/tickets/NNN-<slug>.md`):
- A ticket is one complete user-facing capability cutting through every layer it touches (frontend, backend, data, tests, acceptance). Never a horizontal task ("all the backend", "all the tests").
- Prefer a thin end-to-end tracer bullet grown in later tickets over a complete layer finished early.
- Occam ordering: ticket 1 delivers the simplest version that works end to end; convenience arrives in later tickets pulled by real need. Any abstraction the plan introduces names the second concrete ticket that uses it; abstraction with a single consumer is deferred until a second case exists.
- Declare blocking edges between tickets so independent slices can run in parallel.
- Within each ticket, list implementation steps with ACTION (`CREATE` | `UPDATE` | `REMOVE`), TARGET (file path), OBJECTIVE (mapped to AC), PATTERN REFERENCE (existing file:line), VALIDATION (executable command).

### Phase 5: Output & Verification Gate
Generate the plan file at `specs/<feature>/plan.md` following the template below, with tickets at `specs/<feature>/tickets/`.

---

## Output Plan Template

```markdown
# Feature Plan: <feature-name>

## 1. Overview & Context
- **Problem Statement**: <what problem is being solved>
- **Proposed Solution**: <how the solution addresses the problem>
- **Spec Reference**: `specs/<feature-name>/` (or N/A)
- **Feature Type**: New Capability | Enhancement | Refactor | Bug Fix
- **Estimated Complexity**: Low | Medium | High

## 2. Context References & Existing Patterns
- `path/to/existing_file.ext` (lines X-Y) - Pattern to mirror
- `path/to/config.ext` - Integration target

## 3. Tickets (Vertical Slices, blocking edges declared)

### Ticket 1: <user-visible capability> (blocked by: none)
- **STORY**: As a <role>, I can <capability>.
- **LAYERS**: frontend <files> / backend <files> / data <none> / tests <what> / acceptance <how>
- **STEPS**: ACTION TARGET with OBJECTIVE (mapped to AC), PATTERN `<file:line>`, VALIDATE `<command>`

### Ticket 2: <capability> (blocked by: 1)
...

## 4. Testing & Validation Matrix
- **Syntax / Lint**: `<command>`
- **Unit Tests**: `<command>`
- **Integration Tests**: `<command>`
- **Manual Verification Checklist**:
  - [ ] Verification step 1
  - [ ] Verification step 2

## 5. Acceptance Criteria
- [ ] AC-1: <from spec or requirements>
- [ ] AC-2: <from spec or requirements>
- [ ] All automated tests pass with zero regressions
- [ ] Conforms to existing codebase style and patterns
```

---

## Plan Quality Checklist (Pre-Flight Gate)

Before delivering the plan, ensure:
- [ ] If `specs/<feature-name>/` exists, all tickets map to frozen acceptance criteria.
- [ ] Every ticket is a vertical slice: user-visible capability, every layer it touches included, independently demonstrable.
- [ ] All referenced files and line numbers have been verified in the actual codebase.
- [ ] Ticket blocking edges are declared and form no cycles.
- [ ] Every step includes a working, executable validation command.
- [ ] Plan output path is `specs/<feature>/plan.md` with tickets under `specs/<feature>/tickets/`.

---

## Checkable Completion Criteria

- [ ] Plan file generated at `specs/<feature>/plan.md` following the output template, tickets at `specs/<feature>/tickets/NNN-<slug>.md` per the ticket template.
- [ ] Every ticket is a vertical slice carrying story, layers touched, ACTION/TARGET/OBJECTIVE/PATTERN/VALIDATION steps.
- [ ] All referenced files, symbols, and line numbers verified against the real codebase with tools.
- [ ] Tickets ordered by declared blocking edges and mapped to spec acceptance criteria when a frozen spec exists.
