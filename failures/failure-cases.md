# Failure Cases

Every entry records a real defect this repository shipped, what it taught us, and where its regression guard now lives. New entries are added when a gate, eval, or review finds a repeatable class of mistake; near-neighbor eval cases and guard tests cite back to these entries.

## Overlapping capabilities (route theft between siblings)

### duplicate-review-orchestrator

`eng-review-and-fix` duplicated the convergence gauntlet that `eng-review-and-ship` already runs, differing only by stopping before delivery. The model could route a "review and repair my changes" request to either one; nothing recorded which was canonical.

Lesson: two skills whose workflows share more than the leaf steps are one skill with a flag, not two skills. A new orchestrator must state, in its description, what existing lifecycle it does NOT replace. When both stopping points are genuinely needed, the pair needs a recorded boundary decision (ADR 0006) rather than silent coexistence.

Regression guard: `tests/skills.test.mjs` (eng-review-and-fix must exist with its ADR 0006 boundary) plus the near-neighbor eval families in `evals/train_cases.json`.

### plan-vs-execute-vocabulary-leak

`eng-execute`'s description led with "Execute an approved implementation plan ... from a plan file", containing all of `eng-plan`'s trigger vocabulary ("implementation", "plan", "file"). A "write me an implementation plan" request scored higher on execute than on plan.

Lesson: a consuming skill must not carry the producer's trigger vocabulary. Anchor each description to its own action verb: plan = produce the plan; execute = carry out an approved plan.

Regression guard: `evals/train_cases.json` family `plan_vs_spec` and the should_trigger case for `eng-plan`; runner `scripts/trigger-eval.mjs`.

## Contract contradictions between surfaces

### docs-claimed-agent-fires-user-invoked-skill

Five docs pages (`eng-docker-update`, `eng-git-pr`, `eng-linux-security`, `eng-router`, `prod-project-init`) said "the agent reaches for it automatically" while their SKILL.md frontmatter said `disable-model-invocation: true` (human-only). A reader following the docs would expect autonomous behavior the harness cannot produce.

Lesson: the invocation contract lives in exactly two places (frontmatter, openai.yaml policy); every other surface (docs, README, registry) is generated or checked against them, never hand-trusted.

Regression guard: `tests/upstream-conventions.test.mjs` (docs pages state the invocation mode, checked against the registry's invocation field).

### fabricated-strays-in-shipped-prose

Seven real strays shipped across review passes: a dangling `NaN` line inside `eng-hardening-review`, and the duplicated sentence `automatically when a task fits.` written twice in a row, pasted into six docs pages by a templated batch edit. All passed human and mechanical gates because no gate looked for the class.

Lesson: content-shaped non-content (stray tokens, pasted-twice sentences, filler, graft fragments where a standardized sentence collides with a leftover clause) needs a mechanical detector with negative controls; review scrolls past what it is not looking for. A follow-up adversarial sweep found eight more graft fragments the duplication detector could not see: the class needs its own marker, not a wider net.

Regression guard: `tests/no-fabrication.test.mjs` (ADR 0005 marker scan over every prose and code surface, with templates/, evals/, and the scanner's own rule text as explicit exemptions) and `scripts/guard-checks.mjs` (`fabricationViolations`).

## Governance metadata drift

### keyword-derived-risk-misclassification

Risk levels were derived from keyword regexes over SKILL.md text: `eng-router` (a read-only index) scored critical because "firewall/ship" words appear in its routing table; `eng-execute` (writes code) scored low. Eight of thirty-nine skills carried a wrong classification.

Lesson: risk and permission metadata is a human decision recorded once per skill, not a text-processing byproduct. Derived data drifts silently; curated data fails loudly when uncurated.

Regression guard: `CURATED` table in `scripts/generate-manifests.mjs` (all skills must be curated); `tests/skills.test.mjs` (escalation policy: code writers never below high, remote/host ops critical, read-only low).

### stale-count-badges

README badges and section headers claimed 18/27 user/model skills after the catalog had moved to 15/24; two release manifests disagreed with each other.

Lesson: any number duplicated by hand across surfaces will drift. Counts, versions, and skill lists are generated (registry, sync-version) or tested, never hand-maintained.

Regression guard: `tests/repo.test.mjs` (package.json/plugin.json parity, version alignment); `npm run generate:manifests` registry checks.

### version-semver-crash

`VERSION` carried an `-enterprise-optimized-final` suffix after the release number, which failed strict semver parsing, so `npm run validate` crashed before checking anything. Every gate was structurally green and functionally dead.

Lesson: a gate that cannot run is worse than no gate; it reports health it never verified. Gate health is itself tested (the test suite runs validate's imports).

Regression guard: `tests/repo.test.mjs` (VERSION is strict semver); `version.mjs` throws on invalid input.

### gate-crash-on-corrupt-json

Feeding a gate a corrupt JSON file (a truncated RELEASE-MANIFEST.json, a broken registry, a half-written eval suite) crashed release-check, validate, and trigger-eval with raw SyntaxError stack traces before any check ran. A gate that crashes mid-run reports health it never verified.

Lesson: every input a gate parses is an error surface; parse failures must become named, file-attributed gate errors on the first output line, never an unhandled throw.

Regression guard: `scripts/read-json.mjs` (all gate JSON loads route through it); ablated by corrupting each target file and confirming the clean `invalid JSON at <file>` failure.

### ghost-skill-in-eval-case

An eval case whose `skill` field named a nonexistent skill (typo, or a skill removed without its cases) failed forever at 34/35 = 97%, above the 90% train floor, so the case silently rotted without ever reddening the gate. The coverage test demanded that real skills have cases, not that cases reference real skills.

Lesson: referential integrity must be checked in both directions, at load time, as a hard error; a score-based floor absorbs individual dead cases indefinitely.

Regression guard: reference-integrity check at the top of `runEval` in `scripts/trigger-eval.mjs` (an unknown skill reference throws before scoring); ablated with an injected ghost case.

### control-character-corruption

Seven docs lines shipped with stray C0 control characters (backspace U+0008, vertical tab U+000B, escape U+001B) embedded mid-word: "precedes \x0Balidate" displayed as "precedes alidate" and the corruption survived every review pass because editors render the controls invisibly while they silently eat the adjacent character's display. The encoding gate checked only empty files and BOM, so the class had no detector at all. Found only when a deeper sweep dumped raw bytes.

Lesson: invisible-byte corruption needs a byte-level detector; character-level review and UTF-8 validity both pass it. Each control-character family is one marker, not a widening of an existing one.

Regression guard: control-character marker in `fabricationViolations` (`scripts/guard-checks.mjs`, all C0 except tab/newline/cr plus U+007F); ablation controls inject vertical-tab and backspace samples and assert tab/newline stay legal (`tests/ablation.test.mjs`).

### graft-to-variant

The graft-fragment marker enumerated its stranded-clause verbs (during, when, for, after, before) and missed "to": two docs pages shipped an invocation sentence colliding with a leftover "to implement tasks from a plan file" clause, straight through the scanner because the variant's verb was not in the list.

Lesson: enumeration-based detectors rot by construction; every observed variant of a defect class extends the marker and gets its own ablation control in the same change, or the next variant ships the same way.

Regression guard: `to` added to the graft marker (`scripts/guard-checks.mjs`); ablation control injects the to-variant and asserts it fires (`tests/ablation.test.mjs`).
