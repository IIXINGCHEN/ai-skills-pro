---
"ai-skills-pro": patch
---

Multi-dimensional audit sweep (eng-multidimensional-audit: spatial, solid, reverse), evidence-backed probes with ablation controls:

- New `scripts/read-json.mjs`: a corrupt JSON file in any gate input (RELEASE-MANIFEST.json, registry/skills.json, eval suites, package/plugin/marketplace manifests) previously crashed the gate scripts with raw stack traces before any check ran; all 11 JSON load sites across release-check, validate-skills, and trigger-eval now route through the shared loader and fail with a file-named single-line error.
- Eval reference integrity: an eval case naming a nonexistent skill (typo, or cases left behind by a removed skill) used to fail forever at 34/35 = 97%, above the 90% train floor, silently. `runEval` now hard-fails at load on unknown skill references in should_trigger and near_neighbor cases.
- CI least privilege: validate-skills.yml gained `permissions: contents: read` (the job only checks out and runs gates; release.yml already declared its narrower write scopes).
- Verified clean by measurement: all 17 script/test relative imports resolve; npm script targets, CI `npm run` references, and plugin paths all exist; graph == registry names; 42/42 manifests at the current version; counts consistent across tree, RELEASE-MANIFEST, and README badge; registry regeneration deterministic; no hardcoded secrets; ghost plugin.json paths and broken frontmatter already caught by existing gates.
- Two new failure-ledger entries with their regression guards and ablation evidence (gate-crash-on-corrupt-json, ghost-skill-in-eval-case); full report at `specs/multidimensional-audit-2026-09-07/reports/audit-report.md`.
