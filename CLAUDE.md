# CLAUDE.md - Rules for ai-skills-pro

## Skill Structure and Organization

Skills are organized into three bucket folders under `skills/`:
- `skills/engineering/`: Code work, architecture planning, testing, review, bugfix, DevOps, and router.
- `skills/productivity/`: PRD generation, session management, retrospective reports, SEO keywords.
- `skills/design/`: Visual token extraction, 3D character translation, anime stylization, and Axiom cognitive architecture.

Every skill folder contains:
1. `SKILL.md` (mandatory entry point, frontmatter with `name` and `description`).
2. `agents/openai.yaml` (mandatory Codex/OpenAI interface metadata).
3. Optional modular references (`references/`, `modes/`, `config/`, etc.) for progressive disclosure.

## Writing and Prose Guidelines

- **No em-dashes**: Do not use em-dashes anywhere. Use commas, colons, periods, or parentheses instead.
- **Positive Prompting**: Describe what the agent *should* do. Minimize bare negative prohibitions.
- **Checkable Completion Criteria**: Every workflow phase must end with an unambiguous, verifiable completion test.
- **Progressive Disclosure**: Keep `SKILL.md` focused on core steps. Move detailed templates and extensive schemas into auxiliary markdown files in the same directory.
- **Sync manifests**: When adding or updating a skill, update `.claude-plugin/plugin.json`, `package.json`, and `README.md`.
