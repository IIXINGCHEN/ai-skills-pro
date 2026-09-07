# Skill Authoring Checklist

One checklist per authoring operation, executed in order. Every unchecked item that ships is exactly how a stale count, a lying router, or an untested description reaches production. The gates catch what they can; this list covers the surfaces no gate sees (yet).

## A. Adding a new skill

1. [ ] `skills/<bucket>/<skill-name>/SKILL.md`: frontmatter exactly `name`, `description`, and (user-invoked only) `disable-model-invocation: true`; name matches the directory.
2. [ ] `skills/<bucket>/<skill-name>/agents/openai.yaml`: `interface` block; user-invoked skills add `policy.allow_implicit_invocation: false`.
3. [ ] Description conventions: user-invoked is one clear line, max 180 chars, no trigger phrasing ("Use when", "when the user"); model-invoked carries trigger boundaries, max 280 chars, producer skills keep their own trigger words (consuming skills must not steal them).
4. [ ] `skills/<bucket>/README.md`: entry in the right invocation group, name linked to its SKILL.md.
5. [ ] Top-level `README.md` and `README.zh-CN.md`: linked entry in the correct section; bump the skills badge and both section counts.
6. [ ] `.claude-plugin/plugin.json` and `package.json`: path added to both `skills` arrays.
7. [ ] `scripts/generate-manifests.mjs`: curated entry in CURATED (risk, permissions, owner, maturity, cadence). No heuristic fallback ships.
8. [ ] `RELEASE-MANIFEST.json`: bump `skillCount` and the affected `invocation` count (release-check cross-checks these against the live tree).
9. [ ] Model-invoked only: eval cases in `evals/train_cases.json` (at least 3 should_trigger, 1 near_neighbor) and `evals/blind_holdout_cases.json` (at least 1); the coverage test fails without them.
10. [ ] Network-capable only: entry in `security/network_policy.json` (allowed_hosts, HTTPS, timeout, expiry, reviewer) with a matching `security/permission_policy.json` approval.
11. [ ] `docs/<bucket>/<skill-name>.md`: four-section frame (What it does, When to reach for it with the invocation mode stated, Common questions, It's working if) ending with Where it fits.
12. [ ] Orchestrator (calls 2+ skills or a lifecycle): execution-record clause in the completion criteria, per `templates/execution-record.md` (ADR 0004).
13. [ ] Engineering bucket and user-invoked: routing row in `skills/engineering/eng-router/SKILL.md`; if it can be confused with a sibling, state in the description which existing skill it does NOT replace (ADR 0001).
14. [ ] Run `npm run generate:manifests` (never hand-edit manifest.yaml or registry/skills.json).
15. [ ] Run all four gates: `npm run validate`, `npm test`, `npm run eval`, `npm run release-check`.
16. [ ] Run the link script (`scripts/link-skills.ps1` or `.sh`) so the local harness directories see the skill.
17. [ ] Add a changeset (`npx changeset`) describing the user-visible change.

## B. Renaming a skill

1. [ ] Move the directory; keep the bucket.
2. [ ] Update every surface from section A that names the skill (SKILL.md frontmatter, READMEs, plugin/package arrays, CURATED key, eval case `skill` fields, docs page filename and links, router table, other skills' bodies that call or redirect to it).
3. [ ] Grep the repo for the old name; anything left is a stale pointer (manifests and registry regenerate clean, prose does not).
4. [ ] Sections A steps 14-17.

## C. Removing a skill

1. [ ] Check `registry/skills.json` for inbound dependencies; every caller's SKILL.md must drop the call or be removed too.
2. [ ] Delete the skill directory, its docs page, README entries (both languages), plugin/package array entries, CURATED entry, eval cases, router rows, and any `security/` policy entries.
3. [ ] Bump `RELEASE-MANIFEST.json` counts down.
4. [ ] If the removal reverses an ADR decision (a lifecycle), write the superseding ADR rather than editing the old one.
5. [ ] Sections A steps 14-17.

## D. Changing only a description

1. [ ] Model-invoked: adjust its eval cases in the same change (train cases may tune; holdout and blind must not regress).
2. [ ] User-invoked: keep the 180-char limit and the no-trigger-phrasing rule.
3. [ ] Run `npm run generate:manifests` then `npm run eval`.
