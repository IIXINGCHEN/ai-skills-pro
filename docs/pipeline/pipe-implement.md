## What it does

Implements a spec or set of tickets, working the frontier of unblocked tickets. Every ticket runs a loop until green: implement, test, audit, review, fix, retest, refix. TDD at the agreed seams, typecheck regularly, full suite at the end, diff reviewed, committed per ticket.

## When to reach for it

Type `/pipe-implement` with a spec or approved tickets. It is stage 4 of the `pipe-ship` pipeline.

## Common questions

**What does the per-ticket loop look like?**
Implement, test, audit (`eng-adversarial-audit` for security-sensitive surfaces, else `eng-hardening-review`), review (`pipe-review-diff`), fix, retest, refix. A ticket closes only when typecheck, ticket tests, and the full suite are all green.

**What if the loop never converges?**
Fix-retest cycles are capped at 3 per ticket; then it escalates with the failing evidence instead of looping silently.

## It's working if

- No ticket moved on with open findings or red tests.
- Commit hashes are recorded per ticket.

## Where it fits

Stage 4 of `pipe-ship`, feeding `eng-code-review`.
