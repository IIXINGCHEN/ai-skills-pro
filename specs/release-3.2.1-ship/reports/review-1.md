# Code Review Report - Pass 1

- **Scope**: repo (entire tree; fresh git repo, zero commits)
- **Profile**: strict
- **Spec Reference**: specs/ (no frozen spec for this ship; RELEASE-MANIFEST.json + ADRs act as release contract)
- **Target**: ai-skills-pro v3.2.1 snapshot, 295 files, prior to ship to github.com/IIXINGCHEN/ai-skills-pro
- **Evidence runs**: `npm run validate` (2 ERR), `npm test` (61/62), `npm run eval` (34/34, 17/17, 11/11, 20/20), `npm run release-check` (3 ERR, 2 WARN), `npm run check-plugin-version` (exit 1)

## Summary Matrix
| Severity | Count | Status |
|---|---|---|
| Critical | 1 | Action Required |
| Warning | 5 | Review Needed |
| Suggestion | 3 | Optional |

## Detailed Findings

### [CRITICAL] F1 - Release manifests stuck at 3.1.0 while VERSION is 3.2.1
- **Category**: Spec Alignment / Correctness
- **Files**: `.claude-plugin/plugin.json:3` (3.1.0), `.claude-plugin/marketplace.json:7,14` (3.1.0), `registry/skills.json:2` (3.1.0)
- **Description**: VERSION (single source of truth) says 3.2.1; package.json, package-lock.json, RELEASE-MANIFEST.json agree. Three packaging manifests lag at 3.1.0. The project's own gates fail: validate reports 2 errors, release-check reports 3 errors, tests/repo.test.mjs:14 fails. A shipped plugin would self-identify as 3.1.0.
- **Recommended Fix**:
  ```bash
  node scripts/sync-plugin-version.mjs        # plugin.json, format-preserving
  # marketplace.json: two fields -> 3.2.1
  npm run generate:manifests                  # registry version + hashes
  ```

### [WARNING] F2 - RELEASE.md body still says 3.1.0
- **Category**: Spec Alignment
- **File**: `RELEASE.md:4`
- **Description**: Header (line 1) was updated to "3.2.1 Production Release" but line 4 reads `Release version: 3.1.0`. The release announcement contradicts itself.
- **Recommended Fix**: `Release version: 3.1.0` -> `Release version: 3.2.1`

### [WARNING] F3 - sync-version.mjs regex misses the actual RELEASE.md field name (root cause of F2)
- **Category**: Correctness
- **File**: `scripts/sync-version.mjs:95`
- **Description**: The updater replaces `/^Version:\s*.*$/m`, but the real field is `Release version:`. Every future version bump will silently leave RELEASE.md stale again.
- **Recommended Fix**:
  ```diff
  - releaseText = releaseText.replace(/^Version:\s*.*$/m, `Version: ${targetVersion}`);
  + releaseText = releaseText.replace(/^Release version:\s*.*$/m, `Release version: ${targetVersion}`);
  ```

### [WARNING] F4 - RELEASE.md stale catalog counts (40 skills, 51 tests)
- **Category**: No-fabrication discipline (ADR 0005): claims must match the tree
- **Files**: `RELEASE.md:8` ("catalog of 40 skills"), `RELEASE.md:16` ("test suite of 51 tests")
- **Description**: Actual tree has 42 skills (release-check PASS at 42; RELEASE-MANIFEST declares 42) and 62 tests (npm test: tests=62). Both lines understate the release.
- **Recommended Fix**: 40 -> 42, 51 -> 62 on the two lines.

### [WARNING] F5 - QUALITY_REPORT.md is a v3.1.0-era snapshot presented as current
- **Category**: No-fabrication discipline / release integrity
- **File**: `QUALITY_REPORT.md` (all lines)
- **Description**: Title "v3.1.0 Quality Report", 40 skills, 16 user/24 model split, 51/51 tests, alignment claim at 3.1.0. Current tree: 42 skills, 18/24 split, 62 tests. The document sits at repo root and is a required release file, so it reads as the release's quality statement while describing a superseded release.
- **Recommended Fix**: Regenerate after F1 lands, copying only freshly verified numbers (42 skills, 18/24, 62/62, real edge count from regenerated registry, alignment at 3.2.1).

### [WARNING] F6 - ARCHITECTURE.md skill count stale
- **Category**: No-fabrication discipline
- **File**: `ARCHITECTURE.md:7` ("40 skills in three promoted buckets")
- **Recommended Fix**: 40 -> 42.

### [SUGGESTION] F7 - No-op replace is dead code
- **File**: `scripts/generate-manifests.mjs:288`
- **Description**: `yamlKey('required', ...).replace('[]', '[]')` replaces a string with itself; the intent (if any) is already handled by `yamlValue`'s empty-array branch.
- **Recommended Fix**: Drop the `.replace('[]', '[]')` call.

### [SUGGESTION] F8 - Typo in link-skills.sh comment
- **File**: `scripts/link-skills.sh:11` ("grsecius" -> "grsecurity")

### [SUGGESTION] F9 - .npmignore is dead configuration (Deferred)
- **File**: `.npmignore`
- **Description**: package.json `files` whitelist takes precedence; npm never consults root .npmignore when `files` is present. Zero functional impact.
- **Disposition**: Deferred - deletion is cosmetic churn on release day; recommend cleanup in a later housekeeping change.

## Accepted (not defects)
- release-check WARN: `.git` and `.mimosa` exist in the source tree. `.git` is inherent to a git working tree (repo was initialized for this ship); `.mimosa` is local tooling state. Both are excluded from artifacts by the packaging whitelist; the check itself records the policy.

## Clean areas (verified, no findings)
- No secrets, no hardcoded workstation absolute paths, no stray `TODO`/`FIXME`/fabrication markers in shipped content (25 grep hits are rule text naming markers, plus legal template slots).
- Skills corpus: 42 skills, frontmatter/openai.yaml/docs contracts green; em-dash ban green; dependency graph valid (no dangling, no cycles, no user-invoked targets); all skills curated with fresh governance dates.
- Trigger evals: train 34/34, holdout 17/17, blind 11/11; output contracts 20/20.
- Scripts: consistent CLI error-boundary pattern (uncaughtException -> single named line); deterministic hashing; readJson hardening; zero-dependency runtime.
- CI workflows (validate-skills.yml, release.yml) consistent with package.json scripts.

## Verdict: [CHANGES REQUESTED]
