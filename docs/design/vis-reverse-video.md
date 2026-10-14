## What it does

Reverse engineers a finished video (link or file) into how it was made and how to remake it: a generation-method verdict (AI video model vs code rendering vs hybrid), a shot-by-shot table with verbatim on-screen text, a visual style profile, and two reusable prompts (a 50-character one-liner and a full paste-ready version). Includes a frame-acquisition playbook for risk-controlled hosts such as Bilibili.

## When to reach for it

Type /vis-reverse-video, or the agent reaches for it when the user shares a video and asks how it was generated, wants its prompts extracted, or wants to recreate its style.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

**Can it download videos from Bilibili?**
Direct download from datacenter IPs is blocked by risk control. The skill instead drives a real browser to capture metadata and a 10-second-interval screenshot sequence, then analyzes the frames.

## It's working if

- The generation-method verdict carries a confidence level with at least three cited evidence items.
- Every on-screen text in the shot table is transcribed verbatim or marked 「看不清」.
- The credibility section separates observed facts from inferences and declares sampling blind spots.

## Where it fits

Video prompt engineering and style-replication workflow: analyze first, then recreate with a video model or a code-rendering pipeline.
