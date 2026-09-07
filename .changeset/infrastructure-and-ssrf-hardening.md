---
"ai-skills-pro": patch
---

Infrastructure hardening, SSRF boundaries, and developer tooling ergonomics:

- Upgraded `.github/workflows/validate-skills.yml` runner to Node.js 22, matching `release.yml` and eliminating GitHub Actions Node 20 deprecation warnings.
- Pruned stale remote branch `changeset-release/main` following the merge of release PR #1, maintaining a clean repository branch tree.
- Hardened `scripts/link-skills.sh` with a fail-fast shell check (`BASH_VERSION`), outputting clear actionable guidance if accidentally invoked by pure POSIX sh or lightweight container shells.
- Strengthened `skills/design/vis-reverse-ui/SKILL.md` with an explicit SSRF defense boundary: enforcing http/https schemes only and requiring pre-flight host validation that rejects localhost, loopback, private networks, and reserved IP ranges.
- Synchronized `manifest.yaml` for `vis-reverse-ui` and verified clean passing of all four repository quality gates (`validate`, `test`, `eval`, `release-check`).
