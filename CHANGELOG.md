# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **New `prod-writing-for-agents` skill** (productivity): methodology for writing documents that agents consume  --  context-pointer wording, dual budgets (context load vs cognitive load), information hierarchy ladder, completion criteria that prevent premature finishing, and pruning that hunts no-op content. Model-invoked discipline, used when authoring or rewriting skills, AGENTS.md, or any agent-consumed doc.
- **New `prod-domain-model` skill** (productivity): the missing domain-model *producer*  --  sharpens fuzzy terms in a live session, challenges glossary conflicts on the spot, writes settled terms back to the glossary immediately, and records hard-to-reverse decisions as ADRs only when all three gates pass (hard to reverse / surprising without context / genuinely deliberated). Optional stage between `pipe-grill-plan` and `pipe-to-spec`. User-invoked only.
- **New `eng-wizard` skill** (engineering): generates an interactive bash wizard that walks a human through manual-only procedures (third-party provisioning, CI secrets, one-off migrations). The agent authors stage definitions; the human runs the script. Ships a rewritten `scripts/wizard-template.sh` scaffold (Chinese prompts). Hard rule in the skill body: secrets travel via secure channels, never into logs, files, or chat. User-invoked only.
- **New `prod-writing-fragments` + `prod-writing-shape` skills** (productivity): an explore/exploit writing pair, Chinese-first. Fragments runs grilling-style interviews to mine raw writing fragments (sharp lines, claims, vignettes), append-only, never structures or drafts. Shape grows a frozen fragment pile into an article paragraph by paragraph, grounding every concept before use. User-invoked only.
- **New `pipe-harden` skill** (pipeline): fix-loop pipeline for existing projects, audit (`eng-adversarial-audit` / `eng-code-review`), fix (`eng-review-fix` with regression tests), full test suite (`eng-validate`), bounded re-fix loop (max 3 rounds per failure, then escalate), then ship through branch → PR → CI → review → merge. Gated stages, resumable via `hardening/<run-id>/RUN.md`. Complements `pipe-ship` (feature loop).
- **New `prod-eq-reply` skill** (productivity): high-EQ reply assistant, Chinese-first. Paste a received message or describe the situation; it decodes subtext, flags landmines, picks from a 6-principle library, and delivers 2-3 send-ready versions (gentle/firm/humorous) each with a one-line rationale. Red lines: no manipulation or deception, no fabricated facts, bullying/harassment routed to formal channels. User-invoked only.

### Changed
- **Upstream-referenced method upgrades** (referenced `mattpocock/skills` @2237a04 as a method reference; all content rewritten in our own words, no verbatim copying; our `eng-`/`pipe-`/`prod-` prefix scheme kept as the intentional fork):
  - `eng-bugfix-rca`: full feedback-loop discipline  --  10-rung loop-construction ladder (failing test → HTTP script → CLI snapshot diff → headless browser → packet replay → minimal harness → property/fuzz → version bisection → old-vs-new differential → HITL fallback); loop-sharpening triple check (faster / sharper / stabler); flaky-bug "raise-the-repro-rate" branch (never fake a deterministic repro); explicit "no loop, stop" gate at the end of Phase 1 (list what was tried, ask the user for environment access / redacted artifacts / prod instrumentation permission); regression tests must sit on the correct seam, and "no correct seam exists" is reported as an architecture finding.
  - `pipe-review-diff`: three-dot merge-base as the comparison base with ref/diff preflight (fail fast on bad ref or empty diff) before spawning parallel reviewers; Standards axis gains its own smell baseline plus adjudication rules (project-documented standards beat the baseline; baseline is always advisory; skip what the toolchain already enforces).
  - `pipe-to-spec`: terminology challenge  --  stop and clarify on the spot when user wording conflicts with the project glossary or is fuzzy; propose the canonical term.
  - `pipe-ship`: new "Session and context discipline" section  --  stages 1-3 stay in one uncompacted context (grilling reasoning is the next stage's primary source), stage 4 runs each ticket in a clean session with parallel implementers communicating via RUN.md + report pointers; pointer added in `eng-router`.
  - `eng-git-pr`: PR description template upgraded  --  minimal visualization summary (pseudocode/call tree/Mermaid, pick one), Before/After evidence graded (screenshots and test output first, CI run id cited), Merge Danger (one-way vs two-way door + blast radius). Existing safety gates unchanged.
  - `prod-execution-report`: new "Environment Improvement Candidates" section  --  mechanical mistakes land as deterministic checks (linter/hook/CI), never as new rules; judgment calls become review-time standards; navigation friction becomes one-line pointers.
  - `pipe-implement`: frontier parallel mode  --  tickets with cleared blockers run in parallel implementer subagents, each completing the full loop before merging in dependency order; scheduling only, quality gates unchanged.
- **README catalogs (EN/zh)**: added the missing Pipeline catalog section (10 skills), the `prod-eq-reply` Productivity row, and 2 missing zh-CN Design rows; Autopilot table 10→11 with `/pipe-harden`; new Harden sequential-pipeline diagram. Fixed the Invocation column for 14 user-invoked skills that were mislabeled `Model / User`; corrected the `/eng-review-and-fix` vs `/eng-review-and-ship` convergence-pass attribution in the Autopilot table. Later: added `eng-wizard` (Engineering) and `prod-writing-for-agents` / `prod-domain-model` / `prod-writing-fragments` / `prod-writing-shape` (Productivity) rows; counts 58→63 across badges, install sections, and the distillation registry note.

### Fixed
- **cog-axiom** refactor: resolved internal contradictions: Enforcement is now "Proportional" (was "Mandatory: No exceptions", contradicting the Overview's proportional-application rule); quality checklist E now reads "meets the repository's stated target" (was a hardcoded ">95%" contradicting the section text); K.5 shell scripting now allows `#!/usr/bin/env bash` when bash features are genuinely needed (was POSIX-only, contradicting the repo's own scripts). Fixed stale references: `VERSION` file (does not exist, now points to `package.json` + `CHANGELOG.md`), `templates/`/`evals/` placeholder exception (directories do not exist, generalized). Normalized the remaining Chinese frontmatter (`principles.md`), fixed the "3.1 Cognitive Models" numbering, marked `vnd.ant.*` MIME types as convention examples, consolidated the authority disclaimer into SKILL.md's Operational Scope, and normalized frontmatter quoting.
- **prod-eq-reply**: added firm-version calibration to the Generate section (firm on the bottom line, soft on the tone, never the reverse; collaboration framing over negotiation; read-aloud self-test) plus a matching checkable completion criterion. Previously the "firm" version could come out sounding like hard negotiation ("那得重新评估") instead of high-EQ boundary-setting.
- **cog-axiom**: removed the stale 9-item inline principles list from SKILL.md (diverged from the 8 in `foundation/principles.md`); normalized 2 Chinese frontmatter descriptions to English; fixed stale "12-item A-L, v20.2" claim (file has A-K).
- **vis-apple-portfolio**: removed misplaced `allow_implicit_invocation` key from under `interface:` in openai.yaml. Catalog-wide policy state now uniform: 30 user-invoked skills carry `policy.allow_implicit_invocation: false`, 33 model-invoked skills carry no policy block.

## [2.0.0] - 2026-10-06

### Added
- **Skill distillation support**: new `pipe-distill` skill that turns a person (or topic) into a runnable skill capturing how they think: mental models, decision heuristics, expression DNA, anti-patterns, and honesty boundaries. Research swarm across 6 dimensions, triple-verified extraction, user checkpoints before synthesis and build, and 3+1 validation questions. User-invoked only (deliberate, potentially expensive task). Enforces the upstream ethics red lines as hard refusals: no distilling living private individuals without consent, no impersonation/harassment/fraud uses, and medical/legal/investment personas require an explicit cannot-replace-a-professional disclaimer.
- **Distillation directory export**: `npm run export:distillation` (`scripts/export-distillation-directory.mjs`) converts project metadata into an EverythingSkill-compatible directory entry (`dist/everythingskill-entry.json`), with per-skill `agents/openai.yaml` descriptors, bilingual summaries, and the canonical 56-skill registry.
- **Unified `pipe-` naming prefix** for the `pipeline` bucket (was: mixed `ship`/`grill-`/`to-`/`implement`/`review-`/`code-`): `pipe-ship`, `pipe-grill-plan`, `pipe-to-spec`, `pipe-to-tickets`, `pipe-implement`, `pipe-review-diff`, `pipe-code-improve-architecture`, `pipe-code-tdd`. All 55 skill names are kebab-case with one meaningful family prefix per bucket (`eng-`, `prod-`, `vis-`/`cog-`, `pipe-`).
- **`pipe-ship`**: 8-stage end-to-end pipeline skill (grill, spec, tickets, implement, review, deepen, deliver, deploy) taking one feature from raw idea to production. Every stage has a gate; push and production deploy each need explicit user authorization; runs are resumable via `specs/<feature-slug>/RUN.md`.
- **New `skills/pipeline/` bucket** (8 skills): `pipe-ship` plus its stage skills `pipe-grill-plan`, `pipe-to-spec`, `pipe-to-tickets`, `pipe-implement`, `pipe-review-diff`, `pipe-code-improve-architecture`, `pipe-code-tdd`. The library now totals 55 skills across four buckets.
- Per-ticket implement loop in `pipe-ship` stage 4: implement, test, audit, review, fix, retest, refix until green, with a 3-cycle fix-retest cap before escalation.
- Companion docs `docs/pipeline/*.md` for all 8 new skills; `AGENTS.md` documents the ship pipeline sequence and handoff contracts; README (EN/zh) gains the ship pipeline diagram and a 10th Autopilot workflow row.

### Changed
- Synced all 42 overlapping skills to their newer upstream revisions (workspace 2026-09-24): includes Reviewer Stance sections, checkable completion criteria, and normalized report paths (`specs/<feature>/reports/`).
- `plugin.json` / `package.json` / `marketplace.json` bumped to 2.0.0 with the regenerated 55-skill registry.
- `scripts/validate-skills.mjs` and installers (`link-skills.sh` / `link-skills.ps1`) now recognize the `pipeline` bucket.
- Distribution excludes `.git/`, `.dsh-vision-toolkit/`, `.agents/`, and `artifacts/`; the shippable tree is `skills/`, `docs/`, `.claude-plugin/`, scripts, and root docs.

## [1.1.0] - 2026-08-24

### Added
- **`eng-review-and-ship`**: 8-stage delivery lifecycle composing code review, fix loop, validation, completion verdict, atomic commits, git-inspected remote resolution, and an explicitly authorized push or PR. The default outcome is a readiness report; delivery happens solely on user instruction.
- **3-5 pass convergence loops** in `eng-review-and-fix` and `eng-review-and-ship`: passes 1 through 3 are mandatory even when early passes come back clean, convergence requires a clean pass at or after pass 3, and the 5-pass cap halts with evidence before any commit or push.
- `eng-enterprise-lifecycle` fix loop aligned to the same model: Stage 8 counts as pass 1, remediation continues until a clean pass at a total count of 3 or more, and the cap of 5 total passes escalates with evidence.
- **`vis-product-web`**: parameterized requirements-to-production web experience builder covering product analysis, information architecture, CSS-variable design systems, component architecture, data-driven rendering, theme mapping, motion, responsive accessibility, and a five-lens self-review gate.
- **`vis-product-design`**: integrated the Adaptive Product Design suite as a single routed skill with nine focused modes (user-context, get-context, research, ideate, image-to-code, url-to-code, audit, design-qa, share), one shared `PROJECT_CONTEXT` contract, compound workflow recipes, and the prototype scaffold template. Design bucket grows to 6 skills; the library now totals 45.
- Engineering bucket now ships 29 skills with 9 one-command Autopilot orchestrators.

### Changed
- Normalized all 14 legacy `SKILL.md` frontmatter `name:` fields to eliminate doubled prefix mismatches.
- Standardized `## Checkable Completion Criteria` sections across all 45 skills.
- Escaped validator em-dash check regex to maintain zero raw em-dash compliance repo-wide.
- Added `.gitignore` to prevent agent runtime telemetry from polluting repositories.

## [1.0.0] - 2026-08-24

### Added
- **42 production-grade skills** across three buckets:
  - Engineering (28): lifecycle orchestrators, SDD core, reviews and audits, safety gates, git delivery, DevOps.
  - Productivity (10): briefing loop, PRD, content delivery, prompt enhancement, session management, retrospectives.
  - Design (4): UI reverse engineering, 3D portrait compilation, anime stylization, cognitive principles library.
- **8 one-command Autopilot orchestrators** with state persistence and resumable pipelines.
- **13-stage enterprise lifecycle** with 3 human gates, first-pass multi-angle review, verdict-before-push ordering, and fast-path task sizing.
- **Safety model**: evidence-based completion gate, destructive double-confirm gate, readiness-only push policy, whitelist-bound edits, test-first repair chain.
- **Cross-platform installer** (`link-skills.ps1` / `link-skills.sh`) with symlink fallback to copy on restricted filesystems.
- **Quality gate**: `npm run validate` covering structure, frontmatter, companion docs, manifest sync, and em-dash prose rules.
- **CI workflow**: GitHub Actions validation gate on pull requests.
- **Bilingual documentation**: English and Simplified Chinese READMEs with language switch.