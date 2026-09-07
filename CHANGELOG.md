# Changelog

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
