## What it does

Runs the complete bug-fix loop automatically: RCA with repro evidence, human RCA sign-off, surgical fix, full regression validation, atomic commit, and fix retrospective.

## When to reach for it

Type /eng-defect-lifecycle when reporting a bug that needs full remediation, or when the agent detects a confirmed defect requiring the RCA-to-commit loop.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The RCA document exists before any code change.
- The fix includes a regression test derived from the repro loop.
- The validation suite is green and the retrospective is archived.

## Where it fits

Standalone defect pipeline, parallel to the full feature lifecycle.