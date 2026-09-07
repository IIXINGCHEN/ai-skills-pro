# Skill Scaffold

Fill every `<angle-bracket>` slot; delete a section only when its triggering feature is absent (for example the boundary paragraph when no sibling confusion is possible). Placeholders are legal only inside `templates/`; a shipped skill carries real values everywhere (ADR 0005).

## SKILL.md

```markdown
---
name: <kebab-case-name-matching-directory>
description: "<user-invoked: one clear line, max 180 chars, no trigger phrasing | model-invoked: capability plus trigger boundaries, max 280 chars>"
<disable-model-invocation: true  # user-invoked only>
---

# <Title Case Human Name>

<One paragraph: what this skill does, what it composes or provides, and its stopping point (no delivery / no commits / report only / ...)>

[Boundary (ADR 0001): for orchestrators, which existing lifecycle this does NOT replace and which sibling handles the adjacent stopping point.]

## <Pipeline or Method Structure>

<Numbered stages or method sections. Every Skill Tool dependency appears exactly as: Call the Skill tool with "<name>". Never a user-invoked target.>

## State Persistence & Resumption   # stateful pipelines only

Record progress in `.scratch/<pipeline>-state.json` (per-pipeline filename; the shared lifecycle-state.json is banned):

<state fields: feature, pipelineType, currentStage, pass, completedStages, lastUpdated>

## Checkable Completion Criteria

- [ ] <observable outcome per stage; every artifact named with its path under specs/, .scratch/, docs/, or docs/adr/>
- [ ] Execution record appended per `templates/execution-record.md` (executor, skill, version, permissions, steps, results, risk, report), values copied from the generated manifest.   # orchestrators (2+ Skill Tool dependencies or lifecycle) only
```

## agents/openai.yaml

```yaml
interface:
  display_name: "<Title Case>"
  short_description: "<one line>"
<policy:                    # user-invoked only
  allow_implicit_invocation: false>
```

## docs/<bucket>/<skill-name>.md

```markdown
## What it does

<One paragraph, plain language, no H1.>

## When to reach for it

<user-invoked: "You invoke this by typing `/<name>`, and the agent won't reach for it on its own." plus when to choose it over named siblings.>
<model-invoked: how the agent reaches it, plus the trigger boundary.>

## Common questions

<2-4 real questions with answers, including the sibling-confusion one.>

## It's working if

- <observable success criteria matching the completion contract.>

## Where it fits

<One sentence: family, neighbors, what it does not do.>
```
