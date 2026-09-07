## What it does

Runs the content delivery pipeline automatically: Briefing Loop clarification with human sign-off, draft generation, Gap Review self-audit, revision, and delivery record archival.

## When to reach for it

You invoke this by typing `/prod-content-delivery-lifecycle`, and the agent won't reach for it on its own.

Type /prod-content-delivery-lifecycle when producing articles, proposals, or documents that need alignment rigor without manual command re-entry.

## Common questions

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The Brief was confirmed before any drafting started.
- The Gap Review self-audit accompanies the draft.
- The delivery record is archived at .agents/content-deliveries/.

## Where it fits

Standalone content pipeline built on prod-briefing-loop.