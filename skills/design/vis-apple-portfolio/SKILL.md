---
name: vis-apple-portfolio
description: "Generate Apple-grade personal brand and portfolio web landing pages with an integrated dynamic island capsule, bento grid, scroll-driven career timeline, 3D card tilt, infinite marquee, and light/dark theme toggle. Use when creating modern, aesthetic personal websites, developer portfolios, or executive landing pages where user content can be seamlessly swapped into a pre-engineered design architecture."
---

# Apple-Grade Personal Portfolio & Landing Page Generator

Generates high-precision, production-grade personal brand websites and portfolios adhering to Apple aesthetic standards, modern interaction models, and strict data-layer decoupling.

## Non-Negotiable Contract

- **Derive every delivery**: Brand, copy, palette, typography mood, density, radii, and component emphasis come from the current user's input and portfolio context. Reference values demonstrate structure only; none may survive into a delivered page.
- **Preserve factual integrity**: Ask for missing identity, employment, project, metric, publication, and link facts. Infer visual decisions from context, and never invent portfolio claims.
- **Strict data decoupling**: All visible variable content and theme values live in `SITE_DATA`. The HTML skeleton, render layer, and interactions stay content-agnostic.
- **Safe render boundary**: Serialize `SITE_DATA` as JSON, escape `<` as `\u003c` inside the JSON script block, escape every string entering generated markup, validate URL schemes, and constrain style values to the schema.
- **Apple-grade restraint**: Use hairline borders, measured elevation, refined typography, and one derived accent instead of transplanting the reference palette.
- **Dynamic Island integration**: Top navigation hosts an accessible dynamic island capsule with status, live timezone clock, restrained equalizer motion, and keyboard-operable expansion.
- **Bento and timeline architecture**: Highlight supplied achievements through modular bento layouts and a milestone timeline.
- **Zero-dependency portability**: Emit one self-contained `index.html` using system font stacks, HTML5, CSS variables, vanilla JavaScript, and inline SVG assets.

## Execution Workflow

```text
Phase 1: User Profile & Data Intake (Extract Name, Role, Projects, Bio, Socials)
Phase 2: Data Normalization (Structure into references/data-contract.json)
Phase 3: Visual Tuning & Token Mapping (Accent colors, typography, layout options)
Phase 4: Single-File Synthesis (Inject normalized data into references/template.html)
Phase 5: Quality Gate & Visual Review (Dual theme validation, mobile viewport check)
```

### Phase 1: User Profile & Data Intake

Collect the target user's supplied facts and ask focused questions for any missing factual field that the page will display:
1. **Identity and bio**: Full name, bilingual titles, location, timezone, contact email, concise hero pitch, and an approved portrait or representative image with alt text.
2. **Flagship highlights**: One supplied flagship case with verified impact, plus two to four stated principles.
3. **Career timeline**: Two to four real milestones with period, organization, and achievements.
4. **Selected works**: Three to six real project cards with category tags, descriptions, destinations, and inspectable project media supplied or approved by the user.
5. **Insights and articles**: Supplied publications or technical articles with working destinations.
6. **Social matrix**: User-provided profile links.

Completion test: every factual claim traces to user input; no identity, employer, project, metric, publication, or destination is fabricated.

### Phase 2: Data Normalization

Map all collected information into `references/data-contract.json`. Every localized value uses the same `{ en, zh }` shape, every renderer-consumed field is required by the schema, and unknown fields are rejected instead of silently ignored.

### Phase 3: Visual Tuning

Derive visual tokens for every project (refer to `references/design-tokens.md`):
- **Accent primary**: Convert the supplied brand color or a context-derived domain hue into accessible light and dark theme accents.
- **Theme surfaces**: Derive neutral surfaces from the accent hue while preserving Apple-grade restraint and WCAG AA contrast.
- **Project covers**: Derive each two-color cover from the project's category and the active brand palette.
- **Typography mood**: Choose the schema's system, editorial, or technical stack from the user's stated tone.

Record the derivation rationale. Reference token values are structure examples, not delivery defaults.

### Phase 4: Code Synthesis

Validate data against `references/data-contract.json`, serialize it into the template's `application/json` block with `<` encoded as `\u003c`, and remove every `EXAMPLE:` marker before delivery. Deliver the complete runnable `index.html` with:
- Integrated Dynamic Island status disclosure with a restrained transform-and-opacity popup transition.
- Responsive bento grid and interactive project filter tabs.
- Scroll-driven timeline with accent milestone nodes.
- One-click copy email button with toast feedback.
- System-aware light/dark theme toggle stored in localStorage.

### Phase 5: Verification Gate

Verify the generated output satisfies:
1. Valid HTML5 syntax with 0 external npm dependencies.
2. Both Light and Dark themes display appropriate contrast ratios (WCAG AA compliant).
3. Zero layout shift or horizontal overflow across viewport widths (375px to 1440px).
4. Interactive features (theme switch, language toggle, email copy toast, project filter, keyboard-operated island) function smoothly.
5. Every rendered string passes through the text or HTML escape boundary; links reject unsafe schemes and style values satisfy the schema.
6. Regenerate the complete `SITE_DATA` object from the current brief: no `EXAMPLE:`, `example.invalid`, or reference-fixture leaf remains, including UI labels, state messages, and theme tokens; every factual claim traces to user input.
7. System fonts keep the output self-contained, and non-essential motion stops under `prefers-reduced-motion`.
