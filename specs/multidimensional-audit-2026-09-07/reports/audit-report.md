# Multi-Dimensional Audit & Remediation Report

Date: 2026-09-07. Method: eng-multidimensional-audit (spatial / solid / reverse), evidence-backed probes executed against the live tree; every finding verified by injecting the failure before fixing (ablation), every fix verified by the four gates.

## 1. Spatial Architecture Findings (空间维度)

- **Topology & Layer Boundaries**: Pass. Declarative skill packages (skills/) separated from logic (scripts/), guards (tests/), policy (security/), decisions (docs/adr/), and release metadata; no layer reaches sideways.
- **Import & Module Graph**: Pass (measured). All 17 script/test files' relative imports resolve on disk; tests import scripts through four documented entry points (guard-checks, generate-manifests, trigger-eval, version). No cycles (validateGraph DFS, plus this session's graph walk).
- **Environment & Config Match**: Pass (measured). Every npm script target exists; every `npm run` reference in both CI workflows is defined in package.json; marketplace.json source path resolves; no hardcoded secrets in scripts/tests/workflows.

## 2. Solid Data-Flow Findings (立体维度)

- **End-to-End Tracing (SKILL.md -> buildSkillGraph -> generateManifests -> registry -> gates)**: Pass (measured). Graph names == registry names (42/42); all manifests carry the current version; counts agree across tree, RELEASE-MANIFEST, and README badge; registry regeneration is deterministic in its skills array.
- **Eval Pipeline Source**: Pass. trigger-eval reads live SKILL.md descriptions via buildSkillGraph, not the registry snapshot; output contracts' 12 fixtures all present.
- **Version Chain**: Pass. Pre-release VERSION tags pass the strict-semver shape and propagate through sync-version cleanly.

## 3. Reverse Threat & Edge Case Findings (逆向维度)

- **Exception Chains & Error Handling**: **Finding (FIXED)**. Corrupt JSON in any consumed file (RELEASE-MANIFEST.json, registry/skills.json, eval suites) crashed all three gate scripts with raw SyntaxError stack traces: a gate that crashes before reporting reports nothing. Fixed: shared `scripts/read-json.mjs` (file-named single-line error), wired into release-check (6 sites), validate-skills (4 sites), trigger-eval (1 site). Ablation: all three now fail with `invalid JSON at <file>` as the actionable line; governance tests surface the same message red.
- **Gate False Negatives**: **Finding (FIXED)**. An eval case naming a nonexistent skill (typo, or a removed skill with cases left behind) scored 34/35 = 97%, above the 90% train floor: the case failed forever without ever reddening the gate. Fixed: runEval now hard-fails at load on any case referencing an unknown skill. Ablation: ghost case now throws `references unknown skill "ghost-skill"` before any scoring.
- **Security & Vulnerability Exposure**: **Finding (FIXED)**. validate-skills.yml had no permissions block, inheriting the default (potentially write) token scope. Fixed: `permissions: contents: read` (the job only reads and runs gates). release.yml already declared least privilege.
- **Ghost path in plugin.json**: Pass (probe). A nonexistent skill path fails release-check with `[ERROR] plugin.json skill manifest is not exactly synchronized`.
- **Broken frontmatter**: Pass (probe). A corrupted delimiter reddens the test suite.
- **Dead CURATED entries**: Pass (probe). A curated entry for a nonexistent skill is caught by validate.
- **Performance & Concurrency**: Pass. Registry hashing is O(files), deterministic; no shared mutable run state (ADR 0003 banned lifecycle-state.json); .scratch/ state files are per-pipeline.

## 4. Prioritized Remediation Plan (executed)

| ID | Dimension | Severity | Location | Issue | Fix |
|---|---|---|---|---|---|
| FIX-1 | Reverse | High | scripts/release-check.mjs, validate-skills.mjs, trigger-eval.mjs | Corrupt JSON crashed gates with stack traces | New scripts/read-json.mjs; 11 call sites migrated; file-named errors |
| FIX-2 | Reverse | High | scripts/trigger-eval.mjs:63 | Ghost skill names in cases never reddened the gate | Hard reference-integrity check before scoring |
| FIX-3 | Reverse | Medium | .github/workflows/validate-skills.yml | Missing permissions block (default broad token scope) | `permissions: contents: read` |

## 5. Verification Commands

- `npm run validate` -> 42 skills, 0 errors, 0 warnings
- `npm test` -> 54/54
- `npm run eval` -> train 34/34, holdout 17/17, blind 11/11, output 20/20, all 100%
- `npm run release-check` -> 0 errors, 2 pre-existing warnings (dev dirs, excluded by artifact policy)

## 6. Hand-off (out of scope, recorded)

- The gate scripts remain top-level-linear; a corrupt file fails with a clean first line but Node still prints source frames after it. Wrapping each gate in a main() with a single-line exit is a cosmetic follow-up; the actionable error is already the first line and CI fails correctly.
- LLM-semantic trigger eval remains the known next step (keyword evaluator tests vocabulary, not meaning).
