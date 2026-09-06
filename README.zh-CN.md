# AI Skills Pro 2.0.0

面向工程、生产力与设计工作的可组合 Agent Skills。2.0 遵循 `mattpocock/skills` 的核心 invocation 与组合模型：Skill 只按 User-invoked / Model-invoked 两类区分，Skill Tool 依赖只能指向 Model-invoked Skill，详细规则按需通过 context pointer 加载。

[上游参考](https://github.com/mattpocock/skills)

## 安装与验证

```bash
npm run validate
npm run release-check
```

Claude Code 使用 plugin / marketplace 安装；Codex 与其他兼容 Agent 通过对应的 skills installer 安装需要的 Skill。

## Invocation 模型

**User-invoked**：只能由用户显式启动的工作流或高影响操作。它可以向用户推荐其他 User-invoked Skill，但不会通过 Skill Tool 调用它们。

**Model-invoked**：模型和用户都可以调用的可复用能力。当任务匹配 description 时，模型可以自动发现它。User-invoked 工作流可以通过 Skill Tool 调用 Model-invoked 依赖。

## 渐进式加载

`SKILL.md` 只保留所有分支都需要的核心行为。分支专用 schema、模板、检查表和协议放在 Skill 旁边，仅在相关分支需要时加载。

## User-invoked Skills

- [`eng-defect-lifecycle`](skills/engineering/eng-defect-lifecycle/SKILL.md)：Run the end-to-end defect resolution lifecycle from RCA through verified delivery.
- [`eng-docker-update`](skills/engineering/eng-docker-update/SKILL.md)：Update Docker Compose images with health checks and rollback safeguards.
- [`eng-enterprise-lifecycle`](skills/engineering/eng-enterprise-lifecycle/SKILL.md)：Run the end-to-end enterprise development lifecycle with explicit approval gates.
- [`eng-git-pr`](skills/engineering/eng-git-pr/SKILL.md)：Prepare and submit a GitHub pull request for the current branch.
- [`eng-hotfix-emergency-lifecycle`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md)：Run the emergency production hotfix lifecycle for an active P0 or P1 incident.
- [`eng-linux-security`](skills/engineering/eng-linux-security/SKILL.md)：Harden Linux hosts with port-scan detection and firewall safeguards.
- [`eng-onboarding-audit-lifecycle`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md)：Run a read-only onboarding and codebase health audit for an unfamiliar repository.
- [`eng-refactor-lifecycle`](skills/engineering/eng-refactor-lifecycle/SKILL.md)：Run the behavior-preserving progressive refactoring lifecycle for legacy systems.
- [`eng-release-ops-lifecycle`](skills/engineering/eng-release-ops-lifecycle/SKILL.md)：Run the production release-operations lifecycle with health checks and rollback planning.
- [`eng-review-and-fix`](skills/engineering/eng-review-and-fix/SKILL.md)：Execute the review-and-remediate loop in one command: review changes, triage findings, apply surgical fixes, re-validate, and produce a consolidated report.
- [`eng-review-and-ship`](skills/engineering/eng-review-and-ship/SKILL.md)：Run the end-to-end review, remediation, verification, and authorized delivery lifecycle.
- [`eng-router`](skills/engineering/eng-router/SKILL.md)：Browse the engineering capability map and choose the right workflow or reusable skill for the current task.
- [`prod-compress-context`](skills/productivity/prod-compress-context/SKILL.md)：Create a compact checkpoint of the current conversation and task state.
- [`prod-content-delivery-lifecycle`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md)：Run the end-to-end content delivery lifecycle from brief alignment through final delivery.
- [`prod-export-session`](skills/productivity/prod-export-session/SKILL.md)：Export the current agent session history and artifacts into a structured backup.
- [`prod-project-init`](skills/productivity/prod-project-init/SKILL.md)：Initialize a repository-specific development environment and setup guide.
- [`prod-prompt-enhancer`](skills/productivity/prod-prompt-enhancer/SKILL.md)：Transform a user-provided instruction into a single improved prompt.
- [`prod-system-review`](skills/productivity/prod-system-review/SKILL.md)：Review the development workflow after delivery and identify process improvements.

## Model-invoked Skills

- [`cog-axiom`](skills/design/cog-axiom/SKILL.md)：Architecture, security, compliance, context, and delivery reference guidance. Use when a task needs one of these principles or standards; consult only the relevant module.
- [`vis-anime-stylize`](skills/design/vis-anime-stylize/SKILL.md)：Create Japanese anime-style cel-shaded illustrations from real human portraits. Use when stylizing portraits, generating anime avatars, or compiling image-generation prompts.
- [`vis-product-design`](skills/design/vis-product-design/SKILL.md)：Route product-design requests through focused modes with shared context. Use for ideas, screenshots, prototypes, live URLs, UI audits, or reviewable frontend concepts.
- [`vis-product-web`](skills/design/vis-product-web/SKILL.md)：Design and build a complete responsive web experience from requirements. Use for production-oriented pages, dashboards, admin consoles, or product UIs.
- [`vis-reverse-ui`](skills/design/vis-reverse-ui/SKILL.md)：Reverse engineer web UIs into design tokens and CSS specifications. Use when extracting styles, replicating components, or converting rendered UI into reusable tokens.
- [`vis-vtp-3d`](skills/design/vis-vtp-3d/SKILL.md)：Translate real portrait photos into high-end 3D character-art prompts. Use when preserving facial identity while compiling multi-layer image-generation guidance.
- [`eng-adversarial-audit`](skills/engineering/eng-adversarial-audit/SKILL.md)：Perform adversarial code and architecture audits. Use for security vulnerabilities, concurrency risks, threat analysis, or mission-critical systems.
- [`eng-analyze-codebase`](skills/engineering/eng-analyze-codebase/SKILL.md)：Analyze codebase architecture, directory topology, design patterns, and dependency graphs. Use when onboarding, planning refactorings, auditing architecture, or evaluating project structure.
- [`eng-bugfix-implement`](skills/engineering/eng-bugfix-implement/SKILL.md)：Implement a surgical bug fix based on an existing Root Cause Analysis (RCA) document. Use when applying bug fixes, adding regression tests, and verifying bug remediation.
- [`eng-bugfix-rca`](skills/engineering/eng-bugfix-rca/SKILL.md)：Investigate software bugs or GitHub issues and produce a structured Root Cause Analysis (RCA) document. Use when diagnosing defects, analyzing bug reports, and designing targeted bug fixes.
- [`eng-change-scope-funnel`](skills/engineering/eng-change-scope-funnel/SKILL.md)：Narrow the true change surface before editing through keyword search, call-chain tracing, and blast-radius analysis, producing a whitelist of files to modify. Use between planning and execution, or before any risky change, to prevent collateral edits.
- [`eng-code-review`](skills/engineering/eng-code-review/SKILL.md)：Review code changes or repositories against engineering standards and the originating spec. Use before merge, release, or architecture-sensitive changes.
- [`eng-completion-gate`](skills/engineering/eng-completion-gate/SKILL.md)：Produce an evidence-backed completion verdict. Use at the end of a workflow to distinguish DONE, accepted risks, and BLOCKED states.
- [`eng-destructive-safety-gate`](skills/engineering/eng-destructive-safety-gate/SKILL.md)：Require two explicit user confirmations before executing any destructive operation such as file deletion, git reset or clean, force push, database drops, or bulk overwrites. Use whenever a planned action is irreversible or destroys user data.
- [`eng-execute`](skills/engineering/eng-execute/SKILL.md)：Execute an approved implementation plan systematically step by step. Use when implementing tasks from a plan file, applying code changes in dependency order, and validating each step.
- [`eng-git-commit`](skills/engineering/eng-git-commit/SKILL.md)：Prepare and create atomic Git commits safely.
- [`eng-hardening-review`](skills/engineering/eng-hardening-review/SKILL.md)：Audit data integrity and error handling across API, file, database, network, configuration, and input failure surfaces. Use before release or after implementation.
- [`eng-multidimensional-audit`](skills/engineering/eng-multidimensional-audit/SKILL.md)：Execute comprehensive multi-dimensional code reviews and deep architectural repairs using spatial thinking (architecture topology), solid thinking (end-to-end data flow), and reverse thinking (scenario/threat deduction).
- [`eng-plan`](skills/engineering/eng-plan/SKILL.md)：Transform a feature request, user story, or frozen specification (specs/) into a comprehensive, context-rich, one-pass implementation plan. Use when planning new features, major refactorings, or preparing step-by-step tasks before coding.
- [`eng-prime-context`](skills/engineering/eng-prime-context/SKILL.md)：Prime and build a comprehensive understanding of a codebase by analyzing directory structure, tech stack, conventions, and key entry points. Use when onboarding to a project or preparing context before starting development workflows.
- [`eng-review-fix`](skills/engineering/eng-review-fix/SKILL.md)：Systematically remediate and fix issues identified in a code review report. Use when applying review feedback, resolving findings, and verifying fixes with automated tests.
- [`eng-spec`](skills/engineering/eng-spec/SKILL.md)：Freeze requirements into executable specifications. Use when a change needs explicit contracts, acceptance criteria, or a stable input for planning.
- [`eng-validate`](skills/engineering/eng-validate/SKILL.md)：Run comprehensive project validation including syntax checks, linters, type checkers, unit tests, integration tests, and build verification. Use when validating project health or running quality gates.
- [`prod-briefing-loop`](skills/productivity/prod-briefing-loop/SKILL.md)：Align requirements, clarify ambiguities with targeted questions, playback a frozen Brief contract, and perform post-generation gap review. Use when handling complex, ambiguous, or high-stakes requests before generating full deliverables.
- [`prod-create-prd`](skills/productivity/prod-create-prd/SKILL.md)：Transform conversational requirements, user stories, and feature concepts into a formal, comprehensive Product Requirements Document (PRD). Use when planning products, writing specifications, or scoping MVPs.
- [`prod-execution-report`](skills/productivity/prod-execution-report/SKILL.md)：Generate a post-implementation retrospective report detailing changes, test results, divergences from the plan, and lessons learned. Use after completing a feature implementation.
- [`prod-mine-keywords`](skills/productivity/prod-mine-keywords/SKILL.md)：Discover and evaluate breakout AI search keywords within the past 7 days for Google SEO, tool building, and micro-SaaS opportunities. Use when researching emerging AI trends, identifying keyword demand spikes, or evaluating standalone SEO site potential.

## 生产发布门禁

只有同时满足以下条件才允许发布：

- Skill 清单与 invocation 元数据完全同步。
- Skill Tool 依赖只指向 Model-invoked Skill。
- Markdown 链接全部有效，文本统一使用 LF。
- 生产包不包含空文件、运行态状态、Git 元数据或构建产物。
- 安全检查拒绝身份劫持、指令优先级接管和隐藏状态泄露模式。
- `VERSION`、package、plugin、lockfile 与 release manifest 的版本完全一致。
