#!/usr/bin/env bash
# scaffold-run.sh - create the run directory for a ship pipeline run.
# Usage: scripts/scaffold-run.sh <feature-slug>
set -euo pipefail

slug="${1:?usage: scaffold-run.sh <feature-slug>}"
base="specs/$slug"

mkdir -p "$base/tickets" "$base/reports" "$base/releases"

cat > "$base/RUN.md" <<EOF
# Run: $slug

- Started: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- Tracker: (fill in stage 0)
- Status: stage 0 - setup

## Stage log

| Stage | Status | Notes |
|---|---|---|
| 1 grill | pending | |
| 2 spec | pending | |
| 3 tickets | pending | |
| 4 implement | pending | |
| 5 review | pending | |
| 6 deepen | pending | |
| 7 deliver | pending | |
| 8 deploy | pending | |
EOF

touch "$base/spec.md"
echo "run directory ready: $base"
