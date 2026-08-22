---
name: prod-prod-project-init
description: Inspect a repository's tech stack and generate local project initialization, environment setup, dependency installation, and service startup instructions. Use when setting up new developer environments or onboarding to a project.
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
