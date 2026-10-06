---
name: pipe-distill
description: "Distill how someone thinks into a runnable skill: mental models, decision heuristics, expression DNA, anti-patterns, and honesty boundaries. Use when the user asks to distill a person or topic, e.g. 'distill Feynman', 'make a Munger perspective skill', 'create a perspective on how X thinks'."
disable-model-invocation: true
---

# Distill

Turn a person (or a topic) into a skill that reasons the way they do. The product is not a biography and not role-play. It is a runnable cognitive framework extracted from public material, with its limits stated honestly.

## Red lines (non-negotiable)

This skill refuses:

- Distilling a living private individual without their consent (colleagues, ex-partners, ordinary people). Public figures are fine.
- Any use aimed at impersonation, harassment, or fraud.
- Medical, legal, or investment personas unless the output carries an explicit disclaimer that it cannot replace a professional.

Screen the subject against these lines in Phase 0, before any research. If a request hits a red line, decline briefly and name the line it crosses.

## The five layers

Every distillation extracts the same five layers:

1. **Mental models** (3-7): how they see the world. Each must pass triple verification: it recurs across 2+ domains, it predicts their stance on new questions, and it is not something every smart person would say.
2. **Decision heuristics** (5-10): fast rules of the form "if X, then Y", each backed by a concrete case.
3. **Expression DNA**: sentence shape, vocabulary fingerprints, rhythm, humor mode, certainty style.
4. **Values and anti-patterns**: what they stand for, what they refuse to do, and the tensions between their values.
5. **Honesty boundaries**: what the skill cannot do. No predicting reactions to truly novel questions, no replacing creativity or intuition, public expression may differ from private thought, knowledge frozen at research time.

## Process

### Phase 0 - Clarify

Screen the subject against the red lines first; a hit ends the task with a brief refusal. Then confirm the focus (full portrait vs one dimension), and whether local source material exists (books, transcripts, exports beat web search). Agree on a research tier (quick/standard/deep) and its cost before running anything expensive. Defaults fill every gap: full portrait, standard tier, web research. Confirming does not block delivery: anything that does not depend on the user's answer is produced first, then adjusted.

### Phase 1 - Research swarm

Spawn parallel subagents across six dimensions, each writing findings to `references/research/` inside the new skill directory: writings, long-form conversations, expression samples, external views and criticism, decision records, timeline (including the last 12 months). Every claim notes its source and credibility tier (first-hand, second-hand, inferred). Contradictions are kept, not smoothed over.

### Phase 1.5 - Research checkpoint

Pause and show a per-dimension summary: source counts, key findings, conflicts, thin dimensions. The user confirms or orders more research before synthesis begins. Research quality caps the final skill.

### Phase 2 - Synthesis

Extract the five layers. Mental-model candidates go through triple verification; items passing only 1-2 checks downgrade to heuristics; zero-check items are dropped. Keep 3-7 models, ranked by distinctiveness. Fewer deep models beat many shallow principles.

### Phase 2.5 - Synthesis checkpoint

Show the extracted models, heuristics, expression traits, tensions, and boundaries. The user confirms before anything is written into a skill file.

### Phase 3 - Build

Assemble the skill: frontmatter (keep the description short, name the trigger phrases, state it does not auto-trigger on general questions), the five layers, and a sources section. The skill directory must be self-contained: copy the directory and it works, with no external file dependencies.

### Phase 4 - Validate

Test the built skill against 3 questions the subject publicly answered (the direction must match) and 1 they never addressed (it must show calibrated uncertainty, not false confidence). Fix or narrow claims that fail.

## Checkable Completion Criteria

- [ ] Subject passed the red-line screen (consent for living private individuals; no impersonation, harassment, or fraud; disclaimer for medical/legal/investment personas).
- [ ] Subject, focus, and research tier confirmed with the user before expensive work started.
- [ ] Six research dimensions covered, findings filed under `references/research/`, sources and credibility noted.
- [ ] 3-7 mental models each triple-verified; 5-10 heuristics with cases; expression DNA, anti-patterns, and honesty boundaries recorded.
- [ ] Both checkpoints passed with explicit user confirmation.
- [ ] Built skill is self-contained and passes the 3+1 validation questions.
