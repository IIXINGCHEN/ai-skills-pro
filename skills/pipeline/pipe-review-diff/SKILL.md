---
name: pipe-review-diff
description: Human-style review of changes since a fixed point along Standards and Spec axes - does the diff follow repo standards, and does it match the Goal/spec? Use when reviewing a branch, PR, or post-implementation slice. Named pipe-review-diff to avoid colliding with other packs' code-review skill.
disable-model-invocation: true
metadata:
  author: agent-skill-pack-prod
  version: "3.2.0"
  pack: agent-skill-pack-prod
---

Optional: [references/protocol-v2.md](references/protocol-v2.md)

## Process

1. Fixed point base (`main`/commit)
2. Spec source (Goal/spec/issue or "no spec")
3. Standards source
4. Separate axes: Standards vs Spec
5. Report with evidence paths

No silent code edits.
