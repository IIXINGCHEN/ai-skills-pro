---
"ai-skills-pro": patch
---

Zero hardcoded workstation absolute paths policy and automated release enforcement:

- Prohibited all hardcoded host workstation absolute filesystem paths across all repository files and documentation:
  - Cleaned developer workstation drive letters in test and execution reports, replacing them with relative repo-root identifiers.
  - Retained standard user-environment skill directories (`~/.claude/skills`, `~/.agents/skills`) across `CLAUDE.md`, `README.md`, and `README.zh-CN.md`.
  - Retained standard target-system daemon paths (`/etc/os-release`, `/var/log/...`) in `skills/engineering/eng-linux-security/SKILL.md` as legitimate Linux host inspection locations, while ensuring no local development workstation paths are present.
- Hardened release gate (`scripts/release-check.mjs`): added an automated zero-hardcoded-workstation-absolute-paths check that scans every release artifact file and fails immediately if any workstation drive letter, Git Bash mount, or workstation home path is detected outside of standard web URLs.
- Expanded automated regression testing (`tests/upstream-conventions.test.mjs`): added test assertion verifying that all tracked repository `.md`, `.json`, `.yaml`, `.mjs`, `.sh`, and `.ps1` files contain zero hardcoded workstation absolute paths (test suite passing 62/62).
- Regenerated manifests and registry via `npm run generate:manifests`; all four quality gates green (`validate`, `test`, `eval`, `release-check`).

