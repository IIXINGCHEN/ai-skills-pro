---
name: prod-prod-create-prd
description: Transform conversational requirements, user stories, and feature concepts into a formal, comprehensive Product Requirements Document (PRD). Use when planning products, writing specifications, or scoping MVPs.
---

# Create Product Requirements Document (PRD)

Generate an engineering-ready, structured Product Requirements Document (PRD) from discussion context. Enforces the Briefing Loop alignment protocol to eliminate guesswork before document creation.

## 4-Stage PRD Generation Workflow

```
[Phase 1: Clarification Gate] ➔ [Phase 2: Brief Playback & Alignment] ➔ [Phase 3: Formal PRD Generation] ➔ [Phase 4: Gap Review & MVP Audit]
```

### Phase 1: Clarification Gate
When receiving high-level requirements:
1. Do not generate the complete PRD immediately.
2. Formulate 3 to 5 blocker-level clarification questions covering:
   - Target User Persona and primary friction point.
   - Core Value Proposition and key success metric (KPI).
   - Scope Boundaries: Strict MVP (P0) vs Future Phase (P1/P2) non-goals.
   - Hard Technical or Operational constraints.

### Phase 2: Brief Playback & Alignment
1. Synthesize the user answers into a concise Playback Brief:
   - Target User & Core Problem.
   - Primary Value Thesis.
   - Explicit Non-Goals (what will not be built).
2. Request explicit user confirmation before proceeding to document generation.

### Phase 3: Formal PRD Generation
Once the Brief is confirmed, produce the PRD following the standardized structure below.

### Phase 4: Gap Review & MVP Audit
Conclude the PRD with a Gap Review self-audit:
- **Strengths**: High-confidence specifications directly solving core user pain.
- **Open Ambiguities**: Edge cases or UX details deferred to spec design.
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
- Strengths, residual ambiguities, recommended scope cuts, and next steps.
```

## Quality Gate Checklist

- [ ] Pre-flight clarification questions asked (3 to 5 questions).
- [ ] Brief played back and confirmed by the user.
- [ ] MVP scope clearly segregated from non-goals.
- [ ] User stories include Given / When / Then criteria.
- [ ] Gap Review self-audit attached.