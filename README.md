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
[6. Deepen]     code-improve-architecture ──► [Gate: explore / park / end]
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

This pack ships machine-readable metadata for skill distillation directories (e.g. everythingskill.net): per-skill `agents/openai.yaml` interface descriptors, bilingual summaries, and the canonical 63-skill registry. Generate a directory-ready entry any time:

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
- **`skills/engineering/`** (30): lifecycle orchestrators, SDD core (spec, plan, execute), reviews and audits, safety gates, git delivery, DevOps, interactive procedure wizards.
- **`skills/productivity/`** (15): briefing loop, PRD, content delivery, prompt enhancement, session management, retrospectives, high-EQ replies, agent-consumed doc writing, domain modeling, and the writing explore/exploit pair.
- **`skills/design/`** (8): UI reverse engineering, 3D portrait compilation, anime stylization, product web experience design, the adaptive product-design suite, Apple-grade portfolio generation, the modern native UI architect, and the AxiomOS cognitive principles library.
- **`skills/pipeline/`** (10): the `pipe-ship` end-to-end pipeline (grill, spec, tickets, implement, review, deepen, deliver, deploy) plus its stage skills, and the `pipe-harden` fix loop (audit, fix, test, re-fix, ship via PR).

Every skill provides:
1. `SKILL.md`: unambiguous instructions with checkable completion criteria and anti-hallucination guardrails.
2. `agents/openai.yaml`: standard Codex and OpenAI interface metadata.
3. Companion documentation at `docs/<bucket>/<skill-name>.md`.

---

## 🧭 Complete Skills Catalog

### 1. Engineering Skills (`skills/engineering/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `eng-enterprise-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-enterprise-lifecycle/SKILL.md) | **Autopilot**: 13-stage enterprise pipeline, 3 human gates, fast-path |
| `eng-review-and-fix` | **User only** | [`SKILL.md`](skills/engineering/eng-review-and-fix/SKILL.md) | **Autopilot**: one-command review-to-green loop with triage |
| `eng-review-and-ship` | **User only** | [`SKILL.md`](skills/engineering/eng-review-and-ship/SKILL.md) | **Autopilot**: review-fix-verify loop ending in an authorized push to the matching repository |
| `eng-defect-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-defect-lifecycle/SKILL.md) | **Autopilot**: RCA-to-commit defect resolution loop |
| `eng-onboarding-audit-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md) | **Autopilot**: one-shot read-only codebase health inspection |
| `eng-hotfix-emergency-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md) | **Autopilot**: P0/P1 incident fast lane with mandatory postmortem |
| `eng-release-ops-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-release-ops-lifecycle/SKILL.md) | **Autopilot**: release window automation with rollback plans |
| `eng-refactor-lifecycle` | **User only** | [`SKILL.md`](skills/engineering/eng-refactor-lifecycle/SKILL.md) | **Autopilot**: behavior-preserving progressive refactoring |
| `eng-router` | **User only** | [`SKILL.md`](skills/engineering/eng-router/SKILL.md) | Central lifecycle router and orchestrator registry |
| `eng-security-audit` | Model / User | [`SKILL.md`](skills/engineering/eng-security-audit/SKILL.md) | Run a structured, evidence-first security audit of a codebase |
| `eng-spec` | Model / User | [`SKILL.md`](skills/engineering/eng-spec/SKILL.md) | **SDD**: freeze requirements and design contracts before coding |
| `eng-plan` | Model / User | [`SKILL.md`](skills/engineering/eng-plan/SKILL.md) | One-pass implementation plans grounded in verified codebase evidence |
| `eng-execute` | Model / User | [`SKILL.md`](skills/engineering/eng-execute/SKILL.md) | Whitelist-bounded step-by-step implementation |
| `eng-validate` | Model / User | [`SKILL.md`](skills/engineering/eng-validate/SKILL.md) | Full-suite health checks: linters, types, tests, builds |
| `eng-code-review` | Model / User | [`SKILL.md`](skills/engineering/eng-code-review/SKILL.md) | Six-dimension review with second independent post-fix pass |
| `eng-multidimensional-audit` | Model / User | [`SKILL.md`](skills/engineering/eng-multidimensional-audit/SKILL.md) | 3D audit: spatial topology, solid data flow, reverse threats |
| `eng-hardening-review` | Model / User | [`SKILL.md`](skills/engineering/eng-hardening-review/SKILL.md) | Data integrity plus six-surface error handling audit |
| `eng-adversarial-audit` | Model / User | [`SKILL.md`](skills/engineering/eng-adversarial-audit/SKILL.md) | First-principles security and architecture audit |
| `eng-review-fix` | Model / User | [`SKILL.md`](skills/engineering/eng-review-fix/SKILL.md) | Systematic remediation of review findings |
| `eng-completion-gate` | Model / User | [`SKILL.md`](skills/engineering/eng-completion-gate/SKILL.md) | Three-state completion verdict via evidence chain |
| `eng-destructive-safety-gate` | Model / User | [`SKILL.md`](skills/engineering/eng-destructive-safety-gate/SKILL.md) | Two-confirmation gate for irreversible operations |
| `eng-change-scope-funnel` | Model / User | [`SKILL.md`](skills/engineering/eng-change-scope-funnel/SKILL.md) | Pre-edit change surface whitelist contract |
| `eng-bugfix-rca` | Model / User | [`SKILL.md`](skills/engineering/eng-bugfix-rca/SKILL.md) | Root cause analysis with test-first evidence chain |
| `eng-bugfix-implement` | Model / User | [`SKILL.md`](skills/engineering/eng-bugfix-implement/SKILL.md) | Surgical fixes verified against the red-to-green repro test |
| `eng-git-commit` | Model / User | [`SKILL.md`](skills/engineering/eng-git-commit/SKILL.md) | Conventional atomic commits with readiness checklist |
| `eng-git-pr` | **User only** | [`SKILL.md`](skills/engineering/eng-git-pr/SKILL.md) | PR creation with readiness-only push policy |
| `eng-prime-context` | Model / User | [`SKILL.md`](skills/engineering/eng-prime-context/SKILL.md) | Rapid onboarding for unfamiliar repositories |
| `eng-analyze-codebase` | Model / User | [`SKILL.md`](skills/engineering/eng-analyze-codebase/SKILL.md) | Topology, circular dependencies, and pattern analysis |
| `eng-docker-update` | **User only** | [`SKILL.md`](skills/engineering/eng-docker-update/SKILL.md) | Zero-downtime container image updates |
| `eng-linux-security` | **User only** | [`SKILL.md`](skills/engineering/eng-linux-security/SKILL.md) | Port-scan detection and firewall automation |
| `code-review` | Model / User | [`SKILL.md`](skills/engineering/code-review/SKILL.md) | Two-axis review of the diff between HEAD and a fixed point the user supplies: - Standards: |
| `codebase-design` | Model / User | [`SKILL.md`](skills/engineering/codebase-design/SKILL.md) | Design deep modules: a lot of behaviour behind a small interface, placed at a clean seam |
| `diagnosing-bugs` | Model / User | [`SKILL.md`](skills/engineering/diagnosing-bugs/SKILL.md) | A discipline for hard bugs |
| `domain-modeling` | Model / User | [`SKILL.md`](skills/engineering/domain-modeling/SKILL.md) | Actively build and sharpen the project's domain model as you design |
| `git-guardrails-claude-code` | Model / User | [`SKILL.md`](skills/engineering/git-guardrails-claude-code/SKILL.md) | Sets up a PreToolUse hook that intercepts and blocks dangerous git commands before Claude |
| `implement` | Model / User | [`SKILL.md`](skills/engineering/implement/SKILL.md) | Implement the work described by the user in the spec or tickets |
| `implement-spec` | Model / User | [`SKILL.md`](skills/engineering/implement-spec/SKILL.md) | You have been provided a spec |
| `pi-setup` | Model / User | [`SKILL.md`](skills/engineering/pi-setup/SKILL.md) | 帮用户从零配置 Pi Agent，搭配 DeepSeek V4（内置）+ Ant-Ling Ring-2.6-1T（单模型自定义 provider）+ ZenMux（多模型聚合 |
| `scaffold-exercises` | Model / User | [`SKILL.md`](skills/engineering/scaffold-exercises/SKILL.md) | Create exercise directory structures that pass pnpm ai-hero-cli internal lint |
| `setup-pre-commit` | Model / User | [`SKILL.md`](skills/engineering/setup-pre-commit/SKILL.md) | Install Husky + lint-staged + Prettier and configure the pre-commit hook |
| `tdd` | Model / User | [`SKILL.md`](skills/engineering/tdd/SKILL.md) | Run the red to green loop so each cycle produces tests worth keeping |
| `eng-wizard` | **User only** | [`SKILL.md`](skills/engineering/eng-wizard/SKILL.md) | Generate interactive bash wizards for manual-only procedures (third-party provisioning, CI secrets, one-off migrations) |

### 2. Productivity Skills (`skills/productivity/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `prod-briefing-loop` | Model / User | [`SKILL.md`](skills/productivity/prod-briefing-loop/SKILL.md) | Four-stage alignment gate with gap review |
| `prod-content-delivery-lifecycle` | **User only** | [`SKILL.md`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) | **Autopilot**: brief-frozen content delivery |
| `prod-prompt-enhancer` | Model / User | [`SKILL.md`](skills/productivity/prod-prompt-enhancer/SKILL.md) | One-shot prompt enhancement, outputs only the improved text |
| `prod-create-prd` | Model / User | [`SKILL.md`](skills/productivity/prod-create-prd/SKILL.md) | Conversational requirements into formal PRD |
| `prod-project-init` | **User only** | [`SKILL.md`](skills/productivity/prod-project-init/SKILL.md) | Tech stack inspection and environment setup guides |
| `prod-mine-keywords` | Model / User | [`SKILL.md`](skills/productivity/prod-mine-keywords/SKILL.md) | Breakout AI search keyword discovery |
| `prod-execution-report` | Model / User | [`SKILL.md`](skills/productivity/prod-execution-report/SKILL.md) | Retrospective on plan adherence and test evidence |
| `prod-compress-context` | **User only** | [`SKILL.md`](skills/productivity/prod-compress-context/SKILL.md) | Compact session checkpoint |
| `prod-export-session` | **User only** | [`SKILL.md`](skills/productivity/prod-export-session/SKILL.md) | Session logs and artifacts to markdown |
| `prod-system-review` | **User only** | [`SKILL.md`](skills/productivity/prod-system-review/SKILL.md) | Meta-level workflow retrospective |
| `prod-eq-reply` | **User only** | [`SKILL.md`](skills/productivity/prod-eq-reply/SKILL.md) | High-EQ reply assistant (Chinese-first): 2-3 tactful reply versions with subtext decoding and a one-line rationale each |
| `prod-writing-for-agents` | Model / User | [`SKILL.md`](skills/productivity/prod-writing-for-agents/SKILL.md) | Methodology for writing docs agents consume: pointer wording, dual budgets, information hierarchy, pruning |
| `prod-domain-model` | **User only** | [`SKILL.md`](skills/productivity/prod-domain-model/SKILL.md) | Domain-model producer (Chinese-first): sharpen terms live, write settled terms back to the glossary, gate ADRs |
| `prod-writing-fragments` | **User only** | [`SKILL.md`](skills/productivity/prod-writing-fragments/SKILL.md) | Writing explore (Chinese-first): grilling interviews that mine raw fragments, append-only, never structures |
| `prod-ad-brief` | Model / User | [`SKILL.md`](skills/productivity/prod-ad-brief/SKILL.md) | Pin down what an ad must sell before any design work: offer, customer, pain, reward, single |
| `prod-ad-lexicon` | Model / User | [`SKILL.md`](skills/productivity/prod-ad-lexicon/SKILL.md) | Translate a frozen Ad Brief and Style Spec into exact words: a Copy Lock of seven |
| `prototype` | Model / User | [`SKILL.md`](skills/productivity/prototype/SKILL.md) | A prototype is throwaway code that answers a question |
| `research` | Model / User | [`SKILL.md`](skills/productivity/research/SKILL.md) | Spin up a background agent to do the research, so you keep working while it reads |
| `retro` | Model / User | [`SKILL.md`](skills/productivity/retro/SKILL.md) | The user has asked for a retrospective |
| `teach` | Model / User | [`SKILL.md`](skills/productivity/teach/SKILL.md) | The user has asked you to teach them something |
| `to-questionnaire` | Model / User | [`SKILL.md`](skills/productivity/to-questionnaire/SKILL.md) | Purpose: why this questionnaire exists and the decision riding on it |
| `wizard` | Model / User | [`SKILL.md`](skills/productivity/wizard/SKILL.md) | A wizard is a bash script that walks a human, step by step, through a manual procedure that's |
| `writing-for-agents` | Model / User | [`SKILL.md`](skills/productivity/writing-for-agents/SKILL.md) | Reference for writing any document an agent consumes: a skill, an AGENTS.md / CLAUDE.md, a doc |
| `prod-writing-shape` | **User only** | [`SKILL.md`](skills/productivity/prod-writing-shape/SKILL.md) | Writing exploit (Chinese-first): grow a frozen fragment pile into an article, paragraph by paragraph |

### 3. Design & Cognitive Skills (`skills/design/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `vis-reverse-ui` | Model / User | [`SKILL.md`](skills/design/vis-reverse-ui/SKILL.md) | Computed styles, layout trees, and CSS tokens from UI |
| `vis-vtp-3d` | Model / User | [`SKILL.md`](skills/design/vis-vtp-3d/SKILL.md) | 3D animation portrait prompt compiler |
| `vis-anime-stylize` | Model / User | [`SKILL.md`](skills/design/vis-anime-stylize/SKILL.md) | Anime cel-shaded stylization protocol |
| `vis-product-web` | Model / User | [`SKILL.md`](skills/design/vis-product-web/SKILL.md) | Requirements-to-production web experience builder: IA, design system, data-driven UI, motion |
| `vis-product-design` | Model / User | [`SKILL.md`](skills/design/vis-product-design/SKILL.md) | **Suite**: ideas, screenshots, and live URLs routed into reviewable prototypes (9 modes) |
| `vis-apple-portfolio` | Model / User | [`SKILL.md`](skills/design/vis-apple-portfolio/SKILL.md) | Apple-grade portfolio landing generator with dynamic island and bento grid |
| `vis-modern-native-ui` | Model / User | [`SKILL.md`](skills/design/vis-modern-native-ui/SKILL.md) | Two-phase 2026 native-stack UI architect: wireframe + schema confirmation gate, then production single-file code |
| `vis-reverse-video` | Model / User | [`SKILL.md`](skills/design/vis-reverse-video/SKILL.md) | Video reverse engineering: generation-method verdict, shot table, style profile, reusable prompts |
| `ai-ui-enterprise-console` | Model / User | [`SKILL.md`](skills/design/ai-ui-enterprise-console/SKILL.md) | Enterprise Console architecture, UI and code delivery skill with project/greenfield modes |
| `animation-vocabulary` | Model / User | [`SKILL.md`](skills/design/animation-vocabulary/SKILL.md) | Turn a vague description of a motion or effect into the precise term, so the user knows what |
| `apple-design` | Model / User | [`SKILL.md`](skills/design/apple-design/SKILL.md) | How Apple builds interfaces that stop feeling like a computer and start feeling like an |
| `ask-matt` | Model / User | [`SKILL.md`](skills/design/ask-matt/SKILL.md) | A flow is a path through the skills |
| `find-animation-opportunities` | Model / User | [`SKILL.md`](skills/design/find-animation-opportunities/SKILL.md) | A search skill |
| `frontend-design` | Model / User | [`SKILL.md`](skills/design/frontend-design/SKILL.md) | Approach this as the design lead at a design studio known for giving every client a distinct |
| `improve-animations` | Model / User | [`SKILL.md`](skills/design/improve-animations/SKILL.md) | An advisor skill modeled on the audit-then-plan workflow: use the capable model for the part |
| `review-animations` | Model / User | [`SKILL.md`](skills/design/review-animations/SKILL.md) | A specialized review skill |
| `vis-ad-style` | Model / User | [`SKILL.md`](skills/design/vis-ad-style/SKILL.md) | Route a frozen Ad Brief to one visual style and write it down as a Style Spec: style route |
| `vis-amber-glass` | Model / User | [`SKILL.md`](skills/design/vis-amber-glass/SKILL.md) | Build a landing page in the warm-amber dark-glass style: deep warm-black backgrounds, one |
| `wait-what` | Model / User | [`SKILL.md`](skills/design/wait-what/SKILL.md) | Stop |
| `web-design-guidelines` | Model / User | [`SKILL.md`](skills/design/web-design-guidelines/SKILL.md) | 1 |
| `cog-axiom` | Model / User | [`SKILL.md`](skills/design/cog-axiom/SKILL.md) | AxiomOS cognitive principles library: 8 immutable principles and standards |

### 4. Pipeline Skills (`skills/pipeline/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `pipe-ship` | **User only** | [`SKILL.md`](skills/pipeline/pipe-ship/SKILL.md) | **Autopilot**: full feature loop: grill, spec, tickets, implement, review, deepen, deliver, deploy |
| `pipe-harden` | **User only** | [`SKILL.md`](skills/pipeline/pipe-harden/SKILL.md) | **Autopilot**: fix loop: audit, fix, test, re-fix until green, ship via branch-PR-CI-review-merge |
| `pipe-grill-plan` | Model / User | [`SKILL.md`](skills/pipeline/pipe-grill-plan/SKILL.md) | Relentless plan and decision stress-test interview |
| `pipe-to-spec` | **User only** | [`SKILL.md`](skills/pipeline/pipe-to-spec/SKILL.md) | Turn the conversation into a frozen spec |
| `pipe-to-tickets` | **User only** | [`SKILL.md`](skills/pipeline/pipe-to-tickets/SKILL.md) | Break a spec or plan into tracer-bullet tickets |
| `pipe-implement` | **User only** | [`SKILL.md`](skills/pipeline/pipe-implement/SKILL.md) | Implement a piece of work from a spec or tickets |
| `pipe-review-diff` | **User only** | [`SKILL.md`](skills/pipeline/pipe-review-diff/SKILL.md) | Human-style diff review on Standards and Spec axes |
| `pipe-code-tdd` | Model / User | [`SKILL.md`](skills/pipeline/pipe-code-tdd/SKILL.md) | Test-driven development: red-green-refactor |
| `pipe-code-improve-architecture` | **User only** | [`SKILL.md`](skills/pipeline/pipe-code-improve-architecture/SKILL.md) | Visual HTML report of deepening opportunities, then grill |
| `grill-me` | Model / User | [`SKILL.md`](skills/pipeline/grill-me/SKILL.md) | Alias skill: delegates to the grilling skill for a relentless interview that sharpens a plan |
| `grill-with-docs` | Model / User | [`SKILL.md`](skills/pipeline/grill-with-docs/SKILL.md) | Alias skill: delegates to grilling plus domain-modeling, a relentless interview that also |
| `grilling` | Model / User | [`SKILL.md`](skills/pipeline/grilling/SKILL.md) | Interview the user relentlessly until you reach a shared understanding |
| `handoff` | Model / User | [`SKILL.md`](skills/pipeline/handoff/SKILL.md) | Write a handoff document summarising the current conversation so a fresh agent can continue |
| `improve-codebase-architecture` | Model / User | [`SKILL.md`](skills/pipeline/improve-codebase-architecture/SKILL.md) | Surface architectural friction and propose deepening opportunities: refactors that turn |
| `onekey-chain` | Model / User | [`SKILL.md`](skills/pipeline/onekey-chain/SKILL.md) | 把\"有一个想法\"到\"代码写完、审完、架构看完\"的完整链路一次走完，免去六次分别调用、每次重新讲上下文。适用于中等以上规模的新功能/新模块：一次调用，全程只在被链 skill |
| `pipe-poster` | **User only** | [`SKILL.md`](skills/pipeline/pipe-poster/SKILL.md) | Run the poster loop for one offer: brief, style, lexicon, render, proofread, Moments post |
| `pipeline` | Model / User | [`SKILL.md`](skills/pipeline/pipeline/SKILL.md) | 把一次交付走完一整条流水线：需求 → 实现 → 发布。三个硬约束： ① 实现/审计/测试是内循环，不干净不许出环； ② 发布前有全局审计＋全局测试两道门禁，全过才能发布； ③ |
| `pr` | Model / User | [`SKILL.md`](skills/pipeline/pr/SKILL.md) | 用 Summary/Evidence/Merge Danger 模板写 PR body（PR 描述正文）。 |
| `to-spec` | Model / User | [`SKILL.md`](skills/pipeline/to-spec/SKILL.md) | This skill takes the current conversation context and codebase understanding and produces a |
| `to-tickets` | Model / User | [`SKILL.md`](skills/pipeline/to-tickets/SKILL.md) | Break a plan, spec, or conversation into a set of tickets: tracer-bullet vertical slices, each |
| `triage` | Model / User | [`SKILL.md`](skills/pipeline/triage/SKILL.md) | Move issues on the project issue tracker through a small state machine of triage roles |
| `wayfinder` | Model / User | [`SKILL.md`](skills/pipeline/wayfinder/SKILL.md) | A loose idea has arrived, too big for one agent session, and wrapped in fog: the way from here |
| `pipe-distill` | **User only** | [`SKILL.md`](skills/pipeline/pipe-distill/SKILL.md) | Distill how someone thinks into a runnable skill |

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