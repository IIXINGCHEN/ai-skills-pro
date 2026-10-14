# Motion, Amber Glass

Durations marked 实测 come from the reference CSS; others are recommended
values tuned to the same feel.

## Confirmed (实测）

| 场景 | 参数 |
|---|---|
| Tooltip 出现 | `.18s ease-out` |
| Modal / 弹窗 | `.25s ease-out` |
| 通用淡入 | `.2s ease-out` |
| 装饰轨道旋转 | `orbitRotate var(--orbit-duration) linear infinite` |
| 主题切换 | View Transitions API（`mix-blend-mode: normal`） |
| 无障碍 | 全站支持 `prefers-reduced-motion` |

## Signature motions (observed + specified)

1. **Scroll reveal**, sections fade in with a 24px rise, `.6s ease-out`,
 siblings staggered 80ms. Content must be fully readable with JS off.
2. **Marquee**, logo strip, `30s linear infinite`; pause on hover; edge fade
 masks so items dissolve in/out.
3. **Connector-line flow**, a bright segment travels along the thin amber
 lines between hero code cards, `2–3s linear infinite`（估计）.
4. **Shiny text sweep**, the amber hero keyword gets a light band sweeping
 across on load and every ~6s（估计）: white/40 gradient, `1.2s ease`.
5. **Orbit**, decorative dashed rings rotate slowly (`20–40s linear
 infinite`, via `--orbit-duration`); dots ride the ring at low opacity.
6. **Button hover**, brightness +5%, `translateY(-1px)`, `.2s ease-out`.
7. **Card hover**, border warms to amber, `translateY(-4px)`, `.3s ease-out`.
8. **FAQ accordion**, height animation `.3s ease-out`; icon rotates 45°.
9. **Ambient glow**, background orbs breathe (opacity 0.6↔1, `6s ease-in-out
 infinite`)（估计）; keep subtle.

## Rules

- Nothing except marquee / orbit / glow loops longer than 1s.
- `prefers-reduced-motion: reduce` → all motion becomes instant; marquee
 becomes a static wrapped row.
- Reveal animations must not leave blank gaps if JS fails: default state is
 visible, JS adds the hidden-then-reveal.
- Stagger, don't cascade: max 4 staggered items per group, then cut off.
