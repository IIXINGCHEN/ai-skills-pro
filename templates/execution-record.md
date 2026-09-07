# Execution Record Template

One record per governed run, appended (never edited) after the run closes. Copy the chain below, fill every link, keep the order: executor, skill, version, permissions, steps, results, risk, report. Save durable at `specs/<feature>/reports/execution-<timestamp>.md`, or under `.scratch/execution-records/` for runs with no durable artifacts.

```markdown
# Execution Record: <pipeline or skill> - <timestamp>

## 1. Executor

Who ran it: human handle that authorized the run, plus the agent identity and session that executed it.

## 2. Skill

Skill name as in its manifest, invocation mode (user-invoked or model-invoked), and the orchestrator that called it, if any.

## 3. Version

Skill version from its manifest.yaml and the project version at run start (from VERSION or equivalent).

## 4. Permissions

The declared envelope, copied from the skill's manifest: filesystem read/write, shell execute, network access (with the security/network_policy.json approval reference when network is true). Never asserted from memory.

## 5. Steps

The steps actually executed, in order: stage names, commands run, artifacts written, gates hit. Deviations from the skill's contract noted inline.

## 6. Results

Per step: outcome (pass, fail, skipped) and evidence pointer. Totals at the end: fixes applied, tests run, gates green/red.

## 7. Risk level

The manifest risk level for the skill, plus any run-specific overrides (for example a low-risk skill invoked inside a critical pipeline) with their reason.

## 8. Final report

Link to the run's consolidated report (review matrix, remediation plan, verdict) and the completion verdict: DONE, DONE-WITH-ACCEPTED-RISKS, or BLOCKED.
```

Rules:
- Append-only: a closed record is never rewritten; corrections arrive as a new record referencing the old one.
- The chain is the contract: a record missing any link fails review.
- Values for links 2, 3, 4, and 7 come from generated artifacts (manifest, registry), not recall.
