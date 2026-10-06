# Component Specifications

## Buttons

Three tiers: `.btn-primary`, `.btn-secondary`, `.btn-text`.

Shared spec: height 44px, radius `var(--radius-sm)`, horizontal padding 24px, `white-space: nowrap` so labels never wrap.

| State | Treatment |
| :--- | :--- |
| hover | deepen toward `--primary-hover`, lift `translateY(-1px)` |
| active | `transform: scale(0.98)` |
| focus-visible | 2px outline with 2px offset |
| disabled | reduced opacity, `cursor: not-allowed`, no hover motion |
| loading | inline SVG spinner replaces or precedes the label; pointer events blocked |

```css
.btn-primary {
  min-height: 44px;
  padding-inline: 24px;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: var(--bg-main);
  transition: background-color var(--transition-fast), transform var(--transition-fast);
  white-space: nowrap;

  &:hover { background: var(--primary-hover); transform: translateY(-1px); }
  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  &[data-loading] { pointer-events: none; }
}
```

## Icon System

Inline SVG only; icon fonts and raster icon images stay out.

- Size follows the text: `width: 1.2em; height: 1.2em`.
- Color inherits: `stroke="currentColor"` or `fill="currentColor"`.
- Spacing comes from the wrapper: flex with `gap: 8px`, never margins.
- Stroke style: 1.5px lines, round caps and joins, `fill="none"` unless solid by design.
- Accessibility: decorative icons carry `aria-hidden="true"`; icon-only controls carry `aria-label`.

```html
<button class="btn-primary">
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor"
       stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
  <span>立即开始</span>
</button>
```

## Card System & Layered Composition

Cards are the default composition unit for feature grids, pricing tiers, article lists, stat rows, and dashboards.

Every card carries the four-part anatomy:

- Surface: `var(--bg-main)` on a subtle canvas, or `var(--bg-subtle)` on the main canvas.
- Border: 1px `var(--border-color)` hairline; radius from the token ladder (`--radius-md` default).
- Elevation: rest state `var(--shadow-card)`; interactive cards rise to `translateY(-2px)` with `var(--shadow-overlay)` through `transition: transform var(--transition-normal)`.
- Rhythm: internal padding from the 8px grid (24px desktop, 16px mobile); 24px gaps between cards.
- Copy discipline: optional media sits on top, then title, description, and action zone in that order; titles clamp to one line through `text-overflow: ellipsis`, descriptions clamp to three lines through `line-clamp: 3`, keeping sibling rows level.

Stacking patterns, chosen by content hierarchy:

- **Uniform grid**: equal-width cards in `repeat(auto-fit, minmax(280px, 1fr))` with internals aligned through Subgrid.
- **Bento stack**: mixed spans where exactly one flagship card earns double size; information hierarchy decides the span, decoration never does.
- **Overlap layering**: when the confirmed design needs one focal overlap, use grid placement or a transform bounded to one grid unit plus an elevated shadow. Avoid negative margins.

Verify: sibling cards align titles and footers across the row (Subgrid holds), each card adapts through its own `@container`, and no card nests more than three box levels deep.

## Hero Code Window

When the brief includes a product screenshot of code:

- Surface `oklch(0.18 0.03 260)` with radius `var(--radius-md)` and `var(--shadow-overlay)`.
- macOS control dots in red, yellow, and green as pure CSS circles.
- Monospace stack `Fira Code, Cascadia Code, Consolas, monospace`.
- Semantic highlight classes (`.tok-key`, `.tok-str`, `.tok-ok`) instead of hardcoded hex sprinkles; success lines tint green.

## State Console (only for asynchronous or mutable data)

When the confirmed experience loads or mutates data, expose its applicable states through one `data-state` attribute on the owning region:

- `loading`: skeletons driven by a linear-gradient shimmer animation.
- `empty`: inline SVG illustration, one-line explanation, guidance button, all sourced from `APP_CONFIG.states.empty`.
- `error`: friendly message plus a retry button wired to re-render.
- `success`: the fully rendered real content, with action outcomes surfaced as a toast or inline hint so submissions never land silently.

CSS owns visibility and transition (opacity and transform); JavaScript only flips the attribute. Verify: switching states never reloads the page and each switch animates smoothly.

## Native Behavior Layer

- **Modal, when applicable**: native `<dialog>` with `.showModal()` and `.close()`; the platform provides top-layer focus containment and Escape cancellation. Add explicit backdrop-click logic that closes only when `event.target === dialog`, remember the trigger before opening, and restore focus on `close`. Animate opacity plus scale only. Verify: no custom focus trap exists, backdrop click is tested, and close returns focus to the opening control.
- **Popover**: the `popover` attribute with `popovertarget` for menus and lightweight confirmations; top-layer rendering removes z-index management.
- **Accordion**: `<details name="faq">` yields exclusive-open behavior natively; style `summary` and rotate its marker via `details[open]`. Verify: opening one FAQ entry closes its siblings with no JS involved.
- **Forms**: labels sit above inputs with left edges aligned; input height matches button height (44px); required fields carry a visible marker; focus shows a primary border with a soft outer glow; errors show a red border plus a message through `role="alert"`; success shows a green border plus a check SVG; submission feedback lands as a toast or inline hint, never silence. Constraint validation (`required`, `type="email"`, `pattern`) with `:user-invalid` styling carries the logic; JavaScript only enhances messages.

```html
<form>
  <label for="email">邮箱 <span aria-hidden="true">*</span></label>
  <input id="email" type="email" name="email" required placeholder="you@example.com">
  <p class="form-error" role="alert">请输入有效邮箱地址。</p>
</form>
```

```css
input:user-invalid {
  border-color: var(--primary-active);
}

input:user-valid {
  border-color: oklch(0.62 0.15 150);
}

input:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 25%, transparent);
}

.form-error { display: none; }
input:user-invalid ~ .form-error { display: block; }
```
