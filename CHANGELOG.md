# Changelog

## 3.2.1

### Patch Changes

- [`fb24f93`](https://github.com/IIXINGCHEN/ai-skills-pro/commit/fb24f93299274960ff12cd9aaba12c2c4e152ef6) Thanks [@IIXINGCHEN](https://github.com/IIXINGCHEN)! - Infrastructure hardening, SSRF boundaries, and developer tooling ergonomics:
  
  - Upgraded `.github/workflows/validate-skills.yml` runner to Node.js 22, matching `release.yml` and eliminating GitHub Actions Node 20 deprecation warnings.
  - Pruned stale remote branch `changeset-release/main` following the merge of release PR [#1](https://github.com/IIXINGCHEN/ai-skills-pro/issues/1), maintaining a clean repository branch tree.
  - Hardened `scripts/link-skills.sh` with a fail-fast shell check (`BASH_VERSION`), outputting clear actionable guidance if accidentally invoked by pure POSIX sh or lightweight container shells.
  - Strengthened `skills/design/vis-reverse-ui/SKILL.md` with an explicit SSRF defense boundary: enforcing http/https schemes only and requiring pre-flight host validation that rejects localhost, loopback, private networks, and reserved IP ranges.
  - Synchronized `manifest.yaml` for `vis-reverse-ui` and verified clean passing of all four repository quality gates (`validate`, `test`, `eval`, `release-check`).

## 3.2.0

### Minor Changes

- [`d1944a6`](https://github.com/IIXINGCHEN/ai-skills-pro/commit/d1944a62b4f517ae6a11c2abb80f390866aa9a0d) Thanks [@IIXINGCHEN](https://github.com/IIXINGCHEN)! - Catalog meta-skills: two automation skills that maintain the catalog with itself (ADR 0007):
  
  - **`eng-skill-create`** (user-invoked): authors one complete new skill end to end through `templates/skill-authoring-checklist.md` section A. Three intake gates (enterprise fit, worth-building, de-duplication with the ADR 0001 boundary statement), a human-confirmed design freeze (ADR 0002: governance is proposed and confirmed, never derived), scaffolding from the new `templates/skill-scaffold.md`, mechanical surface wiring, four-gate verification with a 3-repair-round cap, then link script, changeset, and execution record.
  - **`eng-skill-optimize`** (user-invoked): diagnoses exactly one named skill across six axes (trigger quality via the eval suites, context budget, contract consistency, body quality, governance freshness, enterprise-domain recheck), writes a risk-ranked plan to `specs/<skill>-optimization/reports/`, applies minimal diffs (description changes carry their eval changes), and drives the gates green. Hard boundaries: no deletion, no unconfirmed invocation flip, no re-purposing, self-optimization needs explicit confirmation.
  - New `templates/skill-scaffold.md` (angle-bracket slots for the three-part scaffold, placeholders legal only in templates/ per ADR 0005) and ADR 0007 recording the catalog-meta vs project-engineering boundary.
  - Catalog: 40 -> 42 skills (18 user-invoked / 24 model-invoked); both skills curated high risk, production maturity, platform owner; router rows added; execution-record clauses present (structural orchestrator detection catches both by their 2+ required dependencies).

- [`d1944a6`](https://github.com/IIXINGCHEN/ai-skills-pro/commit/d1944a62b4f517ae6a11c2abb80f390866aa9a0d) Thanks [@IIXINGCHEN](https://github.com/IIXINGCHEN)! - Production-readiness hardening pass over the governance surfaces (review against upstream mattpocock/skills and the yao-meta-skill reference):
  
  - Removed the dead eval index `evals/trigger_cases.json` (50 cases no runner or test consumed) and re-pointed CLAUDE.md, ARCHITECTURE.md, ADR 0001, and failures/failure-cases.md at the real suite files (`train/holdout/blind_holdout_cases.json`); suite descriptions no longer hardcode the model-invoked count. The old state let a future agent add cases to a file CI never reads and still see green.
  - New governance test: every model-invoked skill must have trigger coverage in the CI suites (should_trigger or near_neighbor); a skill with zero cases fails the gate instead of shipping an untested routing contract.
  - `release-check` no longer hardcodes 40/16/24: RELEASE-MANIFEST.json declares the counts and the gate cross-checks them against the live tree in both directions (ablation-verified: a stale manifest count fails loudly).
  - New router-invariant test: every user-invoked engineering skill must appear in `eng-router`'s routing table, and the router must not mention skills absent from the registry (a router that lies is now a red test, not a prose rule).
  - New `templates/skill-authoring-checklist.md`: the full add/rename/remove touch surface as checklists (17 steps for adding), wired into CLAUDE.md; covers the prose surfaces no gate sees.
  - README (both languages): local symlink install is the primary documented path; remote marketplace/npx commands are explicitly marked pending until the repository is published, honoring the no-fabrication doctrine for commands users would otherwise copy and fail.

### Patch Changes

- [`d1944a6`](https://github.com/IIXINGCHEN/ai-skills-pro/commit/d1944a62b4f517ae6a11c2abb80f390866aa9a0d) Thanks [@IIXINGCHEN](https://github.com/IIXINGCHEN)! - Convergence gauntlet consolidation and risk-tiered floors (ADR 0008, ADR 0009):
  
  - Canonical gauntlet specification (ADR 0008): created `templates/convergence-gauntlet.md` as the single authoritative source of convergence loop mechanics (pass floor, cap 5, per-pass repair cap 3, triage rules, re-review union scope) shared across `eng-review-and-ship`, `eng-review-and-fix`, and `eng-enterprise-lifecycle`. Lifecycles now summarize rules concisely and point to the template, eliminating drift across multi-pass orchestrators.
  - Risk-tiered convergence floor (ADR 0009): differentiated convergence floors by change type. Code-bearing changes retain the full 3-pass stability guarantee; prose-only changes (documentation, copy, prompts) converge after pass 2 when clean, eliminating one unneeded round of token burn on changes that cannot cause runtime regressions. State files carry `floor` and `floorJustification`.
  - Documentation sync: updated docs pages for `eng-review-and-ship`, `eng-review-and-fix`, and `eng-enterprise-lifecycle` to reflect risk-tiered floors; unified ecosystem support framing across all 42 docs pages.
  - Regression guard: added unit tests in `tests/execution-trace.test.mjs` verifying canonical template existence, floor/cap parameters, and lifecycle references; added test in `tests/upstream-conventions.test.mjs` asserting uniform ecosystem support across all docs pages (suite now passes 61/61).
  - Manifests and registry regenerated cleanly via `npm run generate:manifests`; all four quality gates green (`validate`, `test`, `eval`, `release-check`).

- [`d1944a6`](https://github.com/IIXINGCHEN/ai-skills-pro/commit/d1944a62b4f517ae6a11c2abb80f390866aa9a0d) Thanks [@IIXINGCHEN](https://github.com/IIXINGCHEN)! - Deep remediation sweep closing every deferred item from the audit and review loops, plus two new defect classes found by byte-level scanning:
  
  - **Control-character corruption (new class)**: seven docs lines shipped with stray C0 controls (U+0008 backspace, U+000B vertical tab, U+001B escape) embedded mid-word, silently eating the adjacent character's display ("precedes \x0Balidate" read as "precedes alidate"); the encoding gate only checked empty files and BOM. All seven lines repaired with their intended skill names; a control-character marker added to `fabricationViolations` (all C0 except tab/newline/cr plus U+007F) with ablation controls proving vertical-tab and backspace fire while tab/newline stay legal.
  - **Graft to-variant (new class)**: the graft-fragment marker's verb list missed "to", so two docs pages shipped an invocation sentence ending mid-air into a leftover "to implement tasks" clause. Both pages rewritten; the marker extended; ablation control added. The new marker immediately caught its own pattern quoted in two report files, which were rewritten to describe rather than quote.
  - **REDIRECT_RE tightened to require the slash**: prose mentions ("run `eng-multidimensional-audit`" inside a review step) no longer land in manifests as redirects; `eng-enterprise-lifecycle`'s redirects shrank to the real `eng-git-pr` hand-off. Manifests regenerated, graph valid.
  - **Clean single-line gate exits**: all four CLI gate entry points (validate, release-check, trigger-eval, output-eval) now trap load errors and exit with one named `[ERROR]`/`[EVAL ERROR]` line and zero stack frames; ablated with corrupt files on every entry point.
  - **read-json contract tests**: 5 tests pin the loader's behavior (happy path, corrupt names the file, missing says missing, empty file, in-memory string label).
  - Two new failure-ledger entries (control-character-corruption, graft-to-variant), each with its marker and ablation control. Test suite: 54 -> 59.

- [`d1944a6`](https://github.com/IIXINGCHEN/ai-skills-pro/commit/d1944a62b4f517ae6a11c2abb80f390866aa9a0d) Thanks [@IIXINGCHEN](https://github.com/IIXINGCHEN)! - Multi-dimensional audit sweep (eng-multidimensional-audit: spatial, solid, reverse), evidence-backed probes with ablation controls:
  
  - New `scripts/read-json.mjs`: a corrupt JSON file in any gate input (RELEASE-MANIFEST.json, registry/skills.json, eval suites, package/plugin/marketplace manifests) previously crashed the gate scripts with raw stack traces before any check ran; all 11 JSON load sites across release-check, validate-skills, and trigger-eval now route through the shared loader and fail with a file-named single-line error.
  - Eval reference integrity: an eval case naming a nonexistent skill (typo, or cases left behind by a removed skill) used to fail forever at 34/35 = 97%, above the 90% train floor, silently. `runEval` now hard-fails at load on unknown skill references in should_trigger and near_neighbor cases.
  - CI least privilege: validate-skills.yml gained `permissions: contents: read` (the job only checks out and runs gates; release.yml already declared its narrower write scopes).
  - Verified clean by measurement: all 17 script/test relative imports resolve; npm script targets, CI `npm run` references, and plugin paths all exist; graph == registry names; 42/42 manifests at the current version; counts consistent across tree, RELEASE-MANIFEST, and README badge; registry regeneration deterministic; no hardcoded secrets; ghost plugin.json paths and broken frontmatter already caught by existing gates.
  - Two new failure-ledger entries with their regression guards and ablation evidence (gate-crash-on-corrupt-json, ghost-skill-in-eval-case); full report at `specs/multidimensional-audit-2026-09-07/reports/audit-report.md`.

- [`d1944a6`](https://github.com/IIXINGCHEN/ai-skills-pro/commit/d1944a62b4f517ae6a11c2abb80f390866aa9a0d) Thanks [@IIXINGCHEN](https://github.com/IIXINGCHEN)! - Zero hardcoded workstation absolute paths policy and automated release enforcement:
  
  - Prohibited all hardcoded host workstation absolute filesystem paths across all repository files and documentation:
    - Cleaned developer workstation drive letters in test and execution reports, replacing them with relative repo-root identifiers.
    - Retained standard user-environment skill directories (`~/.claude/skills`, `~/.agents/skills`) across `CLAUDE.md`, `README.md`, and `README.zh-CN.md`.
    - Retained standard target-system daemon paths (`/etc/os-release`, `/var/log/...`) in `skills/engineering/eng-linux-security/SKILL.md` as legitimate Linux host inspection locations, while ensuring no local development workstation paths are present.
  - Hardened release gate (`scripts/release-check.mjs`): added an automated zero-hardcoded-workstation-absolute-paths check that scans every release artifact file and fails immediately if any workstation drive letter, Git Bash mount, or workstation home path is detected outside of standard web URLs.
  - Expanded automated regression testing (`tests/upstream-conventions.test.mjs`): added test assertion verifying that all tracked repository `.md`, `.json`, `.yaml`, `.mjs`, `.sh`, and `.ps1` files contain zero hardcoded workstation absolute paths (test suite passing 62/62).
  - Regenerated manifests and registry via `npm run generate:manifests`; all four quality gates green (`validate`, `test`, `eval`, `release-check`).

## [Unreleased]

### Minor Changes

- Reinstate `eng-review-and-fix` as the no-delivery review lifecycle (ADR 0006, superseding the deletion recorded in ADR 0001): it composes `eng-code-review`, `eng-review-fix`, and `eng-validate` into the 3-5 pass convergence loop and stops at the consolidated report under `specs/<feature>/reports/`; no commits, no remote actions. Its description and boundary paragraph state which sibling it does NOT replace (`eng-review-and-ship` remains the delivery lifecycle), run state moved to `.scratch/review-and-fix-state.json` per the knowledge layout doctrine, and it appends the execution record per ADR 0004. Catalog: 40 skills (16 user-invoked / 24 model-invoked); curated at high risk, governed maturity, quarterly review.

## 3.1.0

### Minor Changes

- Introduce the governance and trigger-eval layer (informed by the yao-meta-skill metadata model):
  
  - `manifest.yaml` now carries a governance block (owner, status, maturity, review_cadence, review_due) and a context budget tier; `registry/skills.json` adds per-skill content hashes (sha256 over the skill's source files).
  - Governance rules enforced at generation time: every skill needs a curated entry; critical-risk and network-capable skills must be `governed` maturity with monthly/quarterly review; overdue reviews fail the gate.
  - New `security/network_policy.json` and `security/permission_policy.json`: network-capable skills carry per-entry approvals (allowed_hosts, HTTPS, timeout, expiry, reviewer); expired or missing approvals block generation.
  - New `evals/trigger_cases.json` (50 cases: should_trigger / should_not_trigger / near_neighbor) and `scripts/trigger-eval.mjs` (`npm run eval`, zero dependencies, wired into CI): model-invoked descriptions are scored against the case set and must pass at full rate. Tuning the set fixed real routing defects in `eng-plan`, `eng-execute`, `eng-validate`, `eng-multidimensional-audit`, `prod-create-prd` (vocabulary leaks and missing disambiguation), and `vis-reverse-ui` was promoted to governed maturity for its user-supplied-URL fetch surface.
  - New `failures/failure-cases.md`: every shipped defect class (overlapping orchestrators, docs contradicting the invocation contract, keyword-derived risk misclassification, stale counts, the semver crash) is recorded with the regression guard that now catches each.
  - `vis-product-web` SKILL.md slimmed below the heavy context budget via progressive disclosure.
  - CLAUDE.md documents the new rules; README production gates list the new checks.

- Epistemic discipline: the eight working disciplines plus the no-fabrication hard rule (ADR 0005):
  
  - New doctrine module `skills/design/cog-axiom/cognitive/epistemic-discipline.md`: rule 0 (nothing in this repository may be assumed, simulated, or invented; placeholders only in `templates/` slots and labeled `evals/` fixtures) plus the eight operating habits (reproduce before reasoning, adversarial review, ablation, Occam's razor, uncertainty ledger, independent judgment, fact vs inference, high cohesion low coupling). Registered in cog-axiom's index and Core Principles (9th).
  - ADR 0005 codifies no-fabrication repository-wide; CLAUDE.md carries the contract.
  - Each discipline woven as an operative clause plus completion criterion into the skill that needs it: `eng-bugfix-rca` (red/green outputs archived; competing-hypothesis ablation), `eng-adversarial-audit` (independent skeptic stance, counterexample hunt), `eng-completion-gate` (Uncertainty Ledger blocking DONE over unstated guesses), `eng-code-review` (first-pass independence), `eng-hardening-review` (observed vs inferred with falsifying evidence), `eng-analyze-codebase` (cohesion dimension), `eng-change-scope-funnel` (F3 boundary criterion), `eng-plan` (Occam ordering; abstraction needs a second consumer).
  - Guard checks extracted to `scripts/guard-checks.mjs` (one rule, one place) with `tests/ablation.test.mjs` as negative controls: every rule is fed deliberately bad samples and must fire, proving each rule can fail (the ablation discipline applied to the guards themselves).
  - `tests/no-fabrication.test.mjs` scans every surface for fabrication markers. Its first run caught seven real shipped strays, all fixed in this change: a stray `NaN` line in `eng-hardering-review` (sic, eng-hardening-review) and the duplicated sentence "automatically when a task fits." pasted twice across six docs pages; recorded in `failures/failure-cases.md` with the test as regression guard.

- Execution trace doctrine and enterprise review upgrade:
  
  - **ADR 0004, append-only execution traces**: every orchestrating skill (7 lifecycles, `eng-execute`, `eng-review-fix`) appends one execution record per run using the new `templates/execution-record.md`, in the fixed chain executor, skill, version, permissions, steps, results, risk, report. Values for skill, version, permissions, and risk copy from the generated manifest, never from memory; records are append-only, stored durable under `specs/<feature>/reports/` or ephemeral under `.scratch/execution-records/`. CLAUDE.md documents the contract; `tests/execution-trace.test.mjs` guards template completeness and orchestrator wiring.
  - **`eng-review-fix` repositioned as the enterprise engineering review pipeline**: seven stages (code scan, architecture analysis, security audit, performance analysis, reliability check, risk-ranked remediation plan, validation report) orchestrating the existing leaf skills (`eng-code-review`, `eng-analyze-codebase`, `eng-adversarial-audit`, `eng-hardening-review`, `eng-validate`) instead of re-implementing them. Security findings enter the plan as Critical; architecture findings enter as constraints; out-of-scope findings become an evidence-backed hand-off list. Its trigger description was tightened after the eval suites caught it stealing routes from `cog-axiom` and a human-only request; seven lifecycle-family stopwords (run, deliver, verify, lifecycle, pipeline, ...) were added to the evaluator, restoring train/holdout/blind to 100%.

- Knowledge-organization and evaluation upgrade (your nine knowledge-layout principles, informed by the yao-meta-skill metadata model):
  
  - **Knowledge layout doctrine (ADR 0003)**: skills sort artifacts into four homes: `specs/<feature>/` (durable knowledge: spec, plan, tickets, reports), `.scratch/` (ephemeral run state, per-pipeline `<pipeline>-state.json`, local issues with GitHub Issues taking precedence), `docs/adr/` (decisions), `docs/`. No skill writes into a target project's `.agents/` anymore; the shared `lifecycle-state.json` concurrency hazard is gone. 20 skills' paths migrated; guarded by `tests/knowledge-layout.test.mjs`.
  - **ADR system**: `docs/adr/` with template and three seed ADRs backfilling the decisions that shaped this release (one orchestrator per workflow shape; governance metadata is curated, never derived; the knowledge layout doctrine). Guarded for sequence, completeness, and immutability shape.
  - **Ubiquitous language**: `CONTEXT.md` rewritten as the glossary (skill-system, governance, knowledge-layout, workflow-shape terms with precise definitions); new `ARCHITECTURE.md` one-pager maps layers, invariants, and where every concern lives.
  - **Vertical slice tickets**: `eng-plan` now breaks work into vertical slices per `templates/ticket-template.md` (one user-facing capability cutting through every layer; declared blocking edges); `eng-execute` consumes tickets in blocking-edge order and enforces slice integrity ("backend done, UI later" is a plan defect). Also fixed the `plan.md>.md` path bug the migration introduced.
  - **Three-suite trigger eval**: cases split into `train` (90% floor, tuning loop), `holdout` (100% floor), and a new `blind` set (100% floor) that never participates in tuning. The blind set immediately caught two real-world phrasing gaps ("check your understanding", "clone this screenshot") and the `prod-briefing-loop` and `vis-reverse-ui` descriptions were fixed for natural-language triggers.
  - **Output contracts**: new `evals/output_contracts.json` + `scripts/output-eval.mjs` (20 checks) assert flagship artifacts (plan + tickets, spec, PRD) are structurally deliverable: required sections, ticket fields, AC identifiers, declared blocking edges, quantified success metrics. Exemplar fixtures under `evals/output/fixtures/`. Wired into `npm run eval` and CI.

### Patch Changes

- Adversarial audit sweep over the full repository (method: eng-adversarial-audit stance + eng-bugfix-rca evidence discipline):
  
  - Fixed 8 graft fragments in docs pages (standardized invocation sentences ending mid-air with stranded trigger clauses, such as an invocation sentence colliding with a leftover "before planning major features" clause); added the graft-fragment marker to the fabrication scanner with ablation negative controls so the class stays dead.
  - Closed the last trigger-eval coverage gap: `eng-destructive-safety-gate` was the only model-invoked skill with zero cases; new train + blind cases exposed that its description missed real-world warning phrasing (wipes, cannot be undone), now sharpened.
  - Contract cross-check confirmed body-mandated artifacts all have template sections; RCA path contract is three-way consistent (`specs/<bug-id>/rca.md`).

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
