---
name: prod-create-prd
description: "Transform user stories and feature concepts into a formal Product Requirements Document (PRD): personas, KPIs, MVP scope, non-goals. Use when writing PRDs or scoping an MVP for a product; for engineering implementation plans use eng-plan."
---

# Create Product Requirements Document (PRD)

Generate an engineering-ready, structured Product Requirements Document (PRD) from discussion context. Enforces the Briefing Loop alignment protocol to eliminate guesswork before document creation: run it via the Skill tool, never by re-asking its questions inline.

## 4-Stage PRD Generation Workflow

```
[Phase 1+2: via prod-briefing-loop] ➔ [Phase 3: Formal PRD Generation] ➔ [Phase 4: Gap Review & MVP Audit]
```

### Phases 1-2: Briefing Loop (via Skill tool)

Call the Skill tool with "prod-briefing-loop" and let it run its Phase 1: Clarification Gate and Phase 2: Playback Brief Contract. Do NOT inline its questions here and do NOT enter its Phase 3: the PRD below is the authorized execution. Asking the same clarification questions twice is the failure this rule prevents.

### Phase 3: Formal PRD Generation
Once the Brief is confirmed, produce the PRD following the standardized structure below.

### Phase 4: Gap Review & MVP Audit
Conclude the PRD with a Gap Review self-audit (terminology aligned with `prod-briefing-loop` Phase 4):
- **Strengths**: High-confidence specifications directly solving core user pain.
- **Residual Ambiguities**: Edge cases or UX details deferred to spec design.
- **Recommended Deletions**: Scope creep elements to exclude from MVP.
---
## Structure & Sections

```markdown
# Product Requirements Document (PRD): <Feature / Product Name>

## 1. Executive Summary
- **Overview**: Core value proposition and problem statement.
- **Goals & Non-Goals**: Explicitly state what this feature will and will not do.

## 2. User Personas & Problem Scenarios
- Who is the user and what friction are they experiencing?

## 3. Scope & Feature Requirements
- **MVP In-Scope (P0)**: Mandatory features for initial release.
- **Next Phase (P1/P2)**: Features deferred to subsequent milestones.

## 4. User Stories & Acceptance Criteria
- Format: "As a <role>, I want <action> so that <benefit>."
- Given / When / Then acceptance criteria for each story.

## 5. Technical & Architecture Considerations
- Data model adjustments, API contracts, security & privacy considerations.

## 6. Milestones & Success Metrics
- Quantitative KPIs and launch checklist.

## 7. Gap Review & Scope Audit
- Strengths, residual ambiguities, recommended deletions, and next steps.
```

## Quality Gate Checklist

- [ ] Pre-flight clarification questions asked (3 to 5 questions).
- [ ] Brief played back and confirmed by the user.
- [ ] MVP scope clearly segregated from non-goals.
- [ ] User stories include Given / When / Then criteria.
- [ ] Gap Review self-audit attached.
---

## Checkable Completion Criteria

- [ ] PRD follows the standardized seven-section structure.
- [ ] MVP scope segregated from P1/P2 non-goals; success metrics quantified.
- [ ] Gap Review self-audit attached covering strengths, ambiguities, and recommended deletions.
