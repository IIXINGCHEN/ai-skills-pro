# AI Skills Pro 3.2.2

Enterprise-grade composable Agent Skills for engineering, delivery, and design governance. The pack follows the invocation and composition model used by `mattpocock/skills`: user-invoked and model-invoked are the two reachability classes, Skill Tool dependencies target model-invoked skills, and detailed guidance is disclosed only when a task needs it.

English | [简体中文](README.zh-CN.md)

![Version](https://img.shields.io/badge/version-3.2.2-blue) ![Skills](https://img.shields.io/badge/skills-42-blue) ![Validation](https://img.shields.io/badge/validation-42%2F42%20pass-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green)

[Upstream reference](https://github.com/mattpocock/skills)

---

## ⚡ Installation & Validation

### 1. Local Installation (Direct Symlink, works today)
```bash
# Linux / macOS:
./scripts/link-skills.sh

# Windows PowerShell:
.\scripts\link-skills.ps1
```
Links all skills into `~/.claude/skills` and `~/.agents/skills` (symlink with junction fallback on Windows). Re-run after adding, removing, or renaming a skill.

### 2. Remote Installation (from the public repository)
This repository is published at `IIXINGCHEN/ai-skills-pro`, so the commands below install directly from GitHub:

```bash
# Claude Code plugin marketplace:
claude plugin marketplace add IIXINGCHEN/ai-skills-pro
claude plugin install ai-skills-pro@ai-skills-pro-marketplace

# Codex, Cursor, DSH & Open Agent Skills CLI:
npx skills add IIXINGCHEN/ai-skills-pro --skill '*' -g -y
```

### 3. Integrity Validation
```bash
npm run validate
npm test
npm run eval
npm run release-check
```

---

## Invocation model

- **User-invoked** skills are human-triggered workflows or consequential actions. They may recommend other user-invoked skills for the human to run, but they do not reach them through the Skill Tool.
- **Model-invoked** skills are reusable capabilities the model or user can reach when the description matches the task. A user-invoked workflow may call a model-invoked dependency with the Skill Tool.

## Progressive disclosure

`SKILL.md` contains the behavior every branch needs. Branch-specific schemas, templates, checklists, and protocols live beside the skill and are referenced only when that branch applies.

---

## User-invoked skills (18)

- [`eng-defect-lifecycle`](skills/engineering/eng-defect-lifecycle/SKILL.md) `[Engineering]`: Run the end-to-end defect resolution lifecycle from RCA through verified delivery.
- [`eng-docker-update`](skills/engineering/eng-docker-update/SKILL.md) `[Engineering]`: Update Docker Compose images with health checks and rollback safeguards.
- [`eng-enterprise-lifecycle`](skills/engineering/eng-enterprise-lifecycle/SKILL.md) `[Engineering]`: Run the end-to-end enterprise development lifecycle with explicit approval gates.
- [`eng-git-pr`](skills/engineering/eng-git-pr/SKILL.md) `[Engineering]`: Prepare and submit a GitHub pull request for the current branch.
- [`eng-hotfix-emergency-lifecycle`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md) `[Engineering]`: Run the emergency production hotfix lifecycle for an active P0 or P1 incident.
- [`eng-linux-security`](skills/engineering/eng-linux-security/SKILL.md) `[Engineering]`: Harden Linux hosts with port-scan detection and firewall safeguards.
- [`eng-onboarding-audit-lifecycle`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md) `[Engineering]`: Run a read-only onboarding and codebase health audit for an unfamiliar repository.
- [`eng-refactor-lifecycle`](skills/engineering/eng-refactor-lifecycle/SKILL.md) `[Engineering]`: Run the behavior-preserving progressive refactoring lifecycle for legacy systems.
- [`eng-release-ops-lifecycle`](skills/engineering/eng-release-ops-lifecycle/SKILL.md) `[Engineering]`: Run the production release-operations lifecycle with health checks and rollback planning.
- [`eng-review-and-fix`](skills/engineering/eng-review-and-fix/SKILL.md) `[Engineering]`: Review-and-remediate convergence loop that stops before delivery; for the same gauntlet ending in commits and an authorized push, run eng-review-and-ship instead.
- [`eng-review-and-ship`](skills/engineering/eng-review-and-ship/SKILL.md) `[Engineering]`: Run the end-to-end review, remediation, verification, and authorized delivery lifecycle.
- [`eng-router`](skills/engineering/eng-router/SKILL.md) `[Engineering]`: Browse the engineering capability map and choose the right workflow or reusable skill for the current task.
- [`eng-skill-create`](skills/engineering/eng-skill-create/SKILL.md) `[Engineering]`: Author a new skill end to end through the authoring checklist: intake gates, scaffold, surface wiring, gate verification, and changeset.
- [`eng-skill-optimize`](skills/engineering/eng-skill-optimize/SKILL.md) `[Engineering]`: Diagnose one named skill across trigger, budget, contract, and governance axes, then apply a risk-ranked plan through the gates; project code review belongs to eng-review-fix.
- [`prod-compress-context`](skills/productivity/prod-compress-context/SKILL.md) `[Productivity]`: Create a compact checkpoint of the current conversation and task state.
- [`prod-content-delivery-lifecycle`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) `[Productivity]`: Run the end-to-end content delivery lifecycle from brief alignment through final delivery.
- [`prod-project-init`](skills/productivity/prod-project-init/SKILL.md) `[Productivity]`: Initialize a repository-specific development environment and setup guide.
- [`prod-system-review`](skills/productivity/prod-system-review/SKILL.md) `[Productivity]`: Review the development workflow after delivery and identify process improvements.

---

## Model-invoked skills (24)

- [`cog-axiom`](skills/design/cog-axiom/SKILL.md) `[Design]`: Architecture, security, compliance, context, and delivery reference guidance. Use when a task needs one of these principles or standards; consult only the relevant module.
- [`vis-product-design`](skills/design/vis-product-design/SKILL.md) `[Design]`: Route product-design requests through focused modes with shared context. Use for ideas, screenshots, prototypes, live URLs, UI audits, or reviewable frontend concepts.
- [`vis-product-web`](skills/design/vis-product-web/SKILL.md) `[Design]`: Design and build a complete responsive web experience from requirements. Use for production-oriented pages, dashboards, admin consoles, or product UIs.
- [`vis-reverse-ui`](skills/design/vis-reverse-ui/SKILL.md) `[Design]`: Reverse engineer or clone a web UI, screenshot, or mockup into exact design tokens and atomic CSS specifications: spacing, colors, typography read from computed styles. Use when copying, replicating, or extracting a look into reusable tokens.
- [`eng-adversarial-audit`](skills/engineering/eng-adversarial-audit/SKILL.md) `[Engineering]`: Perform adversarial code and architecture audits. Use for security vulnerabilities, concurrency risks, threat analysis, or mission-critical systems.
- [`eng-analyze-codebase`](skills/engineering/eng-analyze-codebase/SKILL.md) `[Engineering]`: Analyze codebase architecture, directory topology, design patterns, and dependency graphs. Use when onboarding, planning refactorings, auditing architecture, or evaluating project structure.
- [`eng-bugfix-implement`](skills/engineering/eng-bugfix-implement/SKILL.md) `[Engineering]`: Implement the surgical patch and regression test laid out in an existing RCA report (the rca.md produced by eng-bugfix-rca). Use only when that report already exists; never as the starting point for a bug.
- [`eng-bugfix-rca`](skills/engineering/eng-bugfix-rca/SKILL.md) `[Engineering]`: Investigate software bugs or GitHub issues and produce a structured Root Cause Analysis (RCA) document. Use when diagnosing defects, analyzing bug reports, and designing targeted bug fixes.
- [`eng-change-scope-funnel`](skills/engineering/eng-change-scope-funnel/SKILL.md) `[Engineering]`: Narrow the true change surface before editing through keyword search, call-chain tracing, and blast-radius analysis, producing a whitelist of files to modify. Use between planning and execution, or before any risky change, to prevent collateral edits.
- [`eng-code-review`](skills/engineering/eng-code-review/SKILL.md) `[Engineering]`: Review code changes or repositories against engineering standards and the originating spec. Use before merge, release, or architecture-sensitive changes.
- [`eng-completion-gate`](skills/engineering/eng-completion-gate/SKILL.md) `[Engineering]`: Produce an evidence-backed completion verdict. Use at the end of a workflow to distinguish DONE, accepted risks, and BLOCKED states.
- [`eng-destructive-safety-gate`](skills/engineering/eng-destructive-safety-gate/SKILL.md) `[Engineering]`: Gate destructive operations behind two explicit user confirmations: file deletion, git reset or clean, force push, database drops, bulk overwrites, anything irreversible that wipes data or cannot be undone. Use whenever a planned action is destructive or unrecoverable.
- [`eng-execute`](skills/engineering/eng-execute/SKILL.md) `[Engineering]`: Carry out an approved plan: apply each coding task in dependency order and verify every step. Use when the plan already exists and coding should start; for producing the plan itself use eng-plan.
- [`eng-git-commit`](skills/engineering/eng-git-commit/SKILL.md) `[Engineering]`: Stage changes and craft atomic conventional commits safely, with a pre-stage readiness gate for secrets, debug prints, and hook conformance. Use when preparing or creating a commit.
- [`eng-hardening-review`](skills/engineering/eng-hardening-review/SKILL.md) `[Engineering]`: Audit data integrity and error handling across API, file, database, network, configuration, and input failure surfaces. Use before release or after implementation.
- [`eng-multidimensional-audit`](skills/engineering/eng-multidimensional-audit/SKILL.md) `[Engineering]`: Audit code across three architecture dimensions together: topology (spatial), end-to-end data flow (solid), and scenario walk-throughs (reverse). Use for architecture and maintainability findings; for security threats use eng-adversarial-audit.
- [`eng-plan`](skills/engineering/eng-plan/SKILL.md) `[Engineering]`: Produce the implementation plan for a feature or frozen spec: ordered coding phases, files to touch, and risks. Use when planning software work before coding starts; for carrying out an existing plan use eng-execute.
- [`eng-prime-context`](skills/engineering/eng-prime-context/SKILL.md) `[Engineering]`: Prime and build a comprehensive understanding of a codebase by analyzing directory structure, tech stack, conventions, and key entry points. Use when onboarding to a project or preparing context before starting development workflows.
- [`eng-review-fix`](skills/engineering/eng-review-fix/SKILL.md) `[Engineering]`: Turn review or audit findings into verified fixes through a seven-dimension pass (code scan, architecture, security, performance, reliability, remediation plan, validation); every fix lands with a regression test and suite-green proof. Use for hardening a change before delivery.
- [`eng-spec`](skills/engineering/eng-spec/SKILL.md) `[Engineering]`: Freeze requirements into executable specifications. Use when a change needs explicit contracts, acceptance criteria, or a stable input for planning.
- [`eng-validate`](skills/engineering/eng-validate/SKILL.md) `[Engineering]`: Run the project validation suite: linters, type checkers, unit and integration tests, and build verification. Use when validating project health or running the quality gate after code changes.
- [`prod-briefing-loop`](skills/productivity/prod-briefing-loop/SKILL.md) `[Productivity]`: Align requirements before any long deliverable: ask targeted clarification questions, check understanding, playback a frozen Brief contract, then gap-review the result. Use when a request is complex, ambiguous, or high-stakes and the agent should confirm before writing.
- [`prod-create-prd`](skills/productivity/prod-create-prd/SKILL.md) `[Productivity]`: Transform user stories and feature concepts into a formal Product Requirements Document (PRD): personas, KPIs, MVP scope, non-goals. Use when writing PRDs or scoping an MVP for a product; for engineering implementation plans use eng-plan.
- [`prod-execution-report`](skills/productivity/prod-execution-report/SKILL.md) `[Productivity]`: Generate a post-implementation retrospective report detailing changes, test results, divergences from the plan, and lessons learned. Use after completing a feature implementation.

---

## Production gates

A release is publishable only when all of the following hold:

- Skill manifests and invocation metadata are synchronized.
- Skill Tool dependencies target only model-invoked skills.
- Markdown links resolve and release text uses LF line endings.
- No empty files, runtime state, Git metadata, or build output are included in the production artifact.
- Security checks reject identity-hijacking, instruction-priority takeover, and hidden-state disclosure patterns.
- The version in `VERSION`, package metadata, plugin metadata, lockfile, and release manifest is identical.
- Every skill carries governance metadata (owner, status, maturity, review_due); no review is overdue.
- Critical-risk and network-capable skills are `governed` maturity with a current `security/network_policy.json` approval.
- The trigger eval suites pass at floor (train 90%, holdout and blind 100%) and output contracts hold (`npm run eval`).
- Skills write artifacts only into the four knowledge homes: `specs/`, `.scratch/`, `docs/adr/`, `docs/`.
- Every governed run appends an execution record (executor, skill, version, permissions, steps, results, risk, report) per ADR 0004.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
