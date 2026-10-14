#!/bin/bash
# Git guardrail: blocks dangerous git operations before they execute.
# Fail-closed design: any parsing failure blocks the command.

# jq is required to parse the hook input. Without it we cannot see the
# command, so block everything rather than silently allowing it.
command -v jq >/dev/null 2>&1 || {
  echo "BLOCKED: 'jq' is required by the git guardrail but is not installed. Blocking by default (fail-closed)." >&2
  exit 2
}

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# If we cannot extract a command, block rather than allow blindly.
[ -n "$COMMAND" ] || {
  echo "BLOCKED: could not parse the command from hook input. Blocking by default (fail-closed)." >&2
  exit 2
}

# Normalize a git invocation: collapse whitespace, strip the leading `git`
# plus any global flags (-C <path>, -c <k=v>, --git-dir=<p>, --no-pager, ...),
# so `git -C /repo push` and `git push` reduce to the same subcommand string.
normalize_git_command() {
  local cmd="$1" prev=""
  cmd=$(printf '%s' "$cmd" | tr -s ' ' | sed -E 's/^ *//')
  case "$cmd" in
    git\ *|git) ;;
    *) printf '%s' "$cmd"; return 0 ;; # not a git command; leave as-is
  esac
  cmd=$(printf '%s' "$cmd" | sed -E 's/^git( |$)//')
  # Strip leading global flags until the subcommand word appears.
  # The loop always terminates: it breaks when nothing changed.
  while :; do
    prev="$cmd"
    case "$cmd" in
      -C*|-c*) cmd=$(printf '%s' "$cmd" | sed -E 's/^-[Cc] *[^ ]* *//') ;;
      --*=*)   cmd=$(printf '%s' "$cmd" | sed -E 's/^--[^ =]+=[^ ]* *//') ;;
      --*)     cmd=$(printf '%s' "$cmd" | sed -E 's/^--[A-Za-z-]+ *//') ;;
      -*)      cmd=$(printf '%s' "$cmd" | sed -E 's/^-[A-Za-z]+ *//') ;;
    esac
    [ "$cmd" = "$prev" ] && break
  done
  printf '%s' "$cmd"
}

NORMALIZED=$(normalize_git_command "$COMMAND")

# Exact subcommand matching on the normalized string. The reset/clean flag
# clusters are checked with regex (glob backtracking is unreliable when a
# character class overlaps the literal being searched, e.g. "-fd").
is_dangerous() {
  local c="$1"
  case "$c" in
    push*) return 0 ;;                                             # any push
    checkout\ --\ *) return 0 ;;                                   # checkout -- <path>: discards worktree changes
    branch\ -D*|branch\ *--force*) return 0 ;;                      # branch -D / --force (not plain -d)
    restore*)
      case "$c" in
        restore*\ --worktree*) return 0 ;;
        restore*\ --\ *) return 0 ;;
        restore*\ --source=*)
          case "$c" in restore*\ --staged*) return 1 ;; *) return 0 ;; esac ;;
        restore\ [^-]*) return 0 ;;                                # bare path args = worktree restore
      esac
      return 1 ;;                                                  # e.g. restore --staged . is allowed
  esac
  if [[ "$c" =~ ^reset\ +(-[A-Za-z]+\ +)*--hard([[:space:]]|$) ]]; then return 0; fi
  if [[ "$c" =~ ^clean\ +-[A-Za-z]*f ]]; then return 0; fi
  if [[ "$c" =~ ^clean\ +--force([[:space:]]|$) ]]; then return 0; fi
  return 1
}

if is_dangerous "$NORMALIZED"; then
  echo "BLOCKED: '$COMMAND' is a dangerous git operation. The user has prevented you from doing this." >&2
  exit 2
fi

exit 0
