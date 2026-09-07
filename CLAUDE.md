Skills are organized into bucket folders under `skills/`:

- `engineering/`: code work, review, security, and delivery lifecycles
- `productivity/`: enterprise product workflow tools
- `design/`: enterprise design system and UI governance

Every skill in a promoted bucket must have a reference in the top-level `README.md` (grouped into **User-invoked** and **Model-invoked**) and an entry in `.claude-plugin/plugin.json`'s `skills` array (the Claude Code plugin ships exactly the promoted set).

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`, grouped into **User-invoked** and **Model-invoked**.

Every promoted skill also has a human-facing docs page at `docs/<bucket>/<skill-name>.md` following the four-section frame: **What it does**, **When to reach for it** (invocation mode plus trigger boundary), **Common questions**, and **It's working if**, ending with **Where it fits**. When you add, rename, or change the behaviour of a skill, create or re-sync its docs page; a rename moves the file too.

Every `SKILL.md` is either user-invoked (`disable-model-invocation: true` plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`, reachable only by the human) or model-invoked (model- or user-reachable). See [.agents/invocation.md](./.agents/invocation.md).

## Knowledge layout (ADR 0003)

Skills that produce artifacts sort them into exactly four homes:

- `specs/<feature>/`: durable implementation knowledge. Per-feature folders hold the spec, plan, tickets, and reports. Survives delivery; committed to the target project.
- `.scratch/`: ephemeral run state, session-local issues, working notes. One state file per pipeline (`.scratch/<pipeline>-state.json`); git-ignored; safe to delete. When the project uses GitHub Issues, issues live there first; `.scratch/issues/` holds only offline notes.
- `docs/adr/`: architecture decision records, one decision per file, immutable once accepted (see `docs/adr/TEMPLATE.md`). Anything with long-term force (deletions, policy adoption, layout rules) gets an ADR, not just a changelog line.
- `docs/`: human-facing documentation pages for this library.

Never write to `.agents/` in a target project. Durable reports go under `specs/<feature>/reports/`; run state under `.scratch/`.

## Epistemic discipline (ADR 0005)

No file in this repository contains assumed, simulated, or invented content: every path, command, metric, and evidence claim is real and tool-verifiable. Placeholders live only in `templates/` (angle-bracket slots) and `evals/` (labeled fixtures). The eight operating habits (reproduce before reasoning, adversarial review, ablation, Occam's razor, uncertainty ledger, independent judgment, fact vs inference, high cohesion low coupling) are defined in `skills/design/cog-axiom/cognitive/epistemic-discipline.md` and instantiated as clauses inside the skills that need them.

Every governed execution leaves a trace (ADR 0004): orchestrating skills (lifecycles, `eng-review-fix`, `eng-execute`) append one execution record per run using `templates/execution-record.md`, in the exact chain executor, skill, version, permissions, steps, results, risk, report. Records are append-only; permission, version, and risk values are copied from the skill's generated manifest, never asserted from memory.

Every skill also carries a generated `manifest.yaml` (invocation mode, risk level, governance block with owner/status/maturity/review_due, permission footprint, context budget, Skill Tool dependencies) and the whole set is summarized in `registry/skills.json` with per-skill content hashes. Both are produced by `npm run generate:manifests`; never edit them by hand, and regenerate after changing any `SKILL.md`. Governance rules: every packaged skill needs a curated entry in the generator's CURATED table; critical-risk and network-capable skills must be `maturity: governed` with monthly or quarterly review; an overdue `review_due` fails the gate; network-capable skills additionally need a current entry in `security/network_policy.json` (allowed_hosts, HTTPS, timeout, expiry) and any host-fetching step rejects localhost, loopback, private, and reserved addresses.

Trigger quality is evaluated, not assumed: `evals/train_cases.json`, `evals/holdout_cases.json`, and `evals/blind_holdout_cases.json` hold should_trigger / should_not_trigger / near_neighbor cases for every model-invoked skill; `npm run eval` scores each model-invoked `description` against them and must pass at full rate. When you add or reword a description, add or adjust its cases in the same change. Shipped defects are recorded in `failures/failure-cases.md` with the regression guard that now catches each; a fix for a new defect class adds an entry there.

[`eng-router`](./skills/engineering/eng-router/SKILL.md) is the router that maps the engineering workflows. Whenever you add, rename, remove, or change how a user-reachable skill fits the flows, re-read `eng-router`'s `SKILL.md` and update it so the map stays accurate: a new skill it never mentions, or a stale one it still routes to, is a router that lies.

To (re)link every skill into the local harness skill directories (`~/.claude/skills`, `~/.agents/skills`), run `scripts/link-skills.sh` (Linux / macOS) or `scripts/link-skills.ps1` (Windows). Re-run the script after adding, removing, or renaming a skill.

Adding, renaming, or removing a skill touches every surface listed in `templates/skill-authoring-checklist.md` (frontmatter, openai.yaml, READMEs in both languages, plugin/package arrays, CURATED entry, RELEASE-MANIFEST counts, eval cases, docs page, router table, manifest regeneration, link script, changeset). Execute that checklist in the same change; the gates catch the drift they can see, the checklist covers the prose surfaces no gate sees.

No em-dashes anywhere in this repo's prose (`SKILL.md` files, docs, `README.md`, `CHANGELOG.md`, manifests, code comments). Where a sentence reaches for one, rewrite it instead with a comma, colon, period, parentheses, or a conjunction, whichever the sentence actually wants; never do a blind character substitution.

Quality gates: run `npm run validate` and `npm test` after skill changes, and `npm run release-check` before creating a release artifact. Version metadata is sourced from `VERSION` (strict semver) via `npm run sync-version`.
