# Model-invoked vs User-invoked

Every `SKILL.md` in this repository follows the strict dual-invocation model:

- **User-invoked**: Reachable only by the human typing `/<name>`. Set `disable-model-invocation: true` in the `SKILL.md` frontmatter and `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. The `description` is human-facing (a single clear summary line without auto-trigger lists).
- **Model-invoked**: Reachable by both model and user. Omit `disable-model-invocation` and the `policy` block. The `description` is model-facing with rich trigger boundaries ("Use when the user wants, mentions, asks for...").

## Cross-Skill Invocation Discipline

When a skill needs another model-invoked skill, explicitly specify calling the Skill tool:
- Say `Call the Skill tool with "eng-validate"` rather than relying on deep file linking or ambiguous prose.
- A user-invoked skill must never be invoked autonomously by another skill. Tell the user to run `/<skill-name>` if user action is required.
