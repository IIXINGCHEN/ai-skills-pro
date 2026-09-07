# ADR 0004: Every governed execution leaves an append-only trace

Date: 2026-09-07
Status: accepted

## Context

Manifests declare what a skill is allowed to do, but nothing recorded, per run, whether the declared envelope was actually what executed. After a lifecycle touched a codebase there was no uniform answer to: who executed, which skill and version, under which declared permissions, through which steps, with what results, at what risk, pointing to which report. Governance without per-run evidence is a claim, not an audit.

## Decision

Every orchestrating skill (lifecycles, `eng-review-fix`, `eng-execute`) appends one execution record per run, using `templates/execution-record.md`, in the exact chain: executor, skill, version, permissions, steps, results, risk level, final report. Records are append-only (one file per run, never edited after the run closes), stored durable at `specs/<feature>/reports/execution-<timestamp>.md` when the run produced durable artifacts, otherwise under `.scratch/execution-records/`. Permission and risk values in the record must be copied from the skill's generated manifest, never asserted from memory.

## Consequences

Any past run can be reconstructed from its record without re-reading transcripts; permission drift (recorded envelope differs from manifest) becomes visible at review time. `tests/execution-trace.test.mjs` enforces template completeness and that every orchestrator wires the record into its completion criteria. Cost: one extra artifact per run, which is the audit the governed tier owes.

## Alternatives considered

- Free-form closing summaries per skill: rejected, fields drift per author and no consumer can rely on the chain.
- A single JSONL telemetry stream: rejected for now, it needs a runtime consumer; the markdown chain serves human review today and can be parsed later.
