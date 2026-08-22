# AI Agent Instructions for `ai-skills-pro`

This repository hosts a production-grade modular AI Agent skills library adhering to the Agent Skills standard and multi-harness compatibility requirements.

## 🔄 Execution Order & Pipeline Protocols

All skills in this repository operate under strict sequential dependency contracts. Always follow the explicit pipeline sequence:

### 1. Full Feature Development Lifecycle
```
prod-briefing-loop ➔ prod-create-prd ➔ eng-spec ➔ eng-prime-context / eng-analyze-codebase ➔ eng-plan ➔ eng-execute ➔ eng-validate ➔ eng-code-review ➔ eng-review-fix ➔ eng-git-commit / eng-git-pr ➔ prod-execution-report ➔ prod-system-review
```

### 2. Defect & Bugfix Loop
```
eng-bugfix-rca (tight repro loop) ➔ eng-bugfix-implement (surgical fix) ➔ eng-validate (regression check) ➔ eng-git-commit (atomic commit)
```

### 3. Codebase Onboarding & Health Audit
```
eng-prime-context ➔ eng-analyze-codebase ➔ eng-adversarial-audit ➔ eng-validate
```

---

## 📋 Handoff Table & Artifact Contracts

- `prod-briefing-loop` ➔ `prod-create-prd` / `eng-spec` (Frozen Brief Contract)
- `prod-create-prd` ➔ `eng-spec` (`PRD.md`)
- `eng-spec` ➔ `eng-plan` (`specs/<feature-name>/`)
- `eng-plan` ➔ `eng-execute` (`.agents/plans/<feature-name>.md`)
- `eng-execute` ➔ `eng-validate` (Source Code modifications)
- `eng-validate` ➔ `eng-code-review` / `eng-adversarial-audit` (All green test suite)
- `eng-code-review` ➔ `eng-review-fix` (Review findings report)
- `eng-review-fix` ➔ `eng-validate` (Remediated source code)
- `eng-bugfix-rca` ➔ `eng-bugfix-implement` (`.agents/rca/rca-<bug-id>.md`)
- `eng-bugfix-implement` ➔ `eng-validate` (Surgically patched code)
- `eng-validate` ➔ `eng-git-commit` / `eng-git-pr` (Passing verification)

## 🛡️ Core Rules for Agents

1. **Verify Precondition Artifacts**: Always confirm predecessor artifacts (`specs/`, `.agents/plans/`, `rca.md`) exist before starting a downstream skill.
2. **Never Skip Validation**: Running `eng-validate` is mandatory before declaring any implementation, bugfix, or remediation complete.
3. **Explicit Skill Tool Invocations**: Transition between lifecycle stages by explicitly calling the Skill tool with the target skill name.