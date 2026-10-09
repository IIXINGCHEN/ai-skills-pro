---
name: eng-security-audit
description: Run a structured, evidence-first security audit of a codebase. Use for full security audits, vulnerability reviews, or pen-test-style assessments of code, APIs, services, CLIs, and libraries.
---

# Security Audit: Structured Vulnerability Assessment

Turn a codebase into a defensible audit: map where untrusted input meets trusted code, hunt each surface with isolated reviewers, force every candidate through an independent challenger, and report only what the evidence proves.

## Operating Modes

**Guidance mode (default).** Loading this skill does not start the workflow. For security questions, focused code review, triage of a specific report, or methodology advice, use only the relevant section below. Do not start the phased workflow or produce audit files unless asked.

**Full audit mode.** Runs the complete six-phase workflow when the user directly commissions an audit or penetration-style test of a codebase, asks for a full or comprehensive security review, or wants report artifacts. If the request is ambiguous, clarify with a single targeted question before writing any files or spinning up reviewers.

## Core Rules

- **Boundary first.** A finding is only a finding when you can name the weaker principal, the authority line it crossed, the asset it reached, and the effect you observed. A missing best practice with no crossed line is a hardening note, not a vulnerability.
- **Evidence only.** Every claim cites repository-relative `file:line` or a bounded local reproduction with dummy data. Never probe production, real credentials, shared infrastructure, or other users' data.
- **Separate reviewers.** The reviewer who reports a candidate never confirms it. Confirmation always comes from a fresh reviewer who starts by trying to disprove the claim.
- **Severity follows demonstrated impact.** A scary-looking flaw with no reachable effect gets a low rating or none at all.
- **Honest coverage.** A clean run may report zero proven findings. Say what was covered, what was deferred, and what remains unknown. Never imply one pass exhausts a target.

---

## Phase 1: Survey

Map the target before hunting. Produce `survey.md` (about 1000 words max) and a coverage ledger `coverage.json`.

**Survey the source (read-only):**
1. Product, principals, and the authority each principal holds by design.
2. Every entry surface where lower-trust input arrives: HTTP handlers, RPC/message endpoints, file and archive parsers, CLI flags and env vars, config files, plugin and dependency hooks, CI inputs, cloud event selectors, model tool arguments, deep links and local IPC.
3. The authority line guarding each surface and the strongest source-visible control on it.
4. Which controls depend on deployment facts the source cannot show. Name them; do not guess them.
5. Stack, entry points, subsystem boundaries, and which build/test commands can run offline.

**Build the coverage ledger.** One unit per material combination of entry surface, authority line, component, and flaw family. Each unit records:

| Field | Content |
|---|---|
| `unit_id` | Stable source-derived ID, e.g. `src/routes.ts#POST /login::auth::api::credential-handling` |
| `surface` | Entry surface label |
| `authority_line` | The boundary the surface is supposed to respect |
| `component` | Subsystem or package |
| `flaw_family` | One of the families in Phase 2 |
| `starting_paths` | Repository-relative paths to begin reading |
| `status` | `planned` \| `in_progress` \| `covered` \| `candidate` \| `blocked` \| `deferred` \| `out_of_scope` |
| `reviewer` | ID of the assigned reviewer, null until assigned |
| `checked_paths` | Paths actually read |
| `finding_ids` | Linked candidate fingerprints |
| `blocker` | Exact unresolved fact, when blocked |

Unit states and their invariants:

| Status | Reviewer | Checked paths | Finding IDs | Blocker |
|---|---|---|---|---|
| `planned` | null | empty | empty | empty |
| `in_progress` | assigned | empty | empty | empty |
| `covered` | assigned | nonempty | empty | empty |
| `candidate` | assigned | nonempty | nonempty | optional |
| `blocked` | assigned | nonempty | empty | required |
| `deferred` / `out_of_scope` | null | empty | empty | required reason |

A prior run's ledger is input, not verdict: re-check changed source, re-validate carried findings, and never treat an old "covered" as current evidence.

---

## Phase 2: Hunting

Assign `planned` units to isolated reviewers, one reviewer per small group of related units. Reviewers read source and return structured results; they never edit target code or shared files.

**Hunting method for each unit:**
1. Follow the input from entry through parsing, identity checks, authorization, normalization, state changes, derived copies, to the final sink. Read sibling paths that reach the same effect: legacy handlers, batch jobs, retries, migrations, error branches.
2. Work from a concrete invariant: name the principal, the action or value, the control that should stop it, and the exact path after that decision. Stop at the smallest observable effect on dummy data.
3. Test sad paths where the interface allows them: missing or blank input, zero and negative numbers, boundary maximums, oversized payloads, repeated submissions, encoding mixes, expired or revoked tokens, out-of-order or concurrent delivery, and half-completed migrations.
4. Check the promises each component makes against what its neighbors take for granted. Findings hide in the gap between the two.

**Flaw families to cover** (assign at least one unit per family that has a source-visible surface):

| Family | What breaks |
|---|---|
| Injection | Untrusted input reaches interpreters, queries, templates, or shell |
| Access control | Missing or bypassable checks on who may act on what |
| Auth and session | Token issuance, validation, expiry, revocation, privilege changes |
| Cryptography | Weak algorithms, broken randomness, key handling, secret storage |
| Supply chain | Dependencies, build scripts, CI inputs, plugin loading, update paths |
| Client-side trust | DOM sinks, message handlers, deep links, webview bridges |
| Concurrency and state | Races, double-use, TOCTOU, resource exhaustion |
| Data lifecycle | Tenant isolation, retention, deletion, export, backup restore |
| Protocol framing | Request smuggling, cache poisoning, deserialization, webhook verification |

**Reviewer result contract.** Each reviewer returns one JSON object per assigned unit:

```json
{
  "unit_id": "...",
  "disposition": "covered|candidate|blocked",
  "checked_paths": ["repo/relative/path"],
  "candidates": [
    {
      "fingerprint": "stable-source-derived-id",
      "title": "...",
      "principal": "lower-trust actor",
      "authority_line_crossed": "...",
      "trace": ["entry file:line", "propagation file:line", "sink file:line"],
      "observed_effect": "what dummy-data reproduction showed",
      "suspected_fix": "narrowest source change"
    }
  ],
  "blocker": "exact missing fact, if blocked",
  "new_surfaces": ["surfaces seen but not in the ledger"]
}
```

`fingerprint` is derived from the root cause in source, never from line numbers, reviewer names, or severity. New surfaces become new ledger units for the next wave.

**Coverage reviewer.** After each hunting wave, a different reviewer audits the ledger itself: unmapped entry points, parallel paths nobody checked, units closed without checked paths, exclusions without a source-backed reason. It returns gap units and reassignment requests. Repeat waves until a reviewer finds no gaps, or record remaining units as `deferred` with the reason and stop honestly.

---

## Phase 3: Candidate Validation

Give every candidate to a fresh reviewer who did not hunt it. The reviewer's job is to **disprove** the claim from source and bounded local evidence.

The validator re-reads every cited location, reconstructs the strongest visible control on the path, reproduces the minimum effect with dummy data when the sandbox allows, and checks that likelihood, impact, and the proposed fix match only what the evidence shows.

**Verdicts** (one per fingerprint):

| Verdict | Meaning | Gets severity |
|---|---|---|
| `proven` | Complete source trace, reproduced effect, real impact across an authority line, no visible preventing layer | yes |
| `open` | Source-grounded hypothesis blocked by one exact missing fact, with a concrete check plan | no |
| `dropped` | Disproved by source, local behavior, a visible control, or missing impact | no |

Rules:
- A validator may promote `open` to `proven` only after independently establishing the full trace and observed effect.
- Demote to `open` when a deployment or runtime fact remains genuinely unknown; name the fact and the safe owner-observed check.
- `open` is not a parking lot for speculation. No trace, no record.
- A `dropped` record is kept so future runs do not repeat the same claim without new evidence.

**Severity anchors** (overall severity never exceeds demonstrated impact):

| Severity | Anchor |
|---|---|
| critical | Attacker runs code without authenticating, reads or writes the whole data store, or seizes control of any account |
| high | An explicit control fully defeated with real consequences: auth bypass, cross-tenant read/write, stored script execution against other users, authenticated code execution |
| medium | Real line crossed, but limited blast radius, unusual preconditions, or narrow resource set |
| low | Minor internal details leak, or genuine effort for negligible payoff |
| note | Confirmed but negligible impact; mainly useful as supporting detail for a bigger finding |

Deciding high vs medium: did the observed effect completely break a stated control for a consequential action, or just erode it? When the concrete harm cannot be named, rate it lower than instinct suggests.

---

## Phase 4: Findings Record

Write `findings.json`: one record per fingerprint, sorted by fingerprint. Keep the three verdict contracts distinct.

`proven` record fields: `fingerprint`, `title`, `summary`, `principal`, `authority_line_crossed`, `trace` (entry, propagation, sink), `evidence` (file:line citations), `conditions`, `reproduction` (target-native steps with dummy data), `observed_effect`, `impact`, `severity`, `confidence`, `fix` (smallest source change plus regression test).

`open` record fields: `fingerprint`, `title`, `summary`, `principal`, `authority_line_crossed`, `trace`, `evidence`, `blocker` (exact missing fact), `check_plan` (bounded local step and/or safe owner-observed step). No severity, no fix.

`dropped` record fields: `fingerprint`, `title`, `trace`, `evidence`, `reason_dropped`.

---

## Phase 5: Final Verification

A fresh reviewer re-checks every `proven` and `open` record against current source: paths, lines, entry interface, conditions, impact, severity separation, and whether the fix enforces the invariant at the right point.

If verification materially changes a record (different root cause, trace, effect, impact, or severity, or any promotion), a **second** fresh reviewer independently re-checks it before acceptance. Apply non-material corrections (wording, line numbers) directly.

Mark the run complete only after each candidate has been independently resolved. Otherwise record the run incomplete with the exact reason and keep unresolved candidates in the ledger, never in the findings file.

---

## Phase 6: Reporting

Derive prose from the final records only. Prose never changes a verdict, severity, blocker, or observed effect.

**REPORT.md**
1. Scope, source ref, execution limits, prior-run use, and an explicit list of deferred and out-of-scope units. A partial run says so plainly.
2. One short security posture summary.
3. Proven-findings table: severity, title, authority line, one-line observed effect.
4. Each proven finding: location, principal, reproduction, conditions, effect, impact, priority rationale, smallest fix.
5. Separate open-leads table: title, trace, exact blocker, next check. No severity, never called vulnerabilities.
6. Hardening notes: defense-in-depth gaps with no reachable violation, kept clearly separate from findings.
7. Coverage roll-up drawn from the ledger: counts per status plus the final review result.

**FINDINGS-DETAIL.md** - for each medium and above: full trace, dummy principal and affected resource, exact reproduction steps, the invariant the effect proves, conditions and containment, remediation with regression case.

**OPEN-LEADS.md** - every unresolved record with its trace, blocker, and check plan, prioritized. Never written as live test guidance against a deployment.

---

## Execution Safety

- Source review is read-only. Never modify target code during the audit; the audit describes fixes.
- Local reproduction runs only with dummy data inside a sandbox: networking disabled, a minimal allowlisted environment, the target mounted read-only, writes confined to scratch space, explicit CPU/memory/time limits.
- Never touch production, real credentials, shared queues, cloud resources, or other users' data. Stop at the minimum effect that proves the boundary result.
- If a decisive fact lives outside source and the sandbox, record it as an `open` blocker with an exact check plan. Do not guess.

---

## Anti-Patterns

1. Best-practice deviations presented as vulnerabilities.
2. Hardening advice with no reachable authority-line violation.
3. Testing against live or shared systems when a contained local check would settle the question.
4. Guessing deployment, proxy, provider, or identity behavior the source does not show.
5. Counting actions within one principal's own authority, or harm limited to the actor, as a boundary crossing.
6. Reporting a stronger effect than the one actually observed.
7. Assigning severity to `open` records.
8. Reporting before the independent check, or letting the narrative drift from the records.
9. Re-reporting a carried prior finding without re-validating it against current source.
10. Claiming complete coverage from a scoped, partial, or budget-cut run.

---

## Output Template

```markdown
# Security Audit Report: <target> (<source ref>)

## Posture Summary
<2-3 sentences: what this codebase guards, where it is strong, where it is thin>

## Proven Findings
| ID | Severity | Title | Authority Line | Observed Effect |
|---|---|---|---|---|
| P-1 | high | `path:line` | <line crossed> | <one line> |

### [high] P-1: <title>
- **Location**: `src/path/file.ext:lines`
- **Principal**: <lower-trust actor> | **Line crossed**: <authority line>
- **Trace**: entry -> propagation -> sink (each `file:line`)
- **Reproduction**: <target-native steps with dummy data>
- **Observed effect**: <what happened>
- **Fix**: <smallest source change> + regression test `<test path>`

## Open Leads
| ID | Title | Blocker | Next Check |
|---|---|---|---|
| O-1 | <title> | <exact missing fact> | <bounded local or owner-observed step> |

## Hardening Notes
- <gap with no reachable violation, kept separate from findings>

## Coverage
- Units: N covered / M candidate / K blocked / D deferred / X out of scope
- Final review: <clean | gaps listed>
- Not covered: <explicit statement>
```

---

## Checkable Completion Criteria

- [ ] Every finding names a principal, an authority line crossed, an affected asset, and an observed effect.
- [ ] Every claim cites repository-relative `file:line` or a bounded dummy-data reproduction.
- [ ] No reviewer confirmed a candidate they hunted; every `proven` record passed a fresh challenger.
- [ ] `open` records carry an exact blocker and check plan, and no severity.
- [ ] `dropped` records kept with reasons; no repeated claims without new evidence.
- [ ] Coverage ledger closed honestly: covered units have checked paths, deferred units have reasons.
- [ ] REPORT.md, FINDINGS-DETAIL.md, and OPEN-LEADS.md derived from final records with no verdict drift.
- [ ] No production system, real credential, or shared resource was touched.
