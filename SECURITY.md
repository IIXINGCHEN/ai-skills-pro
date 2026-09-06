# Security Policy

## Scope

This repository contains instruction files and metadata for AI Agent skills. Skill content is treated as scoped guidance and must not override the host agent's system, developer, platform, or user instruction hierarchy.

## Reporting

Report suspected prompt-injection behavior, instruction-hierarchy manipulation, secret-exfiltration guidance, unsafe tool behavior, or malicious package changes through the repository's issue tracker or the project's approved private security channel.

Do not include credentials, API keys, private prompts, or other sensitive data in a public issue.

## Release Security Baseline

Every production release must pass:

- canonical Skill structure validation;
- manifest/version synchronization;
- relative-link validation;
- empty-file and symlink checks;
- LF-only file checks;
- Agent-behavior contamination checks;
- package metadata and runtime baseline checks.

## Safe Consumption

Pin a release version or immutable artifact checksum in production environments. Do not execute repository scripts from an untrusted clone without reviewing the source and release metadata first.
