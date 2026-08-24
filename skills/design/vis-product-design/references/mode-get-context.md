
# Get Context

Establish the smallest sufficient brief before focused design/build work.

## Normalize

Identify or infer:

- `[PROJECT_NAME]`
- `[PROJECT_TYPE]`
- `[PRODUCT_TYPE]`
- `[BUSINESS_GOAL]`
- `[TARGET_USER]`
- `[USE_CASE]`
- `[CORE_CONTENT]`
- `[PRIMARY_ACTION]`
- `[DATA_MODEL]`
- `[PLATFORM]`
- `[REFERENCE_SOURCE]`
- `[DESIGN_STYLE]`
- `[TECH_STACK]`

## Context decisions

Derive:

1. information hierarchy
2. page/screen structure
3. component categories
4. state model
5. theme model
6. likely interaction model
7. visual direction
8. implementation constraints

Do not ask for optional details that can be safely inferred.

Return a compact normalized `PROJECT_CONTEXT` for the next skill.

## Shared contract

Before executing this skill, read `references/master-prompt.md` and apply its shared rules, especially the `[PARAMETER]` rule, data/UI separation, and quality contract.
