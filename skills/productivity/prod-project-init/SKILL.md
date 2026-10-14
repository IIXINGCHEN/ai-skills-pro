---
name: prod-project-init
description: Initialize a repository-specific development environment and setup guide.
disable-model-invocation: true
---
# Project Init & Setup

Detect project build systems, dependencies, environment variables, and generate a step-by-step local setup guide.

## Process

### 1. Environment & Tech Stack Detection
1. **Node.js**: Check for `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`.
2. **Python**: Check for `pyproject.toml`, `requirements.txt`, `Pipfile`, `poetry.lock`.
3. **Rust / Go / Java**: Check for `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`.
4. **Docker / Databases**: Check for `docker-compose.yml`, `.env.example`, Dockerfiles.

### 2. Configuration & Secrets Detection
1. Check for `.env.example` or required environment configuration keys.
2. Identify ports, proxy setups, or local service prerequisites (e.g. Postgres, Redis).

### 3. Generate Initialization Guide
Provide clear, platform-appropriate setup commands. Only include a step when you actually detected the corresponding artifact; delete steps that do not apply. Every `<placeholder>` below must be replaced with a measured real value: never ship the guide with placeholders intact.

```markdown
# Local Project Setup Guide

## Prerequisites
- Runtime: <detected runtime + measured version, e.g. Node.js v22.4.0>
- Services: <detected services, or delete this line if none>

## Setup Steps
1. **Clone & Environment Configuration** (only if `.env.example` was detected; otherwise delete this step):
   ```bash
   cp .env.example .env
   # Edit .env with local credentials
   ```
2. **Install Dependencies** (use the detected package manager):
   ```bash
   <package-manager> install
   ```
3. **Database Migration / Seed** (only if a migration tool was detected; otherwise delete this step):
   ```bash
   <migration-command>
   ```
4. **Start Development Server**:
   ```bash
   <start-command>
   ```
5. **Verify Health**:
   - Access URL: `http://localhost:<port>` (use the measured port)
```

---

## Checkable Completion Criteria

- [ ] Tech stack detected from real manifests (package.json, pyproject.toml, Cargo.toml, go.mod, etc.).
- [ ] Environment variables, ports, and service prerequisites surfaced from config files.
- [ ] Setup guide covers clone, env config, dependency install, migration, start, and health verification with runnable commands.
