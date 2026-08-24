# Design System Reference

Token menus supporting SKILL.md steps 4 through 9. Projects adopt what applies; nothing here is mandatory filler.

## Color Tokens

```css
--color-primary / --color-secondary / --color-accent
--color-background / --color-surface / --color-surface-elevated
--color-text-primary / --color-text-secondary / --color-text-muted
--color-success / --color-warning / --color-danger / --color-info
--color-border / --color-shadow / --color-glow
```

Status or category themes remap only the working subset (`--accent`, `--surface`, `--gradient`, `--glow`) under `.theme-[KEY]`; the base system stays untouched and every component keeps reading the same token names.

## Typography Roles

Display, Heading, Subheading, Body, Caption, Label, Number, Data. Numeric roles optimize size, weight, letter spacing, tabular alignment, unit styling, and trend indicators so metrics read at a glance and anchor the visual focus in data-heavy products.

## Component Roster (select per project)

Header, Navigation, Hero, Search, Filter, Card, List, Table, Chart, Stat, Form, Modal, Tooltip, Empty State, Loading State, Error State, Footer, plus domain-specific components. Each component owns Structure, Style, State set, Interaction behavior, Responsive rules, and Animation; similar components share rendering paths instead of duplicated HTML.

## Icon System

Prefer SVG sets, CSS drawing, an icon library, or custom SVG with unified stroke width, weight, size, corner radius, optical alignment, and animation behavior. Emoji stay out of core UI unless the brand explicitly calls for them.

## Motion Tokens

```css
--motion-fast / --motion-base / --motion-slow      /* durations */
--ease-standard / --ease-entrance / --ease-exit    /* easing curves */
```

Animate opacity, transform, scale, translate, rotate, filter, blur, gradient positions, and SVG paths. Hover language example: a slight translateY lift paired with shadow depth, border tint, background shift, and icon micro-motion. Intensity follows `[MOTION_INTENSITY]`: restrained for productivity surfaces, richer for brand moments.

## Material Styles

Solid, Glass, Frosted Glass, Soft Surface, Editorial, Metallic, Paper, Dark Surface, Transparent, Layered. Materials serve hierarchy: mix deliberately, control blur, opacity, border, shadow, gradient highlight, and noise per surface role.

## Background Systems

Solid, Gradient, Radial Light, Ambient Glow, Grid, Noise, Pattern, Image, Illustration, Spatial Layer. Backgrounds support content and never compete with primary information.

## Accessibility Baseline

Semantic landmarks, ARIA on non-obvious controls, full keyboard reachability, visible focus rings, contrast that passes readability thresholds, `prefers-reduced-motion` downgrades for non-essential animation.

## Performance Rules

Prefer transform, opacity, CSS animation, SVG, pseudo-elements, and Canvas for dense generative visuals. Avoid DOM bloat, repeated forced layout, high-frequency JavaScript animation loops, and pointless repaints.
