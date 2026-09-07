# Code Review Report (Pass 1)

- **Scope**: diff (session change set, non-git workspace)
- **Profile**: strict (pre-release surface after the 3.1.0 fold)
- **Spec Reference**: ADR 0006 (reinstate boundary), ADR 0001 (superseded), ADR 0004 (execution trace)
- **Target**: restoration of `eng-review-and-fix` across 19 files: new skill tree (`SKILL.md`, `agents/openai.yaml`, `manifest.yaml`), docs page, ADR 0006, CURATED entry, release-check counts, two tests, bucket README, router SKILL.md, ship SKILL.md trace clause, both READMEs, CHANGELOG, failure ledger, RELEASE-MANIFEST/RELEASE/QUALITY_REPORT, ARCHITECTURE, plugin.json, package.json.

## Summary Matrix

| Severity | Count | Status |
|---|---|---|
| 🚨 Critical | 1 | Action Required |
| ⚠️ Warning | 2 | Review Needed |
| 💡 Suggestion | 2 | Optional |

## Detailed Findings

### [CRITICAL] `scripts/generate-manifests.mjs:207` - Dependency edge silently dropped from required set
- **Category**: Correctness / Contract (dependency graph)
- **Description**: `required: [...deps].filter(d => !redirects.has(d))` removes any Skill Tool dependency that also appears in a human-redirect phrase. The restored skill's Stage 2 line legitimately contains both `Call the Skill tool with "eng-review-fix"` and the boundary sentence `run /eng-review-fix` (ADR 0006's required boundary statement). Result: `eng-review-and-fix`'s manifest declares `required: [eng-code-review, eng-validate]` while its body Skill Tool-calls `eng-review-fix` three-stage pipeline; the dependency graph under-reports a real edge. Registry and validation gates pass because the filter hides the edge rather than misclassifying an existing one. Verified: this is the only skill in the 40-skill catalog where the collision occurs (scan over all SKILL.md files). The generator bug is latent and pre-existing; the restoration is what triggered it.
- **Recommended Fix**: Semantics, not filtering: a dependency is `required` when CALL_RE matches; a redirect phrase only *adds* a redirect entry, never removes a Skill Tool edge. Change to `required: [...deps].sort(), redirects: [...redirects].filter(r => !deps.has(r)).sort()` so redirects stay informational only. Regression test: assert `eng-review-and-fix` manifest contains `eng-review-fix` in required.

### [WARNING] `docs/engineering/eng-router.md` - Router docs page not updated with the restored skill
- **Category**: Spec Alignment (docs parity)
- **Description**: `skills/engineering/eng-router/SKILL.md` routing table now lists `/eng-review-and-fix` ("no delivery in this run"), but the human-facing docs page `docs/engineering/eng-router.md` makes no mention of it. CLAUDE.md's rule: when a skill is added or its routing changes, re-sync the docs page. A reader of the docs page cannot discover the restored workflow. (The page itself is thin and pre-existing; the miss is the stale content relative to the SKILL.md change.)
- **Recommended Fix**: Add the routing row to the docs page's content (the page needs a routing table or a mention of the review-family boundary: fix-and-stop vs ship).

### [WARNING] `docs/engineering/eng-router.md:7` - Graft fragment in standardized invocation sentence
- **Category**: Correctness (fabrication-class defect, pre-existing)
- **Description**: `"You invoke this by typing /eng-router, and the agent won't reach for it on its own. automatically when determining multi-stage development workflows."` The sentence ends mid-air with a stranded clause: an invocation-standardization edit collided with leftover text. This is the exact `docs-claimed-agent-fires-user-invoked-skill` / graft-fragment class recorded in `failures/failure-cases.md`. Pre-existing (not introduced by this change set) but it sits on the same page the router update must touch, and the no-fabrication scanner did not flag it (the marker pattern covers `when a task fits` / `on its own`, and this line's phrasing evades both patterns).
- **Recommended Fix**: Rewrite the sentence cleanly; extend the graft scanner marker if the class recurs (per the failure-ledger rule: each new phrasing gets its own marker, not a wider net).

### [SUGGESTION] `skills/engineering/eng-review-and-fix/SKILL.md:11` - Boundary paragraph could cite ADR 0006
- **Category**: Maintainability
- **Description**: The boundary paragraph distinguishes the skill from `eng-review-and-ship` and `eng-review-fix` but does not link the decision record. The failure ledger's lesson requires the boundary to be recorded; pointing readers at `docs/adr/0006-reinstate-eng-review-and-fix.md` makes the provenance discoverable from the skill body.
- **Recommended Fix**: Append "(ADR 0006)" to the boundary sentence.

### [SUGGESTION] `tests/execution-trace.test.mjs:23` - Orchestrator list is a hand-maintained enum
- **Category**: Test Completeness
- **Description**: The orchestrator filter names four skills explicitly (`eng-execute`, `eng-review-fix`, `eng-review-and-fix`, `eng-review-and-ship`). The ADR 0004 contract says every orchestrating skill wires the record; the enum already missed `eng-review-and-ship` once (found in this session). The next non-`-lifecycle` orchestrator will be missed again.
- **Recommended Fix**: Derive orchestrators structurally: any skill whose SKILL.md contains `Call the Skill tool with` at least twice, or whose manifest `dependencies.required` has 2+ entries and invocation is user. Keep the count assertion as a tripwire.

## Verified clean (dimensions with no findings)

- **Security & Data Safety**: no secrets, no network surface added; `network.access: false` in the restored manifest; CURATED entry `net: false` matches the skill body (no fetch steps). `validateGraph` still blocks user-invoked targets for required edges.
- **Performance**: change surface is declarative markdown/config plus one filter-line change in the generator; no hot-path, I/O, or memory implications (Stage 4 will record this as clean).
- **Counts and parity**: registry 40 skills (16/24), READMEs, bucket README, plugin.json, package.json, RELEASE-MANIFEST counts all consistent; release-check hardcodes updated coherently (40, 16/24, and the error-message text).
- **Execution trace**: both orchestrators now carry the ADR 0004 clause; test floor raised to 10.

## Verdict: [CHANGES REQUESTED]
