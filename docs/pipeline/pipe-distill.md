# pipe-distill

Distill how someone thinks into a runnable skill.

## What it produces

A self-contained skill directory that reasons the way a chosen person (or topic) does. The output is a cognitive framework, not a biography and not role-play.

## Red lines (non-negotiable)

Refuse before any research:

- A living private individual without their consent (colleagues, ex-partners, ordinary people). Public figures are fine.
- Any use aimed at impersonation, harassment, or fraud.
- Medical, legal, or investment personas unless the output carries an explicit disclaimer that it cannot replace a professional.

## The five extraction layers

1. **Mental models** (3-7): triple-verified (cross-domain recurrence, generative power, exclusivity).
2. **Decision heuristics** (5-10): "if X, then Y" rules with concrete cases.
3. **Expression DNA**: sentence shape, vocabulary, rhythm, humor, certainty style.
4. **Values and anti-patterns**: what they stand for, what they refuse, and the tensions between them.
5. **Honesty boundaries**: what the skill cannot do, stated explicitly.

## Phases

| Phase | Name | Gate |
|-------|------|------|
| 0 | Clarify | Subject, focus, research tier, and local material confirmed; expensive tiers need explicit agreement |
| 1 | Research swarm | Six dimensions (writings, conversations, expression, external views, decisions, timeline) filed under `references/research/` with source credibility |
| 1.5 | Research checkpoint | User confirms research quality before synthesis |
| 2 | Synthesis | Triple verification applied; 3-7 models, 5-10 heuristics, DNA, tensions, boundaries |
| 2.5 | Synthesis checkpoint | User confirms the extraction before building |
| 3 | Build | Self-contained skill assembled; short frontmatter with explicit trigger phrases |
| 4 | Validate | 3 public-answered questions match direction; 1 unaddressed question shows calibrated uncertainty |

## Usage

User-invoked only. Distillation is a deliberate, potentially expensive task, so the model never triggers it on its own.

```
User: distill Feynman
```

The skill runs Phase 0 first: it clarifies the subject, asks about local source material, and agrees on a research tier before any expensive work begins.

## Design notes

- A skill that hides its limitations is not worth trusting. Honesty boundaries are a required section, not an afterthought.
- Research files live inside the skill directory. Copy the directory and it works.
- Cheaper than it looks: quick tier (3 dimensions, 5 sources each) validates the approach before committing to a full distillation.
