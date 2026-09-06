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
Provide clear, platform-appropriate setup commands:

```markdown
# Local Project Setup Guide

## Prerequisites
- Runtime: Node.js (vX.X+) / Python (3.X+) / Rust / Go
- Services: Docker / Postgres / etc.

## Setup Steps
1. **Clone & Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with local credentials
   ```
2. **Install Dependencies**:
   ```bash
   <package-manager> install
   ```
3. **Database Migration / Seed (If applicable)**:
   ```bash
   <migration-command>
   ```
4. **Start Development Server**:
   ```bash
   <start-command>
   ```
5. **Verify Health**:
   - Access URL: `http://localhost:<port>`
```

---

## Checkable Completion Criteria

- [ ] Tech stack detected from real manifests (package.json, pyproject.toml, Cargo.toml, go.mod, etc.).
- [ ] Environment variables, ports, and service prerequisites surfaced from config files.
- [ ] Setup guide covers clone, env config, dependency install, migration, start, and health verification with runnable commands.
