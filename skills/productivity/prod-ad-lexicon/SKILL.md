---
name: prod-ad-lexicon
description: "Translate a frozen Ad Brief and Style Spec into exact words: a Copy Lock of seven length-bounded poster fields that pass PRC Advertising Law wording rules, and a render prompt written in image-model vocabulary. Use when fuzzy wishes like 高级感, 点击欲, or 吸引人 must become precise visual or interaction terms, or when ad copy must be made compliant."
---

# Ad Lexicon

Say every requirement **precisely** in the two languages that matter: the customer's language (compliant Chinese copy) and the image model's language (visual terms it renders reliably). The outputs are a **Copy Lock** and a **render prompt**; the poster carries the locked words and no others.

## 1. Read the inputs

Read `posters/<slug>/brief.md` (status `FROZEN`) and `posters/<slug>/style.md`. When either is missing, call the Skill tool with "prod-ad-brief" or "vis-ad-style" first.

**Done when:** both files are loaded and the brief is `FROZEN`.

## 2. Translate fuzzy words

Find every fuzzy wish in the brief and the user's messages (高级感, 有冲击力, 按钮想点) and replace it with its precise term from [`references/visual-terms.md`](references/visual-terms.md). A wish with no row gets a new precise term you define in one line and record in `posters/<slug>/visual-terms.local.md` (project-local). Never edit the skill's shipped `references/visual-terms.md` at runtime: it is a versioned global artifact, and per-project additions would pollute every other project.

**Done when:** every mood or feel word in the inputs maps to a concrete, renderable term.

## 3. Lock the copy

Fill the seven fields in [`references/copy-lock.md`](references/copy-lock.md) within their limits, then run each field through [`references/ad-law-terms.md`](references/ad-law-terms.md). Write the result to `posters/<slug>/copy-lock.md`.

**Done when:** all seven fields are within limits, every claim traces to a confirmed claim fact in the brief, and no field holds a term from the ad-law swap table's left column.

## 4. Write the render prompt

Build the prompt from the Render prompt template in `references/copy-lock.md`, filling it with the Style Spec tokens, the precise terms from step 2, and the locked copy from `posters/<slug>/copy-lock.md` pasted verbatim in quotes. Write it to `posters/<slug>/render-prompt.md`.

In real-photo mode (the brief holds real photos of the item), write `posters/<slug>/layout.json` from the locked copy instead, following `pipe-poster`'s `references/real-photo-composite.md` and its `references/layout-example.json` schema; no render prompt is needed.

**Done when:** the prompt names positions with plain words (top, middle, lower, bottom), quotes every locked string exactly, and ends with the only-text clause defined in the "Render-safe wording" section of `references/visual-terms.md`.

## Checkable Completion Criteria

- [ ] Every fuzzy wish was mapped to a precise term.
- [ ] `copy-lock.md` holds seven fields, each within its limit and compliant.
- [ ] Every number, price, speed, or licence in the copy is a confirmed claim fact.
- [ ] Every product spec on the canvas matches the official spec page for the unit's region variant.
- [ ] `render-prompt.md` (or `layout.json` in real-photo mode) quotes the locked copy verbatim and carries the only-text clause.
