## What it does

Turns something the user can't answer alone into a questionnaire for a knowledgeable recipient. It interviews the user only about the send (who receives it, what they need back), then drafts gap-targeted questions ordered most-important-first.

## When to reach for it

Type /to-questionnaire when a decision needs facts only someone else holds.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- `to-questionnaire-<slug>.md` exists in the current directory.
- Every item the user named as needed-back is covered by a question.

## Where it fits

Between internal work (grill/spec) and external stakeholders; anywhere async knowledge extraction is needed.
