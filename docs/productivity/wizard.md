## What it does

Authors a bash wizard (built on `template.sh`) that walks a human step-by-step through a tedious manual procedure: it opens each URL, says exactly what to click and copy, captures values into `.env` or GitHub secrets, confirms at every stage, and shows stages remaining. Ephemeral by default.

## When to reach for it

Type /wizard when a procedure is tedious to do by hand and tedious to re-explain to an AI every time.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- Every stage is named in order with its captured values mapped to source and destination.
- The user confirms the stage list before authoring; never invent steps that may not exist.

## Where it fits

Third-party service setup, one-off migrations, environment provisioning.
