---
name: pipe-review-diff
description: Human-style review of changes since a fixed point along Standards and Spec axes - does the diff follow repo standards, and does it match the Goal/spec? Use when reviewing a branch, PR, or post-implementation slice. Named pipe-review-diff to avoid colliding with `eng-code-review`.
disable-model-invocation: true
---

Optional: [references/protocol-v2.md](references/protocol-v2.md)

## Process

1. Fixed point base (`main`/commit)
   - Use the three-dot form (`<base>...HEAD`) so the comparison starts at the merge-base. A two-dot range measures the wrong span on branched histories.
   - Before fanning out the two axis reviews in parallel, confirm the base ref resolves (`git rev-parse <base>`) and the diff is non-empty. A bad ref or empty diff fails here, never inside the review agents.
2. Spec source (Goal/spec/issue or "no spec")
3. Standards source
   - Repo-documented standards first; they override the smell baseline in protocol-v2.md.
   - The baseline is always advisory; skip anything the toolchain already enforces.
4. Separate axes: Standards vs Spec
5. Report with evidence paths

No silent code edits.
