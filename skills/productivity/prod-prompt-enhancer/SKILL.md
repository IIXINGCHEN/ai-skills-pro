---
name: prod-prompt-enhancer
description: Transform a user-provided instruction into a single improved prompt.
disable-model-invocation: true
---
# Prompt Enhancer

A focused transformation skill. It performs one transformation and returns exactly one artifact: the enhanced prompt.

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
---

## Checkable Completion Criteria

- [ ] Activated only on an explicit enhancement request.
- [ ] Output is exactly one enhanced prompt: specific, self-contained, verifiable.
- [ ] Zero preamble, zero explanations, zero placeholders, zero surrounding quotes.
