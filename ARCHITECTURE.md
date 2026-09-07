# Architecture

One page: what this library is, how the pieces fit, and where each concern lives. Detail belongs in ADRs and the referenced files.

## What this is

An enterprise-grade skill library: 42 skills in three promoted buckets (`engineering/`, `productivity/`, `design/`), packaged as a Claude Code plugin and installable per-skill by any Agent Skills CLI. The library ships with its own governance machinery; the two are versioned together.

## Layers

```
skills/<bucket>/<skill>/     the product: SKILL.md + agents/openai.yaml + manifest.yaml
        │
        │ (extracted from)          (validated by)
        ▼                                 ▼
scripts/generate-manifests.mjs ──► manifest.yaml per skill + registry/skills.json
        │                                 │
        │ curated: CURATED table          │ checked by
        ▼                                 ▼
security/{network,permission}_policy.json   tests/ (34 tests, CI-enforced)
                                              │
evals/{train,holdout,blind}_cases.json ──► scripts/trigger-eval.mjs (npm run eval)
failures/failure-cases.md ◄── every defect class, each naming its guard
```

Four gates run on every change (`validate`, `eval`, `test`, `release-check`); CI runs validate + eval + test on PR and push, and the Release workflow folds changesets into a Version PR.

## Key invariants

1. **One orchestrator per workflow shape** (ADR 0001): lifecycles stay few; leaf skills stay independently invocable.
2. **Governance metadata is curated, never derived** (ADR 0002): the CURATED table is the single source; uncurated skills cannot ship.
3. **Knowledge has four homes** (ADR 0003): `specs/` (durable), `.scratch/` (ephemeral, per-pipeline state), `docs/adr/` (decisions), `docs/` (human docs). Nothing writes into a target project's `.agents/`.
4. **The description is the routing contract**, evaluated (`evals/`), not assumed; near-neighbor families guard sibling boundaries.
5. **Dual invocation is absolute**: user-invoked skills are reachable only by the human; Skill Tool edges target model-invoked skills only.

## Where things go

| Concern | Home |
|---|---|
| Skill behavior | `skills/<bucket>/<skill>/SKILL.md` |
| Harness UI metadata | `agents/openai.yaml` beside each skill |
| Governance + permissions | generated `manifest.yaml`, curated in `scripts/generate-manifests.mjs` |
| Catalog + hashes | `registry/skills.json` |
| Decisions | `docs/adr/` (immutable, sequenced) |
| Trigger quality | `evals/{train,holdout,blind_holdout}_cases.json` + `scripts/trigger-eval.mjs` |
| Security approvals | `security/network_policy.json`, `security/permission_policy.json` |
| Defect memory | `failures/failure-cases.md` |
| Repository rules | `CLAUDE.md` (AGENTS.md points at it) |
| Vocabulary | `CONTEXT.md` |
| Release flow | Changesets (`.changeset/`) + Release workflow + `VERSION` SSOT |
