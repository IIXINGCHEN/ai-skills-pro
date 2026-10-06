# Apple Portfolio Token Derivation and Interaction Contract

Reference values demonstrate structure only. Every delivered palette, font mood, surface contrast, cover pairing, and density choice must be regenerated from the current user's brand input and portfolio context.

## 1. Derive the Theme

1. Start with a supplied brand color. When none exists, choose one domain-appropriate hue and record the rationale.
2. Generate separate light and dark token objects matching `data-contract.json`: `bg`, `bgElevated`, `bgCard`, `bgCardHover`, `border`, `borderStrong`, `text`, `textSecondary`, `textTertiary`, `accent`, and `accentGlow`.
3. Keep one dominant accent. Project-cover pairs may vary by project category, but stay inside the same derived visual system.
4. Verify WCAG AA contrast for body text, controls, focus rings, and status content in both themes.
5. Use six- or eight-digit hex values because the schema and runtime reject other color syntax.

Completion test: every token is schema-valid, both themes pass contrast checks, and no value was copied from the reference fixture.

## 2. Typography and Shape

- Choose the `fontMood` value from `system`, `editorial`, or `technical` based on the user's stated tone.
- Use self-contained system stacks. Do not fetch external fonts.
- Set letter spacing to `0` throughout.
- Use hero type only in the true hero. Keep panel and card headings compact enough for their containers.
- Keep general card, panel, button, and overlay radii between 4px and 8px. Pill radii are reserved for status chips and the Dynamic Island trigger.
- Keep body measure at or below 65ch and preserve a clear 1.5 to 1.7 body line-height.

Completion test: the longest localized name, role, project title, and button label fit at 390px without clipping or horizontal scroll.

## 3. Dynamic Island Disclosure

- Place a native button in the fixed navigation center with `aria-expanded` and `aria-controls`.
- Expose a separate status disclosure below the trigger. Transition only opacity, transform, and visibility.
- Close on outside click, Escape, or quick-link activation. Escape restores focus only when the disclosure was open.
- Keep the trigger at least 44px tall and retain a visible focus ring.

Completion test: keyboard-only users can open, traverse, close, and recover focus without a trap or unexpected redirect.

## 4. Motion Budget

- Use transform and opacity for geometric motion.
- Keep ordinary transitions between 150ms and 200ms with the shared `cubic-bezier(0.16, 1, 0.3, 1)` curve.
- Project tilt is limited to 6 degrees and runs only for fine pointers.
- Timeline entries reveal once through `IntersectionObserver`; reduced-motion users receive the final state immediately.
- The marquee and equalizer stop under `prefers-reduced-motion`.

Completion test: no motion changes layout geometry, all nonessential animation is disabled under reduced motion, and scrolling stays smooth at mobile and desktop viewports.

## 5. Media and Rendering Boundaries

- Require a user-supplied or approved portrait and project screenshots with localized alt text.
- Accept only schema-valid HTTPS/HTTP media or supported inline image data URLs.
- Render strings with DOM text nodes or `textContent`; configure links through the scheme allow-list; constrain cover colors to schema-valid hex tokens.
- Serialize `SITE_DATA` as JSON and encode `<` as `\u003c` before placing it in the `application/json` script block.

Completion test: malicious markup remains text, unsafe schemes fail schema validation, external links use `noopener noreferrer`, and failed images leave the derived cover fallback visible.
