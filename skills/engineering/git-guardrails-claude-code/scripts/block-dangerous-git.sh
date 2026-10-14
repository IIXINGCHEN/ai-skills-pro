#!/bin/bash
# Git guardrail: blocks dangerous git operations before they execute.
# Fail-closed design: any parsing failure blocks the command.
#
# Two-phase detection:
#   1. Anchored match on the normalized subcommand (direct `git ...` calls).
#   2. Embedded scan: compound commands are split on shell operators and each
#      segment is checked for a git invocation (`cd /repo && git push`,
#      `/usr/bin/git push`, `command git push`, `$(git push)`).

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

BLOCK_REASON=""

# Anchored matcher: input is a normalized subcommand string (no leading `git`).
# Returns 0 when dangerous, 1 when allowed.
match_subcommand() {
  local c="$1"
  case "$c" in
    push|push\ *) return 0 ;;                                     # any push (word-boundary: pushd is not matched)
    checkout\ --\ *) return 0 ;;                                  # checkout -- <path>: discards worktree changes
    checkout\ -*)
      # -f/--force discards worktree changes when switching branches.
      if [[ "$c" =~ (^|[[:space:]])-[A-Za-z]*f([[:space:]]|$) ]] || \
         [[ "$c" =~ (^|[[:space:]])--force([[:space:]]|$) ]]; then
        BLOCK_REASON="checkout -f/--force discards worktree changes"
        return 0
      fi
      return 1 ;;                                                 # -b/-B/--orphan: branch ops, safe
    checkout*)
      local arg="${c#checkout }"
      arg="${arg%% *}"
      [ -n "$arg" ] || return 1                                   # bare `checkout`: no-op
      if git rev-parse --verify --quiet "refs/heads/$arg" >/dev/null 2>&1; then
        return 1                                                  # known local branch: switch, safe
      fi
      if git rev-parse --verify --quiet "refs/tags/$arg" >/dev/null 2>&1; then
        return 1                                                  # known tag: detached checkout, safe
      fi
      BLOCK_REASON="checkout target '$arg' is not a known branch or tag; refusing ambiguous restore (fail-closed)"
      return 0 ;;
    branch\ -D*|branch\ *--force*) return 0 ;;                    # branch -D / --force (not plain -d)
    restore*)
      case "$c" in
        restore*\ --worktree*) return 0 ;;
        restore*\ --\ *) return 0 ;;
        restore*\ --source=*)
          case "$c" in restore*\ --staged*) return 1 ;; *) return 0 ;; esac ;;
        restore\ [^-]*) return 0 ;;                              # bare path args = worktree restore
      esac
      return 1 ;;                                                  # e.g. restore --staged . is allowed
  esac
  # reset --hard in ANY argument position (reset HEAD --hard, reset --hard HEAD, ...)
  if [[ "$c" =~ ^reset([[:space:]]|$) ]] && [[ "$c" =~ (^|[[:space:]])--hard([[:space:]]|$) ]]; then
    return 0
  fi
  if [[ "$c" =~ ^clean\ +-[A-Za-z]*f ]]; then return 0; fi
  if [[ "$c" =~ ^clean\ +--force([[:space:]]|$) ]]; then return 0; fi
  return 1
}

# Scan each shell-operator-separated segment for an embedded git invocation.
# Returns 0 when any segment is dangerous.
match_embedded() {
  local full="$1" seg gitpart norm
  local split
  split=$(printf '%s' "$full" | sed -E 's/&&/\n/g; s/\|\|/\n/g; s/;/\n/g; s/\|/\n/g; s/\$\(/\n/g; s/`/\n/g; s/\(/\n/g; s/\)/\n/g')
  while IFS= read -r seg; do
    # Extract from the last git binary token in the segment:
    # handles `/usr/bin/git`, `command git`, `env git`.
    gitpart=$(printf '%s' "$seg" | sed -E 's/.*[[:space:]](command +)?([^[:space:]]*\/)?git +/git /')
    case "$gitpart" in
      git\ *) ;;
      *)
        gitpart=$(printf '%s' "$seg" | sed -E 's/^(command +)?([^[:space:]]*\/)?git +/git /')
        case "$gitpart" in git\ *|git) ;; *) continue ;; esac
        ;;
    esac
    norm=$(normalize_git_command "$gitpart")
    if match_subcommand "$norm"; then return 0; fi
  done <<< "$split"
  return 1
}

BLOCK_REASON=""
if match_embedded "$COMMAND"; then
  echo "BLOCKED: '$COMMAND' is a dangerous git operation. The user has prevented you from doing this.${BLOCK_REASON:+ Reason: $BLOCK_REASON}" >&2
  exit 2
fi

exit 0
