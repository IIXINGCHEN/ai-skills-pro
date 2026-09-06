---
name: prod-briefing-loop
description: Align requirements, clarify ambiguities with targeted questions, playback a frozen Brief contract, and perform post-generation gap review. Use when handling complex, ambiguous, or high-stakes requests before generating full deliverables.---

# Briefing Loop Protocol

The Briefing Loop establishes a four-stage alignment gate: **Clarify -> Playback Brief -> Authorized Execution -> Post-Generation Gap Review**. It enforces the three-tier context hierarchy (**Context -> Brief -> Prompt**) and prevents ungrounded guessing on open-ended tasks.

## Three-Tier Architecture

- **Tier 1: Context (Long-term)**: Identity, baseline domain, audience defaults, persistent tone and constraints (see `references/context-file-template.md`).
- **Tier 2: Brief (Task-level)**: Objectives, target audience, specific angles, hard constraints, negative constraints, and success criteria for this specific mission.
- **Tier 3: Prompt (Step-level)**: Actionable execution instruction for the immediate next generation step.

## When to Use and When to Skip

- **Skip the Loop (Direct Execution)**: Deterministic, atomic tasks (e.g., translate a sentence, fix a typo, sort a list, reformat JSON). Execute immediately without unnecessary questions.
- **Enforce the Loop (Briefing Required)**: Open-ended, multi-variable, or high-stakes deliverables (e.g., writing articles, designing architecture, conducting business analysis, making strategic decisions, deep tutoring).
---
## Core Lifecycle Protocol

```
[Phase 1: Gatekeeping & Clarification]
    - Analyze task scope and detect ambiguities
    - Question Budget: 3 questions for moderate tasks, up to 5 for complex tasks
    - Rule: Only ask outcome-altering questions (avoid trivia)
            │
            ▼
[Phase 2: Playback & Brief Freezing]
    - Synthesize answers into a structured Brief contract
    - Obtain explicit user confirmation before any generation
            │
            ▼
[Phase 3: Authorized Generation]
    - Produce target deliverable following the frozen Brief specifications
            │
            ▼
[Phase 4: Post-Generation Gap Review]
    - Perform self-audit against the agreed Brief contract
    - Surface strengths, residual ambiguities, deletions, and improvements
```

---

## Phase 1: Clarification Gate

When a user initiates a complex or open-ended task:
1. Do not generate final deliverables immediately.
2. Formulate 3 to 5 high-impact questions to clarify:
   - Primary objective and target audience.
   - Core constraints, tone, and format preferences.
   - Key trade-offs or decision criteria.
3. Keep questions concise and focused exclusively on variables that directly alter the final output.

---

## Phase 2: Playback Brief Contract

After the user answers the clarification questions:
1. Play back your understanding in a structured Brief format:
   - **Goal & Target Audience**: What is the deliverable and who is consuming it?
   - **Core Angle / Thesis**: Key narrative or analytical direction.
   - **Constraints & Format**: Length, structure, technical depth, citation requirements.
   - **Negative Constraints**: Specific anti-patterns, buzzwords, or assumptions to avoid.
2. Await explicit confirmation from the user before proceeding to Phase 3.

---

## Phase 3: Authorized Execution

Once the user approves the Playback Brief:
1. Execute the creation or analysis adhering strictly to the frozen Brief.
2. Reference relevant domain guidelines or templates as defined in `references/`.

---

## Phase 4: Post-Generation Gap Review

Immediately after outputting the initial draft:
1. Provide a dedicated Gap Review section addressing:
   - **Strengths**: Aspects that directly satisfy the Brief.
   - **Residual Ambiguities**: Areas that remain slightly vague or open to interpretation.
   - **Recommended Deletions**: Unnecessary padding or off-target elements.
   - **Actionable Refinements**: Specific steps to maximize value for the target audience.

---

## Modular References

- **Context File Template**: See `references/context-file-template.md` for persistent user profile initialization.
- **Scenario Templates**: See `references/scenarios.md` for quick starters across Content Creation, Data Analysis, Decision Support, and Concept Learning.

## Checkable Completion Criteria

- [ ] Clarification phase respected question budget (3 to 5 outcome-altering questions).
- [ ] Brief contract played back and confirmed by user.
- [ ] Deliverable generated in accordance with frozen Brief.
- [ ] Gap Review self-audit attached at the conclusion of output.