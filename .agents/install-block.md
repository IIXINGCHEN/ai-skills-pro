# The Canonical Install Block

`ai-skills-pro` supports the standard Agent Skills installation routes:

## 1. Claude Code Plugin Installation

From inside a Claude Code session:
```bash
/plugin install <path-or-repo>
```

Or from the CLI:
```bash
claude plugins install <path-or-repo>
```

## 2. Cross-Agent Ecosystem: `skills.sh`

For Codex, Cursor, DSH, and other agents, `skills.sh` copies skill packages into the environment:

```bash
# Add entire suite
npx skills@latest add <path-or-repo>

# Add single skill
npx skills@latest add <path-or-repo> --skill=eng-router
```

## 3. Local Symlink (Development / Offline)

Symlink all skills directly into `~/.agents/skills` and `~/.claude/skills`:

```bash
# Linux / macOS:
./scripts/link-skills.sh

# Windows PowerShell:
.\scripts\link-skills.ps1
```
