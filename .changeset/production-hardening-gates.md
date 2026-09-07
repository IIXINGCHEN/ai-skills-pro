---
"ai-skills-pro": minor
---

Production-readiness hardening pass over the governance surfaces (review against upstream mattpocock/skills and the yao-meta-skill reference):

- Removed the dead eval index `evals/trigger_cases.json` (50 cases no runner or test consumed) and re-pointed CLAUDE.md, ARCHITECTURE.md, ADR 0001, and failures/failure-cases.md at the real suite files (`train/holdout/blind_holdout_cases.json`); suite descriptions no longer hardcode the model-invoked count. The old state let a future agent add cases to a file CI never reads and still see green.
- New governance test: every model-invoked skill must have trigger coverage in the CI suites (should_trigger or near_neighbor); a skill with zero cases fails the gate instead of shipping an untested routing contract.
- `release-check` no longer hardcodes 40/16/24: RELEASE-MANIFEST.json declares the counts and the gate cross-checks them against the live tree in both directions (ablation-verified: a stale manifest count fails loudly).
- New router-invariant test: every user-invoked engineering skill must appear in `eng-router`'s routing table, and the router must not mention skills absent from the registry (a router that lies is now a red test, not a prose rule).
- New `templates/skill-authoring-checklist.md`: the full add/rename/remove touch surface as checklists (17 steps for adding), wired into CLAUDE.md; covers the prose surfaces no gate sees.
- README (both languages): local symlink install is the primary documented path; remote marketplace/npx commands are explicitly marked pending until the repository is published, honoring the no-fabrication doctrine for commands users would otherwise copy and fail.
