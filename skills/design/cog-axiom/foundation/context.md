---
description: "Persistent project context guidance and context-layering model"
version: "1.6.0"
tags: ["context", "agents", "source-of-truth"]
module-type: "foundation"
---

# Context Architecture Guidance

Use persistent project context when it is available and materially relevant. This module describes a recommended context model; it does not make `.agents/context/` an inviolable source or override other project-authoritative sources.

## Context Layers

Use three complementary layers:

1. **Project Context** — durable project facts, decisions, architecture, conventions, and domain knowledge. A repository may store these under `.agents/context/` or another documented location.
2. **Task Brief** — the current task's goals, scope, acceptance criteria, constraints, and known assumptions.
3. **Execution Prompt** — the immediate step being performed, derived from the project context and task brief.

Recommended flow:

`Project Context → Task Brief → Execution Prompt`

## When Context Is Needed

- If missing context could materially change correctness, ask for or retrieve the relevant information before making the affected decision.
- If missing context does not materially change the outcome, use a reasonable default, state the assumption when useful, and continue.
- Prefer the narrowest relevant context rather than loading an entire context tree.
- Treat stale or contradictory context as evidence to resolve, not as unquestionable authority.

## Context Requests

When explicit context retrieval is needed, use a concise request such as:

```xml
<CONTEXT_REQUEST reason="Explain why the missing context affects the requested decision.">
  <file path="path/to/relevant/file.md" />
</CONTEXT_REQUEST>
```

Do not emit a context request merely because a context directory exists.

## Context Evolution

Update persistent context after meaningful architectural decisions or reusable project learnings. Keep updates reviewable, scoped, and version-controlled.

## Related Modules

- [Core Principles](./principles.md)
- [Session State](../cognitive/session.md)
- [Interaction Guidance](../protocols/interaction.md)
