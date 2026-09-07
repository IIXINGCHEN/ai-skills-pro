# ADR 0003: Knowledge layout doctrine (specs, scratch, ADRs, docs)

Date: 2026-09-06
Status: accepted

## Context

Lifecycle skills wrote every artifact into the target project's `.agents/` tree: durable knowledge (specs, RCA reports) and ephemeral run state (`lifecycle-state.json`) shared one directory, concurrent lifecycles overwrote one state file, and local issues had no home. Decisions with long-term force (deletions, policy adoptions) lived only in CHANGELOG entries, which are a chronological stream: nothing anchors a rule a future agent might accidentally violate.

## Decision

Every skill that produces artifacts sorts them into exactly four homes:

- `specs/<feature>/`: durable implementation knowledge, per-feature folders holding the spec, design notes, and tickets. Survives delivery.
- `.scratch/`: ephemeral run state, session-local issues, working notes. Git-ignored in the target project; safe to delete between runs. When the project has GitHub Issues, issues go there first and `.scratch/` holds only offline notes.
- `docs/adr/`: architecture decision records, one decision per file, immutable once accepted.
- `docs/` (the skill library's own tree): human-facing documentation pages.

`lifecycle-state.json` moves under `.scratch/` with a per-pipeline filename (`<pipeline>-state.json`) so concurrent lifecycles cannot clobber each other. Durable reports (review matrices, RCA, retrospectives) move to `specs/<feature>/reports/` or the repo's own reports location; `.agents/` in the target project is no longer written to.

## Consequences

Knowledge survives, state evaporates: a fresh clone loses nothing durable and no run state. `tests/knowledge-layout.test.mjs` enforces that no SKILL.md instructs writes outside the four homes. Cost: existing muscle memory (`.agents/...` paths) must change; migration is a path rewrite in the referencing skills, done in the same change as this ADR.

## Alternatives considered

- Keep `.agents/` for everything: rejected, it conflates knowledge with state and breaks concurrent runs.
- Write state into the skill library itself: rejected, the library is a distributed package; per-user run state has no business inside it.
