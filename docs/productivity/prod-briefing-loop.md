## What it does

Establishes a strict four-stage alignment protocol: Clarify with key questions -> Playback and freeze Brief contract -> Generate deliverable -> Perform post-generation Gap Review. Grounded in the three-tier hierarchy: Context (who you are) -> Brief (what this mission aims to achieve) -> Prompt (immediate step).

## When to reach for it

Type /prod-briefing-loop, or the agent reaches for it when processing ambiguous, multi-variable, or high-stakes requests to prevent hallucinations and unaligned outputs. Skip for atomic deterministic tasks (translation, typo fix, simple sorting).

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The agent pauses to ask 3 to 5 high-impact clarification questions instead of guessing.
- The agent plays back a structured Brief contract for confirmation prior to generation.
- A Gap Review self-audit is attached at the end of the deliverable.

## Where it fits

Upstream requirements gathering and task initialization, feeds into PRD creation, specification design, or direct deliverable generation.