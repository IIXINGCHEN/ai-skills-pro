---
name: vis-amber-glass
description: "Build a landing page in the warm-amber dark-glass style: deep warm-black backgrounds, one amber accent, floating glass pill nav, 24px+ radius cards, texture plus glow lighting, marquee / orbit / shiny-sweep motion. Use when the user asks for a premium dark SaaS, API or product landing page in this visual language, or names 'amber glass'. Pure layout and token system; contains no brand content."
---

# Amber Glass

A dark, premium landing-page style built on three ideas: **warmth** (amber on deep
warm-black, never pure black), **glass** (floating blurred panels), and **glow**
(texture plus ambient light from above). One accent color does all the talking.

**Done when:** a stranger can look at the page and name the three ideas above
without being told.

## 1. Set the tokens

Copy the core tokens from [`references/tokens.md`](references/tokens.md). Minimum
viable set:

- `--bg: #130c05` (dark) / `#fdfdf7` (light), warm, never `#000`
- `--fg: #ffffff`, `--fg-muted: #f5f0e899`, `--fg-subtle: #ffffffb3`
- `--accent: #d4841a` (dark) / `#b85c33` (light), the ONLY accent
- `--card: linear-gradient(180deg, #5a3715, #3e260e)`
- `--glass: #130c05b3` + `blur(20px)`
- radius: cards `24px`, large panels `35px`, buttons `9999px`, avatars `50%`

**Done when:** every color on the page resolves to a token, and there is exactly
one accent hue.

## 2. Stage the page skeleton

Build sections in this order (drop any that the brief does not need, keep the
order):

1. Disclaimer micro-strip (if legally needed), 12px, muted, centered
2. Floating glass pill nav, detached from the top edge, `blur(20px)`
3. Hero, two columns: copy left, overlapping glass code cards right
4. Logo marquee, label + infinite horizontal scroll of partner cards
5. Problem cards, centered eyebrow + title, 3 glass cards in a row
6. Advantage split, eyebrow with corner brackets + big title left, glass
 feature card right
7. Integration, code snippet, "change one line" framing
8. Pricing
9. Testimonials, avatar row, 50% radius
10. Blog cards
11. FAQ accordion
12. Footer, multi-column links + contact buttons
13. Floating contact rail, fixed right edge, vertical glass pill

Container: `max-width: 1300px`, centered. Section vertical rhythm `60–80px`.

**Done when:** the section order reads as problem → proof → price → trust.

## 3. Compose the hero

- Eyebrow (optional) → H1 (48–56px, 700, tight leading) → one-sentence
 sub (15–16px, muted) → two buttons → stat row (3 stats, thin dividers).
- Exactly **one** keyword phrase in the H1 gets the amber treatment. The
 signature move: wrap the key action in braces, e.g. `{一句话行动指令}`, braces plus amber, never a whole sentence in amber.
- Buttons: primary = amber fill + dark text (`#0d0806`), pill `9999px`;
 secondary = ghost (transparent + 1px border).
- Right column: two glass code cards, offset/stacked, joined by thin
 connector lines with flowing light.

**Done when:** the eye lands on the amber phrase first, the primary button
second, and nothing else competes.

## 4. Build the components

Follow [`references/components.md`](references/components.md) for exact specs:
glass nav, buttons, glass card, marquee item, code card + connector line,
stat row, section header, pricing card, testimonial, FAQ item, footer,
contact rail.

Rules that matter most:

- Cards: `24px` radius, top-edge amber highlight, content padding `32–40px`.
- Big translucent watermark icons inside cards are allowed, but keep them
 below 12% opacity so they never fight the text.
- Ghost buttons everywhere except the ONE primary action per viewport.

**Done when:** every component matches the reference spec within 2px, or the
deviation is written down as an intentional change.

## 5. Add motion

Implement [`references/motion.md`](references/motion.md): scroll reveals
(fade + 24px rise, `.6s ease-out`, 80ms stagger), marquee (`30s linear
infinite`, pause on hover), connector-line flow, shiny text sweep on the hero
keyword, orbit rotation for decorative rings, tooltip `.18s`, modal `.25s`.

- Honor `prefers-reduced-motion`: all motion collapses to instant state.
- Theme switch (if offered) uses the View Transitions API.

**Done when:** with motion disabled the page is fully readable, and with motion
on nothing moves for more than 1s except the marquee and orbit loops.

## 6. Light theme pass

Swap to the light column of the token table. Keep the amber accent, keep the
glass, keep the radius. Add a `1px` hairline border to cards, the light card
gradient (`#ece8e6 → #fbf9f5`) is too close to the paper background to stand
alone.

**Done when:** both themes pass the checklist below.

## Do / Don't

Do:
- Warm-black `#130c05`, never pure black; warm-paper `#fdfdf7`, never pure white.
- One amber accent; one primary button per viewport.
- Big radii (24px+), generous whitespace, centered section headers.
- Texture + top glow on dark surfaces.

Don't:
- Don't add a second accent hue (no blue links, no green success badges, use amber/neutral only).
- Don't put body text in amber; amber is for keywords, actions, and light.
- Don't use sharp corners (nothing below 8px except hairlines).
- Don't let watermark icons exceed 12% opacity.
- Don't ship a marquee without pause-on-hover and edge fading.

## Checkable Completion Criteria

- [ ] All colors resolve to tokens; exactly one accent hue exists.
- [ ] Nav is a floating glass pill, detached from viewport top.
- [ ] Hero H1 has exactly one amber keyword phrase (braces optional).
- [ ] Cards are 24px+ radius with top-edge highlight.
- [ ] Sections follow the skeleton order; container 1300px; 60–80px rhythm.
- [ ] Marquee pauses on hover; `prefers-reduced-motion` fully honored.
- [ ] Light theme has hairline card borders; both themes readable.
- [ ] No brand names, logos, or product copy from any reference site appear.
