## What it does

Routes a FROZEN Ad Brief to one visual style and writes a Style Spec: style route, palette tokens with hex codes, type pairing, canvas zone map, and a staged value-leap hero scene.

## When to reach for it

Type /vis-ad-style after prod-ad-brief freezes the brief.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Exactly one route chosen, with a one-sentence reason tied to the brief.
- Every color is a hex token; exactly one accent carries the reward word, badge, and button.

## Where it fits

Second stage of the ad pipeline: prod-ad-brief → vis-ad-style → prod-ad-lexicon.
