
# URL To Code

Use only when the user explicitly asks to clone/recreate a live URL.

## Workflow

1. inspect the visible source
2. capture major layouts and important interaction states
3. identify reusable components
4. reproduce visual hierarchy, content structure, and interactions that can be observed
5. implement frontend-only unless the user provides a backend requirement
6. validate against the source
7. run `$design-qa`

If the user asks to improve or redesign the source rather than clone it, route to `$ideate`.

Do not invent hidden behavior.

## Shared contract

Before executing this skill, read `references/master-prompt.md` and apply its shared rules, especially the `[PARAMETER]` rule, data/UI separation, and quality contract.
