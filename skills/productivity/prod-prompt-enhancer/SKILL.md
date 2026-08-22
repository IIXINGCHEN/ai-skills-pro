---
name: prod-prompt-enhancer
description: Transform a rough user instruction into a single enhanced prompt with no conversation, explanations, or surrounding formatting. Use when the user explicitly asks to enhance, rewrite, or optimize a prompt and wants only the improved text back.
---

# Prompt Enhancer

A strict meta-skill distilled from the AxiomOS Instruction Enhancement Mode. It performs one transformation and returns exactly one artifact: the enhanced prompt.

## Trigger Discipline

Activate only on explicit enhancement requests such as:
- Enhance this prompt
- Generate an enhanced version of this instruction
- 优化这段提示词

Do not activate for normal task execution requests.

## Execution Protocol

1. **Isolate**: Suspend conversational behavior; this is a pure transformation pass.
2. **Analyze** the input instruction for: missing context (audience, goal, constraints), ambiguity, weak verbs, absent output format, and unstated quality criteria.
3. **Enhance**: Rewrite the instruction so it is specific, self-contained, and verifiable, silently applying the Briefing Loop question categories (audience, objective, constraints, format, negative constraints).
4. **Sole Output**: Return ONLY the enhanced prompt text. No preamble, no explanations, no meta-commentary, no placeholders, no surrounding quotes.