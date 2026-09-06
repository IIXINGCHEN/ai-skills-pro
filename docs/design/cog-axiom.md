## What it does

Provides the Cognitive architecture principles library: eight engineering principles, scoped security guidance, compliance constraints, deliverable and artifact standards, and structured reasoning guidance. Pure reference domain with no operational workflow.

## When to reach for it

The agent consults it to ground architecture decisions and enforce delivery standards. Operational work routes through eng-router and the lifecycle orchestrators instead.

## Common questions

**Where did the 10 operational modes go?**
They were removed to eliminate duplication with the native engineering skills. The mapping lives in the SKILL.md replacement table; the prompt enhancement mode was migrated to the standalone prod-prompt-enhancer skill.

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Principles and standards are cited during architecture and delivery work.
- No pipeline or mode execution is attempted from this library.
- All reference links resolve correctly.

## Where it fits

Reference domain in the design bucket; pairs with all engineering pipelines as a standards source.