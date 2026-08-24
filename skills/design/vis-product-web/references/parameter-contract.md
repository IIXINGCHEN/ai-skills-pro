# Parameter Contract

All variable content enters through this contract. Values present in user requirements get extracted into parameters; absent values get inferred from project type + business goal + target users + scenario + content structure + platform, then applied consistently across architecture, tokens, components, and code.

## Parameter Groups

### Project Identity

`[PROJECT_NAME]` `[PROJECT_TYPE]` `[PRODUCT_TYPE]` `[BUSINESS_GOAL]` `[TARGET_USER]` `[USE_CASE]` `[PLATFORM]` `[DEVICE_RANGE]`

### Data & Content

`[DATA_SOURCE]` `[DATA_MODEL]` `[CONTENT_STRUCTURE]`

### Brand & Visual Direction

`[BRAND]` `[DESIGN_STYLE]` `[VISUAL_DIRECTION]` `[REFERENCE_STYLE]` `[STYLE_KEYWORD_1..5]` `[VISUAL_GOAL]`

### Color System

`[PRIMARY_COLOR]` `[SECONDARY_COLOR]` `[ACCENT_COLOR]` `[BACKGROUND_COLOR]`, plus per-state accent, surface, glow, and gradient mappings whenever the project defines statuses or categories.

### Typography & Icons

`[TYPOGRAPHY]` `[ICON_STYLE]`

### Components & Interaction

`[CORE_COMPONENTS]` `[INTERACTION]` `[ANIMATION]` `[MOTION_INTENSITY]`

### Responsive & Engineering

`[RESPONSIVE_RULES]` `[DESKTOP_BREAKPOINT]` `[TABLET_BREAKPOINT]` `[MOBILE_BREAKPOINT]` `[TECH_STACK]` `[DEPENDENCIES]` `[OUTPUT_FORMAT]`

### Content Placeholders

Anything that varies inside content: `[REGION]` `[USER_NAME]` `[DATE]` `[TIME]` `[VALUE]` `[AMOUNT]` `[UNIT]` `[STATUS]` `[CATEGORY]` `[TITLE]` `[DESCRIPTION]` `[METRIC]`, and similar. These render from the data layer at runtime.

## Inference Rules

1. Derive defaults from the tuple: project type x audience x scenario x brand x content shape x platform.
2. Record inferred decisions visibly in the delivery summary so the user can override them later.
3. Ask the user only when a missing fact blocks correct implementation, for example unknown data semantics that would decide the entire layout.
4. Recompute per project; values inferred for one project never migrate into another.

## Parameter Hygiene

- One parameter carries one meaning with one definition point: a CSS variable, a JavaScript constant, a data field, or a reusable function.
- Sample content comes from the data layer with clearly synthetic values.
- Units, currencies, date formats, and locales follow region parameters when present.
