# AI Skills Pro

> Production-grade modular AI Agent skills library: 45 skills across engineering, productivity, and design. User-invoked lifecycle orchestrators, model-invoked reusable skills, evidence-gated quality gates, and multi-harness compatibility (Claude Code, OpenAI Codex, DeepSeek Harness, Cursor, and the open Agent Skills standard).

![Skills](https://img.shields.io/badge/skills-45-blue) ![Validation](https://img.shields.io/badge/validation-45%2F45%20pass-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-%E2%89%A520.x-339933)

English | [简体中文](README.zh-CN.md)

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/IIXINGCHEN/ai-skills-pro.git
cd ai-skills-pro

# 2. Validate integrity
npm run validate

# 3. Install (symlink all 45 skills into your agent skill directories)
./scripts/link-skills.sh        # Linux / macOS
.\scripts\link-skills.ps1      # Windows PowerShell

# 4. Use in any Agent session
/eng-enterprise-lifecycle Build a user points redemption module
```

**One command, full pipeline.** The flagship Autopilot orchestrator runs 13 stages automatically (briefing, spec freeze, whitelist-scoped planning, coding, validation, multi-angle review, fix loop, completion verdict) and pauses only at 3 human gates (Brief, Plan, Push authorization).

---

## 🚀 9 One-Command Autopilot Workflows

| Command | Pipeline | Human Gates |
| :--- | :--- | :--- |
| `/eng-enterprise-lifecycle` | Model / User | Brief, Plan+whitelist, Push |
| `/eng-review-and-fix` | User only | None (auto-loop, 3-5 passes) |
| `/eng-review-and-ship` | Model / User | Push authorization |
| `/eng-defect-lifecycle` | Model / User | RCA sign-off |
| `/eng-onboarding-audit-lifecycle` | Model / User | None |
| `/eng-hotfix-emergency-lifecycle` | Model / User | Hotfix approval |
| `/eng-refactor-lifecycle` | Model / User | Plan sign-off |
| `/eng-release-ops-lifecycle` | Model / User | Window approval |
| `/prod-content-delivery-lifecycle` | Model / User | Brief sign-off |

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

---

## 🛡️ Built-In Safety Model

- **Evidence-based completion**: `eng-completion-gate` issues DONE / DONE-WITH-ACCEPTED-RISKS / BLOCKED verdicts; every claim maps to a verifiable artifact.
- **Destructive double-confirm**: `eng-destructive-safety-gate` requires two explicit confirmations plus a recovery artifact before any irreversible operation.
- **Readiness-only push**: `eng-git-pr` never pushes without explicit user instruction; protected branches are never force-pushed.
- **Whitelist-bound edits**: `eng-change-scope-funnel` locks the change surface before the first edit.
- **Test-first repair**: `eng-bugfix-rca` demands a failing test before any fix exists.

---

## Architecture & Invocation Model

Skills are organized into three buckets under `skills/`. Within each bucket, user-invoked orchestrators are separated from model-invoked reusable skills.
- **`skills/engineering/`** (29): lifecycle orchestrators, SDD core (spec, plan, execute), reviews and audits, safety gates, git delivery, DevOps.
- **`skills/productivity/`** (10): briefing loop, PRD, content delivery, prompt enhancement, session management, retrospectives.
- **`skills/design/`** (6): UI reverse engineering, 3D portrait compilation, anime stylization, product web experience design, the adaptive product-design suite, and the cognitive architecture principles library.

Every skill provides:
1. `SKILL.md`: unambiguous instructions with checkable completion criteria and anti-hallucination guardrails.
2. `agents/openai.yaml`: standard Codex and OpenAI interface metadata.
3. Companion documentation at `docs/<bucket>/<skill-name>.md`.

---

## 🧭 Complete Skills Catalog

### 1. Engineering Skills (`skills/engineering/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `eng-enterprise-lifecycle` | User only | [`SKILL.md`](skills/engineering/eng-enterprise-lifecycle/SKILL.md) | **Autopilot**: 13-stage enterprise pipeline, 3 human gates, fast-path |
| `eng-review-and-fix` | User only | [`SKILL.md`](skills/engineering/eng-review-and-fix/SKILL.md) | **Autopilot**: one-command review-to-green loop with triage |
| `eng-review-and-ship` | User only | [`SKILL.md`](skills/engineering/eng-review-and-ship/SKILL.md) | **Autopilot**: review-fix-verify loop ending in an authorized push to the matching repository |
| `eng-defect-lifecycle` | User only | [`SKILL.md`](skills/engineering/eng-defect-lifecycle/SKILL.md) | **Autopilot**: RCA-to-commit defect resolution loop |
| `eng-onboarding-audit-lifecycle` | User only | [`SKILL.md`](skills/engineering/eng-onboarding-audit-lifecycle/SKILL.md) | **Autopilot**: one-shot read-only codebase health inspection |
| `eng-hotfix-emergency-lifecycle` | User only | [`SKILL.md`](skills/engineering/eng-hotfix-emergency-lifecycle/SKILL.md) | **Autopilot**: P0/P1 incident fast lane with mandatory postmortem |
| `eng-release-ops-lifecycle` | User only | [`SKILL.md`](skills/engineering/eng-release-ops-lifecycle/SKILL.md) | **Autopilot**: release window automation with rollback plans |
| `eng-refactor-lifecycle` | User only | [`SKILL.md`](skills/engineering/eng-refactor-lifecycle/SKILL.md) | **Autopilot**: behavior-preserving progressive refactoring |
| `eng-router` | User only | [`SKILL.md`](skills/engineering/eng-router/SKILL.md) | Central lifecycle router and orchestrator registry |
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
| `eng-git-pr` | Model / User | [`SKILL.md`](skills/engineering/eng-git-pr/SKILL.md) | PR creation with readiness-only push policy |
| `eng-prime-context` | Model / User | [`SKILL.md`](skills/engineering/eng-prime-context/SKILL.md) | Rapid onboarding for unfamiliar repositories |
| `eng-analyze-codebase` | Model / User | [`SKILL.md`](skills/engineering/eng-analyze-codebase/SKILL.md) | Topology, circular dependencies, and pattern analysis |
| `eng-docker-update` | Model / User | [`SKILL.md`](skills/engineering/eng-docker-update/SKILL.md) | Zero-downtime container image updates |
| `eng-linux-security` | Model / User | [`SKILL.md`](skills/engineering/eng-linux-security/SKILL.md) | Port-scan detection and firewall automation |

### 2. Productivity Skills (`skills/productivity/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `prod-briefing-loop` | Model / User | [`SKILL.md`](skills/productivity/prod-briefing-loop/SKILL.md) | Four-stage alignment gate with gap review |
| `prod-content-delivery-lifecycle` | User only | [`SKILL.md`](skills/productivity/prod-content-delivery-lifecycle/SKILL.md) | **Autopilot**: brief-frozen content delivery |
| `prod-prompt-enhancer` | User only | [`SKILL.md`](skills/productivity/prod-prompt-enhancer/SKILL.md) | One-shot prompt enhancement, outputs only the improved text |
| `prod-create-prd` | Model / User | [`SKILL.md`](skills/productivity/prod-create-prd/SKILL.md) | Conversational requirements into formal PRD |
| `prod-project-init` | User only | [`SKILL.md`](skills/productivity/prod-project-init/SKILL.md) | Tech stack inspection and environment setup guides |
| `prod-mine-keywords` | Model / User | [`SKILL.md`](skills/productivity/prod-mine-keywords/SKILL.md) | Breakout AI search keyword discovery |
| `prod-execution-report` | Model / User | [`SKILL.md`](skills/productivity/prod-execution-report/SKILL.md) | Retrospective on plan adherence and test evidence |
| `prod-compress-context` | User only | [`SKILL.md`](skills/productivity/prod-compress-context/SKILL.md) | Compact session checkpoint |
| `prod-export-session` | User only | [`SKILL.md`](skills/productivity/prod-export-session/SKILL.md) | Session logs and artifacts to markdown |
| `prod-system-review` | User only | [`SKILL.md`](skills/productivity/prod-system-review/SKILL.md) | Meta-level workflow retrospective |

### 3. Design & Cognitive Skills (`skills/design/`)

| Skill | Invocation | Path | Description |
| :--- | :--- | :--- | :--- |
| `vis-reverse-ui` | Model / User | [`SKILL.md`](skills/design/vis-reverse-ui/SKILL.md) | Computed styles, layout trees, and CSS tokens from UI |
| `vis-vtp-3d` | Model / User | [`SKILL.md`](skills/design/vis-vtp-3d/SKILL.md) | 3D animation portrait prompt compiler |
| `vis-anime-stylize` | Model / User | [`SKILL.md`](skills/design/vis-anime-stylize/SKILL.md) | Anime cel-shaded stylization protocol |
| `vis-product-web` | Model / User | [`SKILL.md`](skills/design/vis-product-web/SKILL.md) | Requirements-to-production web experience builder: IA, design system, data-driven UI, motion |
| `vis-product-design` | Model / User | [`SKILL.md`](skills/design/vis-product-design/SKILL.md) | **Suite**: ideas, screenshots, and live URLs routed into reviewable prototypes (9 modes) |
| `cog-axiom` | Model / User | [`SKILL.md`](skills/design/cog-axiom/SKILL.md) | Cognitive architecture reference library: 8 core principles and production guidance |

---

## 🔐 Production Release

Version **1.6.1** is the production release baseline. Before distributing or installing from source, run:

```bash
npm ci
npm run release-check
```

The release gate verifies all 45 skills, package/plugin/marketplace synchronization, relative links, empty files, symlinks, line endings, high-risk Agent-behavior patterns, release metadata, and the Node.js runtime baseline. Pin production deployments to a versioned release artifact and verify its SHA-256 checksum.

See [`RELEASE.md`](RELEASE.md) and [`SECURITY.md`](SECURITY.md) for the release and security policies.

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

### 2. Codex, Cursor, DSH & Other Agents: `skills` CLI (verified)
```bash
# Interactive install (pick agents and skills):
npx skills add IIXINGCHEN/ai-skills-pro

# Install ALL 45 skills globally without prompts:
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
