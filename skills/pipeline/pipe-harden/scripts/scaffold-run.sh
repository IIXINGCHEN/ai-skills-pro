#!/usr/bin/env bash
# scaffold-run.sh - create the run directory for a harden pipeline run.
# Usage: scripts/scaffold-run.sh <run-id>
set -euo pipefail

id="${1:?usage: scaffold-run.sh <run-id>}"
base="hardening/$id"

mkdir -p "$base"

cat > "$base/RUN.md" <<EOF
# Run: $id

- Started: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- Status: stage 0 - setup

## Stage log

| Stage | Status | Notes |
|---|---|---|
| 1 audit | pending | |
| 2 fix | pending | |
| 3 test | pending | |
| 4 re-fix | pending | |
| 5 ship | pending | |
EOF

touch "$base/audit-report.md" "$base/fix-plan.md" "$base/test-log.md"
echo "run directory ready: $base"
