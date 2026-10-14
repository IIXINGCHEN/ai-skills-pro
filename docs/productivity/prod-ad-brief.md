## What it does

Settles what an ad must sell before any design work: offer, customer, pain, reward, single action, channel, and the provable facts behind every claim. The output is a frozen Ad Brief (`posters/<slug>/brief.md`, status `FROZEN`) that every later stage (style, lexicon, render, copy) reads from.

## When to reach for it

Type /prod-ad-brief when starting ad or poster work, or when the brief is missing or not yet `FROZEN`.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Every template field is filled and tagged `stated` or `inferred`.
- Every claim fact (price, speed, guarantee, licence) is user-confirmed or removed.
- `brief.md` exists with status `FROZEN` and the confirmation recorded.

## Where it fits

First stage of the ad pipeline: prod-ad-brief → vis-ad-style → prod-ad-lexicon → render.
