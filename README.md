# AI Skills Pro

> Production-grade modular AI Agent skills library: 110 skills across engineering, productivity, design, and pipeline. One-command Autopilot pipelines, evidence-gated quality doors, and multi-harness compatibility (Claude Code, OpenAI Codex, DeepSeek Harness, Cursor, and the open Agent Skills standard).

![Skills](https://img.shields.io/badge/skills-110-blue) ![Validation](https://img.shields.io/badge/validation-110%2F110%20pass-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-%E2%89%A520.x-339933)

English | [简体中文](README.zh-CN.md)

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/IIXINGCHEN/ai-skills-pro.git
cd ai-skills-pro

# 2. Validate integrity
npm run validate

# 3. Install (symlink all 110 skills into your agent skill directories)
./scripts/link-skills.sh        # Linux / macOS
.\scripts\link-skills.ps1      # Windows PowerShell

# 4. Use in any Agent session
/eng-enterprise-lifecycle Build a user points redemption module
```

**One command, full pipeline.** The flagship Autopilot orchestrator runs 13 stages automatically (briefing, spec freeze, whitelist-scoped planning, coding, validation, multi-angle review, fix loop, completion verdict) and pauses only at 3 human gates (Brief, Plan, Push authorization).

---

## 🚀 11 One-Command Autopilot Workflows

| Command | Pipeline | Human Gates |
| :--- | :--- | :--- |
| `/pipe-ship` | Idea to production: grill, spec, tickets, implement (per-ticket loop), review, deepen, deliver, deploy | Spec, Tickets, Push, Release window |
| `/pipe-harden` | Existing project to green: audit, fix, test, re-fix loop, branch-PR-CI-review-merge | Fix scope, Push, Merge |
| `/eng-enterprise-lifecycle` | Full feature development (13 stages, fast-path aware) | Brief, Plan+whitelist, Push |
| `/eng-review-and-fix` | Review-to-green remediation loop (cap: 3 repair rounds) | None (auto-loop) |
| `/eng-review-and-ship` | Review-fix-verify-push delivery loop with 3-5-pass convergence gauntlet | Push authorization |
| `/eng-defect-lifecycle` | Bug fix: RCA to commit | RCA sign-off |
| `/eng-onboarding-audit-lifecycle` | Read-only codebase health inspection | None |
| `/eng-hotfix-emergency-lifecycle` | P0/P1 incident fast lane + postmortem | Hotfix approval |
| `/eng-refactor-lifecycle` | Behavior-preserving progressive refactoring | Plan sign-off |
| `/eng-release-ops-lifecycle` | Release window with rollback plans | Window approval |
| `/prod-content-delivery-lifecycle` | Brief-frozen content delivery | Brief sign-off |

---

## 🔄 Sequential Execution Pipelines

All skills work standalone and as interconnected stages in end-to-end pipelines:

### 1. Full Feature Development Lifecycle (新功能研发全链路)
```
[1. Briefing]             prod-briefing-loop ──► [Gate: Brief sign-off]
                                  │
[2. Context]              eng-prime-context ➔ eng-analyze-codebase
                                  │
[3. PRD (optional)]       prod-create-prd (new features only)
                                  │
[4. Spec Freeze]          eng-spec (requirements.md, design.md, checklist.md)
                                  │
[5. Plan + Whitelist]     eng-plan ➔ eng-change-scope-funnel ──► [Gate: Plan sign-off]
                                  │
[6. Implementation]       eng-execute (whitelist-bounded edits)
                                  │
[7. Validation First]     eng-validate (never review untested code)
                                  │
[8. Multi-Angle Review]   eng-multidimensional-audit ➔ eng-hardening-review
                                  │
[9. Fix Loop]             eng-review-fix (3-5 convergence passes) ➔ re-validate
                                  │
[10. Fix Verification]    Second independent review (fix diff only)
                                  │
[11. Completion Verdict]  eng-completion-gate (DONE / RISKS / BLOCKED)
                                  │
[12. Delivery]            eng-git-commit ➔ eng-git-pr ──► [Gate: Push authorization]
                                  │
[13. Retrospective]       prod-execution-report
```

### 2. Defect Investigation & Surgical Bugfix (缺陷排查与精准修复)
```
eng-bugfix-rca (red test first) ➔ [Gate: RCA sign-off] ➔ eng-bugfix-implement ➔ eng-validate ➔ eng-git-commit
```

### 3. Codebase Onboarding & Architecture Audit (代码库接手与架构巡检)
```
eng-prime-context ➔ eng-analyze-codebase ➔ eng-multidimensional-audit ➔ eng-validate ➔ Health Report
```

### 4. Ship: Idea to Production (想法到生产全链路)
```
/pipe-ship <feature-slug>
[1. Grill]      pipe-grill-plan ──► [Gate: shared understanding]
[2. Spec]       pipe-to-spec ──► [Gate: spec frozen]
[3. Tickets]    pipe-to-tickets ──► [Gate: breakdown approved]
[4. Implement]  pipe-implement per-ticket loop (implement, test, audit, review, fix, retest, refix; 3-cycle cap)
[5. Review]     eng-code-review ➔ eng-review-fix ──► [Gate: APPROVED]
[6. Deepen]     pipe-code-improve-architecture ──► [Gate: explore / park / end]
[7. Deliver]    eng-review-and-ship ──► [Gate: Push authorization]
[8. Deploy]     eng-release-ops-lifecycle ──► [Gate: Release window] ➔ health check ➔ rollback plan
```

### 5. Harden: Audit-Fix-Ship (存量项目加固)
```
/pipe-harden <project-dir>
[1. Audit]  eng-adversarial-audit / eng-code-review ──► [Gate: fix scope confirmed]
[2. Fix]    eng-review-fix (every fix with a regression test)
[3. Test]   eng-validate (full suite) ──► green? ──► [5. Ship] / red? ──► [4. Re-fix]
[4. Re-fix] diagnose ➔ minimal fix ➔ re-test (max 3 rounds per failure, then escalate)
[5. Ship]   branch ➔ PR ➔ CI (must be green) ➔ review ➔ squash-merge ──► [Gate: Push, Merge]
```

---

## 🌐 Skill Distillation Directory

This pack ships machine-readable metadata for skill distillation directories (e.g. everythingskill.net): per-skill `agents/openai.yaml` interface descriptors, bilingual summaries, and the canonical 110-skill registry. Generate a directory-ready entry any time:

```
npm run export:distillation
```

This writes `dist/everythingskill-entry.json`, ready to paste into a directory submission (web form, issue, or PR against the directory's `skills.json`).

---

## 🛡️ Built-In Safety Model

- **Evidence-based completion**: `eng-completion-gate` issues DONE / DONE-WITH-ACCEPTED-RISKS / BLOCKED verdicts; every claim maps to a verifiable artifact.
- **Destructive double-confirm**: `eng-destructive-safety-gate` requires two explicit confirmations plus a recovery artifact before any irreversible operation.
- **Readiness-only push**: `eng-git-pr` never pushes without explicit user instruction; protected branches are never force-pushed.
- **Whitelist-bound edits**: `eng-change-scope-funnel` locks the change surface before the first edit.
- **Test-first repair**: `eng-bugfix-rca` demands a failing test before any fix exists.

---

## Architecture & Invocation Model

Skills are organized into four buckets under `skills/`:
- **`skills/engineering/`** (42): lifecycle orchestrators, SDD core (spec, plan, execute), reviews and audits, safety gates, git delivery, DevOps, interactive procedure wizards.
- **`skills/productivity/`** (24): briefing loop, PRD, content delivery, prompt enhancement, session management, retrospectives, high-EQ replies, agent-consumed doc writing, domain modeling, and the writing explore/exploit pair.
- **`skills/design/`** (21): UI reverse engineering, 3D portrait compilation, anime stylization, product web experience design, the adaptive product-design suite, Apple-grade portfolio generation, the modern native UI architect, and the AxiomOS cognitive principles library.
- **`skills/pipeline/`** (23): the `pipe-ship` end-to-end pipeline (grill, spec, tickets, implement, review, deepen, deliver, deploy) plus its stage skills, and the `pipe-harden` fix loop (audit, fix, test, re-fix, ship via PR).

Every skill provides:
1. `SKILL.md`: unambiguous instructions with checkable completion criteria and anti-hallucination guardrails.
2. `agents/openai.yaml`: standard Codex and OpenAI interface metadata.
3. Companion documentation at `docs/<bucket>/<skill-name>.md`.

---

## 🧭 Complete Skills Catalog

### 1. Engineering Skills (`skills/engineering/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `eng-enterprise-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-enterprise-lifecycle/SKILL.md) | Run the end-to-end enterprise development lifecycle with explicit approval gates. |
| `eng-review-and-fix` | **User only** | [`SKILL.md`](skills/engineering/eng-review-and-fix/SKILL.md) | Review-and-remediate convergence loop that stops before delivery; for the same gauntlet ending in commits and an authorized push, run eng-review-and-ship instead. |
| `eng-review-and-ship` | **User only** | [`SKILL.md`](skills/engineering/eng-review-and-ship/SKILL.md) | Run the end-to-end review, remediation, verification, and authorized delivery lifecycle. |
| `eng-defect-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-defect-lifecycle/SKILL.md) | Run the end-to-end defect resolution lifecycle from RCA through verified delivery. |
| `eng-onboarding-audit-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md) | Run a read-only onboarding and codebase health audit for an unfamiliar repository. |
| `eng-hotfix-emergency-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md) | Run the emergency production hotfix lifecycle for an active P0 or P1 incident. |
| `eng-release-ops-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-release-ops-lifecycle/SKILL.md) | Run the production release-operations lifecycle with health checks and rollback planning. |
| `eng-refactor-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-refactor-lifecycle/SKILL.md) | Run the behavior-preserving progressive refactoring lifecycle for legacy systems. |
| `eng-router` | **User only** | [`SKILL.md`](skills/engineering/eng-router/SKILL.md) | Browse the engineering capability map and choose the right workflow or reusable skill for the current task. |
| `eng-security-audit` | Model / User | [`SKILL.md`](skills/engineering/eng-security-audit/SKILL.md) | Run a structured, evidence-first security audit of a codebase. Use for full security audits, vulnerability reviews, or pen-test-style assessments of code, APIs, services, CLIs, and libraries. |
| `eng-spec` | Model / User | [`SKILL.md`](skills/engineering/eng-spec/SKILL.md) | Freeze requirements into executable specifications. Use when a change needs explicit contracts, acceptance criteria, or a stable input for planning. |
| `eng-plan` | Model / User | [`SKILL.md`](skills/engineering/eng-plan/SKILL.md) | Produce the implementation plan for a feature or frozen spec: ordered coding phases, files to touch, and risks. Use when planning software work before coding starts; for carrying out an existing plan use eng-execute. |
| `eng-execute` | Model / User | [`SKILL.md`](skills/engineering/eng-execute/SKILL.md) | Carry out an approved plan: apply each coding task in dependency order and verify every step. Use when the plan already exists and coding should start; for producing the plan itself use eng-plan. |
| `eng-validate` | Model / User | [`SKILL.md`](skills/engineering/eng-validate/SKILL.md) | Run the project validation suite: linters, type checkers, unit and integration tests, and build verification. Use when validating project health or running the quality gate after code changes. |
| `eng-code-review` | Model / User | [`SKILL.md`](skills/engineering/eng-code-review/SKILL.md) | Review code changes or repositories against engineering standards and the originating spec. Use before merge, release, or architecture-sensitive changes. |
| `eng-multidimensional-audit` | Model / User | [`SKILL.md`](skills/engineering/eng-multidimensional-audit/SKILL.md) | Audit code across three architecture dimensions together: topology (spatial), end-to-end data flow (solid), and scenario walk-throughs (reverse). Use for architecture and maintainability findings; for security threats use eng-adversarial-audit. |
| `eng-hardening-review` | Model / User | [`SKILL.md`](skills/engineering/eng-hardening-review/SKILL.md) | Audit data integrity and error handling across API, file, database, network, configuration, and input failure surfaces. Use before release or after implementation. |
| `eng-adversarial-audit` | Model / User | [`SKILL.md`](skills/engineering/eng-adversarial-audit/SKILL.md) | Perform adversarial code and architecture audits. Use for security vulnerabilities, concurrency risks, threat analysis, or mission-critical systems. |
| `eng-review-fix` | Model / User | [`SKILL.md`](skills/engineering/eng-review-fix/SKILL.md) | Turn review or audit findings into verified fixes through a seven-dimension pass (code scan, architecture, security, performance, reliability, remediation plan, validation); every fix lands with a regression test and suite-green proof. Use for hardening a change before delivery. |
| `eng-completion-gate` | Model / User | [`SKILL.md`](skills/engineering/eng-completion-gate/SKILL.md) | Produce an evidence-backed completion verdict distinguishing DONE, accepted risks, and BLOCKED. Load when evaluating feature completion before final delivery. |
| `eng-destructive-safety-gate` | Model / User | [`SKILL.md`](skills/engineering/eng-destructive-safety-gate/SKILL.md) | Gate destructive operations behind two explicit user confirmations: file deletion, git reset or clean, force push, database drops, bulk overwrites, anything irreversible that wipes data or cannot be undone. Use whenever a planned action is destructive or unrecoverable. |
| `eng-change-scope-funnel` | Model / User | [`SKILL.md`](skills/engineering/eng-change-scope-funnel/SKILL.md) | Narrow the true change surface before editing through keyword search and blast-radius analysis. Load when planning risky changes or scoping modified files. |
| `eng-bugfix-rca` | Model / User | [`SKILL.md`](skills/engineering/eng-bugfix-rca/SKILL.md) | Investigate software bugs or GitHub issues and produce a structured Root Cause Analysis (RCA) document. Use when diagnosing defects, analyzing bug reports, and designing targeted bug fixes. |
| `eng-bugfix-implement` | Model / User | [`SKILL.md`](skills/engineering/eng-bugfix-implement/SKILL.md) | Implement the surgical patch and regression test laid out in an existing RCA report (the rca.md produced by eng-bugfix-rca). Use only when that report already exists; never as the starting point for a bug. |
| `eng-git-commit` | Model / User | [`SKILL.md`](skills/engineering/eng-git-commit/SKILL.md) | Prepare and create atomic, well-formatted Git commits safely. Load when staging changes, writing commit messages, or committing work. |
| `eng-git-pr` | **User only** | [`SKILL.md`](skills/engineering/eng-git-pr/SKILL.md) | Prepare and submit a GitHub pull request for the current branch. |
| `eng-prime-context` | Model / User | [`SKILL.md`](skills/engineering/eng-prime-context/SKILL.md) | Prime and build a comprehensive understanding of a codebase by analyzing directory structure, tech stack, conventions, and key entry points. Use when onboarding to a project or preparing context before starting development workflows. |
| `eng-analyze-codebase` | Model / User | [`SKILL.md`](skills/engineering/eng-analyze-codebase/SKILL.md) | Analyze codebase architecture, directory topology, design patterns, and dependency graphs. Use when onboarding, planning refactorings, auditing architecture, or evaluating project structure. |
| `eng-docker-update` | **User only** | [`SKILL.md`](skills/engineering/eng-docker-update/SKILL.md) | Update Docker Compose images with health checks and rollback safeguards. |
| `eng-linux-security` | **User only** | [`SKILL.md`](skills/engineering/eng-linux-security/SKILL.md) | Harden Linux hosts with port-scan detection and firewall safeguards. |
| `code-review` | Model / User | [`SKILL.md`](skills/engineering/code-review/SKILL.md) | Two-axis review of the diff between HEAD and a fixed point the user supplies: - Standards: does the code conform to this repo's documented coding standards? - Spec: does the code faithfully implement the originating issue / spec? |
| `codebase-design` | Model / User | [`SKILL.md`](skills/engineering/codebase-design/SKILL.md) | Design deep modules: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. Use this language and these principles wherever code is being designed or restructured. |
| `diagnosing-bugs` | Model / User | [`SKILL.md`](skills/engineering/diagnosing-bugs/SKILL.md) | A discipline for hard bugs. Skip phases only when explicitly justified. |
| `domain-modeling` | Model / User | [`SKILL.md`](skills/engineering/domain-modeling/SKILL.md) | Actively build and sharpen the project's domain model as you design. This is the *active* discipline: challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. |
| `git-guardrails-claude-code` | Model / User | [`SKILL.md`](skills/engineering/git-guardrails-claude-code/SKILL.md) | Sets up a PreToolUse hook that intercepts and blocks dangerous git commands before Claude executes them. |
| `implement` | Model / User | [`SKILL.md`](skills/engineering/implement/SKILL.md) | Implement the work described by the user in the spec or tickets. |
| `implement-spec` | Model / User | [`SKILL.md`](skills/engineering/implement-spec/SKILL.md) | You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec. |
| `pi-setup` | Model / User | [`SKILL.md`](skills/engineering/pi-setup/SKILL.md) | 帮用户从零配置 Pi Agent，搭配 DeepSeek V4（内置）+ Ant-Ling Ring-2.6-1T（单模型自定义 provider）+ ZenMux（多模型聚合 provider，含 Gemini 3.5 Flash、inclusionAI Ling-3.0-flash、Claude、GPT 等），装一套精选扩展，并自动规避 12 个已知坑。 |
| `scaffold-exercises` | Model / User | [`SKILL.md`](skills/engineering/scaffold-exercises/SKILL.md) | Create exercise directory structures that pass pnpm ai-hero-cli internal lint. Leaves the new files uncommitted in the working tree for the user to review. |
| `setup-pre-commit` | Model / User | [`SKILL.md`](skills/engineering/setup-pre-commit/SKILL.md) | Install Husky + lint-staged + Prettier and configure the pre-commit hook; detects the package manager from the lockfile first (npm/pnpm/yarn/bun, defaults to npm if unclear). |
| `tdd` | Model / User | [`SKILL.md`](skills/engineering/tdd/SKILL.md) | Run the red to green loop so each cycle produces tests worth keeping. Consult every section before and during the loop, not after. |
| `eng-wizard` | **User only** | [`SKILL.md`](skills/engineering/eng-wizard/SKILL.md) | Generate a guided bash walkthrough for procedures only a human can perform: provisioning third-party services, entering CI secrets, one-off migrations. The agent defines the stages; the human runs the script. |

### 2. Productivity Skills (`skills/productivity/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `prod-briefing-loop` | Model / User | [`SKILL.md`](skills/productivity/prod-briefing-loop/SKILL.md) | Align requirements before any long deliverable: ask targeted clarification questions, check understanding, playback a frozen Brief contract, then gap-review the result. Use when a request is complex, ambiguous, or high-stakes and the agent should confirm before writing. |
| `prod-content-delivery-lifecycle` | **User only** | [`SKILL.md`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) | Run the end-to-end content delivery lifecycle from brief alignment through final delivery. |
| `prod-prompt-enhancer` | Model / User | [`SKILL.md`](skills/productivity/prod-prompt-enhancer/SKILL.md) | Transform a rough user instruction into a single enhanced prompt with no conversation, explanations, or surrounding formatting. Use when the user explicitly asks to enhance, rewrite, or optimize a prompt and wants only the improved text back. |
| `prod-create-prd` | Model / User | [`SKILL.md`](skills/productivity/prod-create-prd/SKILL.md) | Transform user stories and feature concepts into a formal Product Requirements Document (PRD): personas, KPIs, MVP scope, non-goals. Use when writing PRDs or scoping an MVP for a product; for engineering implementation plans use eng-plan. |
| `prod-project-init` | **User only** | [`SKILL.md`](skills/productivity/prod-project-init/SKILL.md) | Initialize a repository-specific development environment and setup guide. |
| `prod-mine-keywords` | Model / User | [`SKILL.md`](skills/productivity/prod-mine-keywords/SKILL.md) | Discover and evaluate breakout AI search keywords within the past 7 days for Google SEO, tool building, and micro-SaaS opportunities. Use when researching emerging AI trends, identifying keyword demand spikes, or evaluating standalone SEO site potential. |
| `prod-execution-report` | Model / User | [`SKILL.md`](skills/productivity/prod-execution-report/SKILL.md) | Generate a post-implementation retrospective report detailing changes, test results, divergences from the plan, and lessons learned. Use after completing a feature implementation. |
| `prod-compress-context` | **User only** | [`SKILL.md`](skills/productivity/prod-compress-context/SKILL.md) | Create a compact checkpoint of the current conversation and task state. |
| `prod-export-session` | **User only** | [`SKILL.md`](skills/productivity/prod-export-session/SKILL.md) | Export the current agent session logs, execution history, tool calls, and created artifacts into a structured markdown backup. |
| `prod-system-review` | **User only** | [`SKILL.md`](skills/productivity/prod-system-review/SKILL.md) | Review the development workflow after delivery and identify process improvements. |
| `prod-eq-reply` | **User only** | [`SKILL.md`](skills/productivity/prod-eq-reply/SKILL.md) | High-EQ reply assistant (Chinese-first): paste a received message or describe the situation, get 2-3 tactful reply versions (gentle, firm, humorous) with subtext decoding and a one-line rationale each. Use when the user asks for help replying, e.g. '帮我回一下', '怎么高情商回复', 'help me reply tactfully'. |
| `prod-writing-for-agents` | Model / User | [`SKILL.md`](skills/productivity/prod-writing-for-agents/SKILL.md) | 写给 agent 看的文档的方法论:context pointer 措辞、context 与 cognitive 双预算、信息层级阶梯、完成标准防提前收尾、剪枝猎杀 no-op。新建或改写 skill、AGENTS.md、任何 agent 消费的文档时调用。 |
| `prod-domain-model` | **User only** | [`SKILL.md`](skills/productivity/prod-domain-model/SKILL.md) | Domain-model producer (Chinese-first): sharpen fuzzy terms in a live session, challenge glossary conflicts on the spot, write settled terms back to the glossary immediately, and record hard-to-reverse decisions as ADRs only when all three gates pass. Use for term disputes like '把术语定下来'. User-triggered; for agent-driven modeling during design, the pipeline routes to engineering/domain-modeling instead. |
| `prod-writing-fragments` | **User only** | [`SKILL.md`](skills/productivity/prod-writing-fragments/SKILL.md) | Writing explore phase (Chinese-first): relentless grilling interviews that mine raw writing fragments (sharp lines, claims, vignettes, half-thoughts); append-only, never structures or drafts. Use when the user wants to explore what to write, e.g. '帮我挖写作素材', 'brainstorm writing fragments'. |
| `prod-ad-brief` | Model / User | [`SKILL.md`](skills/productivity/prod-ad-brief/SKILL.md) | Pin down what an ad must sell before any design work: offer, customer, pain, reward, single action, channel, and the provable facts behind every claim, frozen as an Ad Brief. Use when the user wants a poster, promo image, social ad, or ad copy and the offer is thin or unclear. |
| `prod-ad-lexicon` | Model / User | [`SKILL.md`](skills/productivity/prod-ad-lexicon/SKILL.md) | Translate a frozen Ad Brief and Style Spec into exact words: a Copy Lock of seven length-bounded poster fields that pass PRC Advertising Law wording rules, and a render prompt written in image-model vocabulary. Use when fuzzy wishes like 高级感, 点击欲, or 吸引人 must become precise visual or interaction terms, or when ad copy must be made compliant. |
| `prototype` | Model / User | [`SKILL.md`](skills/productivity/prototype/SKILL.md) | A prototype is throwaway code that answers a question. The question decides the shape. |
| `research` | Model / User | [`SKILL.md`](skills/productivity/research/SKILL.md) | Spin up a background agent to do the research, so you keep working while it reads. |
| `retro` | Model / User | [`SKILL.md`](skills/productivity/retro/SKILL.md) | The user has asked for a retrospective. You are suggesting improvements to the coding agent's environment to improve future runs. |
| `teach` | Model / User | [`SKILL.md`](skills/productivity/teach/SKILL.md) | The user has asked you to teach them something. This is a stateful request - they intend to learn the topic over multiple sessions. |
| `to-questionnaire` | Model / User | [`SKILL.md`](skills/productivity/to-questionnaire/SKILL.md) | Turn something the user can't answer alone into a fill-in questionnaire for someone else: who it goes to, what must come back, then the drafted document. Use when the user needs facts or decisions from a specific person and can't resolve them alone. |
| `wizard` | Model / User | [`SKILL.md`](skills/productivity/wizard/SKILL.md) | A wizard is a bash script that walks a human, step by step, through a manual procedure that's tedious to do by hand and tedious to re-explain to an AI every time. |
| `writing-for-agents` | Model / User | [`SKILL.md`](skills/productivity/writing-for-agents/SKILL.md) | Reference for writing any document an agent consumes: a skill, an AGENTS.md / CLAUDE.md, a doc reached by a pointer. The packaging differs; the writing does not: the same levers make each run take the same process rather than produce the same output. |
| `prod-writing-shape` | **User only** | [`SKILL.md`](skills/productivity/prod-writing-shape/SKILL.md) | Writing exploit phase (Chinese-first): turn a fixed pile of raw fragments into an article paragraph by paragraph; every concept is grounded before use, the opening is chosen by the user, each agreed block is written to disk immediately. Use when fragments exist and it is time to draft, e.g. '开始成文', 'shape my draft'. |

### 3. Design & Cognitive Skills (`skills/design/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `vis-reverse-ui` | Model / User | [`SKILL.md`](skills/design/vis-reverse-ui/SKILL.md) | Reverse engineer or clone a web UI, screenshot, or mockup into exact design tokens and atomic CSS specifications: spacing, colors, typography read from computed styles. Use when copying, replicating, or extracting a look into reusable tokens. |
| `vis-vtp-3d` | Model / User | [`SKILL.md`](skills/design/vis-vtp-3d/SKILL.md) | A structured visual translation protocol (VTP-3D-01) that compiles a reusable prompt package for turning real human portrait photographs into high-end, 3D animation feature-film characters (Pixar/DreamWorks/Disney quality) while preserving recognizable facial likeness. Delivers prompt specs, not rendered images. |
| `vis-anime-stylize` | Model / User | [`SKILL.md`](skills/design/vis-anime-stylize/SKILL.md) | Compile a reusable translation package (biometric mapping + image-model prompt spec + audit checklist) that turns a real human portrait photo into a clean, vibrant Japanese anime-style (cel-shaded) character illustration while preserving facial identity, hair color, expression, clothing, and composition. Delivers prompts, not rendered images. |
| `vis-product-web` | Model / User | [`SKILL.md`](skills/design/vis-product-web/SKILL.md) | Design and build a complete responsive web experience from requirements. Use for production-oriented pages, dashboards, admin consoles, or product UIs. |
| `vis-product-design` | Model / User | [`SKILL.md`](skills/design/vis-product-design/SKILL.md) | Route product-design requests through focused modes with shared context. Use for ideas, screenshots, prototypes, live URLs, UI audits, or reviewable frontend concepts. |
| `vis-apple-portfolio` | Model / User | [`SKILL.md`](skills/design/vis-apple-portfolio/SKILL.md) | Generate Apple-grade personal brand and portfolio web landing pages with an integrated dynamic island capsule, bento grid, scroll-driven career timeline, 3D card tilt, infinite marquee, and light/dark theme toggle. Use when creating modern, aesthetic personal websites, developer portfolios, or executive landing pages where user content can be seamlessly swapped into a pre-engineered design architecture. |
| `vis-modern-native-ui` | Model / User | [`SKILL.md`](skills/design/vis-modern-native-ui/SKILL.md) | Two-phase 2026 frontend UI architect: ASCII wireframe confirmation followed by zero-dependency native HTML/CSS/JS delivery. Load when building modern native web UIs or prototype-first pages. |
| `vis-reverse-video` | Model / User | [`SKILL.md`](skills/design/vis-reverse-video/SKILL.md) | Reverse engineer a video (URL or file) into its generation method, shot-by-shot breakdown, visual style profile, and reusable dual-version prompts. Use when the user asks how a video was made, wants its prompts extracted, or wants to recreate its style. |
| `ai-ui-enterprise-console` | Model / User | [`SKILL.md`](skills/design/ai-ui-enterprise-console/SKILL.md) | Enterprise Console architecture, UI and code delivery skill with project/greenfield modes, traceability, ADR/ARC and real verification boundaries. |
| `animation-vocabulary` | Model / User | [`SKILL.md`](skills/design/animation-vocabulary/SKILL.md) | Turn a vague description of a motion or effect into the precise term, so the user knows what to ask for. |
| `apple-design` | Model / User | [`SKILL.md`](skills/design/apple-design/SKILL.md) | How Apple builds interfaces that stop feeling like a computer and start feeling like an extension of you. This knowledge comes from Apple's WWDC design talks, chiefly *Designing Fluid Interfaces* (WWDC 2018), distilled and translated… |
| `ask-matt` | Model / User | [`SKILL.md`](skills/design/ask-matt/SKILL.md) | A flow is a path through the skills. Most paths run along one main flow, and two on-ramps merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath. |
| `find-animation-opportunities` | Model / User | [`SKILL.md`](skills/design/find-animation-opportunities/SKILL.md) | A search skill. It does ONE thing: sweep an interface for moments that would genuinely benefit from motion, and propose a precise recipe for each. |
| `frontend-design` | Model / User | [`SKILL.md`](skills/design/frontend-design/SKILL.md) | Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's. |
| `improve-animations` | Model / User | [`SKILL.md`](skills/design/improve-animations/SKILL.md) | An advisor skill modeled on the audit-then-plan workflow: use the capable model for the part where judgment compounds, understanding the codebase's motion, deciding what's worth fixing, writing the spec, and hand execution to any agent,… |
| `review-animations` | Model / User | [`SKILL.md`](skills/design/review-animations/SKILL.md) | A specialized review skill. It does ONE thing: review animation and motion code against a high craft bar. It does not write features, fix unrelated bugs, or review non-motion code. |
| `vis-ad-style` | Model / User | [`SKILL.md`](skills/design/vis-ad-style/SKILL.md) | Route a frozen Ad Brief to one visual style and write it down as a Style Spec: style route, palette tokens with hex codes, type, canvas zone map, and the value-leap hero scene. Use when choosing the look of a poster, social ad, or promo image, or when the user names a style such as Swiss Grid, Bento, or editorial collage. |
| `vis-amber-glass` | Model / User | [`SKILL.md`](skills/design/vis-amber-glass/SKILL.md) | Build a landing page in the warm-amber dark-glass style: deep warm-black backgrounds, one amber accent, floating glass pill nav, 24px+ radius cards, texture plus glow lighting, marquee / orbit / shiny-sweep motion. Use when the user asks for a premium dark SaaS, API or product landing page in this visual language, or names 'amber glass'. Pure layout and token system; contains no brand content. |
| `wait-what` | Model / User | [`SKILL.md`](skills/design/wait-what/SKILL.md) | Stop. That last message did not land: re-pitch it with context, in Simplified Technical English and the repo's ubiquitous language. |
| `web-design-guidelines` | Model / User | [`SKILL.md`](skills/design/web-design-guidelines/SKILL.md) | 1. Fetch the latest guidelines from the source URL below 2. Read the specified files (or prompt user for files/pattern) 3. Check against all rules in the fetched guidelines 4. Output findings in the terse file:line format |
| `cog-axiom` | Model / User | [`SKILL.md`](skills/design/cog-axiom/SKILL.md) | Architecture, security, compliance, context, and delivery reference guidance. Use when a task needs one of these principles or standards; consult only the relevant module. |

### 4. Pipeline Skills (`skills/pipeline/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `pipe-ship` | **User only** | [`SKILL.md`](skills/pipeline/pipe-ship/SKILL.md) | `pipe-ship <feature-slug>` takes one feature from raw idea to reviewed code, ready to merge, then looks for architectural deepening. |
| `pipe-harden` | **User only** | [`SKILL.md`](skills/pipeline/pipe-harden/SKILL.md) | Harden an existing project end to end: audit for issues, fix them, run the full test suite, re-fix until green, then ship through branch -> PR -> CI -> review -> merge. Gated stages, bounded fix loops, resumable runs. |
| `pipe-grill-plan` | Model / User | [`SKILL.md`](skills/pipeline/pipe-grill-plan/SKILL.md) | Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases. |
| `pipe-to-spec` | **User only** | [`SKILL.md`](skills/pipeline/pipe-to-spec/SKILL.md) | Turn the current conversation into a spec and publish it to the project issue tracker - no interview, just synthesis of what you've already discussed. |
| `pipe-to-tickets` | **User only** | [`SKILL.md`](skills/pipeline/pipe-to-tickets/SKILL.md) | Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker - edges as text in one file per ticket locally, or native blocking links on a real tracker. |
| `pipe-implement` | **User only** | [`SKILL.md`](skills/pipeline/pipe-implement/SKILL.md) | Implement a piece of work based on a spec or set of tickets. |
| `pipe-review-diff` | **User only** | [`SKILL.md`](skills/pipeline/pipe-review-diff/SKILL.md) | Human-style review of changes since a fixed point along Standards and Spec axes - does the diff follow repo standards, and does it match the Goal/spec? Use when reviewing a branch, PR, or post-implementation slice. Named pipe-review-diff to avoid colliding with `eng-code-review`. |
| `pipe-code-tdd` | Model / User | [`SKILL.md`](skills/pipeline/pipe-code-tdd/SKILL.md) | Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests. |
| `pipe-code-improve-architecture` | **User only** | [`SKILL.md`](skills/pipeline/pipe-code-improve-architecture/SKILL.md) | Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick. |
| `grill-me` | Model / User | [`SKILL.md`](skills/pipeline/grill-me/SKILL.md) | Alias skill: delegates to the grilling skill for a relentless interview that sharpens a plan or design. |
| `grill-with-docs` | Model / User | [`SKILL.md`](skills/pipeline/grill-with-docs/SKILL.md) | Alias skill: delegates to grilling plus domain-modeling, a relentless interview that also creates ADRs and glossary docs as you go. |
| `grilling` | Model / User | [`SKILL.md`](skills/pipeline/grilling/SKILL.md) | Interview the user relentlessly until you reach a shared understanding. Map this as a design tree: every decision branches into the decisions that hang off it. |
| `handoff` | Model / User | [`SKILL.md`](skills/pipeline/handoff/SKILL.md) | Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS - not the current workspace. |
| `improve-codebase-architecture` | Model / User | [`SKILL.md`](skills/pipeline/improve-codebase-architecture/SKILL.md) | Surface architectural friction and propose deepening opportunities: refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability. |
| `onekey-chain` | Model / User | [`SKILL.md`](skills/pipeline/onekey-chain/SKILL.md) | 把\"有一个想法\"到\"代码写完、审完、架构看完\"的完整链路一次走完，免去六次分别调用、每次重新讲上下文。适用于中等以上规模的新功能/新模块：一次调用，全程只在被链 skill 要求人工判断处暂停。 |
| `pipe-poster` | **User only** | [`SKILL.md`](skills/pipeline/pipe-poster/SKILL.md) | Run the poster loop for one offer: brief, style, lexicon, render, proofread, Moments post, delivery. One gated, resumable run per poster. |
| `pipeline` | Model / User | [`SKILL.md`](skills/pipeline/pipeline/SKILL.md) | 把一次交付走完一整条流水线：需求 → 实现 → 发布。三个硬约束： ① 实现/审计/测试是内循环，不干净不许出环； ② 发布前有全局审计＋全局测试两道门禁，全过才能发布； ③ 出环的代码必须是生产级（标准见 references/production-bar.md）。 |
| `pr` | Model / User | [`SKILL.md`](skills/pipeline/pr/SKILL.md) | 用 Summary/Evidence/Merge Danger 模板写 PR body（PR 描述正文）。 |
| `to-spec` | Model / User | [`SKILL.md`](skills/pipeline/to-spec/SKILL.md) | This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know. |
| `to-tickets` | Model / User | [`SKILL.md`](skills/pipeline/to-tickets/SKILL.md) | Break a plan, spec, or conversation into a set of tickets: tracer-bullet vertical slices, each declaring the tickets that block it. |
| `triage` | Model / User | [`SKILL.md`](skills/pipeline/triage/SKILL.md) | Move issues on the project issue tracker through a small state machine of triage roles. |
| `wayfinder` | Model / User | [`SKILL.md`](skills/pipeline/wayfinder/SKILL.md) | A loose idea has arrived, too big for one agent session, and wrapped in fog: the way from here to the destination isn't visible yet. Wayfinding is about finding that way, not charging at the destination. |
| `pipe-distill` | **User only** | [`SKILL.md`](skills/pipeline/pipe-distill/SKILL.md) | Distill how someone thinks into a runnable skill: mental models, decision heuristics, expression DNA, anti-patterns, and honesty boundaries. Use when the user asks to distill a person or topic, e.g. 'distill Feynman', 'make a Munger perspective skill', 'create a perspective on how X thinks'. |

---

## ⚡ Installation & Integration

### 1. Claude Code: Plugin Marketplace
```bash
# Inside a Claude Code session:
/plugin marketplace add IIXINGCHEN/ai-skills-pro
/plugin install ai-skills-pro@ai-skills-pro-marketplace

# Or via CLI:
claude plugin marketplace add IIXINGCHEN/ai-skills-pro
claude plugin install ai-skills-pro@ai-skills-pro-marketplace
```

### 2. Codex, Cursor, DSH & Other Agents: `skills` CLI
```bash
# Interactive install (pick agents and skills):
npx skills add IIXINGCHEN/ai-skills-pro

# Install ALL 110 skills globally without prompts:
npx skills add IIXINGCHEN/ai-skills-pro --skill '*' -g -y

# Install one specific skill:
npx skills add IIXINGCHEN/ai-skills-pro --skill eng-enterprise-lifecycle -g -y

# Preview available skills without installing:
npx skills add IIXINGCHEN/ai-skills-pro --list
```

### 3. Local Development (Direct Symlink)
```bash
# Linux / macOS:
./scripts/link-skills.sh

# Windows PowerShell:
.\scripts\link-skills.ps1
```

**Restricted Linux environments**: symlinks inside your own home directory need no root privileges. On symlink-disabled filesystems (corporate NFS mounts, hardened containers) the script automatically falls back to copying; re-run after upstream changes.

### Validate Skill Integrity
```bash
npm run validate        # structural, frontmatter, companion-doc, and em-dash gates
```

CI runs the same gate on every pull request via GitHub Actions: `.github/workflows/validate-skills.yml`.

---

## 🤝 Contributing

1. Add or modify a skill under `skills/<bucket>/<skill-name>/` with `SKILL.md` plus `agents/openai.yaml`.
2. Add companion documentation at `docs/<bucket>/<skill-name>.md`.
3. Register the skill path in `package.json` and `.claude-plugin/plugin.json`.
4. Run `npm run validate`; all gates must pass.
5. Follow repo prose rules: no em-dashes, positive phrasing, checkable completion criteria.

---

## 📄 License

MIT. See [LICENSE](LICENSE).