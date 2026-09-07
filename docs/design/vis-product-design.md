## What it does

An adaptive product-design suite that routes each request to one focused mode while carrying a single normalized `PROJECT_CONTEXT` through the whole engagement: context setup, brief normalization, evidence research, three-direction ideation, screenshot-to-code, live-URL recreation, UX audit, prototype QA with severity-ranked fixes, and share-ready handoff.

## When to reach for it

Type `/vis-product-design`, or the agent reaches for it automatically when a task fits.

Type `/vis-product-design` when starting from a product idea, a screenshot or design image, a live URL, or an existing prototype, and you want reviewable responsive frontend output through a guided workflow instead of ad-hoc generation. Single intents like "audit this flow" or "clone this page" route to their mode directly.

## Common questions

**How is it different from `vis-product-web`?**
`vis-product-web` builds one complete web experience from requirements end to end. This suite covers the wider product-design lifecycle: it can start from existing surfaces (screenshots, URLs, prototypes), explore multiple directions before building, audit what exists, and prepare sharing, all through composable modes sharing one context.

**What does it refuse to do?**
It keeps project-specific content out of reusable structure: every varying value stays a `[PARAMETER]`, data object, or config value. Clone modes preserve source fidelity without inventing hidden behavior, and share never claims URLs that were not created.

**Does it work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The engagement starts from a normalized `PROJECT_CONTEXT` and modes pass it forward unchanged in meaning.
- Build outputs pass design-qa with P0/P1 defects fixed before delivery.
- Ideation produces genuinely distinct directions rather than recolors of one template.

## Where it fits

Workflow-suite lane of the design bucket: multi-mode product-design routing beside the single-pass builder `vis-product-web` and the reverse-engineering extractor `vis-reverse-ui`.
