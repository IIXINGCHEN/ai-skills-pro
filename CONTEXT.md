# AI Skills Pro Context

## Purpose

AI Skills Pro is an enterprise-grade, multi-harness skill library. Skills are small, composable units rather than a single mandatory global workflow, governed by validated metadata rather than prose conventions.

## Ubiquitous Language

These terms carry precise meanings in this repository; use them exactly and never as loose synonyms.

### Skill system terms

- **User-invoked**: human-triggered only (`disable-model-invocation: true` plus the paired Codex policy). It orchestrates a workflow or performs an explicitly requested consequential action. No skill may reach it through the Skill Tool.
- **Model-invoked**: reachable by model or user when the task matches its description. It provides reusable discipline or a bounded capability. Its `description` is the routing contract, evaluated by `evals/`.
- **Skill Tool dependency**: an explicit instruction in one skill to call another model-invoked skill (`Call the Skill tool with "name"`). Never a user-invoked target.
- **Context pointer**: a short reference telling the agent when to load out-of-context material.
- **Progressive disclosure**: keeping always-loaded entry files small, with branch detail behind pointers or in reference files.
- **Production gate**: repository validation that must pass before a release artifact is publishable.
- **Trigger surface**: the set of requests that should and should not route to a skill; encoded as eval cases, not prose.

### Governance terms

- **Owner**: the accountable team for a skill's review (platform, security, infra, sre, product, design, architecture).
- **Maturity**: the tier a skill has earned: `scaffold` (exploratory), `production` (team-usable), `library` (shared across teams), `governed` (release-critical; security policy and short review cadence mandatory).
- **Risk level**: what the skill can do to its environment: `low` (read/analyze), `medium` (executes project code), `high` (modifies source or orchestrates changes), `critical` (host, infra, remote, or destructive-capable).
- **Review due**: the ISO date by which the curated governance entry must be renewed; an overdue date fails the gates.
- **Curated**: risk, permissions, and governance data recorded by human decision in the generator's CURATED table; never derived from prose (ADR 0002).

### Knowledge layout terms (ADR 0003)

- **Spec**: the durable contract folder for one feature at `specs/<feature>/`, holding the spec, plan, tickets, and reports. Survives delivery.
- **Vertical slice (Ticket)**: one executable unit of work covering every layer it touches (frontend, backend, tests, acceptance) for a complete user-facing capability; never a functionally-sliced task (see `eng-plan`).
- **Scratch**: ephemeral run state and local working notes at `.scratch/`; git-ignored; safe to delete between runs. GitHub Issues take precedence for issues when present.
- **ADR**: architecture decision record at `docs/adr/`; one immutable decision per file; supersedes, never edits.
- **Run state**: per-pipeline progress at `.scratch/<pipeline>-state.json`; the shared `lifecycle-state.json` is banned (concurrency hazard).

### Workflow shape terms

- **Convergence gauntlet**: the review-fix-validate loop shared by governed lifecycles; canonical mechanics defined once in `templates/convergence-gauntlet.md` (ADR 0008), with a risk-tiered pass floor (3 for code changes, 2 for prose-only, ADR 0009; cap of 5). A clean pass at or after the floor converges.
- **Completion verdict**: the evidence-backed DONE / DONE-WITH-ACCEPTED-RISKS / BLOCKED ruling from `eng-completion-gate`; BLOCKED halts before any remote action.
- **Whitelist contract**: the funnel-produced list of files allowed to change; edits outside it halt and re-funnel.
- **Router**: `eng-router`, the index mapping situations to workflows; must be re-synced whenever the reachable set changes.

## Local sources of truth

Skill behavior lives in `skills/<bucket>/<skill>/SKILL.md`.
Codex UI metadata lives beside each skill in `agents/openai.yaml`.
Per-skill governance (invocation, risk, permissions, owner, maturity, review_due) lives in the generated `manifest.yaml`.
The machine-readable catalog lives in `registry/skills.json` (with per-skill content hashes).
Architecture decisions live in `docs/adr/`.
The public catalog is documented in the top-level and bucket README files.
Release metadata is sourced from `VERSION` and synchronized into package and plugin manifests.
