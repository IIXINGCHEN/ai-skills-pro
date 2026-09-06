# AI Skills Pro 2.0.0

Composable Agent Skills for engineering, productivity, and design work. The pack follows the invocation and composition model used by `mattpocock/skills`: user-invoked and model-invoked are the two reachability classes, Skill Tool dependencies target model-invoked skills, and detailed guidance is disclosed only when a task needs it.

English | [简体中文](README.zh-CN.md)

![Version](https://img.shields.io/badge/version-2.0.0-blue) ![Skills](https://img.shields.io/badge/skills-45-blue) ![Validation](https://img.shields.io/badge/validation-45%2F45%20pass-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green)

[Upstream reference](https://github.com/mattpocock/skills)

---

## ⚡ Installation & Validation

### 1. Claude Code: Plugin Marketplace
```bash
# Inside a Claude Code session:
/plugin marketplace add IIXINGCHEN/ai-skills-pro
/plugin install ai-skills-pro@ai-skills-pro-marketplace

# Or via CLI:
claude plugin marketplace add IIXINGCHEN/ai-skills-pro
claude plugin install ai-skills-pro@ai-skills-pro-marketplace
```

### 2. Codex, Cursor, DSH & Open Agent Skills CLI
```bash
# Install all 45 skills globally without prompts:
npx skills add IIXINGCHEN/ai-skills-pro --skill '*' -g -y

# Or install one specific skill:
npx skills add IIXINGCHEN/ai-skills-pro --skill eng-enterprise-lifecycle -g -y
```

### 3. Local Development (Direct Symlink)
```bash
# Linux / macOS:
./scripts/link-skills.sh

# Windows PowerShell:
.\scripts\link-skills.ps1
```

### 4. Integrity Validation
```bash
npm run validate
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
- [`eng-review-and-fix`](skills/engineering/eng-review-and-fix/SKILL.md) `[Engineering]`: Execute the review-and-remediate loop in one command: review changes, triage findings, apply surgical fixes, re-validate, and produce a consolidated report.
- [`eng-review-and-ship`](skills/engineering/eng-review-and-ship/SKILL.md) `[Engineering]`: Run the end-to-end review, remediation, verification, and authorized delivery lifecycle.
- [`eng-router`](skills/engineering/eng-router/SKILL.md) `[Engineering]`: Browse the engineering capability map and choose the right workflow or reusable skill for the current task.
- [`prod-compress-context`](skills/productivity/prod-compress-context/SKILL.md) `[Productivity]`: Create a compact checkpoint of the current conversation and task state.
- [`prod-content-delivery-lifecycle`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) `[Productivity]`: Run the end-to-end content delivery lifecycle from brief alignment through final delivery.
- [`prod-export-session`](skills/productivity/prod-export-session/SKILL.md) `[Productivity]`: Export the current agent session history and artifacts into a structured backup.
- [`prod-project-init`](skills/productivity/prod-project-init/SKILL.md) `[Productivity]`: Initialize a repository-specific development environment and setup guide.
- [`prod-prompt-enhancer`](skills/productivity/prod-prompt-enhancer/SKILL.md) `[Productivity]`: Transform a user-provided instruction into a single improved prompt.
- [`prod-system-review`](skills/productivity/prod-system-review/SKILL.md) `[Productivity]`: Review the development workflow after delivery and identify process improvements.

---

## Model-invoked skills (27)

- [`cog-axiom`](skills/design/cog-axiom/SKILL.md) `[Design]`: Architecture, security, compliance, context, and delivery reference guidance. Use when a task needs one of these principles or standards; consult only the relevant module.
- [`vis-anime-stylize`](skills/design/vis-anime-stylize/SKILL.md) `[Design]`: Create Japanese anime-style cel-shaded illustrations from real human portraits. Use when stylizing portraits, generating anime avatars, or compiling image-generation prompts.
- [`vis-product-design`](skills/design/vis-product-design/SKILL.md) `[Design]`: Route product-design requests through focused modes with shared context. Use for ideas, screenshots, prototypes, live URLs, UI audits, or reviewable frontend concepts.
- [`vis-product-web`](skills/design/vis-product-web/SKILL.md) `[Design]`: Design and build a complete responsive web experience from requirements. Use for production-oriented pages, dashboards, admin consoles, or product UIs.
- [`vis-reverse-ui`](skills/design/vis-reverse-ui/SKILL.md) `[Design]`: Reverse engineer web UIs into design tokens and CSS specifications. Use when extracting styles, replicating components, or converting rendered UI into reusable tokens.
- [`vis-vtp-3d`](skills/design/vis-vtp-3d/SKILL.md) `[Design]`: Translate real portrait photos into high-end 3D character-art prompts. Use when preserving facial identity while compiling multi-layer image-generation guidance.
- [`eng-adversarial-audit`](skills/engineering/eng-adversarial-audit/SKILL.md) `[Engineering]`: Perform adversarial code and architecture audits. Use for security vulnerabilities, concurrency risks, threat analysis, or mission-critical systems.
- [`eng-analyze-codebase`](skills/engineering/eng-analyze-codebase/SKILL.md) `[Engineering]`: Analyze codebase architecture, directory topology, design patterns, and dependency graphs. Use when onboarding, planning refactorings, auditing architecture, or evaluating project structure.
- [`eng-bugfix-implement`](skills/engineering/eng-bugfix-implement/SKILL.md) `[Engineering]`: Implement a surgical bug fix based on an existing Root Cause Analysis (RCA) document. Use when applying bug fixes, adding regression tests, and verifying bug remediation.
- [`eng-bugfix-rca`](skills/engineering/eng-bugfix-rca/SKILL.md) `[Engineering]`: Investigate software bugs or GitHub issues and produce a structured Root Cause Analysis (RCA) document. Use when diagnosing defects, analyzing bug reports, and designing targeted bug fixes.
- [`eng-change-scope-funnel`](skills/engineering/eng-change-scope-funnel/SKILL.md) `[Engineering]`: Narrow the true change surface before editing through keyword search, call-chain tracing, and blast-radius analysis, producing a whitelist of files to modify. Use between planning and execution, or before any risky change, to prevent collateral edits.
- [`eng-code-review`](skills/engineering/eng-code-review/SKILL.md) `[Engineering]`: Review code changes or repositories against engineering standards and the originating spec. Use before merge, release, or architecture-sensitive changes.
- [`eng-completion-gate`](skills/engineering/eng-completion-gate/SKILL.md) `[Engineering]`: Produce an evidence-backed completion verdict. Use at the end of a workflow to distinguish DONE, accepted risks, and BLOCKED states.
- [`eng-destructive-safety-gate`](skills/engineering/eng-destructive-safety-gate/SKILL.md) `[Engineering]`: Require two explicit user confirmations before executing any destructive operation such as file deletion, git reset or clean, force push, database drops, or bulk overwrites. Use whenever a planned action is irreversible or destroys user data.
- [`eng-execute`](skills/engineering/eng-execute/SKILL.md) `[Engineering]`: Execute an approved implementation plan systematically step by step. Use when implementing tasks from a plan file, applying code changes in dependency order, and validating each step.
- [`eng-git-commit`](skills/engineering/eng-git-commit/SKILL.md) `[Engineering]`: Prepare and create atomic Git commits safely.
- [`eng-hardening-review`](skills/engineering/eng-hardening-review/SKILL.md) `[Engineering]`: Audit data integrity and error handling across API, file, database, network, configuration, and input failure surfaces. Use before release or after implementation.
- [`eng-multidimensional-audit`](skills/engineering/eng-multidimensional-audit/SKILL.md) `[Engineering]`: Execute comprehensive multi-dimensional code reviews and deep architectural repairs using spatial thinking (architecture topology), solid thinking (end-to-end data flow), and reverse thinking (scenario/threat deduction).
- [`eng-plan`](skills/engineering/eng-plan/SKILL.md) `[Engineering]`: Transform a feature request, user story, or frozen specification (specs/) into a comprehensive, context-rich, one-pass implementation plan. Use when planning new features, major refactorings, or preparing step-by-step tasks before coding.
- [`eng-prime-context`](skills/engineering/eng-prime-context/SKILL.md) `[Engineering]`: Prime and build a comprehensive understanding of a codebase by analyzing directory structure, tech stack, conventions, and key entry points. Use when onboarding to a project or preparing context before starting development workflows.
- [`eng-review-fix`](skills/engineering/eng-review-fix/SKILL.md) `[Engineering]`: Systematically remediate and fix issues identified in a code review report. Use when applying review feedback, resolving findings, and verifying fixes with automated tests.
- [`eng-spec`](skills/engineering/eng-spec/SKILL.md) `[Engineering]`: Freeze requirements into executable specifications. Use when a change needs explicit contracts, acceptance criteria, or a stable input for planning.
- [`eng-validate`](skills/engineering/eng-validate/SKILL.md) `[Engineering]`: Run comprehensive project validation including syntax checks, linters, type checkers, unit tests, integration tests, and build verification. Use when validating project health or running quality gates.
- [`prod-briefing-loop`](skills/productivity/prod-briefing-loop/SKILL.md) `[Productivity]`: Align requirements, clarify ambiguities with targeted questions, playback a frozen Brief contract, and perform post-generation gap review. Use when handling complex, ambiguous, or high-stakes requests before generating full deliverables.
- [`prod-create-prd`](skills/productivity/prod-create-prd/SKILL.md) `[Productivity]`: Transform conversational requirements, user stories, and feature concepts into a formal, comprehensive Product Requirements Document (PRD). Use when planning products, writing specifications, or scoping MVPs.
- [`prod-execution-report`](skills/productivity/prod-execution-report/SKILL.md) `[Productivity]`: Generate a post-implementation retrospective report detailing changes, test results, divergences from the plan, and lessons learned. Use after completing a feature implementation.
- [`prod-mine-keywords`](skills/productivity/prod-mine-keywords/SKILL.md) `[Productivity]`: Discover and evaluate breakout AI search keywords within the past 7 days for Google SEO, tool building, and micro-SaaS opportunities. Use when researching emerging AI trends, identifying keyword demand spikes, or evaluating standalone SEO site potential.

---

## Production gates

A release is publishable only when all of the following hold:

- Skill manifests and invocation metadata are synchronized.
- Skill Tool dependencies target only model-invoked skills.
- Markdown links resolve and release text uses LF line endings.
- No empty files, runtime state, Git metadata, or build output are included in the production artifact.
- Security checks reject identity-hijacking, instruction-priority takeover, and hidden-state disclosure patterns.
- The version in `VERSION`, package metadata, plugin metadata, lockfile, and release manifest is identical.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
