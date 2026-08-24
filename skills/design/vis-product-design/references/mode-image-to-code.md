
# Image To Code

Use when the user supplies a visual source and asks for implementation.

## Workflow

1. inspect the complete source
2. identify layout regions and component boundaries
3. infer spacing, typography, visual hierarchy, states, and responsive intent
4. reproduce composition and visual language faithfully
5. parameterize project-varying content
6. implement semantic HTML + maintainable CSS + data-driven JavaScript
7. add interaction where it supports the source intent
8. validate desktop/tablet/mobile behavior

## Fidelity rules

- source fidelity comes before creative redesign
- preserve hierarchy, proportions, spacing, and major visual relationships
- do not replace distinctive visual language with generic UI components
- do not invent unrelated product areas

Use `[PARAMETER]` or data/config for content that should vary between projects.

## Shared contract

Before executing this skill, read `references/master-prompt.md` and apply its shared rules, especially the `[PARAMETER]` rule, data/UI separation, and quality contract.
