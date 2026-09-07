## What it does

Central lifecycle router and decision dispatch mapping the engineering workflows of ai-skills-pro: it reads the task shape and names the smallest skill or lifecycle that completely addresses it.

## When to reach for it

You invoke this by typing `/eng-router`, and the agent won't reach for it on its own. Reach for it when several engineering skills could plausibly fit and you want the map instead of a guess: choosing between the review-family lifecycles, picking a defect workflow, or deciding whether a task needs a full lifecycle at all.

Key routing boundary inside the review family: `/eng-review-and-fix` runs the review-fix-validate convergence loop and stops before delivery (no commits, no push); `/eng-review-and-ship` runs the same gauntlet and continues into completion verdict, atomic commits, and an authorized push. The deciding question is whether delivery is part of this run.

Catalog self-maintenance routes here too: `/eng-skill-create` when a new skill should join the catalog (intake gates, scaffold, surface wiring), `/eng-skill-optimize` when an existing skill ships drift (six-axis diagnosis and a risk-ranked plan). Their target is the skill packages of this repository, not project code.

## Common questions

**How does it choose?**
One rule: the smallest skill that completely addresses the task. A focused reusable skill beats a full lifecycle when the task is local; a lifecycle earns its handoffs only when its gates and artifacts add value.

**Can it fire other skills automatically?**
It may recommend any user-invoked skill for the human to run, and it may call model-invoked skills when the current workflow needs them. It never reaches a user-invoked skill through the Skill Tool.

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- One appropriate starting skill or workflow is identified, with the reason it wins over its siblings.
- The selected skill's invocation mode is respected: user-invoked skills are presented as commands to run, not called.
- No user-invoked skill is presented as an automatic Skill Tool dependency.

## Where it fits

Entry point and index of the engineering family: it sits above the lifecycles and the reusable skills, and its routing table stays synchronized with the catalog (a new skill it never mentions, or a stale one it still routes to, is a router that lies).
