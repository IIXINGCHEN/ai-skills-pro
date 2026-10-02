---
"ai-skills-pro": patch
---

Repair the eng-router synchronization guard, tighten the eng-git-commit description, and make the link installers safe to re-run.

- `tests/skills.test.mjs`: the forward router-coverage filter read `x.category`, a field the skill graph does not expose (it exposes `bucket`). The predicate never matched, so the loop body never ran and the assertion passed vacuously. Switch to `x.bucket` and add a non-vacuity guard that fails loudly if the filtered set is ever empty again.
- `skills/engineering/eng-git-commit/SKILL.md`: give the model-invoked description a trigger boundary, matching the other 23 model-invoked skills and `templates/skill-authoring-checklist.md` A.3. Add a matching train eval case; holdout and blind are unchanged and do not regress.
- `scripts/link-skills.ps1` and `scripts/link-skills.sh`: two defects blocked a clean install. First, the two targets alias the same directory when `~/.agents/skills` is a symlink to `~/.claude/skills`, so every skill was processed twice and the second pass deleted the link the first had just made; targets are now resolved and deduplicated. Second, the replace step could recurse through a link into its target (`Remove-Item -Recurse` on Windows follows a junction), which would wipe the skill the link points at; a target entry is now replaced only when it is a link, and the link is deleted without touching its target. A real directory is refused instead of deleted.
