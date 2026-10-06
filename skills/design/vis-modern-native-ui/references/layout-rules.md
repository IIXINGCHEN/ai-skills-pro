# Hard Layout Rules

Ten rules govern every delivery. Apply them while coding and re-verify against them before claiming completion.

1. **Global reset**: include `* { margin: 0; padding: 0; box-sizing: border-box; }` as the first rule inside `@layer reset`. Verify: the reset precedes every other style rule.
2. **Spacing sources**: parent `padding` plus flex and grid `gap` carry component and section spacing. The sole layout-margin exception is `margin-inline: auto` for centering a constrained page container. Use transforms, alignment, or grid placement for optical overlap and baseline adjustment. Verify: every nonzero margin is the documented auto-centering exception.
3. **8px grid**: spacing values draw from 4, 8, 12, 16, 24, 32, 48. Verify: no arbitrary pixel values appear in paddings, margins, or gaps.
4. **Baseline alignment**: mixed font sizes align on the text baseline; equal-tier content centers inside its own container; long paragraphs cap their measure around 65ch. Verify: hero title and subtitle rows align by baseline and no paragraph runs past the measure cap.
5. **Image fill**: fixed containers give their images `width: 100%; height: 100%; object-fit: cover; display: block;` and hold a background-color placeholder underneath. Verify: no letterboxed whitespace sits inside image frames.
6. **Fixed-nav offset**: main content reserves `--nav-height` (64px) plus 24px breathing room at the top. Verify: scrolled content never slides behind the navigation bar.
7. **Page container**: `max-width: var(--container-max); margin-inline: auto;` centers the shell; inner text defaults to left alignment; centering stays reserved for hero-style emphasis blocks.
8. **Unified padding**: desktop 24px and mobile 16px on all four sides; individual sections add no extra padding of their own; vertical rhythm between sections rides `--section-gap` (48 to 80px) and parallel elements share one gap value with nothing touching the container edges.
9. **Navigation bar, when present**: fixed navigation reserves a 64px track, places identity and applicable actions according to the confirmed architecture, reveals active underlines with `transform: scaleX()`, and uses short color-state transitions. When links collapse on mobile, the disclosure control toggles `aria-expanded` and its panel opens with transform plus opacity.
10. **WebKit scrollbar**: custom styled, 8px wide, track `var(--bg-subtle)`, thumb in the primary color at 60% alpha turning fully opaque on hover.

## Mobile Pass

Close every delivery with this sweep: no horizontal scrolling, 16px side padding, tap targets of at least 44px, and any collapsed navigation opens, closes, and reports state through `aria-expanded`.
