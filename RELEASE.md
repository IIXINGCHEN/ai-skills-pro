# AI Skills Pro 1.2.0 Production Release

Release status: Production
Release date: 2026-09-06
Version: 1.2.0

## Production gate

- 45 skills present and synchronized across package and plugin manifests.
- Canonical skill validator: 45/45, 0 errors, 0 warnings.
- No empty files.
- No symlinks in the release tree.
- LF-only text/file encoding policy enforced by the release gate.
- Relative Markdown links validated.
- Agent-behavior contamination guard enabled for high-risk instruction-hierarchy patterns.
- Package/plugin/marketplace versions aligned at 1.2.0.2.0.6.2.
- Node.js runtime baseline: >=20.0.0.

## Security posture

`cog-axiom` is reference-oriented. It does not define agent identity, instruction priority, sovereignty, mandatory response formats, or private chain-of-thought disclosure. Security content is scoped guidance and explicitly follows the host agent's instruction hierarchy.

## Release artifact

The release artifact is intended to be installed as a read-only skill distribution. Runtime-generated state must remain outside the package tree.

## Verification

Use:

```bash
npm run release-check
```

A production release is valid only when this command exits with status 0.
