## What it does

Executes safe progressive refactoring: hotspot analysis, behavior-preservation contracts with characterization tests, phased strangler plan, small-step execution with per-step regression checks, post-refactor audit, and PR delivery.

## When to reach for it

Type /eng-refactor-lifecycle when modernizing legacy systems or restructuring hotspots where observable behavior must remain identical.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Characterization tests passed before and after every refactor step.
- Zero behavioral drift was detected at any step.
- The full validation suite and post-refactor audit are green.

## Where it fits

Standalone modernization pipeline built on top of the SDD core skills.