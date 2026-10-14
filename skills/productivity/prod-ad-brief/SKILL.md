---
name: prod-ad-brief
description: "Pin down what an ad must sell before any design work: offer, customer, pain, reward, single action, channel, and the provable facts behind every claim, frozen as an Ad Brief. Use when the user wants a poster, promo image, social ad, or ad copy and the offer is thin or unclear."
---

# Ad Brief

Settle **what the ad sells** before anyone picks a look or writes a word. The output is a frozen **Ad Brief**: the one source every later stage (style, lexicon, render, copy) reads from. A thin input ("回收烂手机") is normal; this skill turns it into a brief a designer could execute without asking again.

**Pipeline working root:** this skill, `vis-ad-style`, and `prod-ad-lexicon` form one pipeline. Its working root is the current project root (where you were invoked); every `posters/<slug>/` path below is relative to that root. Confirm the root once at the start and use it for all reads and writes.

## 1. Draft the brief from what you have

Fill every field in [`references/ad-brief-template.md`](references/ad-brief-template.md) from the user's input and the most plausible conversion logic for that business. Mark each field `stated` (the user said it) or `inferred` (you filled it).

**Done when:** every field holds a value, each tagged `stated` or `inferred`.

## 2. Ask only the outcome-altering gaps

Call the Skill tool with "prod-briefing-loop" to run **only its Phase 1 (Clarification) and Phase 2 (Playback Brief)**, stop at Phase 2 and do NOT enter Phase 3 (Authorized Execution): the brief freezes in step 3 below, and nothing is generated before the freeze. Use the question bank in [`references/question-bank.md`](references/question-bank.md). Ask about the `inferred` fields that would change the poster or create a legal claim: real prices, real speed promises, licences, the contact action. For one specific product (a used phone, a single unit), also confirm the condition, the warranty, the stock count, whether a time-limited price really expires, and whether real photos of the unit exist. Leave the rest inferred.

**Done when:** every **claim fact** (price, speed, guarantee, licence, partnership) is either confirmed by the user or removed from the brief.

## 3. Freeze

Play the brief back in one block and wait for the user's explicit confirmation. Write the confirmed brief to `posters/<slug>/brief.md` with status `FROZEN` and the date.

**Done when:** `brief.md` exists with status `FROZEN` and the user's confirmation is recorded in it.

## Checkable Completion Criteria

- [ ] Every field in the template is filled and tagged `stated` or `inferred`.
- [ ] Every claim fact is user-confirmed or absent.
- [ ] The offer reads as one line: "customer with pain X takes action Y and gets reward Z".
- [ ] `posters/<slug>/brief.md` is `FROZEN` with the confirmation recorded.
