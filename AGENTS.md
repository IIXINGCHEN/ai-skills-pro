# AI Skills Pro

This repository contains composable Agent Skills for engineering, productivity, and design work.

## Repository rules

- Treat each `SKILL.md` as an independently scoped skill. Do not assume every task follows one global pipeline.
- Keep `SKILL.md` focused. Put branch-specific material behind nearby context pointers.
- Keep `SKILL.md` and `agents/openai.yaml` invocation mode synchronized.
- User-invoked skills are human-only. Skill Tool dependencies may target only model-invoked skills.
- Keep release metadata synchronized from `VERSION`.
- Run `npm run validate` after skill changes and `npm run release-check` before creating a release artifact.

See `CONTEXT.md` for repository vocabulary and `.agents/invocation.md` for the invocation contract.
