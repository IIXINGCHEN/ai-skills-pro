# vis-apple-portfolio: Apple-Grade Personal Portfolio & Landing Page Generator

## Overview

`vis-apple-portfolio` provides an automated design pipeline for generating Apple-grade personal websites, developer portfolios, and executive brand landing pages. It features an integrated dynamic island capsule, bento grid layout, career timeline, interactive project cards, dual theme toggle (dark/light), and complete bilingual (ZH/EN) support.

## Key Features

- **Integrated Dynamic Island**: Floating top navigation capsule featuring real-time status, live timezone clock, music equalizer animation, and interactive quick action anchors.
- **Strict Data-View Decoupling**: All content and theme values reside in a validated `SITE_DATA` structure. Renderers escape markup, constrain URLs and colors, and keep the HTML skeleton content-agnostic.
- **Bento Grid & Career Timeline**: Modular cards for supplied flagship cases, a live local clock, verified metrics, and reduced-motion-safe milestone reveals.
- **Dual Themes & High Polish**: User-derived light and dark tokens, restrained surface elevation, accessible focus states, and fine-pointer project tilt.
- **Zero Build Step**: Outputs a self-contained `index.html` that can be hosted directly on any static web provider or embedded in Notion pages.

## File Structure

```text
skills/design/vis-apple-portfolio/
├── SKILL.md                          # Skill entry point and operational manual
├── agents/
│   └── openai.yaml                   # Codex/OpenAI interface metadata
└── references/
    ├── template.html                 # Production-ready single-file HTML/CSS/JS template
    ├── data-contract.json            # JSON schema for user profile and content data
    └── design-tokens.md              # Design system tokens, color palettes, and motion curves
```

## Usage

When invoked, the agent gathers user-provided background facts (name, title, projects, timeline, articles, links), asks rather than inventing missing claims, derives visual tokens from the user's context, validates the result against `data-contract.json`, and synthesizes a fully customized `index.html` with no reference values left behind.
