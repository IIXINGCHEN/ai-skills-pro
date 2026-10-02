#!/usr/bin/env bash
set -euo pipefail

# Symlink all skills into user agent skill directories.
#
# Safety rules this script must keep:
#   1. A target entry is only ever replaced when it is a symlink. A real
#      directory is refused, never deleted.
#   2. Replacing a symlink removes the link itself, never its target.
#   3. Targets that resolve to the same real directory are collapsed to one.
#      `~/.agents/skills` is commonly a symlink to `~/.claude/skills`; linking
#      both would process every skill twice and delete the link just created.
#
# Permission notes for restricted Linux environments:
#   - Creating symlinks inside your own home directory requires no root privileges.
#   - On hosts where symlinks are disabled (e.g., some corporate NFS mounts or
#     containers with grsecurity protections), this script falls back to copying.
#   - If both symlink and copy fail, check mount options with `mount | grep $(df . | tail -1 | awk '{print $1}')`
#     and confirm the filesystem allows node creation.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

RAW_TARGETS=(
  "${HOME}/.agents/skills"
  "${HOME}/.claude/skills"
)

BUCKETS=("engineering" "productivity" "design")

# Resolve each target to the real directory it points at, creating it when
# missing, and drop duplicates so aliased targets are processed once.
TARGET=()
seen_targets=""
for raw in "${RAW_TARGETS[@]}"; do
  mkdir -p "${raw}"
  real="$(cd "${raw}" && pwd -P)"
  case ";${seen_targets};" in
    *";${real};"*)
      echo "Target skipped (already resolved): ${raw} -> ${real}"
      ;;
    *)
      seen_targets="${seen_targets};${real}"
      TARGET+=("${real}")
      echo "Target resolved: ${raw} -> ${real}"
      ;;
  esac
done

link_count=0
copy_count=0

for bucket in "${BUCKETS[@]}"; do
  bucket_path="${ROOT_DIR}/skills/${bucket}"
  [ -d "${bucket_path}" ] || continue
  for skill_dir in "${bucket_path}"/*; do
    [ -d "${skill_dir}" ] || continue
    skill_name="$(basename "${skill_dir}")"
    for target in "${TARGET[@]}"; do
      link_path="${target}/${skill_name}"
      if [ -L "${link_path}" ]; then
        # Remove the link itself; the link target is left untouched.
        rm -- "${link_path}"
      elif [ -e "${link_path}" ]; then
        echo "ERROR: refusing to replace a real directory (not a link): ${link_path}" >&2
        exit 1
      fi
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
  done
done

echo "Symlinked: ${link_count}, Copied: ${copy_count}"
echo "All skills linked successfully!"
echo "Note: copied fallbacks do not auto-update; re-run this script after upstream changes."
