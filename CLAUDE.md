# AI Skills Pro

This repository contains composable Agent Skills for engineering, productivity, and design work.

## Conventions

- `skills/<bucket>/<skill>/SKILL.md` is the skill entry point.
- `agents/openai.yaml` must match the skill's invocation mode.
- User-invoked skills are human-only; model-invoked skills may be reached automatically.
- Skill Tool dependencies target model-invoked skills only.
- Keep skill entry files small and disclose branch-specific references only when needed.
- Run `npm run validate` after skill changes and `npm run release-check` before release.

See `CONTEXT.md` and `.agents/invocation.md` for the shared vocabulary and invocation contract.
