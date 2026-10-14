---
name: pipe-poster
description: "Run the poster loop for one offer: brief, style, lexicon, render, proofread, Moments post, delivery. One gated, resumable run per poster."
disable-model-invocation: true
---

# Poster

`/pipe-poster <slug>` takes one business offer from a thin idea to a delivered **9:16 conversion poster** plus a matching compliant **WeChat Moments post**. It conducts three stage skills and owns the render, proofread, and delivery stages itself.

Stages: `prod-ad-brief` -> `vis-ad-style` -> `prod-ad-lexicon` -> render -> proofread -> Moments post -> deliver.

## Run directory

Everything for one run lives under `posters/<slug>/`:

- `brief.md`: the frozen Ad Brief (stage 1)
- `style.md`: the Style Spec (stage 2)
- `copy-lock.md` and `render-prompt.md` (stage 3)
- `poster-v<n>.png`: each render (stage 4); in real-photo mode also `cut/` (straightened photos) and `layout.json`
- `moments.md`: the Moments post (stage 6)
- `RUN.md`: stage, status, date, verdicts, and the path of the delivered render

Re-invoking `/pipe-poster <slug>` reads `RUN.md` and continues from the first incomplete stage.

## Stage 1: Brief

Call the Skill tool with "prod-ad-brief".

- Gate: the user confirms the brief; `brief.md` is `FROZEN`. This is the run's planned human gate (a render cap reached in stage 5 also escalates to the user - see below).

## Stage 2: Style

Call the Skill tool with "vis-ad-style".

- Done when `style.md` exists. Record the route in `RUN.md`.

## Stage 3: Lexicon

Call the Skill tool with "prod-ad-lexicon".

- Done when `copy-lock.md` and `render-prompt.md` exist. Record any slogan-energy calls in `RUN.md`.

## Stage 4: Render

Pick the mode from the brief's `Real photos` field and record it in `RUN.md`.

- **Real-photo composite** (the user supplied photos of the exact item sold, such as a used phone): follow [`references/real-photo-composite.md`](references/real-photo-composite.md). Straighten each photo with `scripts/cutout-rectify.py`, fill `layout.json` from `copy-lock.md`, and run `scripts/compose-product-poster.py`. No AI-generated product pixels.
- **AI render** (no real photos): generate the image at 9:16 from `render-prompt.md` with the harness's image tool. When the harness has no image tool, deliver `render-prompt.md` in place of the image and mark stages 4 and 5 `SKIPPED (no image tool)` in `RUN.md`.

Save each render as `poster-v<n>.png`.

- Done when `poster-v<n>.png` exists, or the skip is recorded.

## Stage 5: Proofread

Open the render and read every character against `copy-lock.md`. A render passes when the only text on the canvas is the locked copy, every character is exact and legible, and the value leap is the visual hero. Then open a 270px-wide thumbnail: the product name, condition, price, and action must each read at that size, the way a Moments feed shows it. In real-photo mode, also run the proofread list in `real-photo-composite.md`.

- On a fail, tighten `render-prompt.md` at the point that failed and return to stage 4. Cap: three renders; if the cap is reached without a passing render, stop and escalate to the user for a decision (redo the brief or abandon the run). Never auto-deliver a render with known defects.
- Done when a render passes, or the cap is reached and the user has decided what to do (record the decision and any named failures in `RUN.md`).

## Stage 6: Moments post

Write `moments.md` from `copy-lock.md` with [`references/moments-template.md`](references/moments-template.md), and run every line through the ad-law table in `prod-ad-lexicon`.

- Done when the post makes only the promises the poster makes, and contact details and service area are bracketed placeholders unless the brief holds real ones.

## Stage 7: Deliver

Hand over, with no preamble: the passing render, the Moments post ready to paste, and a three-line report.

```text
参考: <route> + <palette hex codes>
优化: <what the value leap shows; which hooks drive the action>
检查: 通过 | <failures from stage 5>
```

- Done when the three items are delivered and `RUN.md` shows every stage closed.

## Rules

- One offer per run. A new business or a new angle means a new slug.
- Every claim on the poster or in the post traces to a confirmed claim fact in `brief.md`, or, for product specs, to the manufacturer's official spec page for that region variant.
- 实物实拍 appears only when every product pixel comes from the user's own photos.
- When the user rejects a render twice on feel alone (不好看, 不和谐), ask one question that splits the direction (bold promo or quiet product detail?) before rendering again.
- A change to the brief after stage 1 reopens stage 1 and reruns every later stage.
