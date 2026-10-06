---
name: eng-docker-update
description: Update Docker Compose images with health checks and rollback safeguards.
disable-model-invocation: true
---

# Docker Compose Image Update Automation

Design and execute production-grade, automated image update workflows for multi-container Docker Compose stacks with data-loss safeguards, rolling health checks, and automatic rollback.

## Prerequisites

- Docker Engine and Compose v2 installed (`docker compose version`).
- root or docker group membership for the invoking user.
- Compose file path confirmed with the user before running.
- Destructive operations here (notably `docker image prune -f`) fall under `eng-destructive-safety-gate`: run its two-confirmation flow before executing the update script.

## Core Rules & Guardrails

- **Volume Preservation**: Never delete or unmount persistent data volumes during update workflows.
- **Strict Health Check Gate**: Old images and containers MUST NOT be pruned until new containers have passed health checks (`healthcheck`, open port check, or HTTP status 200).
- **Graceful Rollback**: If new containers fail health checks or exit unexpectedly, immediately roll back to the previously recorded image IDs.
- **Digest-Based Diffing**: Use `docker manifest inspect` (Manifest V2) to compare remote vs local SHA256 digests before performing costly pulls. Fall back to pull inspection if the registry does not support Manifest V2.
---
## 6-Stage Update Lifecycle

```
[1. Parse Compose] ➔ [2. Digest Diffing] ➔ [3. Pull & Record Old IDs] ➔ [4. Compose Up -d] ➔ [5. Health Check Gate] ➔ [6. Prune & Report]
```

### Stage 1: Parse Compose Services
Extract all `image` directives from `docker-compose.yml` (registry, repository, tag).

### Stage 2: Version Diffing & Remote Inspection
- **Branch A (Manifest V2 - Preferred)**: Run `docker manifest inspect <image>` and compare remote SHA256 digest against local digest (`docker image inspect --format='{{.RepoDigests}}'`). If identical, skip.
- **Branch B (Pull Inspection - Fallback)**: If manifest inspection fails (e.g. auth proxy or V1 registry), execute `docker pull <image>` and check for `"Status: Downloaded newer image"`.

### Stage 3: Pull & State Snapshot
Record current running container IDs and image IDs as rollback targets. Pull updated images.

### Stage 4: Recreate Containers
Execute `docker compose up -d` for updated services to trigger non-destructive recreate.

### Stage 5: Health Check & Rollback Gate
1. Wait for container startup grace period (e.g. 15-30s).
2. Check container health status (`docker inspect --format='{{.State.Health.Status}}'`).
3. If any service is unhealthy or restarting:
   - Revert compose file or run `docker compose up -d` with previous image tags.
   - Halt update and emit alert.

### Stage 6: Safe Pruning & Summary
Once all health checks pass:
1. Safely remove specific superseded image IDs (`docker rmi <old-image-id>`).
2. Run `docker image prune -f` for dangling layers.
3. Emit update execution report.

---

## Illustrative Shell Script Template (adapt before production use)

The template below sketches the lifecycle. It is intentionally simplified: before production use, add pre-pull digest comparison (skip the pull when the remote digest already matches local, per Core Rules). Rollback on health-check failure re-tags the recorded `OLD_ID`s back to their original tags and re-runs `compose up -d`; `docker image prune -f` only runs after the health gate passes, never after a failure.

```bash
#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${1:-docker-compose.yml}"
ROLLBACK_FILE=$(mktemp)

echo "=== [1/6] Extracting images from $COMPOSE_FILE ==="
IMAGES=$(docker compose -f "$COMPOSE_FILE" config --images)

UPDATED_COUNT=0

for IMG in $IMAGES; do
  echo "Checking image: $IMG"
  # Record old image ID for rollback
  OLD_ID=$(docker image inspect --format='{{.Id}}' "$IMG" 2>/dev/null || echo "none")
  echo "$IMG $OLD_ID" >> "$ROLLBACK_FILE"

  # Branch A: Manifest inspect
  if docker manifest inspect "$IMG" >/dev/null 2>&1; then
    docker pull -q "$IMG"
  else
    docker pull "$IMG"
  fi

  NEW_ID=$(docker image inspect --format='{{.Id}}' "$IMG")
  if [ "$OLD_ID" != "$NEW_ID" ]; then
    echo "  -> Found new version: $OLD_ID -> $NEW_ID"
    UPDATED_COUNT=$((UPDATED_COUNT + 1))
  else
    echo "  -> Image is already up to date."
  fi
done

if [ "$UPDATED_COUNT" -gt 0 ]; then
  echo "=== [4/6] Recreating containers ==="
  docker compose -f "$COMPOSE_FILE" up -d

  echo "=== [5/6] Awaiting Health Checks ==="
  sleep 10
  # Verify container status
  if docker compose -f "$COMPOSE_FILE" ps --status=running | grep -q "Up"; then
    echo "=== [6/6] Health check PASSED. Cleaning old images ==="
    rm -f "$ROLLBACK_FILE"
    docker image prune -f
  else
    echo "=== [ERROR] Container health check FAILED. Rolling back to recorded image IDs ==="
    docker compose -f "$COMPOSE_FILE" logs --tail=50
    while read -r IMG OLD_ID; do
      if [ "$OLD_ID" != "none" ]; then
        docker tag "$OLD_ID" "$IMG" || echo "WARNING: rollback re-tag failed for $IMG"
      fi
    done < "$ROLLBACK_FILE"
    docker compose -f "$COMPOSE_FILE" up -d
    echo "Rollback complete. No images were pruned."
    rm -f "$ROLLBACK_FILE"
    exit 1
  fi
fi

echo "=== Done: Docker Compose Update Completed Successfully ==="
```

---

## Completion Checklist

- [ ] Volume persistence confirmed unaffected.
- [ ] Digest comparison executed before container recreation.
- [ ] Container health check confirmed before old image pruning.
- [ ] Rollback strategy verified.

---

## Checkable Completion Criteria

- [ ] Update report lists per-image digest decisions (skipped vs updated).
- [ ] All recreated containers pass health checks before any old image is pruned.
- [ ] Zero data-volume loss; rollback path proven available throughout the run.
