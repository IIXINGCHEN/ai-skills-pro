## What it does

Translates a frozen Ad Brief and Style Spec into exact words: a Copy Lock of seven length-bounded poster fields checked against PRC Advertising Law wording rules, plus a render prompt (or `layout.json` in real-photo mode) quoting the locked copy verbatim.

## When to reach for it

Type /prod-ad-lexicon after the brief is `FROZEN` and the style spec is written.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- All seven copy fields are within limits and ad-law compliant.
- Every number, price, speed, or licence traces to a confirmed claim fact.
- The render prompt quotes every locked string exactly and carries the only-text clause.

## Where it fits

Third stage of the ad pipeline, after vis-ad-style and before render.
