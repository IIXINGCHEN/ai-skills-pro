#!/usr/bin/env bash
set -euo pipefail

# Fail-fast check for shells that invoke this via sh instead of bash
if [ -z "${BASH_VERSION:-}" ]; then
  printf "ERROR: scripts/link-skills.sh requires bash. Please run with: bash scripts/link-skills.sh\n" >&2
  exit 1
fi

# Symlink all skills into user agent skill directories.
# Permission notes for restricted Linux environments:
#   - Creating symlinks inside your own home directory requires no root privileges.
#   - On hosts where symlinks are disabled (e.g., some corporate NFS mounts or
#     containers with grsecius protections), this script falls back to copying.
#   - If both symlink and copy fail, check mount options with `mount | grep $(df . | tail -1 | awk '{print $1}')`
#     and confirm the filesystem allows node creation.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

TARGET=(
  "${HOME}/.agents/skills"
  "${HOME}/.claude/skills"
)

BUCKETS=("engineering" "productivity" "design")

for target in "${TARGET[@]}"; do
  mkdir -p "${target}"
done

link_count=0
copy_count=0

for bucket in "${BUCKETS[@]}"; do
  bucket_path="${ROOT_DIR}/skills/${bucket}"
  if [ -d "${bucket_path}" ]; then
    for skill_dir in "${bucket_path}"/*; do
      if [ -d "${skill_dir}" ]; then
        skill_name="$(basename "${skill_dir}")"
        for target in "${TARGET[@]}"; do
          link_path="${target}/${skill_name}"
          rm -rf "${link_path}"
          if ln -s "${skill_dir}" "${link_path}" 2>/dev/null; then
            echo "Linked (symlink) ${skill_name} -> ${link_path}"
            link_count=$((link_count + 1))
          elif cp -r "${skill_dir}" "${link_path}" 2>/dev/null; then
            echo "Linked (copy fallback) ${skill_name} -> ${link_path}"
            copy_count=$((copy_count + 1))
          else
            echo "ERROR: cannot create ${link_path} on this filesystem." >&2
            exit 1
          fi
        done
      fi
    done
  fi
done

echo "Symlinked: ${link_count}, Copied: ${copy_count}"
echo "All skills linked successfully!"
echo "Note: copied fallbacks do not auto-update; re-run this script after upstream changes."