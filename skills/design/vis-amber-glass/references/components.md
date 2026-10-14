# Components, Amber Glass

All measurements from the reference CSS unless marked （估计）.
Placeholders like `你的产品` stand for the user's own product, never copy
reference-site copy.

## 1. Floating glass pill nav

- Detached pill, centered, `max-width` within the 1300px container; does NOT
 touch the viewport top (margin-top ~16–24px, 估计）.
- `background: var(--glass)` (`#130c05b3`), `backdrop-filter: blur(20px)`,
 `border-radius: 35px`, 1px hairline border (`#ffffff14`-ish, 估计）.
- Left: logo mark + wordmark. Center: nav links (15px, muted; active link in
 amber). Right: icon buttons (language, theme) + ghost "secondary action" +
 amber "primary action".
- Stays on scroll (sticky). On mobile collapses to logo + menu button.

## 2. Buttons

- Primary: amber gradient fill (`#f3bc85 → #a65f18`), dark text `#0d0806`,
 `border-radius: 9999px`, padding ~12px 28px（估计）, font-weight 600.
- Secondary (ghost): transparent, 1px border (`#ffffff2e`-ish, 估计）,
 muted-white text, same pill radius.
- Exactly one primary per viewport. Hover: brightness +5%, translateY(-1px).

## 3. Hero

- Grid: copy 55–60% / visual 40–45%（估计）, gap ~48px（估计）.
- Copy stack: eyebrow → H1 (48–56px/700) → sub (muted, max ~52ch) →
 button row → stat row.
- Signature emphasis: wrap the ONE key action phrase in braces +
 amber: `{改一行配置，即刻调用}`. Never color a whole sentence.
- Stat row: 3 stats, value (20–24px/700, 估计） over label (12px muted),
 separated by 1px vertical dividers.
- Visual: two overlapping glass code cards (dark card, mono font,
 syntax tinted amber/green), joined by thin connector lines with flowing
 light (see motion.md).
- Background: texture image at low opacity + radial amber glow from top
 center (`blur(61px)`–`blur(153px)` orbs).

## 4. Glass card (default)

- `border-radius: 24px`; `background: linear-gradient(180deg, #5a3715, #3e260e)`.
- Top-edge highlight: 1px inner lighter border on top (the "light from above").
- Padding `32–40px`; card title 20–24px/600, body 15px muted.
- Optional watermark icon: large, ≤12% opacity, bottom-right, never behind
 the title.
- Hover: border warms toward amber, translateY(-4px), `.3s ease-out`.

## 5. Section header (centered)

- Eyebrow (12–13px muted, e.g. "你是不是也遇到了？") → Title 40px/600
 with ONE amber keyword → one-line sub in muted.
- `margin-bottom: 16–24px` under the title; section padding 60–80px.
- Variant: split header, eyebrow with corner brackets `⌐ ¬` + left-aligned
 big title, feature card on the right.

## 6. Logo marquee

- Row: small label (muted, 13px) + infinite horizontal scroll of partner
 cards.
- Each item: glass pill (`9999px` or 16px, 估计）, logo 24–32px（估计） +
 name 14px, gap 16–24px.
- Edge fade masks on both sides; pause on hover; duplicate list for the
 seamless loop.

## 7. Code card + connector lines

- Dark glass panel, `16px` radius, mono 13–14px, line-height 1.7–1.9.
- Syntax colors: keywords/bone white, strings amber `#d4841a`, functions
 blue-green tint, comments dim, success check green.
- Connector lines: 1px amber at ~40% opacity with a brighter segment that
 travels along the line (flow animation).

## 8. Pricing card

- 3-column grid on desktop, stacks on mobile. Middle (recommended) card:
 amber border / slightly larger / amber "推荐" tag.
- Price: 40–48px/700 (估计） + 周期小字； feature list with amber checks;
 primary button at the bottom.

## 9. Testimonial

- Card 24px; quote 15–16px; footer: 48px round avatar (`50%`) + name 14px/600
 + role 12px muted. 2–3 columns grid.

## 10. FAQ accordion

- Items separated by 1px hairlines; question 16–17px/500, plus/minus icon
 in amber; answer muted, height animation `.3s ease-out`. First item open
 by default.

## 11. Footer

- 4–5 columns: brand blurb + link columns + contact buttons; bottom bar with
 copyright + legal links, 12–13px muted.

## 12. Floating contact rail

- Fixed right edge, vertically centered: vertical glass pill (`35px` radius,
 `blur(20px)`), 2–3 round icon buttons (48–56px, 估计） with 10–11px labels
 underneath. Hidden on <768px or collapsed to one button.

## 13. Disclaimer micro-strip (optional)

- Only when legally needed: full-width 32–36px strip above the nav, 12px
 muted centered text.
