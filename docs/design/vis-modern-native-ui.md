# vis-modern-native-ui

## What it does

Runs a two-phase frontend UI build under 2026 web standards. Phase 1 presents an ASCII wireframe with container-query and subgrid annotations plus an APP_CONFIG data schema blueprint, then stops for explicit confirmation. Phase 2 emits one production-grade single-file HTML/CSS/JS page featuring OKLCH design tokens, cascade layers with standard CSS nesting, native dialog/popover/details behaviors, strict data-driven rendering, complete loading/empty/error/success states, and an appended self-check list.

## When to reach for it

Type `/vis-modern-native-ui` when you want a web page or product UI built through a prototype-first confirm-then-code gate, or when the brief names the 2026 modern native tech stack: OKLCH, Container Queries, Subgrid, :has(), @layer, native form and overlay primitives, zero frameworks, zero build tools.

## Common questions

**How is it different from vis-product-web?**

vis-product-web runs an eleven-step pipeline straight to a finished experience without a confirmation gate. This skill hard-gates delivery: nothing renders until the wireframe and schema are confirmed, and the output conforms to a stricter 2026 native-CSS contract including OKLCH tokens, container queries, subgrid alignment, and zero-placeholder shipping rules.

**What does Phase 1 deliver exactly?**

Up to three clarifying questions when the brief is incomplete, then a component tree, an ASCII responsive wireframe marking every container-type and subgrid application point, a design-token derivation covering the OKLCH primary, the type ladder, and the spacing rhythm, and the APP_CONFIG schema mapped to render functions, closed by a fixed confirmation prompt.

**What guarantees ship with Phase 2?**

A runnable single file with zero ellipsis placeholders, content and palette derived from the user's own brief instead of sample values, native-API overlays and accordions, four UI states, the ten hard layout rules, and the final checklist appended with every box verified.

## It's working if

- Phase 1 stops at the confirmation prompt and carries no implementation code.
- Phase 2 output opens directly in a browser with zero console errors.
- Every visible string flows from APP_CONFIG, derives from the user's brief rather than sample values, and the checklist passes line by line.

## Where it fits

Prototype-first creation lane inside the design bucket, complementing vis-product-web's direct pipeline and vis-reverse-ui's extraction lane. eng-router lists it as the Modern Native UI Lane under Pipeline 5.
