# AI Skills Pro 2.0.0 Production Release

Release status: Production
Release version: 2.0.0

## What changed

- Reframed the library as composable skills rather than one mandatory global pipeline.
- Enforced the user-invoked / model-invoked contract across Claude and Codex metadata.
- Restricted consequential Git, PR, Docker, and Linux firewall operations to human-triggered skills.
- Added explicit Skill Tool dependency validation so only model-invoked skills can be reached by other skills.
- Reduced always-loaded repository instructions and added a shared `CONTEXT.md` vocabulary layer.
- Removed repository runtime state, `.git`, and local build state from the production artifact.
- Added stronger version, manifest, catalog, link, encoding, and behavior-safety release gates.

## Verification

```bash
npm run validate
npm run release-check
```

The release artifact is valid only when both commands exit with status 0.
