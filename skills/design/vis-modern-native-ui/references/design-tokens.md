# Design Tokens & Modern CSS Architecture (2026)

Authoritative token set and modern-CSS architecture rules. Every delivery copies this token foundation, adapts the brand-dependent values, and keeps the structure identical so reviews can diff against a stable baseline.

## 1. Token Foundation

```css
:root {
  /* 品牌色阶（采用 OKLCH 色彩空间以获得更自然的渐变与对比度） */
  --primary: oklch(0.62 0.22 25.5);
  --primary-hover: oklch(0.56 0.24 25.5);
  --primary-active: oklch(0.48 0.25 25.5);
  --primary-light: oklch(0.62 0.22 25.5 / 0.12);

  /* 中性色阶 */
  --bg-main: oklch(0.99 0.005 240);
  --bg-subtle: oklch(0.97 0.01 240);
  --bg-dark: oklch(0.18 0.03 260);
  --text-primary: oklch(0.15 0.02 260);
  --text-secondary: oklch(0.42 0.03 260);
  --text-muted: oklch(0.65 0.02 260);
  --border-color: oklch(0.91 0.01 240);

  /* 尺寸与圆角系统 */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* 高级光影系统 */
  --shadow-card: 0 2px 8px -2px oklch(0.15 0.02 260 / 0.08);
  --shadow-overlay: 0 16px 32px -8px oklch(0.15 0.02 260 / 0.16);

  /* 动效令牌 */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* 流式排版（Fluid Typography） */
  --font-hero: clamp(2.25rem, 4.5vw + 1rem, 3.5rem);
  --font-section: clamp(1.5rem, 2.5vw + 1rem, 2.25rem);
  --font-card: 1.125rem;
  --font-body: 1rem;
  --font-caption: 0.875rem;

  /* 布局尺寸 */
  --nav-height: 64px;
  --container-max: 1200px;
  --container-padding: 24px;
  --section-gap: 80px;
}
```

Token names stay fixed; channel values derive per project, so components never re-declare raw values.

## 1a. Brand Derivation (the defaults above are starting points, never destinations)

1. When the user supplies a brand color, convert it to OKLCH and read its L, C, H channels as the base.
2. Without an explicit color, pick the hue from the domain mapping and keep chroma restrained at roughly 0.14 to 0.20 for a premium feel; neon-grade chroma above 0.25 reads cheap outside gaming contexts.

| Domain | Base hue hint | Neutral treatment |
| :--- | :--- | :--- |
| Fintech, enterprise, trust-heavy | blue (240 to 260) | cool tint, low chroma |
| Health, wellness, sustainability | green (140 to 165) | warm off-white surfaces |
| AI, developer tools, SaaS | violet to indigo (270 to 290) | pairs well with the dark scheme |
| Commerce, food, lifestyle | warm orange to red (25 to 60) | watch contrast on light backgrounds |
| Creative, media, youth brands | magenta to pink (320 to 350) | tolerates higher chroma accents |

3. Derive the interaction ladder mechanically: hover lowers lightness by roughly 0.06, active by roughly 0.14, hue held constant; build `--primary-light` from the base with alpha 0.12.
4. Tint neutrals toward the brand hue (shared H channel, chroma 0.01 to 0.03) so surfaces feel cohesive rather than gray-generic.
5. Typography mood follows the same input: geometric sans for tech and data products, humanist sans for consumer warmth, serif display for editorial or luxury tones; weights stay within 400 to 700 and letter spacing stays at 0.
6. Radius and density derive from personality too: enterprise tools favor `--radius-sm` and compact spacing; consumer lifestyle favors `--radius-lg` and generous breathing room.
7. Set the rhythm ladder per role: display and section titles carry weight 600 to 700 with line height 1.2 to 1.3; body runs weight 400 at 1.5 to 1.7; captions lower opacity instead of adding colors; long-form measure caps near 65ch.
8. Respect the color budget: exactly one primary, at most two supporting accents, and a neutral scale of six steps or more; text draws only from the neutral scale, pure #000 paired with #fff stays out, and the primary appears solely on key emphasis such as the primary button, active states, and critical data.
9. Keep geometric motion on transform and opacity, hold durations at 150 to 200ms on the standard cubic-bezier easing, and never animate layout properties such as width, top, or margin. Short state transitions may use color, background-color, and border-color.

## 2. Dark Scheme Override

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-main: oklch(0.18 0.03 260);
    --bg-subtle: oklch(0.23 0.03 260);
    --text-primary: oklch(0.98 0.005 240);
    --text-secondary: oklch(0.82 0.01 240);
    --text-muted: oklch(0.62 0.02 240);
    --border-color: oklch(0.30 0.03 260);
    --shadow-card: 0 2px 8px -2px oklch(0 0 0 / 0.4);
  }
}
```

## 3. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Verify: every animation and transition degrades instantly under the OS reduce setting.

## 3a. Detail Tokens

Selection highlight follows the derived primary instead of the UA default blue:

```css
::selection {
  background: color-mix(in oklab, var(--primary) 20%, transparent);
}
```

Input focus pairs the outline idea with a soft primary glow; error and success border colors come from dedicated state tokens rather than raw hex sprinkles.

## 4. Cascade Layer Order

Declare layers as the very first style statement, then place every rule inside its layer:

```css
@layer reset, base, components, utilities;
```

- `reset`: the universal margin, padding, and box-sizing reset.
- `base`: element defaults, `:root` tokens, and the scheme and motion media overrides above.
- `components`: all classed UI blocks and their nested states.
- `utilities`: single-purpose overrides that win last without specificity fights.

Verify: zero rules live outside a layer, with the sole exception of the layer declaration itself.

## 5. Standard CSS Nesting

Use native nesting for component scoping instead of flat repeated selectors:

```css
.card-shell {
  container: card-shell / inline-size;

  & > .card {
    border-radius: var(--radius-md);
  }

  & > .card:hover {
    box-shadow: var(--shadow-card);
    transform: translateY(-2px);
  }

  @container card-shell (min-width: 420px) {
    & > .card {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  }
}
```

Keep nesting depth at three levels or fewer so specificity stays predictable.

## 6. Hard Requirements: Container Queries, Subgrid, :has()

### Container Queries

Every repeatable card wrapper establishes the containment context, and the query styles a child card. A container never queries itself; viewport media queries handle page-level rearrangement only.

```css
.feature-card-shell {
  container: feature-card / inline-size;
}

@container feature-card (min-width: 420px) {
  .feature-card-shell > .feature-card {
    grid-template-columns: auto 1fr;
  }
}
```

Verify: every `@container` resolves against an eligible ancestor and no card-level layout depends solely on viewport width.

### Subgrid

Card grids align internal rows across siblings by spanning the parent tracks:

```css
.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.plan {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 4; /* 标题 / 描述 / 列表 / 底部按钮 各占一行 */
}
```

Verify: same-row card titles, descriptions, and footer buttons share baselines regardless of copy length.

### :has()

Express parent-state logic in CSS and delete the JavaScript that previously managed it:

```css
/* 选中的定价卡片高亮父容器 */
.plan:has(input:checked) {
  border-color: var(--primary);
  box-shadow: var(--shadow-card);
}

/* 字段校验失败时提示其所在表单行 */
.form-row:has(:user-invalid) .form-hint {
  color: var(--primary-active);
}
```

Verify: interactive parent-state styling ships without DOM class juggling in JS.
