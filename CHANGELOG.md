# Changelog
## 1.6.2

### Engineering invocation conformance
- Promoted `eng-review-and-fix` to a user-invoked lifecycle orchestrator, matching the repository-wide invocation model.
- Synchronized `SKILL.md`, `agents/openai.yaml`, engineering README, and top-level README.
- Added release-gate coverage so every Skill-tool dependency must target a model-invoked skill.
- Refreshed production metadata and release records for 1.6.2.

## [1.6.1] - 2026-09-06

### Production Release Hardening
- Promoted 1.6.1 to the production release baseline with a dedicated `npm run release-check` gate.
- Added synchronized package/plugin/marketplace metadata checks, runtime baseline (`Node.js >=20`), required release-file checks, symlink/empty-file checks, LF normalization checks, Markdown link validation, and Agent-behavior contamination scanning.
- Added `RELEASE.md` as the production release record and made release artifacts reproducible from the repository tree.


### Security & Agent Behavior
- Replaced the `cog-axiom` identity/security-kernel design with scoped security guidance that explicitly follows the host agent instruction hierarchy.
- Removed sovereignty, immutable-priority, identity-locking, and anti-correction language.
- Removed mandatory chain-of-thought disclosure requirements and replaced them with private structured-analysis guidance.
- Replaced mandatory per-response diagnostic YAML with an optional diagnostic mode.

### Consistency & Progressive Loading
- Converted `cog-axiom` into a reference-oriented skill with on-demand module consultation.
- Replaced hard-coded Chinese-only communication with conversation-language matching.
- Reworked context guidance to use Project Context → Task Brief → Execution Prompt and to allow reasonable defaults when missing context is non-critical.
- Replaced stale references to removed `modes/sdm.md` and `modes/review.md` with current lifecycle/review skills.
- Updated `cog-axiom` OpenAI UI metadata to remove the obsolete “10 specialized modes” claim.

### Release Metadata
- Bumped package, plugin, and marketplace versions to `1.6.1`.
- Updated README skill/validation badges from 42 to 45.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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