---
name: prod-compress-context
description: Summarize active conversation history, decisions, code changes, and task state into a compact context checkpoint.
disable-model-invocation: true
---

# Compress Context

Generate a high-density, loss-resistant context summary to allow seamless continuation of complex or long-running agent sessions.

## Checkpoint Structure

Save to `.agents/context-summaries/<context-name>.md`:

```markdown
# Session Context Checkpoint: <Topic / Goal>

## 1. Goal & Current Progress
- **Primary Objective**: <Original task definition>
- **Current Status**: In Progress | Blocked | Complete
- **Next Immediate Action**: <Specific next step to execute>

## 2. Key Decisions & Technical Architecture
- Architectural choices agreed upon with rationale.
- Constraints or trade-offs established.

## 3. Files Examined & Modified
- `path/to/file1.ext`: Created / Modified / Read (summary of purpose)
- `path/to/file2.ext`: Target for next edit

## 4. Unresolved Issues & Blockers
- Pending questions or edge cases to address.
```

---

## Checkable Completion Criteria

- [ ] Checkpoint saved to `.agents/context-summaries/<context-name>.md`.
- [ ] Goal, current status, and next immediate action are explicit enough to resume cold.
- [ ] Key decisions, touched files, and unresolved blockers all captured without loss of intent.
