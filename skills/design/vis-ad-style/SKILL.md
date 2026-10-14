---
name: vis-ad-style
description: "Route a frozen Ad Brief to one visual style and write it down as a Style Spec: style route, palette tokens with hex codes, type, canvas zone map, and the value-leap hero scene. Use when choosing the look of a poster, social ad, or promo image, or when the user names a style such as Swiss Grid, Bento, or editorial collage."
---

# Ad Style

Turn the brief into **one committed look**. The output is a **Style Spec**: every visual decision the render needs, stated as tokens and positions rather than adjectives. Premium editorial restraint earns trust; the **value leap** (problem object turning into the reward) earns the action.

## 1. Read the brief

Read `posters/<slug>/brief.md`. It must be `FROZEN`; when it is not, call the Skill tool with "prod-ad-brief" first, then re-read `brief.md` and confirm its status is `FROZEN`, if it is still not frozen, stop and do not continue.

**Done when:** you hold the offer line, the reward, the channel, and the mood.

## 2. Route the style

Pick one route from [`references/style-routes.md`](references/style-routes.md) using its routing table. A style the user named wins over the table. When the brief holds real photos of the item, the route is Studio Real-Product, and the zone map comes from `pipe-poster`'s `references/real-photo-composite.md`.

**Done when:** one route is chosen and the reason is one sentence tied to the brief.

## 3. Set the tokens

Choose the base and one accent color from the route's palette, the type pairing, and the texture set. Write them as tokens (`--accent: #FF5500`).

**Done when:** every color is a hex token, and exactly one accent carries the reward word, the badge, and the button.

## 4. Stage the value leap

Write the hero scene as one sentence: the problem object, the transformation, the reward props, the light. Use the scene patterns in `style-routes.md`.

**Done when:** the reward is the brightest, glossiest element in the sentence and the problem object is its starting point.

## 5. Write the Style Spec

Fill [`references/canvas.md`](references/canvas.md) into `posters/<slug>/style.md`: route, tokens, type, zone map, hero scene.

**Done when:** `style.md` exists and a stranger could sketch the poster from it without the brief.

## Checkable Completion Criteria

- [ ] The brief was `FROZEN` before routing.
- [ ] One route, with a one-sentence reason.
- [ ] All colors are hex tokens; one accent only, plus at most one functional color.
- [ ] The hero scene stages a value leap.
- [ ] `posters/<slug>/style.md` follows the canvas template.
