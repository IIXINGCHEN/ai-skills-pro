## What it does

Runs a full structured security audit of a codebase in six phases: survey the target and plan coverage, hunt each surface with isolated reviewers, force every candidate through an independent challenger, record findings in a strict verdict taxonomy, verify the final records with fresh eyes, and report from the records only.

## When to reach for it

Type /eng-security-audit, or the agent reaches for it when you ask for a security audit, a vulnerability review, or a pen-test-style assessment of code, APIs, services, CLIs, or libraries.

Guidance mode is the default: security questions and focused reviews use only the relevant parts. The full six-phase workflow runs only on an explicit audit request.

## Common questions

**How is this different from eng-adversarial-audit?**
eng-adversarial-audit is a single-pass adversarial review: fast, broad, dual-tagged. eng-security-audit is the heavyweight option: a coverage ledger that tracks every surface, isolated hunters per unit, and independent verification of each finding, so the final report can defend its coverage claim.

**Does a clean run mean the code is secure?**
No. It means the covered surfaces produced no proven findings under the evidence bar used. The report states exactly what was covered, deferred, and left unknown, so you know where the assurance ends.

**Does this skill work across multiple AI agent tools?**
Yes. It supports Claude Code, OpenAI Codex, DeepSeek Harness (DSH), and standard Agent Skills ecosystem tools.

## It's working if

- The run opens with a survey and a coverage ledger, not with findings.
- No reviewer confirms a candidate they hunted; every proven finding survived a challenger.
- Open leads carry an exact blocker and check plan, never a severity rating.
- The final report states its coverage limits plainly, including any deferred units.

## Where it fits

The deep-audit complement to eng-adversarial-audit: reach for eng-adversarial-audit for a fast adversarial pass, eng-security-audit when you need a complete, defensible assessment with tracked coverage. Findings that need data-integrity or error-handling depth hand off to eng-hardening-review.
